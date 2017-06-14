import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Setup } from '../components/setup';
import { Input } from '../components/ui/input/input';
import { Help } from '../components/ui/buttons/help';
import { Button } from '../components/ui/buttons/button';
import { Primary } from '../components/ui/buttons/primary';
import { Card } from '../components/cards/users';

storiesOf('Cards')
  .add('Users', () => <Card />);

storiesOf('Button', module)
  .add('Flat', () => <Button label='Button' />)
  .add('Primary', () => <Primary>Button</Primary>)
  .add('Help', () => <Help />);

storiesOf('Input', module)
  .add('Overview', () => {
    return (
      <div>
        <Input label='Default' />
        <Input label='With a placeholder' placeholder='Please type your name here abracadabra' />
        <Input label='With a success' placeholder='This is a very long placeholder value with overflow' classNames={['briskhome-form_success']} success />
        <Input label='With a warning' classNames={['briskhome-form_warning']} warning />
        <Input label='With an error' classNames={['briskhome-form_error']} error />
      </div>
    );
  });

  storiesOf('Wizard', module)
  .add('Initial page', () => <Setup />)
