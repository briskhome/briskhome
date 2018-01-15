/** @flow */
import * as React from 'react';
import Icon from '../../../ui/icon';
import Input from '../../../ui/input';
import Title from '../../../ui/title';
import { WizardControls } from '../../../wizard';
import type { WizardSlideProps } from '../../../wizard/types';

type CreateAccountSlideState = {
  data: {
    firstName: string,
    lastName: string,
  },
  errors: string[],
};

export class CreateAccountSlide extends React.Component<
  WizardSlideProps,
  CreateAccountSlideState,
> {
  constructor(props: WizardSlideProps) {
    super(props);

    this.state = {
      data: {
        firstName: '',
        lastName: '',
      },
      errors: [],
    };
  }

  resetErrors(): void {
    this.setState({ errors: [] });
  }

  next(): void {
    const errors = [];
    const { data, data: { firstName, lastName } } = this.state;
    if (!firstName || !firstName.length) errors.push('E_INVALID_FIRSTNAME');
    if (!lastName || !lastName.length) errors.push('E_INVALID_LASTNAME');
    if (errors.length) return this.setState({ errors });
    this.props.next(data);
  }

  render(): React.Fragment {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <Icon name="head" className="briskhome-welcome__image" />
        <Title medium>How can we call you?</Title>
        <p className="briskhome-welcome__text">
          Just trying to get to know you better.<br />Cross my silicone heart!
        </p>
        <Input
          name="first-name"
          autoComplete="given-name"
          placeholder="First name"
          valid={!errors.includes('E_INVALID_FIRSTNAME')}
          onFocus={this.resetErrors.bind(this)}
          onChange={({ target: { value } }) =>
            this.setState({ data: { ...data, firstName: value } })
          }
        />
        <Input
          name="last-name"
          autoComplete="family-name"
          placeholder="Last name"
          valid={!errors.includes('E_INVALID_LASTNAME')}
          onFocus={this.resetErrors.bind(this)}
          onChange={({ target: { value } }) =>
            this.setState({ data: { ...data, lastName: value } })
          }
        />
        <WizardControls next={this.next.bind(this)} />
      </React.Fragment>
    );
  }
}

export default CreateAccountSlide;
