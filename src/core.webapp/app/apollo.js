import ApolloClient, { createNetworkInterface } from 'apollo-client';
// createNetworkInterface,

// when need token based authentication:
// networkInterface.use([{
//   applyMiddleware(req, next) {
//     if (!req.options.headers) {
//       req.options.headers = {};  // Create the header object if needed.
//     }
//     // get the authentication token from local storage if it exists
//     req.options.headers.authorization = `Bearer ${localStorage.getItem('token') || null}`;
//     next();
//   },
// }]);

// export const apolloClient = new ApolloClient({
//   networkInterface: createNetworkInterface({
//     uri: 'http://localhost:4000/graphql',
//   }),
//   // queryTransformer: addTypename,
// });

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
});

export const apolloClient = new ApolloClient({ networkInterface });
export default apolloClient;
