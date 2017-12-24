import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { routerReducer } from 'react-router-redux';
import { apolloClient } from './apollo';
import { userReducer } from './reducers';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
});

const middleware = compose(
  applyMiddleware(thunkMiddleware, apolloClient.middleware(), loggerMiddleware),
);

const reducers = combineReducers({
  apollo: apolloClient.reducer(),
  routing: routerReducer,
  user: userReducer,
});

export default function configureStore(initialState) {
  return createStore(reducers, initialState, middleware);
}

export const client = apolloClient;
