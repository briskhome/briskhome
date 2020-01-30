import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import Input from "../";
describe('core.webapp -> ui -> Input', () => {
  it('renders with provided autoComplete', () => {
    expect(toJson(mount(<Input autoComplete="username" />))).toMatchSnapshot();
  });
  it('renders with provided placeholder', () => {
    expect(toJson(mount(<Input placeholder="Username" />))).toMatchSnapshot();
  });
  it('renders with provided className', () => {
    expect(toJson(mount(<Input className="lorem-ipsum" />))).toMatchSnapshot();
  });
  it('renders with provided caption', () => {
    expect(toJson(mount(<Input caption="Lorem ipsum" />))).toMatchSnapshot();
  });
  it('renders with provided label', () => {
    expect(toJson(mount(<Input label="Lorem ipsum" />))).toMatchSnapshot();
  });
  it('renders with provided type', () => {
    expect(toJson(mount(<Input type="lorem" />))).toMatchSnapshot();
  });
  it('renders with provided name', () => {
    expect(toJson(mount(<Input name="lorem" />))).toMatchSnapshot();
  });
  it('renders with provided value', () => {
    expect(toJson(mount(<Input value="lorem" />))).toMatchSnapshot();
  });
  it('renders with provided onBlur event handler', () => {
    expect(toJson(mount(<Input onBlur={() => null} />))).toMatchSnapshot();
  });
  it('renders with provided onFocus event handler', () => {
    expect(toJson(mount(<Input onFocus={() => null} />))).toMatchSnapshot();
  });
  it('renders with provided onChange event handler', () => {
    expect(toJson(mount(<Input onChange={() => null} />))).toMatchSnapshot();
  });
  it('renders in disabled state ', () => {
    expect(toJson(mount(<Input disabled />))).toMatchSnapshot();
  });
  it('renders in valid state ', () => {
    expect(toJson(mount(<Input valid />))).toMatchSnapshot();
  });
  it('renders', () => {
    expect(toJson(mount(<Input />))).toMatchSnapshot();
  });
});