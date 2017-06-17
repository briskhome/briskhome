import { addDecorator, configure } from '@storybook/react';
import centered from '@storybook/addon-centered';

addDecorator(centered);

function loadStories() {
  require('../src/core.webapp/src/stories/index.js');
}

configure(loadStories, module);
