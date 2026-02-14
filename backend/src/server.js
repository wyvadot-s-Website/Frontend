import dotenv from "dotenv";
import app from "./app.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProfileRoutes from "./routes/admin.profile.routes.js";
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
import serviceRequestUserRoutes from "./routes/serviceRequestUserRoutes.js";
import serviceRequestAdminRoutes from "./routes/serviceRequestAdminRoutes.js";
import serviceRequestUserReadRoutes from "./routes/serviceRequestUserReadRoutes.js";
import shopAdminRoutes from "./routes/shopAdminRoutes.js";
import shopPublicRoutes from "./routes/shopPublicRoutes.js";
import orderPublicRoutes from "./routes/orderPublicRoutes.js";
import orderAdminRoutes from "./routes/orderAdminRoutes.js";
import userOrderRoutes from "./routes/order.user.routes.js";
import paystackRoutes from "./routes/paystack.routes.js";
import userWishlistRoutes from "./routes/user.wishlist.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reviewRoutes from "./routes/review.routes.js";

// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

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
  })
);

await connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminHomeRoutes);
app.use("/api/admin", projectAdminRoutes);
app.use("/api/admin", adminProfileRoutes);
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
app.use("/api/service-requests", serviceRequestUserRoutes);
app.use("/api/admin/service-requests", serviceRequestAdminRoutes);
app.use("/api/service-requests", serviceRequestUserReadRoutes);
app.use("/api/admin/shop", shopAdminRoutes);
app.use("/api", shopPublicRoutes);
app.use("/api", orderPublicRoutes);
app.use("/api/admin/shop", orderAdminRoutes);
app.use("/api/user", userOrderRoutes);
app.use("/api", paystackRoutes);
app.use("/api/user", userWishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);  // ✅ FIXED!
});