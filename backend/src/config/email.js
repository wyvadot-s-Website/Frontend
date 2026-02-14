import { Resend } from 'resend';
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    console.log('📤 Attempting to send email via Resend to:', toEmail);
    console.log('🔑 Using Resend API key:', process.env.RESEND_API_KEY ? 'KEY EXISTS' : 'KEY MISSING');
    
    const result = await resend.emails.send({
      from: 'Wyvadot PR <noreply@wyvadotpr.com>',
      to: toEmail,
      subject: 'Verify your email',
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #ff6b35; font-size: 32px;">${code}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });
    
    console.log('✅ Resend API response:', result);
    console.log('✅ Verification email sent to:', toEmail);
  } catch (error) {
    console.error('❌ Resend API error:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

export const sendAdminVerificationEmail = async ({
  code,
  requestedName,
  requestedEmail,
  requestedRole,
}) => {
  const adminEmail = process.env.ADMIN_CONTROL_EMAIL;

  if (!adminEmail) throw new Error("ADMIN_CONTROL_EMAIL not set");

  try {
    await resend.emails.send({
from: 'Wyvadot PR <noreply@wyvadotpr.com>',
      to: adminEmail,
      subject: 'New Admin Signup Verification',
      html: `
        <h2>Admin Verification Required</h2>
        <p>A new admin signup was requested.</p>

        <p><strong>Name:</strong> ${requestedName}</p>
        <p><strong>Email:</strong> ${requestedEmail}</p>
        <p><strong>Requested Role:</strong> ${requestedRole}</p>

        <hr />

        <p><strong>Verification Code:</strong></p>
        <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 4px;">${code}</h1>

        <p>This code expires in 10 minutes.</p>
      `,
    });
    console.log('✅ Admin verification email sent to:', adminEmail);
  } catch (error) {
    console.error('❌ Failed to send admin verification email:', error);
    throw error;
  }
};

export const sendServiceRequestNotificationToAdmins = async ({
  projectId,
  serviceName,
  contactName,
  contactEmail,
  contactTel,
  projectScope,
}) => {
  const PROJECT_ALLOWED_ROLES = [
    "super_admin",
    "project_admin",
    "content_project_admin",
    "shop_project_admin",
  ];

  const admins = await Admin.find({
    isVerified: true,
    role: { $in: PROJECT_ALLOWED_ROLES },
  }).select("email name role");

  if (!admins.length) {
    console.warn("No verified project-enabled admins found to notify");
    return;
  }

  const adminEmails = admins.map((a) => a.email);

  try {
    await resend.emails.send({
      from: 'Wyvadot PR <noreply@wyvadotpr.com>',
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
    });
    console.log('✅ Service request notification sent to admins');
  } catch (error) {
    console.error('❌ Failed to send service request notification:', error);
    throw error;
  }
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
  const SHOP_ALLOWED_ROLES = [
    "super_admin",
    "shop_admin",
    "content_shop_admin",
    "shop_project_admin",
  ];

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

  try {
    await resend.emails.send({
      from: 'Wyvadot PR <noreply@wyvadotpr.com>',
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
    });
    console.log('✅ Order notification sent to shop admins');
  } catch (error) {
    console.error('❌ Failed to send order notification:', error);
    throw error;
  }
};