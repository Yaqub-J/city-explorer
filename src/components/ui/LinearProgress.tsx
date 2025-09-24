import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LinearProgressProps {
  className?: string;
  value?: number;
  animated?: boolean;
}

const LinearProgress: React.FC<LinearProgressProps> = ({
  className = "",
  value = 45,
  animated = true
}) => {
  return (
    <Progress
      value={value}
      className={cn(
        "w-full h-1",
        animated && "animate-pulse",
        className
      )}
    />
  );
};

export default LinearProgress;