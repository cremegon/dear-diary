import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const fetchBio = async (req: Request, res: Response): Promise<any> => {
  console.log("fetching profile bio...");

  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;

  const profileBio = await pool.query("SELECT bio FROM users WHERE id = $1", [
    userId,
  ]);

  return res.status(200).json({
    message: "Profile Bio Found",
    data: profileBio.rows[0].bio,
  });
};
