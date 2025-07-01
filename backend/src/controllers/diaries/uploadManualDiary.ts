import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const uploadManualDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const filepath = req.file?.path;
  const { title } = req.params;
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;

  await pool.query("INSERT INTO diaries(user_id,title,pdf) VALUES ($1,$2,$3)", [
    userId,
    title,
    filepath,
  ]);

  return res.status(200).json({
    message: "Profile Pic Updated",
    data: filepath,
  });
};
