import { Request, response, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const deleteDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { diaryURL } = req.params;
  const token = req.cookies.authToken;

  console.log("Deleting Diary...", diaryURL);

  if (!token) {
    console.log("Token Error at deleteDiary");
    return res.status(404).send();
  }

  try {
    await pool.query("DELETE FROM diaries WHERE url = $1", [diaryURL]);
  } catch (error) {
    console.log("No Relevant Diary Found");
    return res.status(404).send();
  }

  return res.status(204).send();
};
