import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const changeTitle = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { new_title } = req.body;
  const { diaryURL } = req.params;
  try {
    await pool.query(
      "ALTER TABLE diaries SET COLUMN title = $1 WHERE url = $2",
      [new_title, diaryURL]
    );
  } catch (error) {
    console.log("Error injecting into DB");
    return res.status(403).json({ message: "Error injecting into DB" });
  }

  return res.status(200).json({
    message: "Diary Entries Found",
  });
};
