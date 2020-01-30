import * as React from 'react';
import cn from 'classnames';
import { WizardStepperProps } from "../types";
export const WizardStepper = ({
  currentSlide,
  totalSlides
}: WizardStepperProps) => {
  const renderSlides = () => {
    const slides = [];

    for (let idx = 0; idx < totalSlides; idx++) {
      slides.push(<li className={cn('briskhome-wizard__step', {
        'briskhome-wizard__step_active': currentSlide === idx,
        'briskhome-wizard__step_complete': currentSlide > idx
      })}>
          <span className="briskhome-wizard__step-circle">{idx + 1}</span>
        </li>);
    }

    return slides;
  };

  return <ul className="briskhome-wizard__stepper">{renderSlides()}</ul>;
};
export default WizardStepper;