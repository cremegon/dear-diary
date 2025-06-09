import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Middleware Authentication...");

  const token = req.cookies.authToken;
  console.log(req.cookies, "hey");

  // if user exists ; decode the token they have
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
    console.log("decoded details form token:", decoded);
    // select the user connected to the token from the database
    const selectedUser = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [decoded.id]
    );
    const user = selectedUser.rows[0];
    console.log("selected user from login: ", user);

    // if the user from the token does not match the user in the database, return False
    console.log("comparisions = ", user.email, decoded.email);
    if (user.email === decoded.email) {
      next();
    }
    // if the user matches, then the verification is successful
  } catch (error) {
    console.log("Invalid Token from Token Verification");
    return res
      .status(403)
      .clearCookie("authToken", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Invalid Token" });
  }
};
