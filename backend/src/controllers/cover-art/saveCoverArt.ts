import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const saveCoverArt = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { image } = req.body;
  const { diaryURL } = req.params;

  await pool.query("UPDATE diaries SET cover = $1 WHERE url = $2", [
    image,
    diaryURL,
  ]);

  return res.status(200).json({
    message: "Cover Art Saved Successfully",
  });
};
