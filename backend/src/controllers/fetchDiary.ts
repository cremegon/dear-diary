import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const fetchDiary = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.authToken;
  const { diaryURL } = req.params;

  console.log("fetching diary to be compiled!");

  if (!token) {
    console.log("Token Error at checkDiary");
    return res.status(404).json({ message: "No Diaries Found" });
  }

  const diaryEntry = await pool.query("SELECT * FROM diaries WHERE url = $1", [
    diaryURL,
  ]);

  return res.status(200).json({
    message: "Diary Entries Found",
    data: diaryEntry.rows,
  });
};
