/** @flow
 * @briskhome
 * └core.webapp <lib/core.webapp/index.js>
 */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import type { CoreImports, CoreRegister } from '../utilities/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const { graphql: { root, schema } } = imports;
  imports.log();

  const app = express();
  app.use('/graphql', graphqlHTTP({
    schema,
    context: imports,
    rootValue: root,
    graphiql: true,
  }));

  app.listen(4000);

  return register(null, { webapp: app });
};
