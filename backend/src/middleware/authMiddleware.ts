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
  console.log("Middleware Authenticating...");
  const token = req.cookies.authToken;

  // if user exists ; decode the token they have
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
    if (decoded) {
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
