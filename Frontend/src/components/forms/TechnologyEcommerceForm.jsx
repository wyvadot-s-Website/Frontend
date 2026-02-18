import React from 'react'
import { QuestionField, PlatformSelector, TimelineSelector, LocationSelector } from './FormFields'

function TechnologyEcommerceForm({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="tech_software"
        label="Are you primarily seeking Software Development or Technology Implementation services?"
        placeholder=""
        value={formData.tech_software}
        onChange={onChange}
        error={errors.tech_software}
        required
      />
      <PlatformSelector
        id="tech_platform"
        label="What platform or operating system do you need support for?"
        value={formData.tech_platform}
        onChange={onChange}
        error={errors.tech_platform}
        required
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
      <TimelineSelector 
        value={formData.timeline} 
        onChange={onChange}
        error={errors.timeline}
      />
      <LocationSelector
        locationValue={formData.location}
        addressValue={formData.locationAddress}
        onChange={onChange}
        error={errors.location || errors.locationAddress}
      />
    </div>
  )
}

export default TechnologyEcommerceForm