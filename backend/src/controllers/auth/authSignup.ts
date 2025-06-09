import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const signupUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  // hash their password Input for extra security.
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  // if there is a user, then this person already has an existing account.
  if (result.rows.length > 0) {
    console.log("User by this email already exists: ");
    console.log(result.rows[0]);
    return res
      .status(400)
      .json({ message: "User by this email already exists" });
  }

  // there is no existing user by the userInput email, so we create a user by their inputs.
  await pool.query(
    "INSERT INTO users (email,password,name) VALUES ($1,$2,$3) ON CONFLICT(email) DO NOTHING;",
    [email, hashedPassword, name]
  );

  // select the user we just created and get the id associated with their account.
  const getUser = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = getUser.rows[0];
  const userId = user.id;

  // generates a jwt token and sign the token with the encrypted id from the database.
  const token = jwt.sign({ id: userId }, JWT_SECRET as string, {
    expiresIn: "1h",
  });

  console.log("Successfully Authorized, Cookie Issued");

  // authorize a token to the user.
  return res
    .cookie("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    })
    .status(200)
    .json({ message: "Successfully Created User", content: user.name });
};
