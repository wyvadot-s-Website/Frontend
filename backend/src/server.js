import dotenv from "dotenv";
import app from "./app.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import projectAdminRoutes from "./routes/projectAdminRoutes.js";
import projectPublicRoute from "./routes/projectPublicRoute.js";
import userRoutes from "./routes/userRoutes.js";
import adminHomeRoutes from "./routes/adminHomeRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import aboutAdminRoutes from "./routes/aboutAdminRoutes.js";
import aboutPublicRoutes from "./routes/aboutPublicRoutes.js";
import teamAdminRoutes from "./routes/teamAdminRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import testimonialAdminRoutes from "./routes/testimonialAdminRoutes.js"; 
import testimonialRoutes from "./routes/testimonialRoutes.js";
import footerAdminRoutes from "./routes/footerAdminRoutes.js";
import footerPublicRoutes from "./routes/footerPublicRoutes.js"; 


dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite
      "http://localhost:3000", // if needed
      "https://YOUR_FRONTEND_RENDER_URL",
    ],
    credentials: true,
  })
);

await connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminHomeRoutes);
app.use("/api/admin", projectAdminRoutes);
app.use("/api", homeRoutes);
app.use("/api", projectPublicRoute);
app.use("/users", userRoutes);
app.use("/api/admin", aboutAdminRoutes);
app.use("/api", aboutPublicRoutes);
app.use("/api/admin", teamAdminRoutes);
app.use("/api", teamRoutes);
app.use("/api/admin", testimonialAdminRoutes);
app.use("/api", testimonialRoutes);
app.use("/api/admin", footerAdminRoutes);
app.use("/api", footerPublicRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
