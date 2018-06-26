import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import Intro from '../intro';

describe('core.webapp -> components -> pages -> welcome -> intro', () => {
  it('renders', () => {
    expect(toJson(mount(<Intro />))).toMatchSnapshot();
  });
  it('next()', () => {
    const mockNext = jest.fn();
    const slide = mount(<Intro next={mockNext} />);
    slide.instance().next();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
