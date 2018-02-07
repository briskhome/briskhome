/* @flow */
import * as React from 'react';
import { graphql, compose } from 'react-apollo';

import { DashboardWidget } from '../../../';
import { UserModal, UserRow } from '../';
import { users as UsersQuery, removeUser } from '../graphql';
import '../styles/users.styl';
import '../styles/modal.styl';

import type { UserWidgetProps, UserWidgetState } from './types';

export class UserWidget extends React.Component<
  UserWidgetProps,
  UserWidgetState,
> {
  constructor() {
    super();
    this.state = {
      isUserModalOpen: false,
      showInactive: false,
    };
  }

  composeMenu = (): Object => {
    const { showInactive } = this.state;
    return [
      {
        title: 'Create a user',
        onItemChosen: this.toggleUserModal,
      },
      {
        title: `${showInactive ? 'Hide' : 'Show'} inactive`,
        onItemChosen: this.toggleShowInactive,
      },
    ];
  };

  toggleShowInactive = (): void => {
    this.setState({ showInactive: !this.state.showInactive });
  };

  toggleUserModal = (): void => {
    this.setState({ isUserModalOpen: !this.state.isUserModalOpen });
  };

  render() {
    const { data: { users = [] }, mutate } = this.props;
    const { isUserModalOpen, showInactive } = this.state;
    return (
      <DashboardWidget title="Users and guests" menu={this.composeMenu()}>
        <table className="user-widget__table">
          <tbody>
            {users
              .filter(user => showInactive || user.isActive)
              .map(user => <UserRow {...user} />)}
          </tbody>
        </table>
        <UserModal isOpen={isUserModalOpen} onToggle={this.toggleUserModal} />
      </DashboardWidget>
    );
  }
}

export default compose(graphql(UsersQuery), graphql(removeUser))(UserWidget);
