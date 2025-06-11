import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const fetchNextPrevChapters = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterURL } = req.params;
  console.log("Checking Prev and Next Chapters...");

  try {
    const query = await pool.query(
      "SELECT prevchapterid,nextchapterid FROM chapters WHERE url = $1",
      [chapterURL]
    );
    const { prev, next } = query.rows[0];
    console.log(prev, next);
    return res.status(200).json({
      message: "Prev Next Found",
      prev: prev,
      next: next,
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Failed to find prev/next chapterId's" });
  }
};
