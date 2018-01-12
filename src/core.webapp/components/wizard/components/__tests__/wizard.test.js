import React from 'react';
import toJson from 'enzyme-to-json';
import { render } from 'enzyme';

import { Wizard, WizardStepper } from '../../';

jest.mock('../stepper');
WizardStepper.mockImplementation(() => <div data-mock="WizardStepper" />);
const MockIntro = jest.fn(() => <div data-mock="MockIntro" />);
const MockOutro = jest.fn(() => <div data-mock="MockOutro" />);
const MockSlide = jest.fn(() => <div data-mock="MockSlide" />);
const store = {
  dispatch: jest.fn(),
  getState: jest.fn(),
  subscribe: jest.fn(),
};

const wizard = { currentSlide: 0, totalSlides: 1 };
describe('core.webapp -> components -> wizard', () => {
  beforeEach(() => {
    store.getState.mockReturnValue({ wizard });
  });

  it('renders', () => {
    expect(
      toJson(render(<Wizard store={store} slides={[MockSlide]} />)),
    ).toMatchSnapshot();
  });

  it('renders with intro', () => {
    store.getState.mockReturnValueOnce({
      wizard: { ...wizard, currentSlide: -1 },
    });
    expect(
      toJson(
        render(<Wizard store={store} intro={MockIntro} slides={[MockSlide]} />),
      ),
    ).toMatchSnapshot();
  });

  it('renders with outro', () => {
    store.getState.mockReturnValueOnce({
      wizard: { ...wizard, totalSlides: 0 },
    });
    expect(
      toJson(
        render(<Wizard store={store} outro={MockOutro} slides={[MockSlide]} />),
      ),
    ).toMatchSnapshot();
  });

  it('does not render without slides', () => {
    expect(toJson(render(<Wizard store={store} />))).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });
    it('prev', () => {
      render(<Wizard store={store} slides={[MockSlide]} />);
      MockSlide.mock.calls[0][0].prev();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@@WIZARD/PREV',
        value: { state: {} },
      });
    });
    it('next', () => {
      render(<Wizard store={store} slides={[MockSlide]} />);
      MockSlide.mock.calls[0][0].next();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@@WIZARD/NEXT',
        value: { state: {} },
      });
    });
    it('goto', () => {
      render(<Wizard store={store} slides={[MockSlide]} />);
      MockSlide.mock.calls[0][0].goto(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@@WIZARD/GOTO',
        value: { slide: 1, state: {} },
      });
    });
  });
});
