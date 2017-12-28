/** @flow */
import type { LoginAction, User } from '../types';

export const userReducer = (state: ?User = null, action: LoginAction) => {
  if (action.type === '@@BRISKHOME/LOGIN') return action.value;
  if (action.type === '@@BRISKHOME/LOGOUT') return null;
  return state;
};
