import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function SuccessView({ isOpen, onClose, onContinue }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <DialogTitle className="text-2xl font-bold mb-2">
            Account Created!
          </DialogTitle>

          <DialogDescription className="mb-6">
            Your account has been successfully created
          </DialogDescription>

          <Button
            onClick={onContinue}
            className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessView
