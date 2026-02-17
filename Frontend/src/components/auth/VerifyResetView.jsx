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

function VerifyResetView({
  isOpen,
  onClose,
  formData,
  verificationCode,
  handleVerificationChange,
  handleVerify,
  backToForgot,
  onResendCode,
  verifyError,
  resendCooldown =0,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Verify your email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm">Enter the code sent to</Label>
            <p className="text-sm font-medium">
              {formData.email || "presente@gmail.com"}
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleVerificationChange(index, e.target.value)
                }
                className="w-12 h-12 text-center text-lg font-semibold border-gray-300"
              />
            ))}
          </div>

          <div className="text-center">
            {verifyError && (
  <p className="text-sm text-red-500 mb-2">{verifyError}</p>
)}
<button
  onClick={onResendCode}
  disabled={resendCooldown > 0}  // ✅ disable during cooldown
  className={`text-sm hover:underline ${
    resendCooldown > 0 
      ? 'text-gray-400 cursor-not-allowed' 
      : 'text-orange-500'
  }`}
>
  {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
</button>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Verify
          </Button>

          <button
            onClick={backToForgot}
            className="w-full text-sm text-gray-600 hover:underline"
          >
            ← Back to login
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyResetView;
