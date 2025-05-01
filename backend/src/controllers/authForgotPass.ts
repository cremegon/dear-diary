import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { randomBytes } from "crypto";
import { send_forgot_Email } from "../middleware/sendForgotEmail";

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
    return res.status(404).json({ message: "No Valid Session", data: false });
  }
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.userId;

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    receipientEmail,
  ]);
  if (!userExists.rows.length) {
    return res
      .status(400)
      .json({ message: "No Such Email Exists", data: false });
  }

  const resetPass = send_forgot_Email(receipientEmail, token);
  if (!resetPass)
    return res.status(404).json({ message: "Forgot Email Failed..." });

  await pool.query("UPDATE users SET forgottoken = $1 WHERE id = $2", [
    encryptedToken,
    userId,
  ]);

  return res.status(200).json({
    message: "New Forgot Token Generated...",
    data: true,
  });
};
