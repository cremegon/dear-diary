import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const fetchUniqueTrustees = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("fetching trustees...");
  const token = req.cookies.authToken;

  // check if a token exists ; if not then a user isn't verified
  if (!token) {
    console.log("no tokens found at fetching trustees");
    return res.status(403).json({ message: "No cookies found" });
  }

  const trustees = await pool.query("SELECT DISTINCT * FROM trustees");

  return res.status(200).json({
    message: "Unique Trustees Found",
    trustees: trustees.rows,
  });
};
