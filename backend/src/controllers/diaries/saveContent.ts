import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";
import getRedisClient from "../../middleware/redis";

const pool = new Pool(config.db);

export const saveContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, content, url, font, fontsize, chapter, diary } = req.body;
  const client = await getRedisClient();
  console.log(font, fontsize);
  await pool.query(
    "UPDATE chapters SET title = $1, content = $2, font_size = $3, font_family = $4 WHERE url = $5 ",
    [title, content, fontsize, font, url]
  );
  const cacheData = await client.get(`diary:${diary}:chapter:${chapter}:data`);

  if (cacheData) {
    client.del(`diary:${diary}:chapter:${chapter}:data`);
    console.log("chapter entry changed, previous cache deleted");
  }
  return res.status(200).json({ message: "entry updated and cache deleted" });
};
