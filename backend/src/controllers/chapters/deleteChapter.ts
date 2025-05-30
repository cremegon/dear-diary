import { Request, response, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const deleteChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chapterURL } = req.params;
  const token = req.cookies.authToken;

  console.log("Deleting Chapter...", chapterURL);

  if (!token) {
    console.log("Token Error at deleteDiary");
    return res.status(404).send();
  }

  let prevId = null;
  let nextId = null;

  const id = await pool.query("SELECT id FROM chapters WHERE url = $1", [
    chapterURL,
  ]);
  const currentId = id.rows[0].id;
  const chapterIdBefore = await pool.query(
    "SELECT id FROM chapters WHERE id < $1 ORDER BY created_at DESC LIMIT 1",
    [currentId]
  );
  const chapterIdAfter = await pool.query(
    "SELECT id FROM chapters WHERE id > $1 ORDER BY created_at DESC LIMIT 1",
    [currentId]
  );

  if (chapterIdBefore.rows[0])
    console.log(chapterIdBefore.rows[0], chapterIdAfter.rows[0]);

  try {
    // await pool.query("DELETE FROM chapters WHERE url = $1", [chapterURL]);
  } catch (error) {
    console.log("No Relevant Chapter Found");
    return res.status(404).send();
  }

  return res.status(204).send();
};
