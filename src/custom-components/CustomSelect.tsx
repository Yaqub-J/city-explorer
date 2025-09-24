import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  options: { name: string | number; value: string | number }[];
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  placeholder,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(newValue) => onChange(newValue)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full h-[66px] border border-[#CDD0D5] rounded-md px-3 focus:border-primary focus:ring-1 focus:ring-primary">
        <SelectValue placeholder={placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {placeholder && (
          <SelectItem value="" className="text-gray-500">
            {placeholder}
          </SelectItem>
        )}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}