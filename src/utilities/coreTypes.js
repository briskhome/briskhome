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
  bus: Object,
  config: () => Object,
  dataloader: Function,
  db: mongoose,
  graphql: Object,
  log: () => Object,
  webapp: Function,
}

export type CoreRegister = (err: ?Error, data?: Object) => void;

export type ModelType<Model> = {
  save: (document?: Object) => Model,
  update: (document?: Object) => Model,
};

export type CoreGraphQL = {
  schema: string,
  queries?: string,
  mutations?: string,
  resolvers?: {
    queries?: { [string]: Function },
    mutations?: { [string]: Function }
  }
};

export type SubscriptionType = {
  username: string,
  eventId: string,
  levels?: Array<string>,
};
