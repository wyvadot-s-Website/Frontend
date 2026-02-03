import React, { useEffect, useState } from "react";
import eng from "../assets/eng.png";
import cont from "../assets/contract.png";
import workr from "../assets/worker.png";
import tool from "../assets/tool.png";
import mech from "../assets/machine.png";
import comp from "../assets/comp.png";

import { toast } from "sonner";

import ConsultationModal from "./ConsultationModal";
import AuthModal from "@/pages/AuthModal.jsx"; // ✅ adjust path if needed

function UserServiceComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  // Auth modal controls
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState("signup");

  // Store what user wanted before login
  const [pendingService, setPendingService] = useState("");

  const services = [
    { name: "Project Management & Resourcing", icon: eng },
    { name: "Core Engineering & Construction", icon: cont },
    { name: "Facilities Management & Maintenance", icon: workr },
    { name: "Energy & Process Services", icon: tool },
    { name: "Technology & E-commerce", icon: mech },
    { name: "General Contracts", icon: comp },
  ];

  const openConsultation = (serviceName) => {
    setSelectedService(serviceName);
    setModalOpen(true);
  };

  const handleServiceClick = (serviceName) => {
    const token = localStorage.getItem("token");

    // ✅ logged in → open service form
    if (token) {
      openConsultation(serviceName);
      return;
    }

    // ❌ not logged in → open AuthModal first
    setPendingService(serviceName);

    // choose default view when prompting
    setAuthInitialView("signup"); // or "login" if you prefer
    setAuthOpen(true);

    toast.error("Please login or sign up to request a service.");
  };

  // ✅ When AuthModal closes, if token exists and we have pendingService → open consultation
  useEffect(() => {
    if (authOpen) return; // wait until modal closes

    const token = localStorage.getItem("token");
    if (token && pendingService) {
      openConsultation(pendingService);
      setPendingService(""); // clear
    }
  }, [authOpen, pendingService]);

  return (
    <div className=" mt-5 p-8">
     <div className="max-w-7xl mx-auto px-4">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {services.map((service, index) => (
      <button
        key={index}
        onClick={() => handleServiceClick(service.name)}
        className="bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-lg border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center gap-3 group"
      >
        {/* Icon */}
        <div className="w-16 h-16 flex items-center justify-center mb-2">
          <img
            className="w-full h-full object-contain transition-transform group-hover:scale-110"
            src={service.icon}
            alt={service.name}
          />
        </div>
        
        {/* Service Name */}
        <p className="text-sm font-medium text-gray-700 leading-tight">
          {service.name}
        </p>
      </button>
    ))}
  </div>
</div>

      {/* ✅ Auth modal first if not logged in */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authInitialView}
      />

      {/* ✅ Consultation modal (service form) */}
      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={selectedService}
      />
    </div>
  );
}

export default UserServiceComponent;
