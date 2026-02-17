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

function VerifyEmailView({
  isOpen,
  onClose,
  email,
  verificationCode,
  handleVerificationChange,
  handleVerify,
  backToSignup,
  onResendCode,
  resendCooldown =0,
}) {
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    handleVerificationChange(index, value);

    // Move to next input automatically
    if (value && index < verificationCode.length - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };
  const formatCooldown = (seconds) => {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s > 0 ? `${s}s` : ""}`;
  }
  return `${seconds}s`;
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Verify your email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2 text-center">
            <Label className="text-sm">Enter the code sent to</Label>
            <p className="text-sm font-medium">
              {email || "wyvaman@gmail.com"}
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-semibold border-gray-300"
              />
            ))}
          </div>

          <div className="text-center">
  <button
  onClick={onResendCode}
  disabled={resendCooldown > 0}
  className={`text-sm hover:underline ${
    resendCooldown > 0
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-orange-500'
  }`}
>
  {resendCooldown > 0 
    ? `Resend available in ${formatCooldown(resendCooldown)}` 
    : 'Resend code'}
</button>
</div>

          <Button
            onClick={handleVerify}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Verify
          </Button>

          <button
            onClick={backToSignup}
            className="w-full text-sm text-gray-600 hover:underline"
          >
            ← Back to sign up
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyEmailView;
