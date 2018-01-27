/** @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Link /*, NavLink*/ } from 'react-router-dom';
import Menu from '../ui/menu';

import Avatar from '../avatar';
import type { BriskhomeState } from '../../app/types';

import './navigation.styl';

const Navigation = ({ user }: BriskhomeState): React.Node => (
  <header>
    <nav role="navigation">
      <Link to="/">
        <img src="/static/assets/img/logo@256w.png" alt="Briskhome" />
      </Link>
      <ul />
      <div className="profile">
        <Menu
          arrow
          trigger={
            <Avatar
              online
              name={`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
            />
          }
          options={[<Link to="/preferences">Preferences</Link>]}
        />
      </div>
    </nav>
  </header>
);

export default compose(connect((state: BriskhomeState): * => state))(
  Navigation,
);
