import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const createDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.cookies.authToken;

  if (!token)
    return res.status(403).json({ message: "No Token Found (Creating Diary)" });

  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  pool.query("INSERT INTO diaries(user_id,title) VALUES $1,$2", [
    decoded.id,
    "FIRST DIARY!",
  ]);
};
