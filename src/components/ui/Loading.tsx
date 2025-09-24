import React from "react";
import { Progress } from "@/components/ui/progress";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="text-gray-500">Please wait while we set things up</p>
        <Progress value={50} className="w-64" />
      </div>
    </div>
  );
};

export default Loading;