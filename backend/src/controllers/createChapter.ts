import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { Console } from "console";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const createChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, content, fontFamily, fontSize } = req.body;
  const token = req.cookies.authToken;
  console.log("WE OUT HERE SMOKING PENISES!!!");
  console.log(title, content, fontFamily, fontSize);

  if (!token)
    return res.status(403).json({ message: "Token not verified at Chapters" });

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  const diaryId = await pool.query(
    "SELECT id FROM diaries WHERE user_id = $1",
    [decoded.userId]
  );
  console.log(diaryId);
};
