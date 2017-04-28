/** @flow
 * @briskhome
 * └core <utilities/coreTypes.js>
 */

export type PackageJson = {
  name: string,
  version: string,
  description: string,
  main: string,
  author: string,
  license: string,
  private: boolean,
  plugin: {
    provides?: Array<string>,
    consumes?: Array<string>,
    disabled?: boolean
  }
};