import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";
import getRedisClient from "../../middleware/redis";

const pool = new Pool(config.db);

export const loadContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterId, diaryId } = req.body;
  const client = await getRedisClient();
  console.log("loading content = ", chapterId);

  const query = await pool.query("SELECT * from chapters WHERE url = $1", [
    chapterId,
  ]);
  if (query.rows.length < 1)
    return res.status(404).json({ message: "No Chapter Found" });

  const cacheData = await client.get(
    `diary:${diaryId}:chapter:${chapterId}:data`
  );
  if (cacheData) {
    return res.status(200).json({
      message: "chapter cache retrieved successfully",
      data: JSON.stringify(cacheData),
    });
  }
  const data = query.rows[0];
  const [title, content, fontSize, fontFamily] = [
    data.title,
    data.content,
    data.font_size,
    data.font_family,
  ];

  await client.set(
    `diary:${diaryId}:chapter:${chapterId}:data`,
    JSON.stringify([title, content, fontSize, fontFamily])
  );
  return res.status(200).json({
    message: "Successfully Loaded Chapter",
    data: [title, content, fontSize, fontFamily],
  });
};
