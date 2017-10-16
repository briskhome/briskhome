/** @flow
 * @briskhome
 * └core.webapp <lib/core.webapp/index.js>
 */

import path from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoStore from 'connect-mongo';
import graphqlHTTP from 'express-graphql';
import cookieParser from 'cookie-parser';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
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
      secret: options.secret,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: db.connection,
        ttl: 30 * 24 * 60 * 60,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          req => (req && req.cookies ? req.cookies['jwt'] : null),
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: options.secret,
      },
      function(jwt_payload, done) {
        console.log('in here');
        console.log(jwt_payload);
        return done(null, jwt_payload);
        // User.findOne({ id: jwt_payload.sub }, function(err, user) {
        //   if (err) {
        //     return done(err, false);
        //   }
        //   if (user) {
        //     return done(null, user);
        //   } else {
        //     return done(null, false);
        //     // or you could create a new account
        //   }
        // });
      },
    ),
  );

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
  app.get('/', passport.authenticate('jwt', { session: true }), (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  app.listen(4000, '0.0.0.0');

  return register(null, { webapp: app });
};
