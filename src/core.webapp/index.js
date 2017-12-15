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
  const log = imports.log();

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
        uri: db.uri,
        expires: 30 * 24 * 60 * 60,
        collection: 'sessions',
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) =>
    done(null, { id: user._id, type: user.type }),
  );

  passport.deserializeUser(
    async ({ id, type }: { id: string, type: string }, done) => {
      const UserModel = db.model('core:user');
      const user = await UserModel.fetchByUsername(id, { lean: true });

      if (!user) {
        log.warn({ user: { id, type } }, 'User account not found in database');
        return null;
      }

      if (user.isDisabled) {
        log.warn({ user: { id, type } }, 'User account is disabled');
        return null;
      }

      return done(null, user);
    },
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
