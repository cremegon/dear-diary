import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";
import { encryptUserId } from "../../utils/security";

const pool = new Pool(config.db);

export const createChapter = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { fontFamily, fontSize, url } = req.body;
  console.log("Creating New Chapter....", url);

  const selectedRow = await pool.query(
    "SELECT id FROM diaries WHERE url = $1",
    [url]
  );
  const diaryId = selectedRow.rows[0].id;
  console.log("selected diary id for chapters", diaryId);

  const prevChapterId = await pool.query(
    "SELECT id FROM chapters WHERE diary_id = $1 ORDER BY id DESC LIMIT 1",
    [diaryId]
  );

  const prevchapterid =
    prevChapterId.rows.length > 0 ? prevChapterId.rows[0].id : null;

  const query = await pool.query(
    "INSERT INTO chapters(diary_id,font_family,font_size,title,prevchapterid) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [diaryId, fontFamily, fontSize, "untitled", prevchapterid]
  );

  const id = query.rows[0].id;

  await pool.query("UPDATE chapters SET nextchapterid = $1 WHERE id = $2", [
    id,
    prevchapterid,
  ]);

  const encryptedURL = encryptUserId(id);

  await pool.query("UPDATE chapters SET url = $1 WHERE id = $2", [
    encryptedURL,
    id,
  ]);
  console.log("new chapter created");
  return res.status(200).json({
    message: "Chapter Created Successfully",
    redirect: `${encryptedURL}`,
  });
};
