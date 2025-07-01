import { Request, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import { encryptUserId } from "../../utils/security";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const uploadManualDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const filepath = req.file?.path;
  const { title } = req.params;
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  const userId = decoded.id;
  const now = new Date();
  const formattedDateNow = now.toISOString().replace("T", " ").slice(0, 23);

  try {
    const query = await pool.query(
      "INSERT INTO diaries(user_id,title,pdf,completed_at) VALUES ($1,$2,$3,$4)",
      [userId, title, filepath, formattedDateNow]
    );
    const id = query.rows[0].id;
    const encryptedURL = encryptUserId(id);

    await pool.query("UPDATE diaries SET url = $1 WHERE id = $2", [
      encryptedURL,
      id,
    ]);

    return res.status(200).json({
      message: "Manual Diary Uploaded",
      data: filepath,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error Occured at Manual Diary Upload", data: null });
  }
};
