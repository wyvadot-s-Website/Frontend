import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Timeline selector component
export function TimelineSelector({ value, onChange, error }) {
  return (
    <div className="space-y-2">
      <Label>Project Timeline</Label>
      <Select value={value} onValueChange={(val) => onChange('timeline', val)}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Immediately (Emergency)">Immediately (Emergency)</SelectItem>
          <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
          <SelectItem value="1-3 Months">1-3 Months</SelectItem>
          <SelectItem value="Just Researching / Future Project">
            Just Researching / Future Project
          </SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Location selector component
export function LocationSelector({ locationValue, addressValue, onChange, error }) {
  const locations = ['Nigeria', 'US', 'UK', 'Canada']

  return (
    <div className="space-y-2">
      <Label>Location of your project</Label>
      <div className="flex gap-2">
        {locations.map((loc) => (
          <Button
            key={loc}
            type="button"
            variant={locationValue === loc ? 'default' : 'outline'}
            className={`flex-1 ${
              locationValue === loc ? 'bg-[#FF8D28] hover:bg-orange-600' : ''
            } ${error ? 'border-red-500' : ''}`}
            onClick={() => onChange('location', loc)}
          >
            {loc}
          </Button>
        ))}
      </div>
      <Input
        placeholder="Enter location of your project"
        value={addressValue}
        onChange={(e) => onChange('locationAddress', e.target.value)}
        className={`mt-2 ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Generic question field
export function QuestionField({ id, label, placeholder, required, value, onChange, error }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        name={id}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        rows={3}
        className={`resize-none ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Radio button group for Yes/No questions
export function RadioButtonGroup({ id, label, value, onChange, required, error }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={value === 'Yes' ? 'default' : 'outline'}
          className={`flex-1 ${
            value === 'Yes' ? 'bg-[#FF8D28] hover:bg-orange-600' : ''
          } ${error ? 'border-red-500' : ''}`}
          onClick={() => onChange(id, 'Yes')}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant={value === 'No' ? 'default' : 'outline'}
          className={`flex-1 ${
            value === 'No' ? 'bg-gray-400 hover:bg-gray-500' : ''
          } ${error ? 'border-red-500' : ''}`}
          onClick={() => onChange(id, 'No')}
        >
          No
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Platform selector for technology form
export function PlatformSelector({ id, label, value, onChange, required, error }) {
  const platforms = ['Web', 'iOS', 'Android', 'Desktop']
  
  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform}
            type="button"
            variant={value === platform ? 'default' : 'outline'}
            className={`flex-1 ${
              value === platform ? 'bg-[#FF8D28] hover:bg-orange-600' : ''
            } ${error ? 'border-red-500' : ''}`}
            onClick={() => onChange(id, platform)}
          >
            {platform}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}