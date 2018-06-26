/* @flow */
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import ArchitectError from './ArchitectError';

const statAsync = promisify(fs.stat);

//
export const isPathname = (str: string) => {
  return str.length && (str[0] === '.' || str[0] === '/');
};

//
export const toPathname = (str: string) => {
  return isPathname(str) ? str : `./${str}`;
};

//
export const isExtension = (obj: Object) => {
  return (
    obj.extensions &&
    obj.peerDependencies &&
    obj.peerDependencies['@briskhome/core']
  );
};

//
const EXT_TIMEOUT = 'Extension failed to load within 1000ms timeout';
export const timeout = (t: number = 1000) => {
  return new Promise((unused, reject) =>
    setTimeout(() => reject(new ArchitectError(EXT_TIMEOUT, 'EXT_TIMEOUT')), t),
  );
};

//
export const normalize = (name: string): string => {
  let normalizedName: string = name;

  // if (name.indexOf('core.') >= 0) {
  //   return name.substr(name.indexOf('core.') + 5);
  // }

  if (normalizedName.indexOf('/') >= 0) {
    normalizedName = normalizedName.substr(normalizedName.indexOf('/') + 1);
  }

  if (normalizedName.indexOf('briskhome-') >= 0) {
    normalizedName = normalizedName.substr(
      normalizedName.indexOf('briskhome-') + 10,
    );
  }

  return normalizedName;
};

//
export const flatten = (arr: any[]) => {
  return [].concat(...arr);
};

//
export const maybeExtension = async (dir: string): Promise<boolean> => {
  const stats = await statAsync(dir);
  return (
    stats.isDirectory() && (dir.includes('core.') || dir.includes('briskhome-'))
  );
};

export const write = (err: Error) => {
  const writeln = (message, data = {}) =>
    process.stdout.write(
      JSON.stringify({
        name: 'briskhome',
        hostname: os.hostname(),
        pid: process.pid,
        component: 'core',
        level: 30,
        msg: message,
        time: new Date().toISOString(),
        v: 0,
        ...data,
      }) + '\n',
    );

  typeof err === 'string' ? writeln(err) : writeln(err.message, err.data);
};

export const dump = (err: Error): void => {
  write(err.message);
  process.stderr.write(err.stack);
  process.stderr.write('\n');
  process.exit(1);
};
