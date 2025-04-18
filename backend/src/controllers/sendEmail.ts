import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { createHash } from "crypto";
import {nodemailer }from "nodemailer"

const pool = new Pool(config.db);

export const send_PDF_Email = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userEmail = "tyreese@acrewgame.com"
  const senderEmail = "hussain.artist.ahmed@gmail.com"
  const senderPassword = "ilikenarnia1100"

  const transporter = 
  

  return res.status(200).json({ message: "We in This" });
};