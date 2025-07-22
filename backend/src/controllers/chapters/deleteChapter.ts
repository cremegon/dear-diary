import { Request, response, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";
import getRedisClient from "../../middleware/redis";

const pool = new Pool(config.db);

export const deleteChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const client = await getRedisClient();
  const { chapterURL } = req.params;
  console.log("Deleting Chapter...", chapterURL);

  let prevId = null;
  let nextId = null;

  const id = await pool.query("SELECT * FROM chapters WHERE url = $1", [
    chapterURL,
  ]);
  const currentId = id.rows[0];
  console.log(currentId, "current id...");
  const diary_id = currentId.diary_id;
  prevId = currentId.prevchapterid;
  nextId = currentId.nextchapterid;

  // ---- link the next chapter's previd to the current chapters previd
  if (nextId) {
    await pool.query("UPDATE chapters SET prevchapterid = $1 WHERE id = $2", [
      prevId,
      nextId,
    ]);
  }
  // ---- otherwise, if this is the last chapter, set the prevchapter's nextid to null
  else {
    await pool.query("UPDATE chapters SET nextchapterId = $1 WHERE id = $2", [
      nextId,
      prevId,
    ]);
  }
  // ---- if there is a prev chapter, set the prev chapter's nextid to the next chapter of the current chapter
  if (prevId) {
    await pool.query("UPDATE chapters SET nextchapterid = $1 WHERE id = $2", [
      nextId,
      prevId,
    ]);
  }
  // ---- otherwise, if this is the first chapter, then set the next chapter's previd to null
  else {
    await pool.query("UPDATE chapters SET prevchapterid = $1 WHERE id = $2", [
      prevId,
      nextId,
    ]);
  }

  try {
    await pool.query("DELETE FROM chapters WHERE url = $1", [chapterURL]);
    const diary_url = await pool.query(
      "SELECT url FROM diaries WHERE id = $1",
      [diary_id]
    );
    const diary = diary_url.rows[0].url;
    const cacheData = await client.get(`diary:${diary}:chapter`);

    if (cacheData) {
      client.del(`diary:${diary}:chapter`);
      console.log("chapter entry changed, previous cache deleted");
    }
  } catch (error) {
    console.log("No Relevant Chapter Found");
    return res.status(404).send();
  }

  return res.status(204).send();
};
