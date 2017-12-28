/** @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Redirect, Route } from 'react-router-dom';
import { withWrapper } from '../wrapper';
import { me as meQuery } from './graphql';

type ProtectedRouteProps = {
  data: {
    error: boolean,
    loading: boolean,
    me: User,
  },
  common: BriskhomeState,
  actions: { logoutUser: () => void },
  component: any,
};
const ProtectedRoute = ({
  data: { error, loading, me },
  common: { user },
  actions: { logoutUser },
  component: Component,
  ...props
}: ProtectedRouteProps): React.Node => {
  if (loading) return null; // Some pretty loading animation?
  if (!me || error) {
    if (user) logoutUser();
    return <Redirect to="/login" />;
  }

  return (
    <Route
      {...props}
      render={props =>
        user ? withWrapper(<Component {...props} />) : <Redirect to="/login" />
      }
    />
  );
};

export default compose(
  connect(
    ({ user }: BriskhomeState) => {
      return { common: { user } };
    },
    dispatch => {
      return {
        actions: {
          logoutUser: (user: User) =>
            dispatch(
              ({ type: '@@BRISKHOME/LOGOUT', value: user }: LoginAction),
            ),
        },
      };
    },
  ),
  graphql(meQuery, { options: () => ({ fetchPolicy: 'network-only' }) }),
)(ProtectedRoute);
