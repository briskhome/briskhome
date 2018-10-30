import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, shallow } from 'enzyme';

import UsageData from '../usageData';

describe('core.webapp -> components -> pages -> welcome -> usageData', () => {
  it('renders', () => {
    expect(toJson(mount(<UsageData />))).toMatchSnapshot();
  });
  it('next() without errors', () => {
    const mockNext = jest.fn();
    const usageData = mount(<UsageData next={mockNext} />);
    usageData.instance().next();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
  it('prev() without errors', () => {
    const mockPrev = jest.fn();
    const usageData = shallow(<UsageData prev={mockPrev} />);
    usageData.instance().prev();
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });
  it('clicking checkbox changes its value in state', () => {
    const usageData = mount(<UsageData />);
    usageData.instance().setState({ data: { checked: false } });
    usageData.find('.briskhome-checkbox__input').simulate('change');
    expect(usageData.state()).toEqual({
      data: { checked: true },
    });
  });
});
