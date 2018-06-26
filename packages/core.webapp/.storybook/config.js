import { configure } from '@storybook/react';

function loadStories() {
  require('../__stories__');
}

configure(loadStories, module);
