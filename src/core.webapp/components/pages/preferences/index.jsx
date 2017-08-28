/* @flow */
import React from 'react';
import Input from '../../ui/input';
import Title from '../../ui/title';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import General from './views/general';
import Plugins from './views/plugins';
import './preferences.styl';
// import Card from '../card';

export const Preferences = ({ children, match }: any): React.Element<*> => {
  console.log({ match });
  return (
    <div className="briskhome-page preferences">
      {/* <h1 className='briskhome__title'>System Preferences</h1> */}
      <div className="briskhome__sidebar">
        <nav className="briskhome__sidenav">
          <h3 className="briskhome__sidenav-title">Core preferences</h3>
          <Link to="/preferences/general" className="briskhome__sidenav-link">
            General
          </Link>
          <Link to="/preferences/plugins" className="briskhome__sidenav-link">
            Installed Plugins
          </Link>
        </nav>

        <nav className="briskhome__sidenav" />
      </div>

      <div className="briskhome__content">
        <Switch>
          <Route path={`${match.url}/plugins`} component={Plugins} />
          <Route path={`${match.url}/`} component={General} />
        </Switch>
      </div>
    </div>
  );
};
