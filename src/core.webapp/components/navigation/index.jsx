import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Menu from '../ui/menu';

import Avatar from '../avatar';

import './navigation.styl';

export const Navigation = (): React.Element => (
  <header>
    <nav role="navigation">
      <Link to="/">
        <img src="/static/assets/img/logo@256w.png" alt="Briskhome" />
      </Link>
      <ul>
        <li>
          <NavLink to="/cameras">Cameras</NavLink>
        </li>
      </ul>
      <div className="profile">
        <Menu
          arrow
          trigger={<Avatar online name="EZ" />}
          options={[<Link to="/preferences">Preferences</Link>]}
        />
      </div>
    </nav>
  </header>
);

export default Navigation;
