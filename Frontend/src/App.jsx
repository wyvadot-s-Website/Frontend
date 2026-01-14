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
import Shop from "./pages/Shop.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AdminAuthLayout from "./Layout/AdminAuthLayout.jsx";
import AdminLayout from "./Layout/AdminLayout.jsx";
import AdminContent from "./pages/admin/AdminContent.jsx";
import AdminServices from "./pages/admin/AdminServices.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminForms from "./pages/admin/AdminForms.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";

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
      <Router>
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
          <Route
            path="/shop"
            element={
              <UserLayout>
                <Shop />
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

          {/* ADMIN ROUTES */}
          <Route path="/theboss" element={<AdminAuthLayout />}>
            <Route index element={<AdminAuth />} />
          </Route>

          <Route path="/theboss" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="forms" element={<AdminForms />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
