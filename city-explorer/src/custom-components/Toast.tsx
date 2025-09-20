import { toast } from "sonner";
import { CheckCircle, AlertCircle, X } from "lucide-react";

type ToastProps = {
  open: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

// Helper functions to show toasts using Sonner
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle className="w-4 h-4" />,
    duration: 4000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: <AlertCircle className="w-4 h-4" />,
    duration: 4000,
  });
};

// Legacy component for backward compatibility
const Toast = ({ open, message, type, onClose }: ToastProps) => {
  if (!open) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 px-4 py-2 rounded-md shadow-lg text-white z-50 ${
        type === "success" ? "bg-[#4AC000]" : "bg-[#E72B2B]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex gap-2 items-center">
          {type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message}
        </span>
        <button
          className="ml-4 text-white hover:text-gray-200"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;