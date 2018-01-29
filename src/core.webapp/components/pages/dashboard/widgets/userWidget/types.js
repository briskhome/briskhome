/* @flow */

export type UserWidgetProps = {
  data: { error: boolean, loading: boolean, users: any },
  mutate: Function,
};

export type UserWidgetState = {
  addUserModalOpen: boolean,
};
