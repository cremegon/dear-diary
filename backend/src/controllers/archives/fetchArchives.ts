import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

type trustedPersonsMap = { [key: number]: any[] };

export const fetchArchives = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("checking archives...");
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;

  // ---- Get the user id from the cookie and select all completed diaries from db
  const diaryEntry = await pool.query(
    "SELECT * FROM diaries WHERE user_id = $1 AND completed_at IS NOT NULL ORDER BY completed_at DESC",
    [userId]
  );
  console.log("checking entrusted...");

  // ---- select all unique diary id's from these diaries
  const diaryIds = await pool.query(
    "SELECT DISTINCT id FROM diaries WHERE user_id = $1 AND completed_at IS NOT NULL",
    [userId]
  );

  const trustedPersons: trustedPersonsMap = {};
  // ---- create a hashmap of diaries mapped to users they are shared with
  for (let i = 0; i < diaryIds.rows.length; i++) {
    const user_id = diaryIds.rows[i].id;
    const entrusted = await pool.query(
      `SELECT * FROM trustees WHERE diary_id = $1`,
      [user_id]
    );
    if (entrusted && entrusted.rows.length > 0) {
      if (!trustedPersons[user_id]) {
        trustedPersons[user_id] = [];
      }
      trustedPersons[user_id].push(...entrusted.rows);
    }
  }

  return res.status(200).json({
    message: "Archived Diaries Found",
    data: diaryEntry.rows,
    entrusted: trustedPersons,
  });
};
