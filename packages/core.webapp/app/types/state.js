/** @flow */
export type BriskhomeState = {
  apollo: any,
  user: User,
  wizard: Wizard,
};

export type User = {|
  firstName: string,
  lastName: string,
  username: string,
  type: UserType,
|};

export type Wizard = {
  currentSlide: number,
  totalSlides: number,
  hasIntro: boolean,
  hasOutro: boolean,
  slides: {
    [number]: {
      [string]: any,
    },
  },
};

type UserType = 'guest' | 'regular' | 'superuser';
