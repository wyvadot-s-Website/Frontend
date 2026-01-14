import React, { useEffect, useState } from "react";
import WelcomeView from "@/components/auth/WelcomeView.jsx";
import logo from "../../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";

function UserDashboard() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const justSignedUp = localStorage.getItem("justSignedUp");

    if (justSignedUp === "true") {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.removeItem("justSignedUp");
    setShowWelcome(false);
  };

  return (
    <>
      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeView
          isOpen={showWelcome}
          logo={logo}
          onContinue={handleCloseWelcome}
        />
      )}

      {/* Dashboard Content */}
      <div className="min-h-screen bg-gray-50 px-6 py-8 space-y-10">

        {/* Top Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {[
            "Project Management & Resourcing",
            "Core Engineering & Constructions",
            "Facilities Management & Maintenance",
            "Energy & Project Services",
            "Technology & Ecommerce",
            "General Contact",
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 mb-4" />
              <p className="text-sm font-medium text-gray-800">{item}</p>
            </div>
          ))}
        </div>

        {/* Service Project Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Service Project</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3">Project ID</th>
                  <th className="text-left py-3">Title</th>
                  <th className="text-left py-3">Client</th>
                  <th className="text-left py-3">Progress</th>
                  <th className="text-left py-3">Stage</th>
                  <th className="text-left py-3">Manager</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3">PROJ-CEC-2024-001</td>
                    <td className="py-3 font-medium">
                      Residential Complex Construction
                    </td>
                    <td className="py-3">Sarah Smith</td>
                    <td className="py-3">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-gray-800 rounded w-3/4" />
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
                        Documentation
                      </span>
                    </td>
                    <td className="py-3">James Anderson</td>
                    <td className="py-3">12/16/2024</td>
                    <td className="py-3 text-gray-500">emma@example.com</td>
                    <td className="py-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        Service
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Shop Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Shop</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Product Name</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-left py-3">Items</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3">ORD-8765</td>
                    <td className="py-3 font-medium">
                      Safety Helmet - Pro Series
                    </td>
                    <td className="py-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                        Safety Equipment
                      </span>
                    </td>
                    <td className="py-3">125</td>
                    <td className="py-3">$45.99</td>
                    <td className="py-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        Delivered
                      </span>
                    </td>
                    <td className="py-3">28/12/2025</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}

export default UserDashboard;
