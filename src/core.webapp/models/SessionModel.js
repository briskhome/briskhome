/** @flow */

import type { CoreImports } from '../../utilities/coreTypes';

export class SessionModel /* :: extends Mongoose$Document */ {
  session: Session;
  expires: Date;

  constructor() {}

  get browser(): string {
    const ua = this.session.useragent;
    return `${ua.family} ${ua.major}.${ua.minor}.${ua.patch}`;
  }

  get device(): string {
    const device = this.session.useragent.device;
    return `${device.family} ${device.major}.${device.minor}.${device.patch}`;
  }

  get os(): string {
    const os = this.session.useragent.os;
    return `${os.family} ${os.major}.${os.minor}.${os.patch}`;
  }

  get issued(): Date {
    return this.session.issued;
  }

  static async fetchByUsername(username: string): Promise<Session[]> {
    return this.find({ 'session.passport.user.username': username });
  }
}

export const Session = ({ db }: CoreImports) => {
  const Schema = db.Schema;
  const SessionSchema = new Schema(
    {
      _id: {
        type: String,
      },
      session: {
        type: Object,
      },
      expires: {
        type: Date,
      },
    },
    {
      collection: 'sessions',
    },
  );

  SessionSchema.loadClass(SessionModel);
  return db.model('SessionModel', SessionSchema);
};

// type SessionType = {
//   cookie: SessionCookie,
//   passport: SessionPassport,
//   useragent: SessionUseragent,
//   issued: Date,
//   ip: string,
// };

// type SessionCookie = {
//   originalMaxAge: number,
//   expires: number,
//   secure: boolean,
//   httpOnly: boolean,
//   domain: string,
//   path: string,
//   sameSite: true,
// };

// type SessionPassport = {
//   user: {
//     username: string,
//     type: string,
//   },
// };

// type SessionUseragent = {
//   family: string,
//   major: string,
//   minor: string,
//   patch: string,
//   device: {
//     family: string,
//     major: string,
//     minor: string,
//     patch: string,
//   },
//   os: {
//     family: string,
//     major: string,
//     minor: string,
//     patch: string,
//   },
// };
