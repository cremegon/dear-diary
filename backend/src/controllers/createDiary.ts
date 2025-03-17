import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { encryptUserId } from "../utils/security";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const createDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title } = req.body;
  console.log("checking title", title);
  const token = req.cookies.authToken;

  if (!token)
    return res.status(403).json({ message: "No Token Found (Creating Diary)" });

  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  console.log(decoded.userId);

  const query = await pool.query(
    "INSERT INTO diaries(user_id,title) VALUES ($1,$2) RETURNING id",
    [decoded.userId, title]
  );
  const id = query.rows[0].id;
  const encryptedURL = encryptUserId(id);

  await pool.query("UPDATE diaries SET url = $1 WHERE id = ($2)", [
    encryptedURL,
    id,
  ]);
  console.log("new diary created");
  return res.status(200).json({ message: "Successfully Created New Diary" });
};
