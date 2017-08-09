import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Dropdown, {DropdownContent, DropdownTrigger} from 'react-simple-dropdown';

import Avatar from '../avatar';

import './navigation.styl';

export const Navigation = (): React.Element => {
  return (
    <header>
      <nav role='navigation'>
        <Link to='/'>
          <img src='static/assets/img/logo@256w.png' alt='Briskhome' />
        </Link>
        <ul>
          <li><NavLink to='/sections'>Sections</NavLink></li>
          <li><NavLink to='/cameras'>Cameras</NavLink></li>
        </ul>
        <div className='profile'>
          <Dropdown>
            <DropdownTrigger>
              <div className='profile__title'>Dominator B.</div>
              <Avatar name='DB' image='/static/assets/img/avatar.jpg' />
              <div className='profile__arrow'/>
            </DropdownTrigger>
            <DropdownContent>
              <ul>
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a href="/favorites">Favorites</a>
                </li>
                <li>
                  <a href="/logout">Log Out</a>
                </li>
              </ul>
            </DropdownContent>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};
