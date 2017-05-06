import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { reducers } from './reducers';

const initialState = {
  context: {
    user: {
      username: '',
      lastName: '',
      firstName: '',
    },
  },
  styleManager: {},
};

export const createBriskhomeStore = (params?: Object) => {
  return createStore(
    reducers,
    {
      ...initialState,
      ...params,
    },
    applyMiddleware(
      thunkMiddleware,
    ),
  );
};
