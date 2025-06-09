import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const checkDiary = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;

  const diaryEntry = await pool.query(
    "SELECT * FROM diaries WHERE user_id = $1 AND completed_at IS NULL",
    [userId]
  );

  return res.status(200).json({
    message: "Diary Entries Found",
    data: diaryEntry.rows,
  });
};
