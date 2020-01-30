import React from 'react';
import toJson from 'enzyme-to-json';
import { render } from 'enzyme';
import { Icon } from "../../";
describe('core.webapp -> ui -> icon', () => {
  it('renders', () => {
    expect(toJson(render(<Icon name="example" className="example" />))).toMatchSnapshot();
  });
});