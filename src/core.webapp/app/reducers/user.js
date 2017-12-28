// @flow
import type { User } from '../../types';
import type { LoginAction } from '../types';

export const userReducer = (state: ?User = null, action: LoginAction) => {
  if (action.type === '@@BRISKHOME/LOGIN') return action.value;
  if (action.type === '@@BRISKHOME/LOGOUT') return null;
  return state;
};
