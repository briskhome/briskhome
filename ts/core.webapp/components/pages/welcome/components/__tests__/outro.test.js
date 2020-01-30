import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';
import Outro from "../outro";
jest.mock('react-router', () => ({
  withRouter: jest.fn(a => a)
}));
const store = {
  dispatch: jest.fn(),
  getState: jest.fn(),
  subscribe: jest.fn()
};
describe('core.webapp -> components -> pages -> welcome -> outro', () => {
  beforeEach(() => {
    store.getState.mockReturnValue({});
  });
  it('renders', () => {
    expect(toJson(render(<Outro store={store} />))).toMatchSnapshot();
  });
  it('renders', () => {
    expect(toJson(render(<Outro store={store} loading={true} />))).toMatchSnapshot();
  });
  it('redirects on click', () => {
    const history = {
      push: jest.fn()
    };
    const slide = mount(<Outro store={store} history={history} />);
    slide.find('.briskhome-button').simulate('click');
    expect(history.push).toHaveBeenCalledWith('/');
  });
  it('calls mutation', () => {
    const mutate = jest.fn();
    const wizard = {
      slides: {
        firstName: 'example',
        lastName: 'example',
        password: 'example'
      }
    };
    mount(<Outro store={store} mutate={mutate} wizard={wizard} />);
  });
});