/* @flow */
import React from 'react';
import { graphql } from 'react-apollo';

import Card from '../../card';
import Users from '../../widgets/users';
import './dashboard.styl';

export const Dashboard = ({ children }: any): React.Element<*> => {
  return (
    <div className='dashboard'>
      <h1 className='briskhome__title'>Dashboard</h1>
      <Users />
      {children}
    </div>
  );
};
