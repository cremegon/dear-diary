import { config } from "../config";
import { randomBytes } from "crypto";
import { createTransport } from "nodemailer";

const serverEmail = config.serverEmail;
const serverPassword = config.serverPassword;
const senderEmail = config.senderEmail;

export const send_PDF_Email = async (
  receipientEmail: string,
  title: string,
  author: string,
  pdfBuffer: Buffer
): Promise<any> => {
  console.log("testing email...");

  const token = randomBytes(16).toString("hex").slice(0, 6);

  const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: serverEmail, pass: serverPassword },
  });

  const mailOptions = {
    from: senderEmail,
    to: receipientEmail,
    subject: "Hello from the Backend 2",
    html: `<p>this is our second point of contact brother...${token}</p>`,
    attachments: [
      {
        filename: `${title}-${author}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`send successful to ${receipientEmail}`);
  } catch (error) {
    console.log("error", error);
    return false;
  }

  return true;
};
