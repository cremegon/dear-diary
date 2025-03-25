import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const validateToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("Verifying Token...");

  const token = req.cookies.authToken;
  console.log(req.cookies, "hey");

  // check if a token exists ; if not then a user isn't verified
  if (!token) {
    return res.status(403).json({ message: "No cookies found" });
  }

  // if user exists ; decode the token they have
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  console.log("decoded token from verification: ", decoded);

  // select the user connected to the token from the database
  const selectedUser = await pool.query(
    "SELECT email FROM users WHERE id = $1",
    [decoded.userId]
  );
  const user = selectedUser.rows[0];

  // if the user from the token does not match the user in the database, return False
  if (!user.email === decoded.email) {
    return res.status(400).json({ message: "Verficiation Failed" });
  }
  // if the user matches, then the verification is successful
  return res.status(200).json({
    message: "Verification Successful, redirecting...",
    content: user.name,
  });
};
