/** @flow
 * @briskhome
 * └core <utilities/helpers.js>
 */

export const getCallee = (depth?: number = 3): string =>
  new Error().stack.split('\n')[depth].split('/').reduce((acc, s, i, arr) =>
    (s === 'lib' || s === 'node_modules' ? arr[i + 1] : acc), '').split(':').shift();

export const a = null;
