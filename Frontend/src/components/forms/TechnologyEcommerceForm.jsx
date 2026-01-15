import React from 'react'
import { QuestionField, PlatformSelector, TimelineSelector, LocationSelector } from './FormFields'

function TechnologyEcommerceForm({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="tech_software"
        label="Are you primarily seeking Software Development (e.g., building a new app) or New Technology Implementation (e.g., AI/Automation into existing processes)? (Multiple choice)"
        placeholder="Are you primarily seeking Software Development"
        value={formData.tech_software}
        onChange={onChange}
      />

      <PlatformSelector
        id="tech_platform"
        label="What platform or operating system is the new software/application intended for (e.g., Web, iOS, Android, Desktop)?"
        value={formData.tech_platform}
        onChange={onChange}
      />

      <QuestionField
        id="tech_cmms"
        label="If seeking Computerized Maintenance Management Systems (CMMS), what is the current system you use, if any?"
        placeholder=""
        value={formData.tech_cmms}
        onChange={onChange}
      />

      <QuestionField
        id="tech_ecommerce"
        label="For E-Commerce services, what is your estimated product volume or target sales channel?"
        placeholder=""
        value={formData.tech_ecommerce}
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

export default TechnologyEcommerceForm