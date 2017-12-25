import React from 'react';
import { shallow } from 'enzyme';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import ProtectedRoute from '../ProtectedRoute';

jest.mock('react-redux');
jest.mock('react-router-dom');

connect.mockImplementation(({ store }) => Component => (
  <Component {...store} />
));
Redirect.mockImplementation(props => <div data-mockof="Redirect" {...props} />);
Route.mockImplementation(props => <div data-mockof="Route" {...props} />);

describe('core.webapp -> app -> routes -> ProtectedRoute', () => {
  let store;

  it('renders', () => {
    store = { getState: () => ({ user: null }) };
    expect(shallow(<ProtectedRoute store={store} />)).toMatchSnapshot();
  });
});
