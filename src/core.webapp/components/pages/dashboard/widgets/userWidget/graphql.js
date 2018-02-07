import { gql } from 'react-apollo';

export const users = gql`
  query users {
    users {
      username
      name
      type
      isActive
    }
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

export const removeUser = gql`
  mutation removeUser($username: String!) {
    removeUser(input: { username: $username }) {
      result
    }
  }
`;
