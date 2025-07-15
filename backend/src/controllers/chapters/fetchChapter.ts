import { Request, response, Response } from "express";
import { Pool } from "pg";
import { createClient } from "redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import getRedisClient from "../../middleware/redis";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const fetchChapters = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { key } = req.query;
  console.log("Checking Chapters...");
  const client = await getRedisClient();

  const chapterData = await client.get(`diary:${key}:chapter`);
  if (chapterData) {
    // await client.del(`diary:${key}:chapter`);
    console.log(chapterData);
    return res
      .status(200)
      .json({ message: "found in redis", data: JSON.parse(chapterData) });
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
  client.set(`diary:${key}:chapter`, JSON.stringify(chapters));

  return res.status(200).json({
    message: "Diary Entries Found",
    data: chapters,
  });
};
