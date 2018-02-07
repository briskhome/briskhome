/** @flow */

export type CSR = string;
export type Certificate = string;
export type Attributes = any;

export type Subject = {
  st: string,
  l: string,
  o: string,
  ou: string,
  cn: string,
  e: string,
};
