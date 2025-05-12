import { config } from "../config";
import { createTransport } from "nodemailer";

const serverEmail = config.serverEmail;
const serverPassword = config.serverPassword;
const senderEmail = config.senderEmail;

export const send_signUpCode_Email = async (
  receipientEmail: string,
  token: string
): Promise<any> => {
  console.log("testing signup code...");

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
    subject: "Verify Your Sign Up",
    html: `<p>You requested a signup code...here... have this...${token}</p>`,
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
