/* @flow */
import React from 'react';
import Button from '../../ui/button';
import Input from '../../ui/input';
import { login as loginQuery } from './graphql';
import { graphql, compose } from 'react-apollo';

import './login.styl';

type LoginProps = {
  mutate: Function,
};

type LoginState = {
  username: string,
  password: string,
  isLoading: boolean,
};

export class Login extends React.Component {
  props: LoginProps;
  state: LoginState;

  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      errors: [],
      isLoading: false,
    };
  }

  setError(error: string): void {
    const { errors } = this.state;
    if (errors.includes(error)) return;
    this.setState({ errors: errors.concat(error) });
  }

  resetErrors(): void {
    this.setState({ errors: [] });
  }

  async submit(): Promise<void> {
    const { history, mutate } = this.props;
    const { username, password } = this.state;

    this.resetErrors();
    const errors = [];
    if (!username) errors.push('E_INVALID_USERNAME');
    if (!password) errors.push('E_INVALID_PASSWORD');
    if (errors.length) return this.setState({ errors });

    this.setState({ isLoading: true });

    try {
      await mutate({
        variables: {
          username,
          password,
        },
      });
    } catch (e) {
      this.setState({ errors: e.graphQLErrors.pop().message });
      this.setState({ isLoading: false });
      return;
    }

    history.replace('/');
    this.setState({ isLoading: false });
  }

  render() {
    const { isLoading, errors } = this.state;
    return (
      <form className="briskhome-login">
        <img
          src="/static/assets/img/logo@256w-i.png"
          alt="Briskhome"
          className="briskhome-login__image"
        />
        <Input
          autoComplete="username"
          placeholder="Username"
          valid={!errors.includes('E_INVALID_USERNAME')}
          onChange={({ target: { value } }) => {
            this.resetErrors();
            this.setState({ username: value });
          }}
        />
        <Input
          autoComplete="current-password"
          placeholder="Password"
          valid={!errors.includes('E_INVALID_PASSWORD')}
          type="password"
          onChange={({ target: { value } }) => {
            this.resetErrors();
            this.setState({ password: value });
          }}
        />
        <Button
          caps
          large
          yellow
          type="submit"
          loading={isLoading}
          display="inline-block"
          className="briskhome-login__button_submit"
          onClick={() => this.submit()}
        >
          Log in
        </Button>
        <Button
          className="briskhome-login__button_restore"
          display="inline-block"
        >
          Forgot password?
        </Button>
      </form>
    );
  }
}

export default compose(graphql(loginQuery))(Login);
