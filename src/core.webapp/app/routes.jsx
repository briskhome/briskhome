import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import configureStore, { client } from './redux/store';
import { Preferences } from '../components/pages/preferences';
import { Navigation } from '../components/navigation';
import { Dashboard } from '../components/pages/dashboard';
import { NotFound } from '../components/notfound';
import { Example } from '../components/onboarding/example';

import './app.styl';
import './stuff.styl';

export const Routes = () => (
  <ApolloProvider store={configureStore()} client={client}>
    <Router>
      <div>
        <Navigation />
        <section>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/cameras" component={Example} />
            <Route path="/preferences" component={Preferences} />
            <Route path="*" component={NotFound} />
          </Switch>
        </section>
      </div>
    </Router>
  </ApolloProvider>
);

export default Routes;
