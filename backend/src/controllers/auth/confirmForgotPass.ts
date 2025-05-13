import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../../config";

const pool = new Pool(config.db);

export const confirmForgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userToken = req.body.code;
  console.log("checking matching usertoken", userToken);

  const checkToken = await pool.query(
    "SELECT * FROM users WHERE forgottoken = $1",
    [userToken]
  );
  if (!checkToken.rows.length)
    return res.status(400).json({ message: "Incorrect Token", data: false });

  return res.status(200).json({
    message: "Forgot Token Confirmed...",
    data: true,
  });
};
