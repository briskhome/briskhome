/** @flow
 * @briskhome
 * └core.webapp <lib/core.webapp/index.js>
 */

import path from 'path';
import uuid from 'uuid-1345';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoStore from 'connect-mongodb-session';
import graphqlHTTP from 'express-graphql';
import cookieParser from 'cookie-parser';
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
  app.use(cookieParser());
  app.use(
    session({
      genid: () => uuid.v4(),
      name: 'session',
      resave: true,
      secret: options.secret,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: db.connection,
        ttl: 60 * 60 * 24 * 30,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serialize', user);
    done(null, user.name);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserialize', id);
    done(null, { id });
  });

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
