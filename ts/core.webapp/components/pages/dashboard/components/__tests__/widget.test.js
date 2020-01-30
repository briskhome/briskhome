import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';
import { DashboardWidget } from "../../";
describe('core.webapp -> components -> pages -> dashboard -> widget', () => {
  it('renders', () => {
    const component = mount(<DashboardWidget id="example" title="example" menu={[{
      title: 'Example',
      onItemChosen: () => null
    }]}>
        ...
      </DashboardWidget>);
    expect(toJson(render(component))).toMatchSnapshot();
  });
});