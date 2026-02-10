import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import Products from "./pages/Products.jsx";
import NotFound from "./pages/NotFound.jsx";
import Contact from "./pages/Contact.jsx";
import ShopRouter from "./pages/ShopRouter.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AdminAuthLayout from "./Layout/AdminAuthLayout.jsx";
import AdminLayout from "./Layout/AdminLayout.jsx";
import AdminContent from "./pages/admin/AdminContent.jsx";
import AdminAccount from "./pages/admin/AdminAccount.jsx";
import AdminShop from "./pages/admin/ShopManagment.jsx";
import AdminProjects from "./pages/admin/ProjectManagement.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import ServiceRequestDetail from "./pages/admin/ServiceRequestDetail.jsx";
import CartRouter from "./pages/CartRouter.jsx";
import PaymentCallback from "./pages/PaymentCallback.jsx";
import OrderComplete from "./pages/OrderCompletePage.jsx";
import Wishlist from "./pages/user/Wishlist.jsx";
import UserAccount from "./pages/user/UserAccount.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <FloatingWhatsApp />

      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <UserLayout>
                <Home />
              </UserLayout>
            }
          />
          <Route
            path="/about"
            element={
              <UserLayout>
                <About />
              </UserLayout>
            }
          />
          <Route
            path="/services"
            element={
              <UserLayout>
                <Services />
              </UserLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <UserLayout>
                <Projects />
              </UserLayout>
            }
          />
          <Route
            path="/products"
            element={
              <UserLayout>
                <Products />
              </UserLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <UserLayout>
                <Contact />
              </UserLayout>
            }
          />

          {/* ✅ SHOP ROUTES - Now properly separated */}
          <Route
            path="/shop"
            element={
              <UserLayout>
                <ShopRouter />
              </UserLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <UserLayout>
                <ShopRouter />
              </UserLayout>
            }
          />

          {/* ✅ CART & CHECKOUT ROUTES */}
          <Route
            path="/cart"
            element={
              <UserLayout>
                <CartRouter />
              </UserLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <UserLayout>
                <CartRouter />
              </UserLayout>
            }
          />

          {/* ✅ PAYMENT & ORDER ROUTES */}
          <Route
            path="/payment/callback"
            element={
              <UserLayout>
                <PaymentCallback />
              </UserLayout>
            }
          />
          <Route
            path="/order-complete"
            element={
              <UserLayout>
                <OrderComplete />
              </UserLayout>
            }
          />

          <Route
            path="*"
            element={
              <UserLayout>
                <NotFound />
              </UserLayout>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <UserDashboard />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <Wishlist />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <UserAccount />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route path="/theboss" element={<AdminAuthLayout />}>
            <Route index element={<AdminAuth />} />
          </Route>

          <Route path="/theboss" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="services" element={<AdminShop />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="account" element={<AdminAccount />} />

            <Route
              path="service-requests/:id"
              element={<ServiceRequestDetail />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
