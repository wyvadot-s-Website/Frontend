import React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "@/components/auth/GoogleButton";

function SignUpView({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSignUp,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  switchToLogin,
  onGoogleAuth, // ✅ add this
  loading, // ✅ add this (you already pass it)
}) {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // tokenResponse does NOT include idToken in this mode (access token flow)
      // We want "credential" (idToken) mode instead.
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Sign up to WyvadotPR
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/** First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Your First name"
            />
          </div>

          {/** Middle Name */}
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle name</Label>
            <Input
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Your Middle name"
            />
          </div>

          {/** Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Your Last name"
            />
          </div>
          {/** Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          {/** Phone Number */}
          <div className="space-y-2">
            <Label>Phone Number</Label>

            <div className="flex gap-2">
              {/* Country Code */}
              <Input
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                placeholder="+234"
                className="w-28"
              />

              {/* Phone Number */}
              <Input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="8123456789"
                className="flex-1"
              />
            </div>
          </div>

          {/** Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Your Country"
            />
          </div>

          {/** Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Your Password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/** Confirm Password */}
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSignUp}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Sign Up
          </Button>

          {/** Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/** Google */}
          <GoogleButton onGoogleAuth={onGoogleAuth} />
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-orange-500 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default SignUpView;
