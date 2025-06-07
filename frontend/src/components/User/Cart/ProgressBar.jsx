import React from "react";

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { name: "Address", path: "/checkout" },
    { name: "Schedule", path: "/checkout" },
  ];

  // Calculate progress percentage between steps
  const progressPercentage =
    (currentStep / (steps.length)) * 100;

  return (
    <div className="relative w-full mb-8">
      {/* Background bar */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gray-200"
      ></div>
      {/* Progress bar */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 left-0 h-1 bg-red-500"
        style={{ width: `${progressPercentage}%` }}
      ></div>

      {/* Steps with numbered circles and labels */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Numbered circle with border */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10
                ${
                  index < currentStep
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
            >
              {index + 1}
            </div>
            {/* Label below the circle */}
            <span
              className={`mt-2 text-sm ${
                index < currentStep ? "text-red-500" : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;