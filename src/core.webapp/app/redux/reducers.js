// @flow
import type { User } from '../../types';

type LoginAction = { type: '@@BRISKHOME/LOGIN', value: User };
export const user = (state: User, action: LoginAction) => {
  if (action.type === '@@BRISKHOME/LOGIN') {
    action;
  }
};
