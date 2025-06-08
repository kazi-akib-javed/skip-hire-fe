import React from 'react';
import './ProgressSteps.css';

// Types
type Step = 'Postcode' | 'Waste Type' | 'Select Skip' | 'Permit Check' | 'Choose Date' | 'Payment';

interface StepItem {
  label: Step;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
}

interface ProgressStepsViewProps {
  steps: StepItem[];
}

// View component - handles only UI rendering
const ProgressStepsView: React.FC<ProgressStepsViewProps> = ({ steps }) => {
  return (
    <div className="progress-steps-container">
      <div className="progress-steps">
        {steps.map(({ label, index, isCompleted, isActive }) => (
          <div
            key={label}
            className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="step-circle">{index + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Container component - handles business logic
interface ProgressStepsProps {
  currentStep: Step;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps: Step[] = ['Postcode', 'Waste Type', 'Select Skip', 'Permit Check', 'Choose Date', 'Payment'];
  const currentStepIndex = steps.indexOf(currentStep);

  const processedSteps: StepItem[] = steps.map((step, index) => ({
    label: step,
    index,
    isCompleted: index <= currentStepIndex,
    isActive: index === currentStepIndex
  }));

  return <ProgressStepsView steps={processedSteps} />;
};

export default ProgressSteps; 