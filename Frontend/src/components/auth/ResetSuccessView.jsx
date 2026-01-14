import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ResetSuccessView({
  isOpen,
  onClose,
  logo,
  continueToLogin,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-8">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <div className="bg-orange-500 rounded-full"></div>
              <img src={logo} alt="Logo" className="w-40" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold mb-2">
            Password Updated
          </DialogTitle>

          <DialogDescription className="mb-8">
            Your password has been successfully changed
          </DialogDescription>

          <Button
            onClick={continueToLogin}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Continue to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResetSuccessView;
