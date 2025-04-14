import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const saveCoverArt = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { image } = req.body;
  const { diaryId } = req.params;
  const token = req.cookies.authToken;

  if (!token) {
    console.log("Token Error at checkDiary");
    return res.status(404).json({ message: "No Token Found" });
  }

  await pool.query("UPDATE diaries SET cover = $1 WHERE url = $2", [
    image,
    diaryId,
  ]);

  return res.status(200).json({
    message: "Cover Art Saved Successfully",
  });
};
