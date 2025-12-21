import nodemailer from "nodemailer";

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
