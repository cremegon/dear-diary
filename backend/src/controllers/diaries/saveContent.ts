import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";
import getRedisClient from "../../middleware/redis";

const pool = new Pool(config.db);

export const saveContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, content, url, font, fontsize } = req.body;
  const client = await getRedisClient();

  await pool.query(
    "UPDATE chapters SET title = $1, content = $2, font_size = $3, font_family = $4 WHERE url = $5 ",
    [title, content, fontsize, font, url]
  );

  const chapter = await pool.query("SELECT * FROM chapters WHERE url = $1", [
    url,
  ]);

  const diary = await pool.query(
    "SELECT * FROM diaries WHERE id = (SELECT diary_id FROM chapters WHERE url = $1)",
    [url]
  );

  const chapters = await pool.query(
    "SELECT * FROM chapters WHERE diary_id = (SELECT diary_id FROM chapters WHERE url = $1) ORDER BY created_at DESC",
    [url]
  );
  const diaryId = diary.rows[0].url;
  console.log("diary id...?", diaryId);
  console.log("chapter...?", chapter.rows[0]);
  try {
    client.set(
      `diary:${diaryId}:chapter:${url}`,
      JSON.stringify(chapter.rows[0])
    );
    client.set(`diary:${diaryId}:chapter`, JSON.stringify(chapters.rows));
  } catch (error) {
    console.log("Error Inserting into Redis from Chapter Save", error);
  }
  return res.status(200).json({ message: "We in This" });
};
