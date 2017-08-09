/* @flow */
import React from 'react';

import { graphql } from 'react-apollo';
import { usersQuery } from './graphql';

import './dashboard.styl';
import Card from '../card';
import UsersCard from '../card/userCard';

export const Dashboard = ({ children }: any): React.Element<*> => {
  const UsersCardWithData = graphql(usersQuery)(UsersCard);
  return (
    <div className='dashboard'>
      <h1 className='briskhome__title'>Dashboard</h1>
      <Card
        loading
        title='Users & Guests'
        caption='1 user online, 3 home'
      />
      <UsersCardWithData />
      {children}
    </div>
  );
};
