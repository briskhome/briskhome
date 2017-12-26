import { userReducer } from '../';

describe('core.webapp -> reducers', () => {
  describe('userReducer', () => {
    it('@@BRISKHOME/LOGIN', () => {
      const user = {
        username: 'jdoe',
        type: 'guest',
        firstName: 'John',
        lastName: 'DOe',
      };
      expect(
        userReducer(null, {
          type: '@@BRISKHOME/LOGIN',
          value: user,
        }),
      ).toEqual(user);
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
