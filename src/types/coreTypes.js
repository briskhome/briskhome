/** @flow
 * @briskhome
 * └core <utilities/coreTypes.js>
 */

import type mongoose from 'mongoose';

export type PackageJson = {
  name: string,
  version: string,
  description: string,
  main: string,
  author: string,
  license: string,
  private: boolean,
  dependencies: Object,
  devDependencies: Object,
  peerDependencies: Object,
  optionalDependencies: Object,
  plugin: {
    provides?: Array<string>,
    consumes?: Array<string>,
    disabled?: boolean,
  },
};

export type CoreImports = {
  db: mongoose,
  config: () => Object,
  bus: Object,
  log: () => Object,
  loader: (string) => Object,
}

export type CoreRegister = (err: ?Error, data?: Object) => void;

export type ModelType<Model> = {
  save: (document?: Object) => Model,
  update: (document?: Object) => Model,
};

export type SubscriptionType = {
  username: string,
  eventId: string,
  levels?: Array<string>,
};
