import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Verifying Token...");

  const token = req.cookies.authToken;

  if (!token) {
    console.log("no tokens found at verification");
    return res.status(403).json({ message: "No cookies found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
    if (decoded) {
      next();
    }
    // if the user matches, then the verification is successful
  } catch (error) {
    console.log("Invalid Token from Token Verification");
    return res
      .status(401)
      .clearCookie("authToken", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Invalid Token" });
  }
};
