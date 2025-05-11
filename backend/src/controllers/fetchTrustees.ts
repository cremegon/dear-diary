import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.db);

type relatedToTrustees = { [key: number]: any[] };

export const fetchTrustees = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("fetching trustees...");

  //   const distinctTrustees = await pool.query()
  const uniqueTrustees = await pool.query(
    "SELECT DISTINCT name FROM trustees ORDER BY name ASC"
  );
  const trustees = await pool.query("SELECT * FROM trustees");

  const diary_to_trustees: relatedToTrustees = {};

  for (let i = 0; i < trustees.rows.length; i++) {
    const diary_id = trustees.rows[i].diary_id;
    const title = trustees.rows[i].title;

    if (!diary_to_trustees[diary_id]) {
      diary_to_trustees[diary_id] = [];
    }
    if (!diary_to_trustees[diary_id].includes(title)) {
      console.log("curr title", title);
      diary_to_trustees[diary_id].push(title);
    }
  }

  console.log(diary_to_trustees);

  return res.status(200).json({
    message: "Trustees Found",
    data: uniqueTrustees.rows,
    diaries: diary_to_trustees,
  });
};
