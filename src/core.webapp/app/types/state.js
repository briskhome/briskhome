/** @flow */
export type BriskhomeState = {
  apollo: any,
  user: User,
};

export type User = {|
  firstName: string,
  lastName: string,
  username: string,
  type: UserType,
|};

type UserType = 'guest' | 'regular' | 'superuser';
