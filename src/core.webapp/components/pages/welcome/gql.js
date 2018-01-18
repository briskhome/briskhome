/** @flow */
import { gql } from 'react-apollo';

export const welcomeQuery = gql`
  query welcome {
    welcome
  }
`;

export const createUser = gql`
  mutation createUser(
    $lastName: String!
    $firstName: String!
    $password: String!
    $type: UserTypeEnum!
  ) {
    createUser(
      input: {
        lastName: $lastName
        firstName: $firstName
        password: $password
        type: $type
      }
    ) {
      firstName
      lastName
      username
    }
  }
`;
