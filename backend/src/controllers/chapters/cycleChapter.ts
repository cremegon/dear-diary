import { Request, response, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const cycleToPrevChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterURL } = req.params;
  console.log("Flipping Behind...", chapterURL);

  const query = await pool.query(
    "SELECT prevchapterid FROM chapters WHERE url = $1",
    [chapterURL]
  );

  if (!query.rows[0].prevchapterid) {
    console.log("no prev chapter");
    return res
      .status(404)
      .json({ message: "No Prev Chapter Present", data: null });
  }

  const id = query.rows[0].prevchapterid;
  const prev = await pool.query(
    "SELECT prevchapterid FROM chapters WHERE id=$1",
    [id]
  );
  const chapterQuery = await pool.query(
    "SELECT url FROM chapters WHERE id = $1",
    [id]
  );

  return res.status(200).json({
    json: "Cycling to Prev Page",
    data: chapterQuery.rows[0].url,
    prev: prev,
  });
};

export const cycleToNextChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterURL } = req.params;
  console.log("Flipping Forward...");

  const query = await pool.query(
    "SELECT nextchapterid FROM chapters WHERE url = $1",
    [chapterURL]
  );

  if (!query.rows[0].nextchapterid) {
    console.log("no next chapter");
    return res
      .status(404)
      .json({ message: "No Next Chapter Present", data: null });
  }

  const id = query.rows[0].nextchapterid;
  const next = await pool.query(
    "SELECT nextchapterid FROM chapters WHERE id=$1",
    [id]
  );
  const chapterQuery = await pool.query(
    "SELECT url FROM chapters WHERE id = $1",
    [id]
  );

  return res
    .status(200)
    .json({
      json: "Cycling to Next Page",
      data: chapterQuery.rows[0].url,
      next: next,
    });
};
