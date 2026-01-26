import express from "express";

const app = express();

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
