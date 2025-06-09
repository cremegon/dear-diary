import { Request, response, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const fetchChapters = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { key } = req.query;
  console.log("Checking Chapters...");

  const query = await pool.query("SELECT id FROM diaries WHERE url = $1", [
    key,
  ]);
  const diaryId = query.rows[0].id;
  const diaryEntry = await pool.query(
    "SELECT * FROM chapters WHERE diary_id = $1 ORDER BY created_at DESC",
    [diaryId]
  );

  const chapters = diaryEntry.rows;

  return res.status(200).json({
    message: "Diary Entries Found",
    data: chapters,
  });
};
