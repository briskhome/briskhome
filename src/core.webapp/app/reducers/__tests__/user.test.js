import { userReducer } from '../';

const user = {
  username: 'jdoe',
  type: 'guest',
  firstName: 'John',
  lastName: 'DOe',
};

describe('core.webapp -> reducers', () => {
  describe('userReducer', () => {
    it('@@BRISKHOME/LOGIN', () => {
      expect(
        userReducer(undefined, {
          type: '@@BRISKHOME/LOGIN',
          value: user,
        }),
      ).toEqual(user);
    });
    it('@@BRISKHOME/LOGOUT', () => {
      expect(
        userReducer(user, {
          type: '@@BRISKHOME/LOGOUT',
        }),
      ).toEqual(null);
    });
    it('default', () => {
      expect(
        userReducer(null, {
          type: '@@BRISKHOME/RANDOM',
          value: 'any',
        }),
      ).toEqual(null);
    });
  });
});
