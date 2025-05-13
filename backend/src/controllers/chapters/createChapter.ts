import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import { encryptUserId } from "../../utils/security";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const createChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { fontFamily, fontSize, url } = req.body;
  const token = req.cookies.authToken;
  console.log("Creating New Chapter....", url);

  if (!token)
    return res.status(403).json({ message: "Token not verified at Chapters" });

  const selectedRow = await pool.query(
    "SELECT id FROM diaries WHERE url = $1",
    [url]
  );
  const diaryId = selectedRow.rows[0].id;
  console.log("selected diary id for chapters", diaryId);

  const query = await pool.query(
    "INSERT INTO chapters(diary_id,font_family,font_size,title) VALUES($1,$2,$3,$4) RETURNING *",
    [diaryId, fontFamily, fontSize, "untitled"]
  );

  const id = query.rows[0].id;
  console.log("encrypting...", id);
  const encryptedURL = encryptUserId(id);

  await pool.query("UPDATE chapters SET url = $1 WHERE id = $2", [
    encryptedURL,
    id,
  ]);
  console.log("new chapter created");
  return res.status(200).json({
    message: "Chapter Created Successfully",
    redirect: `${encryptedURL}/write-session?create=true`,
  });
};
