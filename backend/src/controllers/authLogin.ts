import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../config";

const pool = new Pool(config.db);

const JWT_SECRET = config.jwtSecret;

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  // select the user that is tied to the token from the database
  const selectedUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  // if there is no user in the database connected to the token, then things are sketch, return False
  if (selectedUser.rowCount === 0) {
    return res
      .status(404)
      .json({ message: "User not Found", redirect: "/signup" });
  }

  // the user does exist if the above condition is false, so select them from the database
  const user = selectedUser.rows[0];

  // check if the hashed userInput password matches the hashed password of the user we have selected.
  // if they do not match, this is not the correct password or the right user.
  const samePassword = await bcrypt.compare(password, user.password);
  if (!samePassword) {
    return res.status(400).json({
      message: "Password Incorrect, Please Try Again",
      redirect: "/login",
    });
  }

  // if they do match, then this is the right user.
  // we generate a new token for them to verify their sessions with.
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return res
    .cookie("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    })
    .status(200)
    .json({
      message: "Successfully Logged In",
      redirect: "/",
      content: user.name,
    });
};
