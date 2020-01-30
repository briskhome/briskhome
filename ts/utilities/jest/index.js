/* eslint-disable */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
Enzyme.configure({
  adapter: new Adapter()
});
expect.extend({
  toMatchImageSnapshot
});
expect.addSnapshotSerializer(createSerializer({
  mode: 'deep'
}));
process.on('unhandledRejection', () => null);
/* eslint-enable */