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
import { promisify } from 'util';
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
  const {
    db,
    graphql: { root, schema },
  } = imports;
  const log = imports.log();

  const app = express();
  app.use(cookieParser());
  app.use(
    session({
      genid: () => uuid.v4(),
      cookie: {
        expires: 1000 * 30 * 24 * 60 * 60,
      },
      name: 'session',
      resave: false,
      saveUninitialized: false,
      secret: options.secret,
      store: new MongoStore({
        uri: options.database,
        expires: 1000 * 30 * 24 * 60 * 60,
        collection: 'sessions',
      }),
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, { username: user.username, type: user.type });
  });

  passport.deserializeUser(
    async ({ username, type }: { username: string, type: string }, done) => {
      const UserModel = db.model('core:user');
      const user = await UserModel.fetchByUsername(username, { lean: true });

      if (!user) {
        log.warn({ user: { username, type } }, 'User account is not found');
        return done(null);
      }

      if (user.isDisabled) {
        log.warn({ user: { username, type } }, 'User account is disabled');
        return done(null);
      }

      return done(null, user);
    },
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    '/graphql',
    passport.authenticate(['session', 'local'], {}),
    graphqlHTTP((req, res) => ({
      schema,
      context: {
        ...imports,
        dataloader: imports.dataloader(),
        log: imports.log('core.graphql'),
        req,
        res,
        login: promisify(req.login).bind(req),
        logout: promisify(req.logout).bind(req),
      },
      rootValue: root,
      graphiql: true,
    })),
  );

  app.use('/static', express.static(path.resolve(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  app.listen(process.env.PORT || 4000, '0.0.0.0');

  return register(null, { webapp: app });
};
