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

  try {
    await pool.query("DELETE FROM chapters WHERE url = $1", [chapterURL]);
  } catch (error) {
    console.log("No Relevant Chapter Found");
    return res.status(404).send();
  }

  return res.status(204).send();
};
