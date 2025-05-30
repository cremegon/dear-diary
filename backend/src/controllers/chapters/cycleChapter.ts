import { Request, response, Response } from "express";
import { Pool } from "pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

const pool = new Pool(config.db);
const JWT_SECRET = config.jwtSecret;

export const cycleToPrevChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterURL } = req.params;
  const token = req.cookies.authToken;

  console.log("Flipping Behind...", chapterURL);

  if (!token) {
    console.log("Token Error at chapterFlipBack");
    return res.status(404).json({ message: "No Chapters Found" });
  }

  const query = await pool.query(
    "SELECT prevchapterid FROM chapters WHERE url = $1",
    [chapterURL]
  );

  console.log("current query: ", query.rows[0].prevchapterid);

  if (!query.rows[0].prevchapterid) {
    return res
      .status(404)
      .json({ message: "No Prev Chapter Present", data: null });
  }

  const id = query.rows[0].prevchapterid;
  const chapterQuery = await pool.query(
    "SELECT url FROM chapters WHERE id = $1",
    [id]
  );
  console.log(id);

  return res
    .status(200)
    .json({ json: "Cycling to Prev Page", data: chapterQuery.rows[0].url });
};

export const cycleToNextChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterURL } = req.params;
  const token = req.cookies.authToken;

  console.log("Flipping Forward...");

  if (!token) {
    console.log("Token Error at chapterFlipNext");
    return res.status(404).json({ message: "No Chapters Found" });
  }

  const query = await pool.query(
    "SELECT nextchapterid FROM chapters WHERE url = $1",
    [chapterURL]
  );

  console.log("current query: ", query.rows.length);

  if (!query.rows[0].nextchapterid) {
    return res
      .status(404)
      .json({ message: "No Next Chapter Present", data: null });
  }

  const id = query.rows[0].nextchapterid;
  const chapterQuery = await pool.query(
    "SELECT url FROM chapters WHERE id = $1",
    [id]
  );

  return res
    .status(200)
    .json({ json: "Cycling to Next Page", data: chapterQuery.rows[0].url });
};
