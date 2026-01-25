import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function ContactDetailsSection({ formData, onChange }) {
  const handleInputChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Contact Details</h3>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your Full Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter Email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tel">Tel</Label>

        <div className="flex gap-2">
          {/* Country code selector */}
          <select
            name="countryCode"
            value={formData.countryCode || "+234"}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md bg-gray-50 text-sm outline-none"
          >
            <option value="+234">🇳🇬 +234 (Nigeria)</option>
            <option value="+1">🇺🇸 +1 (United States)</option>
            <option value="+1">🇨🇦 +1 (Canada)</option>
            <option value="+44">🇬🇧 +44 (United Kingdom)</option>
          </select>

          {/* Phone number */}
          <Input
            id="tel"
            name="tel"
            type="tel"
            value={formData.tel}
            onChange={handleInputChange}
            placeholder="Enter Phone Number"
            className="flex-1"
          />
        </div>

        {/* Optional: show full phone preview */}
        <p className="text-xs text-gray-500">
          Full: {(formData.countryCode || "+234") + (formData.tel || "")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Enter Company Name"
        />
        <span className="text-xs text-gray-500">optional</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectScope">Project Scope</Label>
        <Textarea
          id="projectScope"
          name="projectScope"
          value={formData.projectScope}
          onChange={handleInputChange}
          placeholder="Describe your project"
          rows={3}
        />
      </div>
    </div>
  );
}

export default ContactDetailsSection;
