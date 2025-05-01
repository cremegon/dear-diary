import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { randomBytes } from "crypto";
import { send_forgot_Email } from "../middleware/sendForgotEmail";

const pool = new Pool(config.db);

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const receipientEmail = req.body;
  const encryptedToken = randomBytes(16).toString("hex").slice(0, 6);

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    receipientEmail,
  ]);
  if (!userExists.rows.length) {
    return res
      .status(400)
      .json({ message: "No Such Email Exists", data: false });
  }

  const userId = userExists.rows[0].id;

  const resetPass = send_forgot_Email(receipientEmail, encryptedToken);
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
