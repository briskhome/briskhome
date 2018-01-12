/** @flow */
import type {
  Wizard,
  WizardInitAction,
  WizardPrevAction,
  WizardNextAction,
  WizardGotoAction,
} from '../types';

const emptyWizard = {
  currentSlide: 0,
  totalSlides: 0,
  slides: {},
  hasIntro: false,
  hasOutro: false,
};

export const wizardReducer = (
  state: Wizard = emptyWizard,
  action:
    | WizardInitAction
    | WizardPrevAction
    | WizardNextAction
    | WizardGotoAction,
) => {
  switch (action.type) {
    case '@@WIZARD/INIT': {
      const slides = new Array(action.value.state.totalSlides).reduce(
        (slides, slide, idx) => (slides[idx] = {}) && slides,
        {},
      );
      return {
        ...emptyWizard,
        ...action.value.state,
        slides,
      };
    }

    case '@@WIZARD/PREV': {
      if (state.currentSlide - 1 >= 0 - Number(!!state.hasIntro)) {
        const currentSlide = state.currentSlide - 1;
        const slides = action.value
          ? {
              ...state.slides,
              [state.currentSlide]: action.value.state,
            }
          : { ...state.slides };
        return {
          ...state,
          currentSlide,
          slides,
        };
      }
      return state;
    }

    case '@@WIZARD/NEXT': {
      if (
        state.currentSlide + 1 <
        state.totalSlides + Number(!!state.hasOutro)
      ) {
        const currentSlide = state.currentSlide + 1;
        const slides = action.value
          ? {
              ...state.slides,
              [state.currentSlide]: action.value.state,
            }
          : { ...state.slides };
        return {
          ...state,
          currentSlide,
          slides,
        };
      }
      return state;
    }

    case '@@WIZARD/GOTO': {
      if (
        action.value.slide >= 0 - Number(!!state.hasIntro) &&
        action.value.slide < state.totalSlides + Number(!!state.hasOutro)
      ) {
        const currentSlide = action.value.slide;
        const slides = action.value.state
          ? {
              ...state.slides,
              [state.currentSlide]: action.value.state,
            }
          : { ...state.slides };
        return {
          ...state,
          currentSlide,
          slides,
        };
      }
      return state;
    }

    default: {
      return state;
    }
  }
};
