import { Check } from 'lucide-react';
import { cn } from './ui/utils';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

interface WorkflowStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function WorkflowStepper({ steps, currentStep, completedSteps }: WorkflowStepperProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-start justify-between max-w-6xl mx-auto relative">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isUpcoming = index > currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 bg-white relative z-10",
                  isCompleted && "bg-[#3E378F] border-[#3E378F] text-white",
                  isCurrent && "border-[#3E378F] text-[#3E378F] ring-4 ring-[#3E378F]/10",
                  isUpcoming && "border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Connector Line to next step */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-[50%] w-full h-[2px] z-0">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      isCompleted ? "bg-[#3E378F]" : "bg-gray-300"
                    )}
                  />
                </div>
              )}
              
              {/* Step Label */}
              <div className="mt-3 text-center max-w-[120px]">
                <p className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isCurrent && "text-[#3E378F]",
                  isCompleted && "text-gray-700",
                  isUpcoming && "text-gray-400"
                )}>
                  {step.label}
                </p>
                {step.description && isCurrent && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}