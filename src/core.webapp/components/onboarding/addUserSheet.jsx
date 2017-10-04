import React from 'react';
import { graphql, compose } from 'react-apollo';
import { createUser, users as usersQuery } from '../widgets/users/graphql';

import Title from '../ui/title';
import Dropdown from '../ui/dropdown';
import Input from '../ui/input';
import Button from '../ui/button';

import './onboarding.styl';

class UsersSheet extends React.Component {
  constructor() {
    super();

    this.state = {
      lastName: '',
      firstName: '',
      password: '12345',
      type: 'guest',
    };
  }

  render() {
    const { mutate } = this.props;
    return (
      <div>
        <Title
          medium
          extraClassName="briskhome-title_thin onboarding-title_medium"
        >
          Create an account
        </Title>
        <form className="briskhome-form">
          <Dropdown
            disabled
            extraClassName="onboarding-dropdown"
            value="Superuser account"
            options={[
              { value: '2', label: 'Superuser account' },
              { value: '1', label: 'Regular account' },
              { value: '0', label: 'Guest account' },
            ]}
            caption="Superuser account with administrative priviliges."
          />
          <Input
            type="text"
            placeholder="First name"
            value={this.state.firstName}
            onChange={e => this.setState({ firstName: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Last name"
            value={this.state.lastName}
            onChange={e => this.setState({ lastName: e.target.value })}
          />
          <Button
            yellow
            onClick={() =>
              mutate({
                variables: {
                  lastName: this.state.lastName,
                  firstName: this.state.firstName,
                  password: this.state.password,
                  type: this.state.type,
                },
                refetchQueries: [{ query: usersQuery }],
              })}
          >
            Create account
          </Button>
        </form>
      </div>
    );
  }
}

export default compose(graphql(createUser))(UsersSheet);
