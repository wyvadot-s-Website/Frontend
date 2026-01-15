import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// Import individual form components
import ProjectManagementForm from './forms/ProjectManagementForm'
import CoreEngineeringForm from './forms/CoreEngineeringForm'
import FacilitiesManagementForm from './forms/FacilitiesManagementForm'
import EnergyProcessForm from './forms/EnergyProcessForm'
import TechnologyEcommerceForm from './forms/TechnologyEcommerceForm'
import GeneralContractsForm from './forms/GeneralContractsForm'
import ContactDetailsSection from './forms/ContactDetailsSection'

function ConsultationModal({ isOpen, onClose, serviceName }) {
  const [formData, setFormData] = useState({
    // Contact details
    name: '',
    email: '',
    tel: '',
    companyName: '',
    projectScope: '',
    // Common fields
    timeline: 'Immediately (Emergency)',
    location: 'Nigeria',
    locationAddress: '',
    agreed: false,
    // Service-specific fields will be added by child components
  })

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = () => {
    console.log('Form submitted:', { service: serviceName, ...formData })
    // Add your form submission logic here
    onClose()
  }

  // Render the appropriate service form based on serviceName prop
  const renderServiceForm = () => {
    switch (serviceName) {
      case 'Project Management & Resourcing':
        return <ProjectManagementForm formData={formData} onChange={handleChange} />
      case 'Core Engineering & Construction':
        return <CoreEngineeringForm formData={formData} onChange={handleChange} />
      case 'Facilities Management & Maintenance':
        return <FacilitiesManagementForm formData={formData} onChange={handleChange} />
      case 'Energy & Process Services':
        return <EnergyProcessForm formData={formData} onChange={handleChange} />
      case 'Technology & E-commerce':
        return <TechnologyEcommerceForm formData={formData} onChange={handleChange} />
      case 'General Contracts':
        return <GeneralContractsForm formData={formData} onChange={handleChange} />
      default:
        return <GeneralContractsForm formData={formData} onChange={handleChange} />
    }
  }

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
          <ContactDetailsSection formData={formData} onChange={handleChange} />

          {/* Service-Specific Form - Based on the service button clicked */}
          {renderServiceForm()}

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreement"
              checked={formData.agreed}
              onCheckedChange={(checked) => handleChange('agreed', checked)}
            />
            <Label htmlFor="agreement" className="text-xs leading-tight cursor-pointer">
              Click to subscribe to our newsletter (optional)
            </Label>
          </div>

          <div className="text-xs text-gray-600">
            By submitting, you agree to our privacy policy and terms and conditions
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
  )
}

export default ConsultationModal