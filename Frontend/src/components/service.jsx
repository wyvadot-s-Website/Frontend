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

function ServiceComponent() {
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
    <div className="min-h-screen mt-15 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            What we Build, We Build With Purpose
          </h1>
          <p className="text-gray-600 text-sm">
            Our multidisciplinary team delivers engineering construction, and
            maintenance solutions with precision and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => handleServiceClick(service.name)}
              className="bg-gray-200 hover:bg-gray-300 transition-colors h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-lg p-6"
            >
              <img
                className="text-xl w-20 mb-2"
                src={service.icon}
                alt={service.name}
              />
              <p className="text-xl font-medium max-w-[65%]">
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

export default ServiceComponent;
