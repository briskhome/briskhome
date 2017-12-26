/** @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Redirect, Route } from 'react-router-dom';
import type { BriskhomeState } from '../../types';

const ProtectedRoute = ({
  component: Component,
  user,
  ...props
}): React.Node => (
  <Route
    {...props}
    render={props =>
      user ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default compose(connect((state: BriskhomeState): * => state))(
  ProtectedRoute,
);
