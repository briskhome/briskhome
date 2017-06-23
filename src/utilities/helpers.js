/** @flow
 * @briskhome
 * └core <utilities/helpers.js>
 */
import path from 'path';

/**
 * Determines either the package name or the directory of the module that issued a call.
 * @param {Number} depth  A level of stack trace that will be used for determining the callee.
 * @returns {String} Either a name of directory or module name from package.json.
 */
export const getCallee = (depth?: number = 3): string => {
  const d = new Error().stack.split('\n')[depth].split('/').slice(1, -1);
  try {
    return require(path.join('/', d.join('/'), 'package.json')).name;                             // eslint-disable-line
  } catch (e) {
    return d.reduce((acc, s, i, a) => (s === 'lib' || s === 'node_modules' ? a[i + 1] : acc), '').split(':').shift();
  }
};
