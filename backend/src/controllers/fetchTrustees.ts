import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.db);

export const fetchTrustees = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("fetching trustees...");

  const diaryEntry = await pool.query("SELECT * FROM trustees");

  return res.status(200).json({
    message: "Trustees fOUND",
    data: diaryEntry.rows,
  });
};
