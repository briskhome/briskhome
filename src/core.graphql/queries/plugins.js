/** @flow
 * @briskhome
 * └core.graphql <queries/devices.js>
 */

import { GraphQLList } from 'graphql';
import Plugin from '../types/Plugin';
import { plugins, inspectPlugin } from '../../utilities/plugins';

export default () => {
  return {
    type: new GraphQLList(Plugin),
    resolve: async () => {
      return plugins().map(plugin => inspectPlugin(plugin));
    },
  };
};
