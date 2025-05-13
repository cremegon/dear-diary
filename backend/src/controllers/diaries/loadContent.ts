import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const loadContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { url } = req.body;
  console.log("loading content = ", url);

  const query = await pool.query("SELECT * from chapters WHERE url = $1", [
    url,
  ]);
  if (query.rows.length < 1)
    return res.status(404).json({ message: "No Chapter Found" });
  const data = query.rows[0];

  const [title, content, fontSize, fontFamily] = [
    data.title,
    data.content,
    data.font_size,
    data.font_family,
  ];
  return res.status(200).json({
    message: "Successfully Loaded Chapter",
    data: [title, content, fontSize, fontFamily],
  });
};
