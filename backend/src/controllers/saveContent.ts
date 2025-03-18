import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { encryptUserId } from "../utils/security";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const saveContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, content, url } = req.body;
  console.log(title, content, url);

  const query = await pool.query(
    "UPDATE chapters SET title = $1, content = $2 WHERE url = $3 ",
    [title, content, url]
  );
  console.log(query.rows[0]);
  return res.status(200).json({ message: "We in This" });
};
