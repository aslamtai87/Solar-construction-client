import React from "react";
import { ClipLoader } from "react-spinners";
import { Sun } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="min-h-screen z-50 flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 rounded-lg p-1.5">
          <Sun className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-foreground leading-tight">
            SunTrakker
          </h1>
        </div>
      </div>
      <ClipLoader/>
    </div>
  );
};

export default LoadingState;
