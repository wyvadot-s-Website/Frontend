import React, { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import  BASE_URL  from "../utils/api.js"; // adjust if path differs

function SignUpForm({ onNavigateToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) return;
    if (formData.password !== formData.confirmPassword) return;

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/admin/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // If backend returns token on signup, store it
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }

      onNavigateToLogin();
    } catch (error) {
      toast.error("Admin signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full bg-white/80 backdrop-blur-sm rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6 place-self-start">
        Sign Up
      </h2>

      <div className="space-y-4">
        <div>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            placeholder="Name"
          />
        </div>

        <div>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="Email"
          />
        </div>

        <div>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="pr-10"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pr-10"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-30 h-10 bg-black hover:bg-gray-800 text-white mt-6 flex place-self-end"
        >
          {loading ? "Creating…" : "Continue"}
        </Button>
      </div>

      <p className="absolute bottom-end inset-x-0 text-center text-sm text-gray-600 mt-6">
        Have an account?{" "}
        <button
          onClick={onNavigateToLogin}
          className="text-orange-500 hover:text-orange-600 font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default SignUpForm;
