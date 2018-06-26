import React from 'react';
import { shallow } from 'enzyme';

import Wrapper from '../';

describe('core.webapp -> components -> wrapper', () => {
  it('renders', () => {
    expect(shallow(<Wrapper>Lorem ispum</Wrapper>)).toMatchSnapshot();
  });
});
