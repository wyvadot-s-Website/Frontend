import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitServiceRequest } from "../services/serviceRequestService";

// Import individual form components
import ProjectManagementForm from "./forms/ProjectManagementForm";
import CoreEngineeringForm from "./forms/CoreEngineeringForm";
import FacilitiesManagementForm from "./forms/FacilitiesManagementForm";
import EnergyProcessForm from "./forms/EnergyProcessForm";
import TechnologyEcommerceForm from "./forms/TechnologyEcommerceForm";
import GeneralContractsForm from "./forms/GeneralContractsForm";
import ContactDetailsSection from "./forms/ContactDetailsSection";

function ConsultationModal({ isOpen, onClose, serviceName }) {
  const [formData, setFormData] = useState({
    // Contact details
    name: "",
    email: "",
    countryCode: "+234",
    tel: "",
    companyName: "",
    projectScope: "",
    // Common fields
    timeline: "Immediately (Emergency)",
    location: "Nigeria",
    locationAddress: "",
    agreed: false,
    // Service-specific fields will be added by child components
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
  const newErrors = {};

  // ===== CONTACT DETAILS (Required for all) =====
  if (!formData.name?.trim()) {
    newErrors.name = "Full name is required";
  }
  
  if (!formData.email?.trim()) {
    newErrors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }
  
  if (!formData.tel?.trim()) {
    newErrors.tel = "Phone number is required";
  }
  
  if (!formData.projectScope?.trim()) {
    newErrors.projectScope = "Project scope description is required";
  }

  // ===== COMMON FIELDS (Required for all) =====
  if (!formData.timeline) {
    newErrors.timeline = "Project timeline is required";
  }
  
  if (!formData.location) {
    newErrors.location = "Project location is required";
  }
  
  if (!formData.locationAddress?.trim()) {
    newErrors.locationAddress = "Specific project address is required";
  }

  // ===== SERVICE-SPECIFIC VALIDATIONS =====
  
  // Project Management & Resourcing
  if (serviceName === "Project Management & Resourcing") {
    if (!formData.pm_service?.trim()) {
      newErrors.pm_service = "Please specify the project management service you need";
    }
    if (!formData.pm_budget?.trim()) {
      newErrors.pm_budget = "Budget estimate is required for planning purposes";
    }
    if (!formData.pm_financing) {
      newErrors.pm_financing = "Please indicate if financing is secured";
    }
  }

  // Core Engineering & Construction
  if (serviceName === "Core Engineering & Construction") {
    if (!formData.ce_description?.trim()) {
      newErrors.ce_description = "Core discipline description is required";
    }
    if (!formData.ce_design?.trim()) {
      newErrors.ce_design = "Design status information is required";
    }
    if (!formData.ce_cost?.trim()) {
      newErrors.ce_cost = "Construction cost state is required";
    }
    if (!formData.ce_materials?.trim()) {
      newErrors.ce_materials = "Material standards/preferences are required";
    }
  }

  // Facilities Management & Maintenance
  if (serviceName === "Facilities Management & Maintenance") {
    if (!formData.fm_services?.trim()) {
      newErrors.fm_services = "Please specify if this is one-time or long-term service";
    }
    if (!formData.fm_coverage?.trim()) {
      newErrors.fm_coverage = "Facility size/square footage is required";
    }
    if (!formData.fm_maintenance?.trim()) {
      newErrors.fm_maintenance = "Please list your top 3 critical maintenance needs";
    }
  }

  // Energy & Process Services
  if (serviceName === "Energy & Process Services") {
    if (!formData.ep_inquiry?.trim()) {
      newErrors.ep_inquiry = "Please specify the type of energy service you need";
    }
    if (!formData.ep_facility?.trim()) {
      newErrors.ep_facility = "Facility/process type is required";
    }
  }

  // Technology & E-commerce
  if (serviceName === "Technology & E-commerce") {
    if (!formData.tech_software?.trim()) {
      newErrors.tech_software = "Please specify software development or technology implementation needs";
    }
    if (!formData.tech_platform) {
      newErrors.tech_platform = "Platform selection is required";
    }
  }

  // General Contracts
  if (serviceName === "General Contracts") {
    if (!formData.gc_region?.trim()) {
      newErrors.gc_region = "Region/market information is required";
    }
    if (!formData.gc_location?.trim()) {
      newErrors.gc_location = "Project location is required";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async () => {
  setErrors({});
  
  if (!validateForm()) {
    toast.error("Please fill in all required fields correctly");
    const firstError = document.querySelector('.border-red-500');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login to submit a service request.");
    return;
  }

  const toastId = toast.loading("Submitting request...");

  // ✅ ADD THIS LOGGING
  const payload = {
    serviceName,
    ...formData,
  };
  console.log("=== SUBMITTING SERVICE REQUEST ===");
  console.log("Service Name:", serviceName);
  console.log("Payload:", payload);
  console.log("Token exists:", !!token);
  console.log("==================================");

  try {
    const result = await submitServiceRequest(payload, token);
    
    console.log("=== SUBMISSION SUCCESS ===");
    console.log("Result:", result);
    console.log("==========================");

    toast.success("Service request submitted successfully!", { id: toastId });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      countryCode: "+234",
      tel: "",
      companyName: "",
      projectScope: "",
      timeline: "Immediately (Emergency)",
      location: "Nigeria",
      locationAddress: "",
      agreed: false,
    });
    
    onClose();
    
  } catch (err) {
    console.error("=== SUBMISSION ERROR ===");
    console.error("Error:", err);
    console.error("========================");
    toast.error(err.message || "Submission failed", { id: toastId });
  }
};

  // Render the appropriate service form based on serviceName prop
  const renderServiceForm = () => {
  switch (serviceName) {
    case "Project Management & Resourcing":
      return (
        <ProjectManagementForm 
          formData={formData} 
          onChange={handleChange}
          errors={errors}
        />
      );
    case "Core Engineering & Construction":
      return (
        <CoreEngineeringForm 
          formData={formData} 
          onChange={handleChange}
          errors={errors}
        />
      );
    case "Facilities Management & Maintenance":
      return (
        <FacilitiesManagementForm
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />
      );
    case "Energy & Process Services":
      return (
        <EnergyProcessForm 
          formData={formData} 
          onChange={handleChange}
          errors={errors}
        />
      );
    case "Technology & E-commerce":
      return (
        <TechnologyEcommerceForm
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />
      );
    case "General Contracts":
      return (
        <GeneralContractsForm 
          formData={formData} 
          onChange={handleChange}
          errors={errors}
        />
      );
    default:
      return (
        <GeneralContractsForm 
          formData={formData} 
          onChange={handleChange}
          errors={errors}
        />
      );
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Request Your Consultation
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">{serviceName}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
         {/* Contact Details Section - Shared across all forms */}
<ContactDetailsSection 
  formData={formData} 
  onChange={handleChange}
  errors={errors}
/>

          {/* Service-Specific Form - Based on the service button clicked */}
          {renderServiceForm()}

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreement"
              checked={formData.agreed}
              onCheckedChange={(checked) => handleChange("agreed", checked)}
            />
            <Label
              htmlFor="agreement"
              className="text-xs leading-tight cursor-pointer"
            >
              Click to subscribe to our newsletter (optional)
            </Label>
          </div>

          <div className="text-xs text-gray-600">
            By submitting, you agree to our privacy policy and terms and
            conditions
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Request Consultation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConsultationModal;
