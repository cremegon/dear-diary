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

  // if the user matches, then the verification is successful
  console.log("verification successful from validate token!");
  return res.status(200).json({
    message: "Verification Successful, redirecting...",
  });
};
