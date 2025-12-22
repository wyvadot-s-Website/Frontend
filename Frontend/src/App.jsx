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

function UserLayout({ children }) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  )
}






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/about" element={<UserLayout><About /></UserLayout>} />
        <Route path="/services" element={<UserLayout><Services /></UserLayout>} />
        <Route path="/projects" element={<UserLayout><Projects /></UserLayout>} />
        <Route path="/products" element={<UserLayout><Products /></UserLayout>} />
        <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
        <Route path="/shop" element={<UserLayout><Shop /></UserLayout>} />

        <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
          <Route path="/theboss" element={<AdminAuthLayout />}>
              <Route index element={<AdminAuth />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />} >
              <Route path = 'thedashboard' element={<AdminDashboard />} />
          </Route>
      </Routes>
    </Router>
  )
}

export default App