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
  const token = req.cookies.authToken;

  console.log("Checking Chapters...");

  if (!token) {
    console.log("Token Error at checkChapter");
    return res.status(404).json({ message: "No Chapters Found" });
  }

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
