import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.db);

export const addEntrustee = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { diaryURL } = req.params;
  const { trustees } = req.body;
  console.log("finishing diary...", trustees);

  for (const { diaryId, name, email, address, phone } of trustees) {
    console.log(diaryId, name, email, address, phone);
    try {
      await pool.query(
        "INSERT INTO trustees(diary_id,name,email,address,phone) VALUES ((SELECT id FROM diaries WHERE url = $1),$2,$3,$4,$5)",
        [diaryURL, name, email, address, phone]
      );
    } catch (error) {
      return res
        .status(403)
        .json({ message: `The following error occured: ${error}` });
    }
  }

  console.log("Successfully Created Diary PDF");
  return res.status(200).json({
    message: "Successfully Added New Entrustee",
  });
};
