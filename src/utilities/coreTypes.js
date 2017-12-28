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

export type CoreOptions = {
  [key: string]: string,
};

export type CoreImports = {
  bus: Object,
  config: () => Object,
  dataloader: Function,
  db: Object,
  graphql: Object,
  log: (?string) => Object,
  webapp: Function,
};

export type CoreRegister = (err: ?Error, data?: Object) => void;

export type CoreGraphQL = {
  schema: string,
  queries?: string,
  mutations?: string,
  resolvers?: {
    queries?: { [string]: Function },
    mutations?: { [string]: Function },
  },
};

export type Context = CoreImports & {
  req: Req,
  res: Res,
  login: ({ id: string, type: string }) => Promise<void>,
  logout: () => Promise<void>,
};

export type Req = {
  headers: { [string]: string },
  session: any,
  user: { username: string },
};
export type Res = {};

export type SubscriptionType = {
  username: string,
  eventId: string,
  levels?: Array<string>,
};
