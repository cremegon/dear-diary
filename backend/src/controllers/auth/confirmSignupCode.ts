import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const confirmSignupCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userToken = req.body.code;
  console.log("checking matching signup code", userToken);

  const checkToken = await pool.query(
    "SELECT * FROM checkemails WHERE signup_code = $1",
    [userToken]
  );
  if (!checkToken.rows.length)
    return res
      .status(400)
      .json({ message: "Incorrect Signup Code", data: false });

  await pool.query("UPDATE checkemails SET verified = $1", [true]);

  return res.status(200).json({
    message: "SignUp Code Confirmed...",
    data: true,
  });
};
