import React, { useEffect, useState } from "react";
import eng from "../assets/eng.png";
import cont from "../assets/contract.png";
import workr from "../assets/worker.png";
import tool from "../assets/tool.png";
import mech from "../assets/machine.png";
import comp from "../assets/comp.png";

import { toast } from "sonner";

import ConsultationModal from "./ConsultationModal";
import AuthModal from "@/pages/AuthModal.jsx";
import { fetchServicesContent } from "../services/servicesService";
import { DEFAULT_SERVICES, getServiceRequestName } from "../utils/servicesContent";

const fallbackIcons = {
  project_management_resourcing: eng,
  core_engineering_construction: cont,
  facilities_management_maintenance: workr,
  energy_process_services: tool,
  technology_ecommerce: mech,
  general_contracts: comp,
};

function ServiceComponent({ services: providedServices, intro }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState("signup");
  const [pendingService, setPendingService] = useState("");
  const [services, setServices] = useState(providedServices || DEFAULT_SERVICES);
  const [pageIntro, setPageIntro] = useState(intro || {});

  const loadServices = async () => {
    if (providedServices) {
      setServices(providedServices);
      return;
    }

    try {
      const data = await fetchServicesContent();
      setServices(data.services?.length ? data.services : DEFAULT_SERVICES);
      setPageIntro(data.intro || {});
    } catch {
      setServices(DEFAULT_SERVICES);
    }
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providedServices]);

  const openConsultation = (service) => {
    setSelectedService(getServiceRequestName(service));
    setModalOpen(true);
  };

  const handleServiceClick = (service) => {
    const token = localStorage.getItem("token");

    if (token) {
      openConsultation(service);
      return;
    }

    setPendingService(service);
    setAuthInitialView("signup");
    setAuthOpen(true);
    toast.error("Please login or sign up to request a service.");
  };

  useEffect(() => {
    if (authOpen) return;

    const token = localStorage.getItem("token");
    if (token && pendingService) {
      openConsultation(pendingService);
      setPendingService("");
    }
  }, [authOpen, pendingService]);

  const heading = pageIntro?.heading || "What we Build, We Build With Purpose";
  const description =
    pageIntro?.description ||
    "Our multidisciplinary team delivers engineering construction, and maintenance solutions with precision and purpose";

  return (
    <div className="min-h-screen mt-15 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{heading}</h1>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        {services.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
            No services are currently available.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const icon = service.image?.url || fallbackIcons[service.serviceKey];
            return (
              <button
                key={service.serviceKey || service.title}
                onClick={() => handleServiceClick(service)}
                className="bg-gray-200 hover:bg-gray-300 transition-colors min-h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-lg p-6"
              >
                {icon && (
                  <img
                    className="text-xl w-20 mb-2"
                    src={icon}
                    alt={service.title}
                  />
                )}
                <p className="text-xl font-medium max-w-[65%]">{service.title}</p>
                {service.shortDescription && (
                  <p className="text-sm text-gray-600 max-w-[85%]">{service.shortDescription}</p>
                )}
              </button>
            );
          })}
        </div>
        )}
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={authInitialView}
      />

      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={selectedService}
      />
    </div>
  );
}

export default ServiceComponent;
