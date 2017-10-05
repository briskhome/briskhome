import { configure } from '@storybook/react';

function loadStories() {
  require('../src/core.webapp/stories');
}

configure(loadStories, module);
