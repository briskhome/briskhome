import { combineReducers } from 'redux';

export const styleManager = (state: Object = {}) => state;

export const user = (state: Object = {}, action: Object) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const isCreateNewUserDialogOpen = (state: boolean = false, action: Object) => {
  if (action.type === 'TOGGLE_DIALOG') {
    return action.value;
  }

  return state;
};

export const reducers = combineReducers({
  context: combineReducers({
    user,
  }),
  status: combineReducers({
    isCreateNewUserDialogOpen,
  }),
  styleManager,
});
