import React from 'react'
import { QuestionField, TimelineSelector, LocationSelector } from './FormFields'

function EnergyProcessForm({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="ep_inquiry"
        label="Are you inquiring about facility operations support, energy services, or process engineering?"
        placeholder=""
        value={formData.ep_inquiry}
        onChange={onChange}
        error={errors.ep_inquiry}
        required
      />
      <QuestionField
        id="ep_facility"
        label="What type of facility or process are you looking to optimize or support?"
        placeholder=""
        value={formData.ep_facility}
        onChange={onChange}
        error={errors.ep_facility}
        required
      />
      <QuestionField
        id="ep_cmms"
        label="If seeking Computerized Maintenance Management System or CMMS, what is the current system you use if any?"
        placeholder=""
        value={formData.ep_cmms}
        onChange={onChange}
      />
      <QuestionField
        id="ep_process"
        label="For Process Engineering, what is the desired capacity increase or efficiency goals you are targeting?"
        placeholder=""
        value={formData.ep_process}
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

export default EnergyProcessForm