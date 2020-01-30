import React from 'react';
import toJson from 'enzyme-to-json';
import { mount, shallow } from 'enzyme';
import CreateAccount from "../createAccount";
describe('core.webapp -> components -> pages -> welcome -> createAccount', () => {
  it('renders', () => {
    expect(toJson(mount(<CreateAccount />))).toMatchSnapshot();
  });
  it('next() with errors', () => {
    const mockNext = jest.fn();
    const createAccount = mount(<CreateAccount next={mockNext} />);
    createAccount.instance().next();
    expect(mockNext).toHaveBeenCalledTimes(0);
  });
  it('next() without errors', () => {
    const mockNext = jest.fn();
    const createAccount = shallow(<CreateAccount next={mockNext} />);
    createAccount.instance().setState({
      data: {
        lastName: 'example',
        firstName: 'example'
      }
    });
    createAccount.instance().next();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
  it('focus resets errors', () => {
    const createAccount = shallow(<CreateAccount />);
    createAccount.instance().setState({
      data: {
        lastName: '',
        firstName: ''
      },
      errors: ['example']
    });
    createAccount.find('[name="last-name"]').simulate('focus');
    expect(createAccount.state()).toEqual({
      data: {
        firstName: '',
        lastName: ''
      },
      errors: []
    });
  });
  it('typing in last name changes it in state', () => {
    const createAccount = shallow(<CreateAccount />);
    createAccount.find('[name="last-name"]').simulate('change', {
      target: {
        value: 'example'
      }
    });
    expect(createAccount.state()).toEqual({
      data: {
        firstName: '',
        lastName: 'example'
      },
      errors: []
    });
  });
  it('typing in first name changes it in state', () => {
    const createAccount = shallow(<CreateAccount />);
    createAccount.find('[name="first-name"]').simulate('change', {
      target: {
        value: 'example'
      }
    });
    expect(createAccount.state()).toEqual({
      data: {
        firstName: 'example',
        lastName: ''
      },
      errors: []
    });
  });
});