/** @flow */
import type { ComponentType } from 'react';
import type { Wizard } from 'core.webapp/app/types';

/** Wizard */

export type WizardProps = WizardOwnProps & {
  init: (state: Wizard) => void,
  prev: WizardNavigate,
  next: WizardNavigate,
  goto: (slide: number & WizardNavigate) => void,

  wizard: {
    currentSlide: number,
    totalSlides: number,
  },
};

type WizardOwnProps = {
  className?: string,
  intro?: ComponentType<WizardIntroProps>,
  outro?: ComponentType<WizardOutroProps>,
  slides: ComponentType<WizardSlideProps>[],
};

export type WizardState = {};
export type WizardNavigate = (state?: WizardSlideState) => void;

/** WizardControls */

export type WizardControlsProps = {
  className?: ?string,
  prev?: WizardNavigate,
  prevLabel?: string,
  prevClassName?: ?string,
  next?: WizardNavigate,
  nextLabel?: string,
  nextClassName?: ?string,
};

/** WizardSlide */

export type WizardIntroProps = {
  next?: WizardNavigate,
};

export type WizardOutroProps = {
  prev?: WizardNavigate,
};

export type WizardSlideProps = {
  next: WizardNavigate,
  prev: WizardNavigate,
  goto: (slide: number & WizardNavigate) => void,
};

export type WizardSlideState = {
  [string]: mixed,
};

/** WizardStepper */

export type WizardStepperProps = {
  currentSlide: number,
  totalSlides: number,
};
