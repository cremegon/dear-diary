require("dotenv").config();
import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const email = req.body.email;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return res
    .status(201)
    .json({ message: `Result from Backend: ${result.rows}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
