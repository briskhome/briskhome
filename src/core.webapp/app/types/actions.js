/** @flow */
import type { User } from './';

export type LoginAction = { type: '@@BRISKHOME/LOGIN', value: User };
export type LogoutAction = { type: '@@BRISKHOME/LOGOUT' };
