/** @flow
 * @briskhome
 * └core.graphql <queries/plugins.js>
 */

import { GraphQLList } from 'graphql';
import Plugin from '../types/Plugin';
import { plugins, inspectPlugin } from '../../utilities/plugins';

export default {
  type: new GraphQLList(Plugin),
  resolve: async () => plugins().map(plugin => inspectPlugin(plugin)),
};
