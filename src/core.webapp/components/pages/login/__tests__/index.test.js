import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

// jest.mock('../../../ui/button', (props) => (
//   <a data-mock="ui/button" {...props} />
// ));
// jest.mock('../../../ui/input', (props) => (
//   <input data-mock="ui/input" {...props} />
// ));

import { Login } from '../';

describe('core.webapp / components / pages / login', () => {
  it('renders', () => {
    expect(toJson(mount(<Login />))).toMatchSnapshot();
  });
});
