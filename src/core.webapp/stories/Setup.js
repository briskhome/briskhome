import React from 'react';

import { storiesOf } from '@storybook/react';
import { Setup } from '../components/setup';

storiesOf('Setup', module)
  .add('with text', () => <Setup />)
