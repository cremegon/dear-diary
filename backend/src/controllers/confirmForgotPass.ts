import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const confirmForgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = req.cookies.authToken;
  const userToken = req.body;

  if (!token) {
    console.log("Token Error at checkDiary");
    return res.status(404).json({ message: "No Valid Session", data: false });
  }
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.userId;

  const checkToken = await pool.query(
    "SELECT * FROM users WHERE forgottoken = $1",
    [userToken]
  );
  if (!checkToken.rows.length)
    return res.status(400).json({ message: "Incorrect Token", data: false });

  return res.status(200).json({
    message: "Forgot Token Confirmed...",
    data: true,
  });
};
