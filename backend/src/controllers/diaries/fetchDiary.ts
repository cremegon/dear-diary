import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const fetchDiary = async (req: Request, res: Response): Promise<any> => {
  const { diaryURL } = req.params;
  console.log("fetching diary to be compiled!");

  const diaryEntry = await pool.query("SELECT * FROM diaries WHERE url = $1", [
    diaryURL,
  ]);

  return res.status(200).json({
    message: "Diary Entries Found",
    data: diaryEntry.rows,
  });
};
