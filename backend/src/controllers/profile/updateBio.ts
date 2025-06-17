import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const updateBio = async (req: Request, res: Response): Promise<any> => {
  const bio = req.body;
  console.log("updating profile bio...");

  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;
  console.log(bio, userId);

  await pool.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, userId]);

  return res.status(200).json({
    message: "Profile Bio Updated",
  });
};
