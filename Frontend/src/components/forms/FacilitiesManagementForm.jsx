import React from 'react'
import { QuestionField, TimelineSelector, LocationSelector } from './FormFields'

function FacilitiesManagementForm({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="fm_services"
        label="Is this a one-time service inquiry (e.g., renovation, installation) or are you seeking a long-term maintenance contract (e.g., Operations/Maintenance, general Building/Facility Management)?"
        placeholder=""
        value={formData.fm_services}
        onChange={onChange}
      />

      <QuestionField
        id="fm_coverage"
        label="What is the total square footage or estimated size of the facilities requiring maintenance?"
        placeholder=""
        value={formData.fm_coverage}
        onChange={onChange}
      />

      <QuestionField
        id="fm_maintenance"
        label="Please list the top three critical maintenance issues or services you require immediately (e.g., HVAC/Elev, plumbing/elec, exterior renovation)"
        placeholder=""
        value={formData.fm_maintenance}
        onChange={onChange}
      />

      <QuestionField
        id="fm_availability"
        label="If seeking decorative/aesthetic services, do you have a specific design style or existing mood board you can share?"
        placeholder=""
        value={formData.fm_availability}
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

export default FacilitiesManagementForm