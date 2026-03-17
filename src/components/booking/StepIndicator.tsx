interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full px-2 py-3">
      <div className="flex items-center justify-between w-full max-w-2xl">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const highlight = isCompleted || isActive;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${highlight ? "text-primary" : "text-muted-foreground"}`}>
                  {stepLabels[index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className={`flex-1 h-px mx-1 transition-all duration-300 ${index < currentStep ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
