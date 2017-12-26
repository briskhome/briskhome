// @flow
import type { User } from '../../types';
import type { LoginAction } from '../types';

export const userReducer = (state: ?User = null, action: LoginAction) => {
  if (action.type === '@@BRISKHOME/LOGIN') return action.value;
  return state;
};
