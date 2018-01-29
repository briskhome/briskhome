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
    };
  }

  toggleUserModal = (): void => {
    this.setState({ isUserModalOpen: !this.state.isUserModalOpen });
  };

  render() {
    const { data: { users = [] }, mutate } = this.props;
    const { isUserModalOpen } = this.state;
    return (
      <DashboardWidget
        title="Users and guests"
        menu={[{ title: 'Add new user', onItemChosen: this.toggleUserModal }]}
      >
        <table className="user-widget__table">
          <tbody>{users && users.map(user => <UserRow {...user} />)}</tbody>
        </table>
        <UserModal isOpen={isUserModalOpen} onToggle={this.toggleUserModal} />
      </DashboardWidget>
    );
  }
}

export default compose(graphql(UsersQuery), graphql(removeUser))(UserWidget);
