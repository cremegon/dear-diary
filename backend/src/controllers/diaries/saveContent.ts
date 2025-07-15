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

  const query = await pool.query(
    "UPDATE chapters SET title = $1, content = $2, font_size = $3, font_family = $4 WHERE url = $5 ",
    [title, content, fontsize, font, url]
  );

  const diary = await pool.query(
    "SELECT url FROM diaries WHERE id = (SELECT diary_id FROM chapters WHERE url = $1)",
    [url]
  );
  const { diaryId } = diary.rows[0].url;
  console.log("diary id..?", diaryId);
  // try {
  //   client.set(
  //     `diary:${diaryId}:chapter:${url}`,
  //     JSON.stringify(query.rows[0])
  //   );
  // } catch (error) {
  //   console.log("Error Inserting into Redis from Chapter Save", error);
  // }
  console.log(query.rows[0]);
  return res.status(200).json({ message: "We in This" });
};
