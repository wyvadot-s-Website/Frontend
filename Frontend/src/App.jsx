<<<<<<< HEAD
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Projects from './pages/Projects.jsx'
import Products from './pages/Products.jsx'
import NotFound from './pages/NotFound.jsx'
import Contact from './pages/Contact.jsx'
import Shop from './pages/Shop.jsx'
import AdminLayout from './layout/AdminLayout.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminAuthLayout from "@/Layout/AdminAuthLayout.jsx";
import AdminAuth from "./pages/AdminAuth.jsx"
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import Products from "./pages/Products.jsx";
import NotFound from "./pages/NotFound.jsx";
import Contact from "./pages/Contact.jsx";
import Shop from "./pages/Shop.jsx";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoutes from "./routes/AdminRoutes";
>>>>>>> b9395471ff2912f9c4608a5e1e0e79ce91592834

function UserLayout({ children }) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}

<<<<<<< HEAD



=======
function AdminLayout({ children }) {
  return <div>{children}</div>;
}
>>>>>>> b9395471ff2912f9c4608a5e1e0e79ce91592834

function App() {
  return (
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

<<<<<<< HEAD
        <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
          <Route path="/theboss" element={<AdminAuthLayout />}>
              <Route index element={<AdminAuth />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />} >
              <Route path = 'thedashboard' element={<AdminDashboard />} />
          </Route>
=======
        <Route
          path="*"
          element={
            <UserLayout>
              <NotFound />
            </UserLayout>
          }
        />
        {/* ADMIN ROUTES */}
        <Route path="/theboss" element={<AdminSignup />} />
        <Route path="/theboss/login" element={<AdminLogin />} />

        <Route
          path="/theboss/dashboard"
          element={
            <AdminRoutes>
              <AdminDashboard />
            </AdminRoutes>
          }
        />
>>>>>>> b9395471ff2912f9c4608a5e1e0e79ce91592834
      </Routes>
    </Router>
  );
}

export default App;
