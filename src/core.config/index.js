/** @flow
 * @briskhome
 * └core.config <lib/core.config/index.js>
 */

import path from 'path';
import nconf from 'nconf';
import properties from 'properties';
import { resources } from '../resources';
import { getCallee } from '../utilities/helpers';
import type { CoreImports, CoreRegister } from '../types/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const parse = (dir: string) => properties.parse(dir, {
    comments: '#',
    separators: '=',
    sections: true,
    namespaces: true,
    variables: true,
  });

  const stringify = (dir: string) => properties.stringify(dir, {
    comment: '#',
    separator: '=',
    unicode: true,
  });

  nconf.env();
  [].concat(path.resolve('etc', `${nconf.get('NODE_ENV') || 'briskhome'}.conf`), resources('etc'))
    .map(config => nconf.use('briskhome', {
      type: 'file',
      file: config,
      format: {
        parse,
        stringify,
      },
    }),
  );

  register(null, {
    config: () => nconf.get(getCallee().replace('.', ':')),
  });
};
