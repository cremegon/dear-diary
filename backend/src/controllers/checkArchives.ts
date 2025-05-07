import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const checkArchives = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("checking archives...");
  const token = req.cookies.authToken;

  if (!token) {
    console.log("Token Error at checkDiary");
    return res.status(404).json({ message: "No Diaries Found" });
  }

  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.userId;

  const diaryEntry = await pool.query(
    "SELECT * FROM diaries WHERE user_id = $1 AND completed_at IS NOT NULL",
    [userId]
  );
  console.log("checking entrusted...");

  const diaryIds = await pool.query(
    "SELECT DISTINCT id FROM diaries WHERE user_id = $1 AND completed_at IS NOT NULL",
    [userId]
  );

  console.log(diaryIds.rows);
  for (let i = 0; i < diaryIds.rows.length; i++) {
    const user_id = diaryIds.rows[i].id;
    const entrusted = await pool.query(
      `SELECT * FROM trustees WHERE diary_id = $1`,
      [user_id]
    );
    console.log("ENTRUSTED PERSON!", entrusted.rows);
  }

  return res.status(200).json({
    message: "Archived Diaries Found",
    data: diaryEntry.rows,
  });
};
