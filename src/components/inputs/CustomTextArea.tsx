import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CustomTextAreaProps {
  label?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  errorMessage?: FieldError | undefined;
  className?: string;
  value?: string;
  disabled?: boolean;
  rows?: number;
}

const CustomTextArea = ({
  label,
  register,
  placeholder,
  errorMessage,
  className,
  value,
  disabled,
  rows = 3,
}: CustomTextAreaProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={label} className="text-base text-text-primary">
          {label}
        </Label>
      )}
      <div className="w-full">
        <Textarea
          id={label}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          rows={rows}
          {...register}
          className={cn(
            "border-[#E2E8F0] focus:border-primary focus:ring-1 focus:ring-primary resize-none",
            errorMessage && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
      </div>
      {errorMessage?.message && (
        <p className="text-red-500 text-sm">{errorMessage.message}</p>
      )}
    </div>
  );
};

export default CustomTextArea;