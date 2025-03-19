import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.db);

export const saveContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, content, url, font, fontsize } = req.body;

  const query = await pool.query(
    "UPDATE chapters SET title = $1, content = $2, font_size = $3, font_family = $4 WHERE url = $5 ",
    [title, content, fontsize, font, url]
  );
  console.log(query.rows[0]);
  return res.status(200).json({ message: "We in This" });
};
