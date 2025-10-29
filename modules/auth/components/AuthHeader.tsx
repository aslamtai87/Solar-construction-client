import { Sun } from "lucide-react";
import React from "react";

const AuthHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SunTrakker</h1>
              <p className="text-sm text-gray-500">
                Enterprise Solar Management
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
