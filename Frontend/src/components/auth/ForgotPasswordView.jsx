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

function ForgotPasswordView({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleContinue,
  backToLogin,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Reset Password ?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmNewPassword"
              className="text-sm font-medium"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="border-gray-300"
            />
          </div>

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
