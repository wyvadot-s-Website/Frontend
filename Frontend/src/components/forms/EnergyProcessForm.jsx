import React from 'react'
import { QuestionField, TimelineSelector, LocationSelector } from './FormFields'

function EnergyProcessForm({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="ep_inquiry"
        label="Are you inquiring about facility operations/expansion or engineering or energy support/management services (e.g., Own Plant/Power Management or Reliability/Utilities)?"
        placeholder=""
        value={formData.ep_inquiry}
        onChange={onChange}
      />

      <QuestionField
        id="ep_facility"
        label="What type of facility or process are you seeking (e.g., Oil & Gas, Power Plant, Industries)?"
        placeholder=""
        value={formData.ep_facility}
        onChange={onChange}
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

      <TimelineSelector value={formData.timeline} onChange={onChange} />

      <LocationSelector
        locationValue={formData.location}
        addressValue={formData.locationAddress}
        onChange={onChange}
      />
    </div>
  )
}

export default EnergyProcessForm