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

  const id = await pool.query("SELECT * FROM chapters WHERE url = $1", [
    chapterURL,
  ]);
  const currentId = id.rows[0];
  prevId = currentId.prevchapterid;
  nextId = currentId.nextchapterid;

  if (nextId) {
    await pool.query("UPDATE chapters SET prevchapterid = $1 WHERE id = $2", [
      prevId,
      nextId,
    ]);
  } else {
    await pool.query("UPDATE chapters SET nextchapterId = $1 WHERE id = $2", [
      nextId,
      prevId,
    ]);
  }
  if (prevId) {
    await pool.query("UPDATE chapters SET nextchapterid = $1 WHERE id = $2", [
      nextId,
      prevId,
    ]);
  } else {
    await pool.query("UPDATE capters SET prevchapterid = $1 WHERE id = $2", [
      prevId,
      nextId,
    ]);
  }

  try {
    await pool.query("DELETE FROM chapters WHERE url = $1", [chapterURL]);
  } catch (error) {
    console.log("No Relevant Chapter Found");
    return res.status(404).send();
  }

  return res.status(204).send();
};
