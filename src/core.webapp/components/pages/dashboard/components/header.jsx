/* @flow */
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { DashboardCard } from '../';
import Title from '../../../ui/title';

import type { User } from 'core.webapp/app/types';

type DashboardHeaderProps = {
  user: User,
};

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const timeOfDay = () => {
    const hrs = new Date().getHours();
    if (hrs > 6 && hrs <= 12) return 'morning';
    if (hrs > 12 && hrs <= 17) return 'afternoon';
    if (hrs > 17 && hrs <= 21) return 'evening';
    return 'night';
  };
  return (
    <div className="dashboard-header">
      <Title large className="dashboard-header__title">
        Have a good {timeOfDay()}, {user.firstName}
      </Title>
      <div className="dashboard-header__status dashboard-header__status_good">
        <p className="dashboard-header__status-text">
          Everything is doing great.{' '}
          <a href="#" className="dashboard-header__status-link">
            See status.
          </a>
        </p>
      </div>
      <div className="dashboard-header__card-container">
        <div className="dashboard-header__card-container-fade_left" />
        <DashboardCard
          icon="add"
          status="Click here to add a new room to your house."
        />
        <div className="dashboard-header__card-container-fade_right" />
      </div>
    </div>
  );
};

export default compose(connect(state => state, () => ({})))(DashboardHeader);
