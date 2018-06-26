/* @flow */
import * as React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import General from './views/general';
import Plugins from './views/plugins';
import Security from './views/security';
import './preferences.styl';

export const Preferences = ({ match }: any): React.Node => (
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
        <Link to="/preferences/security" className="briskhome__sidenav-link">
          Security
        </Link>
      </nav>

      <nav className="briskhome__sidenav" />
    </div>

    <div className="briskhome__content">
      <Switch>
        <Route path={`${match.url}/security`} component={Security} />
        <Route path={`${match.url}/plugins`} component={Plugins} />
        <Route path={`${match.url}/`} component={General} />
      </Switch>
    </div>
  </div>
);

export default Preferences;
