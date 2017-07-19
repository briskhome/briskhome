/** @flow
 * @briskhome
 * └core.config <lib/core.config/index.js>
 */

import path from 'path';
import nconf from 'nconf';
import properties from 'properties';
import { getCallee } from '../utilities/helpers';
import { resources } from '../utilities/resources';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const parse = (dir: string): Function => properties.parse(dir, {
    comments: '#',
    separators: '=',
    sections: true,
    namespaces: true,
    variables: true,
  });

  const stringify = (dir: string): Function => properties.stringify(dir, {
    comment: '#',
    separator: '=',
    unicode: true,
  });

  nconf.env();
  [].concat(path.resolve('etc', `${nconf.get('NODE_ENV') || 'briskhome'}.conf`), resources('etc'))
    .map(config => nconf.use(config, {
      type: 'file',
      file: config,
      format: {
        parse,
        stringify,
      },
    }),
  );

  register(null, {
    config: (name?: string) =>
      (name
        ? nconf.get(name.replace('.', ':'))
        : nconf.get(getCallee().replace('.', ':'))
      ),
  });
};
