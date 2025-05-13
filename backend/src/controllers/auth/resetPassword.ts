import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { password, forgotToken } = req.body;
  console.log("creating new password", password, forgotToken, req.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query("UPDATE users SET password = $1 WHERE forgottoken = $2", [
    hashedPassword,
    forgotToken,
  ]);

  return res.status(200).json({
    message: "Password Updated!",
    data: true,
  });
};
