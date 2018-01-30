import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';

import { Dashboard } from '../../';

jest.mock('../header', () => () => <div data-mock="DashboardHeader" />);
jest.mock('react-grid-layout', () => ({
  Responsive: jest.fn(props => <div {...props} />),
  WidthProvider: jest.fn(props => props),
}));

describe('core.webapp -> components -> pages -> dashboard -> card', () => {
  it('renders', () => {
    const component = mount(<Dashboard />);
    expect(toJson(render(component))).toMatchSnapshot();
  });

  it('onToggleEditing', () => {
    const component = mount(<Dashboard />);
    component.instance().onToggleEditing();
    expect(toJson(render(component))).toMatchSnapshot();
  });

  it('onLayoutChange', () => {
    const component = mount(<Dashboard />);
    component.instance().onLayoutChange('md', {});
    expect(toJson(render(component))).toMatchSnapshot();
  });
});
