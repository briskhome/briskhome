import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({
  component: Component,
  user,
  ...props
}): React.Node => (
  <Route
    {...props}
    render={props =>
      user ? <Component {...props} /> : <Redirect to="/login" />}
  />
);

export default connect(state => state)(ProtectedRoute);
