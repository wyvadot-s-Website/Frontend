import express from "express";
import cors from "cors";

const app = express();

// ✅ CORS MUST BE FIRST
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

// ✅ Paystack webhook needs raw body for signature verification
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get("/", (_req, res) => {
  res.send("API running");
});

export default app;