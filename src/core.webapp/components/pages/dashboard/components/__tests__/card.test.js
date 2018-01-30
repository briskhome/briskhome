import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, render } from 'enzyme';

import { DashboardCard } from '../../';

describe('core.webapp -> components -> pages -> dashboard -> card', () => {
  it('renders', () => {
    const component = mount(
      <DashboardCard
        title="example"
        icon="example"
        count={1}
        status="example"
      />,
    );
    expect(toJson(render(component))).toMatchSnapshot();
  });
});
