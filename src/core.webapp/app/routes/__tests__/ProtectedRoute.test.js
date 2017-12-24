import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import ProtectedRoute from '../ProtectedRoute';

describe('core.webapp -> app -> routes -> ProtectedRoute', () => {
  it('renders', () => {
    expect(toJson(mount(<ProtectedRoute />))).toMatchSnapshot();
  });
});
