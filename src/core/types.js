// @flow

export type Extensions = { [string]: Extension[] };
export type Extension = ExtensionString | ExtensionObject;

// Correct types for literals:
export type ExtensionString = string;
export type ExtensionObject = {
  name: string,
  main: string,
  type: string,
  dependencies: string[],
};

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
  extensions?: Extensions,
};
