import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.db);

export const loadCoverArt = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { diaryURL } = req.params;
  console.log("loading cover art...");

  const query = await pool.query("SELECT * from chapters WHERE url = $1", [
    diaryURL,
  ]);
  if (query.rows.length < 1)
    return res.status(404).json({ message: "No Cover Art Found Found" });
  const data = query.rows[0].cover;

  return res.status(200).json({
    data: data,
  });
};
