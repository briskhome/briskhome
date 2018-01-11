import * as React from 'react';
import cn from 'classnames';
import type { WizardStepperProps } from '../types';

export const WizardStepper = ({ currentStep, slides }: WizardStepperProps) => {
  return (
    <ul className="briskhome-wizard__stepper">
      {slides.map((_, idx) => (
        <li
          className={cn('briskhome-wizard__step', {
            'briskhome-wizard__step_active': currentStep === idx,
            'briskhome-wizard__step_complete': currentStep > idx,
          })}
        >
          <span className="briskhome-wizard__step-circle">{idx + 1}</span>
        </li>
      ))}
    </ul>
  );
};

export default WizardStepper;
