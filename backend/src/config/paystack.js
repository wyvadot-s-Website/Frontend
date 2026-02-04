// config/paystack.js
export function getPaystackConfig() {
  const MODE = (process.env.PAYSTACK_MODE || "test").toLowerCase();

  const BASE_URL = process.env.PAYSTACK_BASE_URL || "https://api.paystack.co";

  const SECRET =
    MODE === "live"
      ? process.env.PAYSTACK_SECRET_KEY_LIVE
      : process.env.PAYSTACK_SECRET_KEY_TEST;

  const PUBLIC_KEY =
    MODE === "live"
      ? process.env.PAYSTACK_PUBLIC_KEY_LIVE
      : process.env.PAYSTACK_PUBLIC_KEY_TEST;

  const WEBHOOK_SECRET =
    MODE === "live"
      ? (process.env.PAYSTACK_WEBHOOK_SECRET_LIVE || SECRET)
      : (process.env.PAYSTACK_WEBHOOK_SECRET_TEST || SECRET);

  const FRONTEND_URL = process.env.FRONTEND_URL;

  // ✅ hard safety: refuse to run with missing keys
  if (!SECRET) {
    throw new Error(
      `Missing Paystack SECRET key for mode="${MODE}". Check PAYSTACK_SECRET_KEY_${MODE.toUpperCase()} in .env`,
    );
  }

  if (!FRONTEND_URL) {
    throw new Error("Missing FRONTEND_URL in .env");
  }

  return {
    MODE,
    BASE_URL,
    SECRET,
    PUBLIC_KEY,
    WEBHOOK_SECRET,
    FRONTEND_URL,
  };
}