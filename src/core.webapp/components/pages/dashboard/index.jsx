/* @flow */
import * as React from 'react';
import Users from '../../widgets/users';
import './dashboard.styl';

export const Dashboard = ({ children }: any): React.Node => (
  <div className="dashboard">
    <h1 className="briskhome__title">Dashboard</h1>
    <Users />
    {children}
  </div>
);

export default Dashboard;
