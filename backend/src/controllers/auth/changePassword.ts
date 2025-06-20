import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { config } from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("changing password...");
  const { password, new_password } = req.body;
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;

  const query = await pool.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);
  const db_password = query.rows[0].password;
  const samePassword = await bcrypt.compare(password, db_password);
  if (!samePassword) {
    return res.status(400).json({ error: true, message: "Incorrect Password" });
  }
  await pool.query("UPDATE users SET password = $1 WHERE id=$2", [
    new_password,
    userId,
  ]);

  return res.status(200).json({
    error: false,
    message: "Password Updated!",
  });
};
