import React, { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import BASE_URL from "../utils/api.js";

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin (All Access)" },
  { value: "content_admin", label: "Content Admin (Dashboard + Content)" },
  { value: "shop_admin", label: "Shop Admin (Dashboard + Shop)" },
  { value: "project_admin", label: "Project Admin (Dashboard + Projects)" },
  { value: "content_shop_admin", label: "Content + Shop Admin" },
  { value: "content_project_admin", label: "Content + Projects Admin" },
  { value: "shop_project_admin", label: "Shop + Projects Admin" },
];

function SignUpForm({ onSignupSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "content_admin",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !email || !password || !confirmPassword || !role) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("pending_admin_email", email);

      toast.success("Verification code sent. Contact super admin to get the code.");
      onSignupSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Sign Up</h2>

      <div className="space-y-4">
        <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />

        <div>
          <label className="text-sm text-gray-600">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-2 border rounded-md px-3 py-2 text-sm bg-white"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full bg-black text-white">
          {loading ? "Creating admin…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default SignUpForm;

