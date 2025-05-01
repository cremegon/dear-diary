import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { randomBytes } from "crypto";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.cookies.authToken;
  const receipientEmail = req.body;
  const encryptedToken = randomBytes(16).toString("hex").slice(0, 6);

  if (!token) {
    console.log("Token Error at checkDiary");
    return res.status(404).json({ message: "No Valid Session" });
  }
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.userId;

  await pool.query("INSERT $1 into TABLE users WHERE id = $2", [
    encryptedToken,
    userId,
  ]);

  return res.status(200).json({
    message: "New Forgot Token Generated...",
  });
};
