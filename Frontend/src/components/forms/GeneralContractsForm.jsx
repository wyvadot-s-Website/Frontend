import React from 'react'
import { QuestionField } from './FormFields'

function GeneralContractsForm({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-4">
      <QuestionField
  id="gc_region"
  label="What is your region/market?"
  placeholder="Select region/market"
  required={true}
  value={formData.gc_region}
  onChange={onChange}
  error={errors.gc_region}
/>


      <QuestionField
  id="gc_location"
  label="Where is the location of your project?"
  placeholder="Enter Address"
  value={formData.gc_location}
  onChange={onChange}
  error={errors.gc_location}
  required
/>
    </div>
  )
}

export default GeneralContractsForm