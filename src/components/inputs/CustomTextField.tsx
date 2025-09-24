import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CustomTextFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  errorMessage?: FieldError | undefined;
  className?: string;
  value?: string;
  disabled?: boolean;
  checkPassword?: boolean;
}

const CustomTextField = ({
  label,
  type,
  register,
  placeholder,
  errorMessage,
  className,
  value,
  disabled,
  checkPassword,
}: CustomTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label} className="text-base text-text-primary">
        {label}
      </Label>
      <div className="relative w-full">
        <Input
          id={label}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          {...register}
          className={cn(
            "h-10 border-[#E2E8F0] focus:border-primary focus:ring-1 focus:ring-primary",
            errorMessage && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {checkPassword && (
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-primary hover:bg-transparent"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        )}
      </div>
      {errorMessage?.message && (
        <p className="text-red-500 text-sm">{errorMessage.message}</p>
      )}
    </div>
  );
};

export default CustomTextField;