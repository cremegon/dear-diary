import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { randomBytes } from "crypto";
import { createTransport } from "nodemailer";
const pool = new Pool(config.db);

export const send_PDF_Email = async (
  req: Request,
  res: Response
): Promise<any> => {
  const token = randomBytes(16).toString("hex");
  const userEmail = "tyreese@acrewgame.com";
  const senderEmail = "hussain.artist.ahmed@gmail.com";
  const senderPassword = "ilikenarnia1100";

  const transporter = createTransport({
    service: "gmail",
    auth: { user: senderEmail, pass: senderPassword },
  });

  const mailOptions = {
    from: senderEmail,
    to: userEmail,
    subject: "Hello from the Backend",
    html: `<p>this is our first point of contact brother...${token}</p>`,
  };

  transporter.sendMail(mailOptions);

  return res.status(200).json({ message: "We in This" });
};
