import React from 'react';
import { Dashboard } from '../components/dashboard';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import configureStore, {
  client,
} from './redux/store';

import { Navigation } from '../components/navigation';
import './app.styl';

const store = configureStore();


export const Routes = () => {
  return (
    <ApolloProvider store={ store } client={ client }>
      <Router>
        <div>
          <Navigation />
          <section>
            <Route exact path='/' component={ Dashboard } />
            <Route path='/about' component={ Dashboard } />
            <Route path='/topics' component={ Dashboard } />
          </section>
        </div>
      </Router>
    </ApolloProvider>
  );
};
