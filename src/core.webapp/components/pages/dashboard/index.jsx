/* @flow */
import React from 'react';
import Users from '../../widgets/users';
import './dashboard.styl';

export const Dashboard = ({ children }: any): React.Element<*> => (
  <div className="dashboard">
    <h1 className="briskhome__title">Dashboard</h1>
    <Users />
    {children}
  </div>
);

export default Dashboard;
