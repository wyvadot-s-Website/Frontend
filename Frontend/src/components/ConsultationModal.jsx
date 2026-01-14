import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

// Service configurations with their specific questions
const serviceConfigs = {
  'Project Management & Resourcing': {
    questions: [
      {
        id: 'pm_service',
        type: 'textarea',
        label: 'What specific project management services are you currently seeking (e.g., Construction Management, Engineering Management, or General Project Oversight)?',
        placeholder: 'What specific project management service?'
      },
      {
        id: 'pm_budget',
        type: 'textarea',
        label: 'What is the estimated budget range for this project? (e.g., under $50k, $50k-$500k, over $500k)?',
        placeholder: 'Your estimated budget?'
      },
      {
        id: 'pm_resourcing',
        type: 'textarea',
        label: 'If seeking Human Resource/Resourcing/Consultation, what key technical roles are you looking to start or gain expertise in?',
        placeholder: ''
      },
      {
        id: 'pm_penalties',
        type: 'textarea',
        label: 'Have you already secured financing or necessary permits for the project?',
        placeholder: ''
      }
    ],
    timeline: true,
    location: true
  },
  'General Contracts': {
    questions: [
      {
        id: 'gc_region',
        type: 'textarea',
        label: 'What is your region/market?',
        required: true,
        placeholder: ''
      },
      {
        id: 'gc_location',
        type: 'textarea',
        label: 'Where is the location of your project?',
        placeholder: 'Enter Address'
      }
    ],
    timeline: false,
    location: true
  },
  'Technology & E-commerce': {
    questions: [
      {
        id: 'tech_software',
        type: 'textarea',
        label: 'Are you currently seeking Software Development (e.g., Building a new app or SaaS, Technology enablement/migration, Mobile/web dev, AI/automation and redesign ecosystem / Multiple choice)?',
        placeholder: 'Are you currently seeking Software Development (e.g., Technology)?'
      },
      {
        id: 'tech_platform',
        type: 'textarea',
        label: 'What platform or operating system is the most relevant/applicable/desired intended for (e.g., Web, iOS, OS, Android, Desktop)?',
        placeholder: ''
      },
      {
        id: 'tech_cmms',
        type: 'textarea',
        label: 'If seeking Computerized Maintenance Management Systems (CMMS), what is the current system you use if any?',
        placeholder: ''
      },
      {
        id: 'tech_ecommerce',
        type: 'textarea',
        label: 'For E-Commerce services, what is your main product/service or target sales channel?',
        placeholder: ''
      }
    ],
    timeline: true,
    location: true
  },
  'Core Engineering & Construction': {
    questions: [
      {
        id: 'ce_description',
        type: 'textarea',
        label: 'In brief, describe why your project primarily involves (Civil, Mechanical, Electrical, or Instrumentation & Controls)?',
        placeholder: 'What best describes what your project primarily involves?'
      },
      {
        id: 'ce_design',
        type: 'textarea',
        label: 'Do you already possess finalized designs and plans, or are you seeking our Architecture/Engineering Design services?',
        placeholder: ''
      },
      {
        id: 'ce_cost',
        type: 'textarea',
        label: 'For construction cost, what is the estimating/feasibility, procurement, renovation, active facility?',
        placeholder: ''
      },
      {
        id: 'ce_materials',
        type: 'textarea',
        label: 'What are the relevant/preferred materials or material standards (tools/equipment/tech) this engineering project must meet?',
        placeholder: ''
      }
    ],
    timeline: true,
    location: true
  },
  'Energy & Process Services': {
    questions: [
      {
        id: 'ep_inquiry',
        type: 'textarea',
        label: 'Are you inquiring about facility operations/expansion (engineering or energy at big management services (e.g., Own Port, Energy Management)? (Multiple choice)',
        placeholder: ''
      },
      {
        id: 'ep_facility',
        type: 'textarea',
        label: 'What type of facility or process are you seeking (e.g., Oil & Gas-Based Plant, Industries)?',
        placeholder: ''
      },
      {
        id: 'ep_cmms',
        type: 'textarea',
        label: 'If seeking Computerized Maintenance Management Systems (CMMS), what is the current system you use if any?',
        placeholder: ''
      },
      {
        id: 'ep_process',
        type: 'textarea',
        label: 'For Process Engineering, what is the aim/size/capacity/efficiency goal you are targeting?',
        placeholder: ''
      }
    ],
    timeline: true,
    location: true
  },
  'Facilities Management & Maintenance': {
    questions: [
      {
        id: 'fm_services',
        type: 'textarea',
        label: 'Is this a one-time service inquiry (e.g., renovation, installation) or are you seeking a long-term maintenance contract (e.g., Operations/Maintenance, general Building/Facility Management)?',
        placeholder: ''
      },
      {
        id: 'fm_coverage',
        type: 'textarea',
        label: 'What are the total square footage or estimated size of the facilities requiring maintenance?',
        placeholder: ''
      },
      {
        id: 'fm_maintenance',
        type: 'textarea',
        label: 'Please list the top three critical maintenance issues or services you require immediately (e.g., HVAC/Elev, plumbing/elec, exterior renovation)',
        placeholder: ''
      },
      {
        id: 'fm_availability',
        type: 'textarea',
        label: 'If seeking Specialized Services/on-site, are you have a specific design style or wild or most based you can share?',
        placeholder: ''
      }
    ],
    timeline: true,
    location: true
  }
}

function ConsultationModal({ isOpen, onClose, serviceName }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    companyName: '',
    projectScope: '',
    timeline: 'Immediately (Emergency)',
    location: 'Urgent',
    agreed: false
  })

  const config = serviceConfigs[serviceName] || serviceConfigs['General Contracts']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request Your Consultation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Desired Service</Label>
            <Select defaultValue={serviceName}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Management & Resourcing">Project Management & Resourcing</SelectItem>
                <SelectItem value="Core Engineering & Construction">Core Engineering & Construction</SelectItem>
                <SelectItem value="Facilities Management & Maintenance">Facilities Management & Maintenance</SelectItem>
                <SelectItem value="Energy & Process Services">Energy & Process Services</SelectItem>
                <SelectItem value="Technology & E-commerce">Technology & E-commerce</SelectItem>
                <SelectItem value="General Contracts">General Contracts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tel">Tel</Label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-2 border rounded-md bg-gray-50">
                  <span className="text-sm">🇳🇬 +234</span>
                </div>
                <Input
                  id="tel"
                  name="tel"
                  type="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
              />
              <span className="text-xs text-gray-500">optional</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectScope">Project Scope</Label>
              <Textarea
                id="projectScope"
                name="projectScope"
                value={formData.projectScope}
                onChange={handleChange}
                placeholder="Describe your project"
                rows={3}
              />
            </div>
          </div>

          {/* Service-specific questions */}
          <div className="space-y-4">
            {config.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label htmlFor={question.id} className="text-sm">
                  {question.label}
                  {question.required && <span className="text-orange-500 ml-1">*</span>}
                </Label>
                <Textarea
                  id={question.id}
                  name={question.id}
                  placeholder={question.placeholder}
                  rows={3}
                  className="resize-none"
                />
              </div>
            ))}
          </div>

          {/* Project Timeline */}
          {config.timeline && (
            <div className="space-y-2">
              <Label>Project Timeline</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData({ ...formData, timeline: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediately (Emergency)">Immediately (Emergency)</SelectItem>
                  <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
                  <SelectItem value="1-3 Months">1-3 Months</SelectItem>
                  <SelectItem value="Just Researching / Future Project">Just Researching / Future Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location of Project */}
          {config.location && (
            <div className="space-y-2">
              <Label>Location of your project</Label>
              <div className="flex gap-2">
                {['Nigeria', 'US', 'UK', 'Canada'].map((loc) => (
                  <Button
                    key={loc}
                    type="button"
                    variant={formData.location === loc ? "default" : "outline"}
                    className={`flex-1 ${formData.location === loc ? 'bg-[#FF8D28] hover:bg-orange-600' : ''}`}
                    onClick={() => setFormData({ ...formData, location: loc })}
                  >
                    {loc}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="Enter location of your project"
                className="mt-2"
              />
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreement"
              checked={formData.agreed}
              onCheckedChange={(checked) => setFormData({ ...formData, agreed: checked })}
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


export default ConsultationModal;