/** @flow
 * @briskhome
 * └core <utilities/coreTypes.js>
 */
export type PackageJson = {
  name: string;
  version: string;
  description: string;
  main: string;
  author: string;
  license: string;
  private: boolean;
  dependencies: object;
  devDependencies: object;
  peerDependencies: object;
  optionalDependencies: object;
  plugin: {
    provides?: Array<string>;
    consumes?: Array<string>;
    disabled?: boolean;
  };
};
export type CoreOptions = {
  [key: string]: string;
};
export type CoreImports = {
  app: {
    load: Function;
  };
  bus: object;
  config: () => object;
  dataloader: Function;
  db: object;
  graphql: object;
  log: (a?: string | null) => object;
  webapp: Function;
};
export type CoreRegister = (err: Error | undefined | null, data?: object) => void;
export type CoreGraphQL = {
  schema: string;
  queries?: string;
  mutations?: string;
  resolvers?: {
    queries?: {
      [x: string]: Function;
    };
    mutations?: {
      [x: string]: Function;
    };
  };
};
export type Context = CoreImports & {
  req: Req;
  res: Res;
  login: (a: {
    id: string;
    type: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};
export type Req = {
  headers: {
    [x: string]: string;
  };
  ip: string;
  session: any;
  sessionID: string;
  user: {
    username: string;
    type: string;
  };
};
export type Res = {};
export type SubscriptionType = {
  username: string;
  eventId: string;
  levels?: Array<string>;
};