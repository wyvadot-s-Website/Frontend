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
import GoogleButton from "@/components/auth/GoogleButton";

function LoginView({
  isOpen,
  onClose,
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  handleLogin,
  goToSignup,
  goToForgot,
  onGoogleAuth, // ✅ add this
loading,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Login to Wyvadotpr
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email Address"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Your Password"
                className="pr-10 border-gray-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={goToForgot}
                className="text-sm text-orange-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Login
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <GoogleButton onGoogleAuth={onGoogleAuth} />
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={goToSignup}
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default LoginView;
