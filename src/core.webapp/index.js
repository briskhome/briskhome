/** @flow
 * @briskhome
 * └core.webapp <lib/core.webapp/index.js>
 */

import path from 'path';
import express from 'express';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import graphqlHTTP from 'express-graphql';
import type {
  CoreOptions,
  CoreImports,
  CoreRegister,
} from '../utilities/coreTypes';

const MongoStore = mongoStore(session);

export default (
  options: CoreOptions,
  imports: CoreImports,
  register: CoreRegister,
) => {
  const { db, graphql: { root, schema } } = imports;
  imports.log();

  const app = express();

  app.use(
    session({
      secret: options.session_secret,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: db.connection,
        ttl: 30 * 24 * 60 * 60,
      }),
    }),
  );

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      context: {
        ...imports,
        dataloader: imports.dataloader(),
        log: imports.log('core.graphql'),
      },
      rootValue: root,
      graphiql: true,
    }),
  );

  app.use('/static', express.static(path.resolve(__dirname, 'public')));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  app.listen(4000, '0.0.0.0');

  return register(null, { webapp: app });
};
