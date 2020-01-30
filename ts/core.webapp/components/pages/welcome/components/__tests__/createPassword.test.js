import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, shallow } from 'enzyme';
import CreatePassword from "../createPassword";
describe('core.webapp -> components -> pages -> welcome -> createPassword', () => {
  it('renders', () => {
    expect(toJson(mount(<CreatePassword />))).toMatchSnapshot();
  });
  it('next() with errors', () => {
    const mockNext = jest.fn();
    const createPassword = mount(<CreatePassword next={mockNext} />);
    createPassword.instance().next();
    expect(mockNext).toHaveBeenCalledTimes(0);
  });
  it('next() without errors', () => {
    const mockNext = jest.fn();
    const createPassword = shallow(<CreatePassword next={mockNext} />);
    createPassword.instance().setState({
      data: {
        password: 'example',
        repeat: 'example'
      }
    });
    createPassword.instance().next();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
  it('prev() without errors', () => {
    const mockPrev = jest.fn();
    const createPassword = shallow(<CreatePassword prev={mockPrev} />);
    createPassword.instance().setState({
      data: {
        password: 'example',
        repeat: 'example'
      }
    });
    createPassword.instance().prev();
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });
  it('focus resets errors', () => {
    const createPassword = shallow(<CreatePassword />);
    createPassword.instance().setState({
      data: {
        password: '',
        repeat: ''
      },
      errors: ['example']
    });
    createPassword.find('[name="new-password"]').simulate('focus');
    expect(createPassword.state()).toEqual({
      data: {
        password: '',
        repeat: ''
      },
      errors: []
    });
  });
  it('typing in new password changes it in state', () => {
    const createPassword = shallow(<CreatePassword />);
    createPassword.find('[name="new-password"]').simulate('change', {
      target: {
        value: 'example'
      }
    });
    expect(createPassword.state()).toEqual({
      data: {
        password: 'example',
        repeat: ''
      },
      errors: []
    });
  });
  it('typing in repeat password changes it in state', () => {
    const createPassword = shallow(<CreatePassword />);
    createPassword.find('[name="repeat-password"]').simulate('change', {
      target: {
        value: 'example'
      }
    });
    expect(createPassword.state()).toEqual({
      data: {
        password: '',
        repeat: 'example'
      },
      errors: []
    });
  });
});