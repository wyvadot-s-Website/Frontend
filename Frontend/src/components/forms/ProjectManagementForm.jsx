import React from 'react'
import { QuestionField, RadioButtonGroup, TimelineSelector, LocationSelector } from './FormFields'

function ProjectManagementForm({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="pm_service"
        label="What specific project management services are you currently seeking (e.g., Construction Management, Engineering Management, or General Project Oversight)?"
        placeholder="What specific project management service?"
        value={formData.pm_service}
        onChange={onChange}
      />

      <QuestionField
        id="pm_budget"
        label="What is the estimated budget range for this project? (e.g., under $50k, $50k-$500k, over $500k)?"
        placeholder="Your estimated budget?"
        value={formData.pm_budget}
        onChange={onChange}
      />

      <QuestionField
        id="pm_resourcing"
        label="If seeking Human Resource/Resourcing/Consultation, what key technical roles are you looking to start or gain expertise in?"
        placeholder=""
        value={formData.pm_resourcing}
        onChange={onChange}
      />

      <RadioButtonGroup
        id="pm_financing"
        label="Have you already secured financing or necessary permits for the project?"
        value={formData.pm_financing}
        onChange={onChange}
      />

      <TimelineSelector value={formData.timeline} onChange={onChange} />

      <LocationSelector
        locationValue={formData.location}
        addressValue={formData.locationAddress}
        onChange={onChange}
      />
    </div>
  )
}

export default ProjectManagementForm