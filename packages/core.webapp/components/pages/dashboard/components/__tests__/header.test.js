import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';

import { DashboardHeader } from '../../';

describe('core.webapp -> components -> pages -> dashboard -> header', () => {
  const RealDate = Date;
  const mockGetHours = jest.fn();
  global.Date = jest.fn(() => ({
    getHours: mockGetHours,
  }));
  global.Date.now = RealDate.now;

  const store = {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  };

  beforeEach(() => {
    store.getState.mockReturnValue({ user: { firstName: 'Example' } });
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  it('renders in the morning', () => {
    mockGetHours.mockReturnValue(9);
    const component = mount(<DashboardHeader store={store} />);
    expect(toJson(render(component))).toMatchSnapshot();
  });

  it('renders in the afternoon', () => {
    mockGetHours.mockReturnValue(13);
    const component = mount(<DashboardHeader store={store} />);
    expect(toJson(render(component))).toMatchSnapshot();
  });

  it('renders in the evening', () => {
    mockGetHours.mockReturnValue(21);
    const component = mount(<DashboardHeader store={store} />);
    expect(toJson(render(component))).toMatchSnapshot();
  });

  it('renders in the night', () => {
    mockGetHours.mockReturnValue(3);
    const component = mount(<DashboardHeader store={store} />);
    expect(toJson(render(component))).toMatchSnapshot();
  });
});
