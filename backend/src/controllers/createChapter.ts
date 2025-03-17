import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { encryptUserId } from "../utils/security";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const createChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, content, fontFamily, fontSize } = req.body;
  const token = req.cookies.authToken;
  console.log("WE OUT HERE SMOKING PENISES!!!");

  if (!token)
    return res.status(403).json({ message: "Token not verified at Chapters" });

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  const selectedRow = await pool.query(
    "SELECT diaries.id FROM diaries WHERE user_id = $1",
    [decoded.userId]
  );
  const diaryId = selectedRow.rows[0].id;

  const query = await pool.query(
    "INSERT INTO chapters(diary_id,title,content,font_family,font_size) VALUES($1,$2,$3,$4,$5) RETURNING id",
    [diaryId, title, content, fontFamily, fontSize]
  );

  const id = query.rows[0].id;
  const encryptedURL = encryptUserId(id);

  await pool.query("UPDATE chapters SET url = $1 WHERE id = ($2)", [
    encryptedURL,
    id,
  ]);
  console.log("new chapter created");
  return res.status(200).json({ message: "Chapter Created Successfully" });
};
