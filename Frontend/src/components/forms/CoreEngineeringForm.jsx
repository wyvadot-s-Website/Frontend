import React from 'react'
import { QuestionField, TimelineSelector, LocationSelector } from './FormFields'

function CoreEngineeringForm({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <QuestionField
        id="ce_description"
        label="Which core discipline does your project primarily involve (Civil, Mechanical, Electrical, or Instrumentation & Controls)?"
        placeholder=""
        value={formData.ce_description}
        onChange={onChange}
      />

      <QuestionField
        id="ce_design"
        label="Do you already possess finalized designs or are you also seeking our Architecture/Engineering Design services?"
        placeholder=""
        value={formData.ce_design}
        onChange={onChange}
      />

      <QuestionField
        id="ce_cost"
        label="For construction cost, what is the state (e.g., estimating/feasibility, procurement, renovation, active facility)?"
        placeholder=""
        value={formData.ce_cost}
        onChange={onChange}
      />

      <QuestionField
        id="ce_materials"
        label="What are the relevant/preferred materials or material standards (tools/equipment/tech) this engineering project must meet?"
        placeholder=""
        value={formData.ce_materials}
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

export default CoreEngineeringForm