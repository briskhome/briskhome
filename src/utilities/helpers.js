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

/**
 * Strips plugin name from mandatory prefixes and namespaces.
 * @param {String} name  Plugin name.
 */
export const normalizeName = (name: string): string => {
  let normalizedName: string = name;

  // if (name.indexOf('core.') >= 0) {
  //   return name.substr(name.indexOf('core.') + 5);
  // }

  if (normalizedName.indexOf('/') >= 0) {
    normalizedName = normalizedName.substr(normalizedName.indexOf('/') + 1);
  }

  if (normalizedName.indexOf('briskhome-') >= 0) {
    normalizedName = normalizedName.substr(normalizedName.indexOf('briskhome-') + 10);
  }

  return normalizedName;
};
