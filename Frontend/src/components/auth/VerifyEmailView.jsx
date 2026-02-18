import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

function VerifyEmailView({
  isOpen,
  onClose,
  email,
  verificationCode,
  onVerificationChange, // ✅ renamed from handleVerificationChange
  handleVerify,
  backToSignup,
  onResendCode,
  resendCooldown = 0,
}) {
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
            <p className="text-sm font-medium">{email || "wyvaman@gmail.com"}</p>
          </div>

          {/* ✅ InputOTP now works with string directly */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={onVerificationChange} // ✅ directly sets string
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-12 text-lg font-semibold border-gray-300"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center">
            <button
              onClick={onResendCode}
              disabled={resendCooldown > 0}
              className={`text-sm hover:underline ${
                resendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-orange-500"
              }`}
            >
              {resendCooldown > 0
                ? `Resend available in ${formatCooldown(resendCooldown)}`
                : "Resend code"}
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