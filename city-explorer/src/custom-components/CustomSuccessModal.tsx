import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

type Props = {
  open: boolean;
  handleClose: () => void;
  message: string;
  viewButton: boolean;
  handleClickView?: () => void;
};

const CustomSuccessModal = ({
  open,
  handleClose,
  message,
  handleClickView,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#1E1E1E]">
              Success
            </DialogTitle>
            <DialogDescription className="text-sm text-[#95969D]">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleClickView || handleClose}
            className="w-60"
            size="lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSuccessModal;