import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';

import { WizardStepper } from '../../';

const MockSlide = jest.fn(() => <div data-mock="MockSlide" />);

describe('core.webapp -> components -> wizard -> stepper', () => {
  it('renders', () => {
    expect(
      toJson(render(<WizardStepper currentStep={0} slides={[MockSlide]} />)),
    ).toMatchSnapshot();
  });
});
