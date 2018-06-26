import SessionSchema, { SessionModel } from '../SessionModel';

const data = {
  cookie: {},
  passport: {
    user: {
      username: 'username',
      type: 'regular',
    },
  },
  useragent: {
    family: 'Browser',
    major: '0',
    minor: '0',
    patch: '0',
    device: {
      family: '0',
      major: '0',
      minor: '0',
      patch: '0',
    },
    os: {
      family: 'Linux',
      major: '0',
      minor: '0',
      patch: '0',
    },
  },
  issued: new Date('0'),
  ip: '1.2.3.4',
};

describe('core.webapp -> models', () => {
  describe('SessionModel', () => {
    beforeEach(() => {
      SessionModel.find = jest.fn(() => Promise.resolve(data));
    });

    it('get browser()', async () => {
      const session = new SessionModel();
      session.session = data;
      expect(session.browser).toEqual('Browser 0.0.0');
    });

    it('get device()', async () => {
      const session = new SessionModel();
      session.session = data;
      expect(session.device).toEqual('0 0.0.0');
    });

    it('get os()', async () => {
      const session = new SessionModel();
      session.session = data;
      expect(session.os).toEqual('Linux 0.0.0');
    });

    it('get issued()', async () => {
      const session = new SessionModel();
      session.session = data;
      expect(session.issued).toEqual(new Date('0'));
    });

    it('static async fetchByUsername()', async () => {
      expect(await SessionModel.fetchByUsername('username')).toEqual(data);
    });
  });

  describe('SessionSchema', () => {
    let mockDb;
    beforeEach(() => {
      mockDb = {
        model: jest.fn(),
        Schema: jest.fn(() => ({
          loadClass: jest.fn(),
        })),
      };
    });

    it('compiles', () => {
      SessionSchema({ db: mockDb });
      expect(mockDb.model).toHaveBeenCalled();
    });
  });
});
