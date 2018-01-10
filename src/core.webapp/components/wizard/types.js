/** @flow */
import type { ComponentType } from 'react';

/** Wizard */

export type WizardProps = {
  intro?: ComponentType<WizardIntroProps>,
  outro?: ComponentType<WizardOutroProps>,
  slides: ComponentType<WizardSlideProps>[],
  className?: string,
};

export type WizardState = {
  currentStep: number,
  totalSteps: number,
};

/** WizardControls */

export type WizardControlsProps = {
  className?: ?string,
  prev?: () => void,
  prevLabel?: string,
  prevClassName?: ?string,
  next?: () => void,
  nextLabel?: string,
  nextClassName?: ?string,
};

/** WizardSlide */

export type WizardIntroProps = {
  next: () => void,
};

export type WizardOutroProps = {
  prev: () => void,
};

export type WizardSlideProps = {
  next: () => void,
  prev: () => void,
  goto?: number => void,
};

/** WizardStepper */

export type WizardStepperProps = {
  currentStep: number,
  slides: ComponentType<WizardSlideProps>[],
};
