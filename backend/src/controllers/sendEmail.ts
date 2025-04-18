import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { randomBytes } from "crypto";
import { createTransport } from "nodemailer";
const pool = new Pool(config.db);
const serverEmail = config.serverEmail;
const serverPassword = config.serverPassword;

export const send_PDF_Email = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("testing email...");

  const token = randomBytes(16).toString("hex").slice(0, 6);
  const userEmail = "xasix32265@cotigz.com";
  const senderEmail = serverEmail;
  const senderPassword = serverPassword;

  const transporter = createTransport({
    service: "gmail",
    auth: { user: senderEmail, pass: senderPassword },
  });

  const mailOptions = {
    from: senderEmail,
    to: userEmail,
    subject: "Hello from the Backend 2",
    html: `<p>this is our second point of contact brother...${token}</p>`,
  };

  try {
    transporter.sendMail(mailOptions);
    console.log("send successful");
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: "We in This" });
};
