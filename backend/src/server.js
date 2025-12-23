import dotenv from "dotenv";
import app from "./app.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import projectRoute from "./routes/projectRoute.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite
      "http://localhost:3000", // if needed
      "https://YOUR_FRONTEND_RENDER_URL",
      "http://localhost:5000/api/projects",
    ],
    credentials: true,
  })
);

await connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/admin/projects", projectRoutes);
app.use("/api/projects", projectRoute);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

