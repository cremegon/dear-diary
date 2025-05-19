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
  // new feature: set up a gateway process in order to validate effectively
  // find: methods to fix errors in browser differences
  // check if a token exists ; if not then a user isn't verified
  if (!token) {
    console.log("no tokens found at verification");
    return res.status(403).json({ message: "No cookies found" });
  }

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
    if (!user.email === decoded.email) {
      return res.status(400).json({ message: "Verficiation Failed" });
    }
    // if the user matches, then the verification is successful
    console.log("verification successful from validate token!");
    return res.status(200).json({
      message: "Verification Successful, redirecting...",
      content: user.name,
    });
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
