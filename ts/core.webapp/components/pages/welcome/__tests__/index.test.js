import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';
import Welcome from "../";
jest.mock('react-apollo', () => ({
  compose: () => Component => props => <Component {...props} />,
  gql: jest.fn(),
  graphql: jest.fn()
}));
jest.mock("../../../wizard", () => ({
  Wizard: jest.fn(() => <div data-mock="Wizard" />)
}));
jest.mock("../components/intro", () => mockSlide);
jest.mock("../components/outro", () => mockSlide);
jest.mock("../components/createAccount", () => mockSlide);
jest.mock("../components/createPassword", () => mockSlide);
jest.mock("../components/usageData", () => mockSlide);
const mockSlide = jest.fn(() => <div data-mock="MockSlide" />);
const store = {
  dispatch: jest.fn(),
  getState: jest.fn(),
  subscribe: jest.fn()
};
describe('core.webapp -> components -> pages -> welcome', () => {
  beforeEach(() => {
    store.getState.mockReturnValue({});
  });
  it('renders', () => {
    const component = mount(<Welcome store={store} data={{
      welcome: true
    }} />);
    expect(toJson(render(component))).toMatchSnapshot();
  });
  it('redirects to /login when disabled', () => {
    const history = {
      replace: jest.fn()
    };
    const slide = mount(<Welcome store={store} history={history} data={{
      welcome: false
    }} />);
    expect(history.replace).toHaveBeenCalledWith('/login');
  });
});