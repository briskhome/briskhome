/** @flow */
import { gql } from 'react-apollo';
export const login = gql`
  mutation login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      firstName
      lastName
      username
      type
    }
  }
`;