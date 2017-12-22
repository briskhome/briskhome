/** @flow */

import type { User } from '../../types'; // TODO: Merge User type and UserModel
export type LoginAction = { type: '@@BRISKHOME/LOGIN', value: User };
