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

  const trustees = await pool.query("SELECT * FROM trustees");

  const diaryToTrustees: relatedToTrustees = {};
  for (let i = 0; i < trustees.rows.length; i++) {
    const diary_id = trustees.rows[i].diary_id;
    const relatedDiaries = await pool.query(
      "SELECT * FROM diaries WHERE id = $1",
      [diary_id]
    );
    if (relatedDiaries && relatedDiaries.rows.length > 0) {
      if (!diaryToTrustees[diary_id]) {
        diaryToTrustees[diary_id] = [];
      }
      diaryToTrustees[diary_id].push(...relatedDiaries.rows);
    }
  }
  console.log(diaryToTrustees);

  return res.status(200).json({
    message: "Trustees Found",
    data: trustees.rows,
    diaries: diaryToTrustees,
  });
};
