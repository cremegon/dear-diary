import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const uploadProfilePic = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { image } = req.body;
  console.log("uploading profile pic...", image);

  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;

  await pool.query("UPDATE users SET profile_dp = $1 WHERE id = $2", [
    image,
    userId,
  ]);

  return res.status(200).json({
    message: "Profile Pic Updated",
  });
};
