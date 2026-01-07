import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, code) => {
  const mailOptions = {
    from: `"Wyvadotpr" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminVerificationEmail = async (code) => {
  const adminEmail = process.env.ADMIN_CONTROL_EMAIL;

  if (!adminEmail) {
    throw new Error("ADMIN_CONTROL_EMAIL not set in .env");
  }

  const mailOptions = {
    from: `"Wyvadotpr" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "New Admin Signup Verification",
    html: `
      <h2>Admin Verification Required</h2>
      <p>An admin signup was requested.</p>

      <h1>${code}</h1>

      <p>This code expires in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
