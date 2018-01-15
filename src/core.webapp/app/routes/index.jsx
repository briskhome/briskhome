import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Dashboard } from '../../components/pages/dashboard';
import { Example } from '../../components/onboarding/example';
import { NotFound } from '../../components/notfound';
import { Preferences } from '../../components/pages/preferences';
import configureStore, { apolloClient } from '../store';
import Login from '../../components/pages/login';
import Welcome from '../../components/pages/welcome';
import ProtectedRoute from '../../components/protectedRoute';

import '../styles/app.styl';
import '../styles/stuff.styl';

export const Routes = () => (
  <ApolloProvider store={configureStore()} client={apolloClient}>
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/welcome" component={Welcome} />
        <ProtectedRoute exact path="/" component={Dashboard} />
        <ProtectedRoute path="/cameras" component={Example} />
        <ProtectedRoute path="/preferences" component={Preferences} />
        <ProtectedRoute component={NotFound} />
      </Switch>
    </Router>
  </ApolloProvider>
);

export default Routes;
