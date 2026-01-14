import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function WelcomeView({ isOpen, onClose, onContinue, logo }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-8">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <div className="bg-orange-500 rounded-full"></div>
              <img src={logo} alt="" className="w-40" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold mb-2">
            Welcome to WyvadotPR
          </DialogTitle>

          <DialogDescription className="mb-8">
            Get started in the best laundry for you
          </DialogDescription>

          <Button
            onClick={onContinue}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Get started now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeView;
