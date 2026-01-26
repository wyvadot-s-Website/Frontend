import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

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

/**
 * ✅ Send OTP to CONTROL EMAIL (super admin)
 * Includes requested admin's: name/email/role
 */
export const sendAdminVerificationEmail = async ({
  code,
  requestedName,
  requestedEmail,
  requestedRole,
}) => {
  const adminEmail = process.env.ADMIN_CONTROL_EMAIL;

  if (!adminEmail) throw new Error("ADMIN_CONTROL_EMAIL not set in .env");

  const mailOptions = {
    from: `"Wyvadotpr" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "New Admin Signup Verification",
    html: `
      <h2>Admin Verification Required</h2>
      <p>A new admin signup was requested.</p>

      <p><strong>Name:</strong> ${requestedName}</p>
      <p><strong>Email:</strong> ${requestedEmail}</p>
      <p><strong>Requested Role:</strong> ${requestedRole}</p>

      <hr />

      <p><strong>Verification Code:</strong></p>
      <h1>${code}</h1>

      <p>This code expires in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendServiceRequestNotificationToAdmins = async ({
  projectId,
  serviceName,
  contactName,
  contactEmail,
  contactTel,
  projectScope,
}) => {
  // ✅ Only admins that can access Project Management
  const PROJECT_ALLOWED_ROLES = [
    "super_admin",
    "project_admin",
    "content_project_admin",
    "shop_project_admin",
  ];

  // ✅ send to VERIFIED admins with allowed roles only
  const admins = await Admin.find({
    isVerified: true,
    role: { $in: PROJECT_ALLOWED_ROLES },
  }).select("email name role");

  if (!admins.length) {
    console.warn("No verified project-enabled admins found to notify");
    return;
  }

  const adminEmails = admins.map((a) => a.email);

  const mailOptions = {
    from: `"Wyvadotpr" <${process.env.EMAIL_USER}>`,
    to: adminEmails,
    subject: `New Service Request – ${projectId}`,
    html: `
      <h2>New Service Request Submitted</h2>

      <p><strong>Service:</strong> ${serviceName}</p>
      <p><strong>Project ID:</strong> ${projectId}</p>

      <hr />

      <h3>Contact Details</h3>
      <p><strong>Name:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${contactEmail}</p>
      <p><strong>Phone:</strong> ${contactTel}</p>

      <h3>Project Scope</h3>
      <p>${projectScope}</p>

      <hr />

      <p>Log in to the admin dashboard to review this request in Project Management.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPaidOrderNotificationToShopAdmins = async ({
  orderId,
  total,
  customerName,
  customerEmail,
  itemsCount,
  paymentMethod,
  createdAt,
}) => {
  // ✅ Only admins that can access Shop Management
  const SHOP_ALLOWED_ROLES = [
    "super_admin",
    "shop_admin",
    "content_shop_admin",
    "shop_project_admin",
  ];

  // ✅ send to VERIFIED admins with allowed roles only
  const admins = await Admin.find({
    isVerified: true,
    role: { $in: SHOP_ALLOWED_ROLES },
  }).select("email name role");

  if (!admins.length) {
    console.warn("No verified shop-enabled admins found to notify");
    return;
  }

  const adminEmails = admins.map((a) => a.email);

  const safeTotal =
    Number(total || 0).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }) || "—";

  const methodLabel =
    paymentMethod === "bank_transfer" ? "Bank Transfer" : "Card";

  const dateLabel = createdAt ? new Date(createdAt).toLocaleString() : "—";

  const mailOptions = {
    from: `"Wyvadotpr" <${process.env.EMAIL_USER}>`,
    to: adminEmails,
    subject: `New Paid Order – ${orderId}`,
    html: `
      <h2>New Paid Order</h2>

      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total:</strong> ${safeTotal}</p>
      <p><strong>Items:</strong> ${itemsCount ?? "—"}</p>
      <p><strong>Payment Method:</strong> ${methodLabel}</p>
      <p><strong>Date:</strong> ${dateLabel}</p>

      <hr />

      <h3>Customer</h3>
      <p><strong>Name:</strong> ${customerName || "—"}</p>
      <p><strong>Email:</strong> ${customerEmail || "—"}</p>

      <hr />

      <p>Log in to the admin dashboard and check Shop Management to process this order.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};