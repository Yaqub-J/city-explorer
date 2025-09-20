import type { FieldError } from "react-hook-form";

interface CustomSelectProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  options: Array<{ name: string | number; value: string | number }>;
  errorMessage?: FieldError | undefined;
  className?: string;
  disabled?: boolean;
  defaultValue?: string | number;
}

const CustomSelect = ({
  label,
  register,
  options,
  errorMessage,
  className,
  disabled,
  defaultValue,
}: CustomSelectProps) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={label} className="text-sm my-2 text-primary">
        {label}
      </label>

      <select
        {...register}
        id={label}
        className={`border border-primary/10 rounded w-full py-2 px-3 text-sm h-10 text-primary`}
        disabled={disabled}
        defaultValue={defaultValue}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      {errorMessage?.message && (
        <p className="text-red-500 text-sm my-1">{errorMessage.message}</p>
      )}
    </div>
  );
};

export default CustomSelect;
