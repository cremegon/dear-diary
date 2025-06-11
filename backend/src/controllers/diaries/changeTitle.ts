import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const checkDiary = async (req: Request, res: Response): Promise<any> => {
  const { new_title } = req.body;
  const { URL } = req.params;

  const diaryEntry = await pool.query("ALTER TABLE diaries SET COLUMN ", [
    new_title,
    URL,
  ]);

  return res.status(200).json({
    message: "Diary Entries Found",
    data: diaryEntry.rows,
  });
};
