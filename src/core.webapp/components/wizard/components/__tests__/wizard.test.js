import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';

import { Wizard, WizardStepper } from '../../';

jest.mock('../stepper');
WizardStepper.mockImplementation(() => <div data-mock="WizardStepper" />);
const MockIntro = jest.fn(() => <div data-mock="MockIntro" />);
const MockOutro = jest.fn(() => <div data-mock="MockOutro" />);
const MockSlide = jest.fn(() => <div data-mock="MockSlide" />);

describe('core.webapp -> components -> wizard', () => {
  it('renders', () => {
    expect(toJson(render(<Wizard slides={[MockSlide]} />))).toMatchSnapshot();
  });

  it('does not render without slides', () => {
    expect(toJson(render(<Wizard />))).toMatchSnapshot();
  });

  describe('next()', () => {
    it('increments current slide value when possible', () => {
      const wizard = mount(
        <Wizard intro={MockIntro} outro={MockOutro} slides={[MockSlide]} />,
      );
      expect(wizard.instance().state.currentStep).toBe(-1);
      wizard.instance().next();
      expect(wizard.instance().state.currentStep).toBe(0);
    });
    it('keeps current slide value when unable to increment', () => {
      const wizard = mount(<Wizard slides={[MockSlide]} />);
      expect(wizard.instance().state.currentStep).toBe(0);
      wizard.instance().next();
      expect(wizard.instance().state.currentStep).toBe(0);
    });
  });

  describe('prev()', () => {
    it('decrements current slide value when possible', () => {
      const wizard = mount(
        <Wizard intro={MockIntro} outro={MockOutro} slides={[MockSlide]} />,
      );
      wizard.instance().state.currentStep = 1;
      expect(wizard.instance().state.currentStep).toBe(1);
      wizard.instance().prev();
      expect(wizard.instance().state.currentStep).toBe(0);
    });
    it('keeps current slide value when unable to decrement', () => {
      const wizard = mount(<Wizard slides={[MockSlide]} />);
      expect(wizard.instance().state.currentStep).toBe(0);
      wizard.instance().prev();
      expect(wizard.instance().state.currentStep).toBe(0);
    });
  });

  describe('goto()', () => {
    it('changes current slide value when possible', () => {
      const wizard = mount(
        <Wizard intro={MockIntro} outro={MockOutro} slides={[MockSlide]} />,
      );
      expect(wizard.instance().state.currentStep).toBe(-1);
      wizard.instance().goto(1);
      expect(wizard.instance().state.currentStep).toBe(1);
    });
    it('keeps current slide value when unable to change', () => {
      const wizard = mount(<Wizard slides={[MockSlide]} />);
      expect(wizard.instance().state.currentStep).toBe(0);
      wizard.instance().goto(1);
      expect(wizard.instance().state.currentStep).toBe(0);
    });
  });
});
