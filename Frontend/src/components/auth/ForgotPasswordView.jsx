import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// In ForgotPasswordView.jsx, update the signature:
function ForgotPasswordView({
  isOpen, onClose, formData, handleChange, handleContinue, backToLogin,
  isReset = false,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
         <DialogTitle className="text-xl font-bold">
  {isReset ? "Set New Password" : "Forgot Password?"}
</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
        {!isReset ? (
  <div className="space-y-2">
    <p className="text-sm text-gray-500">
      Enter your email address and we'll send you a reset code.
    </p>
    <Label htmlFor="email">Email Address</Label>
    <Input
      id="email" name="email" type="email"
      value={formData.email} onChange={handleChange}
      placeholder="Your Email Address" className="border-gray-300"
    />
  </div>
) : (
  <div className="space-y-3">
    <div className="space-y-2">
      <Label htmlFor="newPassword">New Password</Label>
      <Input
        id="newPassword" name="newPassword" type="password"
        value={formData.newPassword} onChange={handleChange}
        placeholder="New Password" className="border-gray-300"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="confirmNewPassword">Confirm Password</Label>
      <Input
        id="confirmNewPassword" name="confirmNewPassword" type="password"
        value={formData.confirmNewPassword} onChange={handleChange}
        placeholder="Confirm Password" className="border-gray-300"
      />
    </div>
  </div>
)}

          <Button
            onClick={handleContinue}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Continue
          </Button>

          <button
            onClick={backToLogin}
            className="w-full text-sm text-gray-600 hover:underline"
          >
            ← Back to login
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPasswordView;
