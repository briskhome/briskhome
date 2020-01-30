import React from 'react';
import toJson from 'enzyme-to-json';
import { render } from 'enzyme';
import { WizardStepper } from "../../";
describe('core.webapp -> components -> wizard -> stepper', () => {
  it('renders', () => {
    expect(toJson(render(<WizardStepper currentSlide={0} totalSlides={1} />))).toMatchSnapshot();
  });
});