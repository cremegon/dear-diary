import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";
import { randomBytes } from "crypto";
import { send_forgot_Email } from "../../middleware/sendForgotEmail";
import { send_signUpCode_Email } from "../../middleware/sendSignUpCode";

const pool = new Pool(config.db);

export const signUpCodeSend = async (
  req: Request,
  res: Response
): Promise<any> => {
  const receipientEmail = req.body.email;
  const encryptedToken = randomBytes(16).toString("hex").slice(0, 6);
  console.log("checking email by verification code", receipientEmail);

  const verified = await pool.query(
    "SELECT * FROM checkemails WHERE email = $1",
    [receipientEmail]
  );

  console.log("verified selection!", verified.rows);

  if (verified.rows.length > 0 && !verified.rows[0].verified) {
    return res
      .status(400)
      .json({ message: "Email Already Marked as Unverified..." });
  }

  const signUpCode = send_signUpCode_Email(receipientEmail, encryptedToken);
  if (!signUpCode)
    return res.status(404).json({ message: "Signup Email Failed..." });

  await pool.query(
    "INSERT INTO checkemails(email,signup_code,verified) VALUES($1,$2,$3)",
    [receipientEmail, encryptedToken, false]
  );

  return res.status(200).json({
    message: "Sign-up Code Sent...",
    data: true,
  });
};
