// @flow

export type BriskhomeState = {
  apollo: any,
  user?: User,
};

type User = {|
  id: string,
  firstName: string,
  lastName: string,
  type: UserType,
|};

type UserType = 'guest' | 'regular' | 'superuser';
