require("dotenv").config();
import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { strict } from "assert";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRETKEY || "poopdog@1234!";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: `http://localhost:3000`,
    credentials: true,
  })
);

app.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length > 0) {
    console.log("User by this email already exists: ");
    console.log(result.rows[0]);
    return res
      .status(400)
      .json({ message: "User by this email already exists" });
  }
  //   return res.status(200).json({ message: "Nah everything good, G" });
  await pool.query(
    "INSERT INTO users (email,password) VALUES ($1,$2) ON CONFLICT(email) DO NOTHING;",
    [email, hashedPassword]
  );

  const getUser = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  const userId = getUser.rows[0].id;

  //generates a jwt token
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });

  console.log("Successfully Authorized, Cookie Issued");

  //return the response
  return res
    .cookie("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    })
    .status(200)
    .json({ message: "Successfully Created User" });
});

app.get("/verify", async (req: Request, res: Response): Promise<any> => {
  console.log("Verification Endpoint Initiated");

  const token = req.cookies.authToken;

  if (!token) {
    return res.status(403).json({ message: "No cookies found" });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  const findEmail = await pool.query("SELECT email FROM users WHERE id = $1", [
    decoded.id,
  ]);

  if (!findEmail.rows[0].email === decoded.email) {
    return res.status(400).json({ message: "Verficiation Failed" });
  }

  return res.status(200).json({
    message: "Verification Successful, redirecting...",
  });
});

app.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  console.log(email, password);
  const selectedUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (selectedUser.rowCount === 0) {
    return res
      .status(404)
      .json({ message: "User not Found", redirect: "/signup" });
  }
  const user = selectedUser.rows[0];

  const samePassword = await bcrypt.compare(password, user.password);
  if (!samePassword) {
    return res.status(400).json({
      message: "Password Incorrect, Please Try Again",
      redirect: "/login",
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return res
    .cookie("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    })
    .status(200)
    .json({ message: "Successfully Logged In", redirect: "/" });
});

app.get("/logout", async (req: Request, res: Response): Promise<any> => {
  console.log("Successfully logged out");
  return res
    .clearCookie("authToken", {
      httpOnly: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Successfully Logged Out" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
