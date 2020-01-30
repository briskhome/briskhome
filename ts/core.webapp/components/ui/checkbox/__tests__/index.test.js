import React from 'react';
import toJson from 'enzyme-to-json';
import { render } from 'enzyme';
import { Checkbox } from "../../";
describe('core.webapp -> ui -> checkbox', () => {
  it('renders', () => {
    expect(toJson(render(<Checkbox name="example" checked={false} onChange={() => null} />))).toMatchSnapshot();
  });
  it('renders checked', () => {
    expect(toJson(render(<Checkbox name="example" checked={true} onChange={() => null} />))).toMatchSnapshot();
  });
  it('renders disabled', () => {
    expect(toJson(render(<Checkbox name="example" checked={true} disabled={true} />))).toMatchSnapshot();
  });
  it('renders with display', () => {
    expect(toJson(render(<Checkbox name="example" checked={true} display="block" />))).toMatchSnapshot();
  });
  it('renders with className', () => {
    expect(toJson(render(<Checkbox checked={false} className="example" />))).toMatchSnapshot();
  });
});