import React from 'react';
import { Check, Circle } from 'lucide-react';

export interface StepperStep {
  id: number | string;
  title: string;
  description?: string;
  icon?: React.ElementType;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  onStepClick?: (stepIndex: number) => void;
  allowClickBack?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    circle: 'w-6 h-6',
    icon: 12,
    title: 'text-xs',
    desc: 'text-[10px]',
    connector: 'h-0.5',
    verticalConnector: 'w-0.5 h-6'
  },
  md: {
    circle: 'w-8 h-8',
    icon: 14,
    title: 'text-sm',
    desc: 'text-xs',
    connector: 'h-0.5',
    verticalConnector: 'w-0.5 h-8'
  },
  lg: {
    circle: 'w-10 h-10',
    icon: 18,
    title: 'text-base',
    desc: 'text-sm',
    connector: 'h-1',
    verticalConnector: 'w-1 h-10'
  }
};

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  onStepClick,
  allowClickBack = false,
  className = ''
}) => {
  const sizes = sizeClasses[size];
  
  const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };
  
  const handleStepClick = (index: number) => {
    if (!onStepClick) return;
    if (allowClickBack && index < currentStep) {
      onStepClick(index);
    }
  };
  
  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!allowClickBack || status !== 'completed'}
                  className={`
                    ${sizes.circle} rounded-full flex items-center justify-center font-medium transition-all
                    ${status === 'completed' 
                      ? 'bg-teal-600 text-white' 
                      : status === 'current'
                        ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                        : 'bg-slate-200 text-slate-400'}
                    ${allowClickBack && status === 'completed' ? 'cursor-pointer hover:bg-teal-700' : ''}
                  `}
                >
                  {status === 'completed' ? (
                    <Check size={sizes.icon} />
                  ) : Icon ? (
                    <Icon size={sizes.icon} />
                  ) : (
                    <span className={sizes.title}>{index + 1}</span>
                  )}
                </button>
                
                {!isLast && (
                  <div 
                    className={`
                      ${sizes.verticalConnector} my-2 rounded-full
                      ${status === 'completed' ? 'bg-teal-600' : 'bg-slate-200'}
                    `}
                  />
                )}
              </div>
              
              <div className="ml-4 pb-8">
                <p className={`font-medium ${sizes.title} ${
                  status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                }`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className={`${sizes.desc} text-slate-500 mt-0.5`}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className={`flex items-start ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        const Icon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <button
                onClick={() => handleStepClick(index)}
                disabled={!allowClickBack || status !== 'completed'}
                className={`
                  ${sizes.circle} rounded-full flex items-center justify-center font-medium transition-all
                  ${status === 'completed' 
                    ? 'bg-teal-600 text-white' 
                    : status === 'current'
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                      : 'bg-slate-200 text-slate-400'}
                  ${allowClickBack && status === 'completed' ? 'cursor-pointer hover:bg-teal-700' : ''}
                `}
              >
                {status === 'completed' ? (
                  <Check size={sizes.icon} />
                ) : Icon ? (
                  <Icon size={sizes.icon} />
                ) : (
                  <span className={sizes.title}>{index + 1}</span>
                )}
              </button>
              
              <div className="text-center mt-2">
                <p className={`font-medium ${sizes.title} ${
                  status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                }`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className={`${sizes.desc} text-slate-500 mt-0.5 max-w-[120px]`}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {!isLast && (
              <div className="flex-1 flex items-center px-2 mt-4">
                <div 
                  className={`
                    flex-1 ${sizes.connector} rounded-full
                    ${status === 'completed' ? 'bg-teal-600' : 'bg-slate-200'}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
