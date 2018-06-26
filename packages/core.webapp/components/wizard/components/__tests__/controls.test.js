import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';

import { WizardControls } from '../../';

const MockSlide = jest.fn(() => <div data-mock="MockSlide" />);

describe('core.webapp -> components -> wizard -> controls', () => {
  const prev = jest.fn();
  const next = jest.fn();

  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('renders', () => {
    expect(
      toJson(render(<WizardControls prev={prev} next={next} />)),
    ).toMatchSnapshot();
  });
  it('renders without "prev" button', () => {
    expect(toJson(render(<WizardControls next={next} />))).toMatchSnapshot();
  });
  it('renders without "next" button', () => {
    expect(toJson(render(<WizardControls prev={prev} />))).toMatchSnapshot();
  });
  it('does not render', () => {
    expect(toJson(render(<WizardControls />))).toMatchSnapshot();
  });
});
