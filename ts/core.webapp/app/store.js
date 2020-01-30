import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { fetchState, storeState } from "./utils/localStorage";
import { routerReducer } from 'react-router-redux';
import { userReducer, wizardReducer } from "./reducers";
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import thunkMiddleware from 'redux-thunk';
export const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  })
});
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});
const middleware = compose(applyMiddleware(thunkMiddleware, apolloClient.middleware(), loggerMiddleware));
const reducers = combineReducers({
  apollo: apolloClient.reducer(),
  routing: routerReducer,
  user: userReducer,
  wizard: wizardReducer
});
export default function configureStore() {
  const store = createStore(reducers, fetchState(), middleware);
  store.subscribe(() => storeState(store.getState()));
  return store;
}