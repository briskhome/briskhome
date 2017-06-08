import { configure } from '@storybook/react';

function loadStories() {
  require('../src/core.webapp/src/stories');
}

configure(loadStories, module);
