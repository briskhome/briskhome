import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import { Login } from "../";
describe('core.webapp / components / pages / login', () => {
  it('renders', () => {
    expect(toJson(mount(<Login />))).toMatchSnapshot();
  });
});