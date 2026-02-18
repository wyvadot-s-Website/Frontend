import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

// ✅ If you're behind Cloudflare/Render proxy, do this:
app.set("trust proxy", 1);

// ✅ CORS FIRST (good)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://wyvadotpr.vercel.app",
      "https://wyvadotpr.onrender.com",
      "https://wyvadotpr.com",
      "https://www.wyvadotpr.com"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ✅ raw body capture (good for Paystack webhook signature)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// ✅ Global rate limit: 100 requests / 15 mins per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
const paystackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many payment requests, please try again later.",
});

app.use("/api/paystack", paystackLimiter);
app.use("/api", apiLimiter);

app.get("/", (_req, res) => res.send("API running"));

export default app;
