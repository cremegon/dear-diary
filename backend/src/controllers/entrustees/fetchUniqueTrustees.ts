import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const fetchUniqueTrustees = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("fetching unique trustees...");

  const trustees = await pool.query(
    "SELECT DISTINCT ON (t.name) t.* FROM trustees as t"
  );

  return res.status(200).json({
    message: "Unique Trustees Found",
    trustees: trustees.rows,
  });
};
