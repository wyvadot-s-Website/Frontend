import React from 'react'
import { QuestionField, TimelineSelector, LocationSelector } from './FormFields'

function FacilitiesManagementForm({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="fm_services"
        label="Is this a one-time service inquiry or are you seeking ongoing maintenance and management?"
        placeholder=""
        value={formData.fm_services}
        onChange={onChange}
        error={errors.fm_services}
        required
      />
      <QuestionField
        id="fm_coverage"
        label="What is the total square footage or size of the facility requiring management?"
        placeholder=""
        value={formData.fm_coverage}
        onChange={onChange}
        error={errors.fm_coverage}
        required
      />
      <QuestionField
        id="fm_maintenance"
        label="Please list the top three critical maintenance needs or facility challenges you are facing."
        placeholder=""
        value={formData.fm_maintenance}
        onChange={onChange}
        error={errors.fm_maintenance}
        required
      />
      <QuestionField
        id="fm_availability"
        label="If seeking decorative/aesthetic services, do you have a specific design style or existing mood board you can share?"
        placeholder=""
        value={formData.fm_availability}
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

export default FacilitiesManagementForm