import path from 'path';
import * as architect from '../node_modules/architect/architect';
import { enabledComponents } from './utilities/plugins';

console.time('c9/architect');
const config = architect.resolveConfig(enabledComponents(), path.resolve(__dirname, '..'));
console.log(config);
architect.createApp(config, (err, app) => {
  console.timeEnd('c9/architect');
});
