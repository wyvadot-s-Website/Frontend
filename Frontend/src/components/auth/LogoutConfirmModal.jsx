import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Log out</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button className="bg-red-600 text-white" onClick={onConfirm}>
            Yes, log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmModal;
