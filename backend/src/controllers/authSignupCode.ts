import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { randomBytes } from "crypto";
import { send_forgot_Email } from "../middleware/sendForgotEmail";
import { send_signUpCode_Email } from "../middleware/sendSignUpCode";

const pool = new Pool(config.db);

export const signUpCodeSend = async (
  req: Request,
  res: Response
): Promise<any> => {
  const receipientEmail = req.body.email;
  const encryptedToken = randomBytes(16).toString("hex").slice(0, 6);
  console.log("checking email by verification code", receipientEmail);

  const resetPass = send_signUpCode_Email(receipientEmail, encryptedToken);
  if (!resetPass)
    return res.status(404).json({ message: "Forgot Email Failed..." });

  await pool.query(
    "INSERT INTO checkemails(email,signup_code,verified) VALUES = ($1,$2)",
    [receipientEmail, encryptedToken, false]
  );

  return res.status(200).json({
    message: "New Forgot Token Generated...",
    data: true,
  });
};
