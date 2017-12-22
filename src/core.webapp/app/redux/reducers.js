// @flow
import type { User } from '../../types';
import type { LoginAction } from './types';

export const user = (state: User, action: LoginAction) => {
  if (action.type === '@@BRISKHOME/LOGIN') {
    action;
  }
};
