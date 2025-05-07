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
  const entrusted = await pool.query(
    "SELECT * FROM trustees WHERE diary_id = (SELECT id from diaries WHERE user_id = $1 AND completed_at IS NOT NULL)",
    [userId]
  );
  console.log("no man...");
  console.log(entrusted);

  return res.status(200).json({
    message: "Archived Diaries Found",
    data: diaryEntry.rows,
    entrusted: entrusted.rows,
  });
};
