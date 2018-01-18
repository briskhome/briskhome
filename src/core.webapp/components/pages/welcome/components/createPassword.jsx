/** @flow */
import * as React from 'react';
import Icon from '../../../ui/icon';
import Input from '../../../ui/input';
import Title from '../../../ui/title';
import { WizardControls } from '../../../wizard';
import type { WizardSlideProps } from '../../../wizard/types';

type PasswordSlideState = {
  data: {
    password: string,
    repeat: string,
  },
  errors: string[],
};

export class CreatePasswordSlide extends React.Component<
  WizardSlideProps,
  PasswordSlideState,
> {
  constructor(props: WizardSlideProps) {
    super(props);

    this.state = {
      data: {
        password: '',
        repeat: '',
      },
      errors: [],
    };
  }

  resetErrors(): void {
    this.setState({ errors: [] });
  }

  prev(): void {
    const { data } = this.state;
    this.props.prev(data);
  }

  next(): void {
    const errors = [];
    const { data: { password, repeat } } = this.state;
    if (!password || !password.length) errors.push('E_INVALID_PASSWORD');
    if (!repeat || !repeat.length || (repeat.length && repeat !== password))
      errors.push('E_INVALID_REPEAT');
    if (errors.length) return this.setState({ errors });
    this.props.next({ password });
  }

  render() {
    const { data, errors } = this.state;
    return (
      <form>
        <Icon name="lock" className="briskhome-welcome__image" />
        <Title medium>Choose a password</Title>
        <p className="briskhome-welcome__text">
          You wouldn't want just anyone taking control of your house, now would
          you?
        </p>
        <Input
          name="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          valid={!errors.includes('E_INVALID_PASSWORD')}
          onFocus={this.resetErrors.bind(this)}
          onChange={({ target: { value } }) =>
            this.setState({ data: { ...data, password: value } })
          }
        />
        <Input
          name="repeat-password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat Password"
          valid={!errors.includes('E_INVALID_REPEAT')}
          onFocus={this.resetErrors.bind(this)}
          onChange={({ target: { value } }) =>
            this.setState({ data: { ...data, repeat: value } })
          }
        />
        <WizardControls
          prev={this.prev.bind(this)}
          next={this.next.bind(this)}
        />
      </form>
    );
  }
}

export default CreatePasswordSlide;
