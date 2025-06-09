import { Request, Response } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

type relatedToTrustees = { [key: string]: any[] };

export const fetchTrustees = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("fetching trustees...");
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
  console.log("fetched user_id:", decoded.id);

  const diaries = await pool.query("SELECT * FROM diaries WHERE user_id = $1", [
    decoded.id,
  ]);

  const trustees = await pool.query(
    "SELECT DISTINCT ON (t.name) t.* FROM trustees as t JOIN diaries AS d ON d.id = t.diary_id JOIN users as u ON u.id = d.user_id AND u.id = $1 ORDER BY t.name ASC;",
    [decoded.id]
  );

  console.log("selected trustees = ", trustees.rows);

  const diary_to_trustees: relatedToTrustees = {};

  for (let i = 0; i < diaries.rows.length; i++) {
    const diary_id = diaries.rows[i].id;
    const title = diaries.rows[i].title;
    const trustees_to_diaries = await pool.query(
      "SELECT * FROM trustees WHERE diary_id = $1",
      [diary_id]
    );
    for (let j = 0; j < trustees_to_diaries.rows.length; j++) {
      const name = trustees_to_diaries.rows[j].name;
      console.log("curr name", name);
      if (!diary_to_trustees[name]) {
        diary_to_trustees[name] = [];
      }
      if (!diary_to_trustees[name].includes(title)) {
        console.log("curr title", title);
        diary_to_trustees[name].push(title);
      }
    }
  }

  console.log(diary_to_trustees);

  return res.status(200).json({
    message: "Trustees Found",
    trustees: trustees.rows,
    diaries: diary_to_trustees,
  });
};
