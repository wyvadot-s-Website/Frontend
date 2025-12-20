import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/admin/projects", projectRoutes);

dotenv.config();

await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
