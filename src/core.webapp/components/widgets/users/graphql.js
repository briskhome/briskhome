import { gql } from 'react-apollo';

export const users = gql`
  query users {
    users {
      id
      name
      type
    }
  }
`;

// export const createUser = gql`
//   mutation createUser(lastName: String!, firstName: String!, type: UserTypeEnum!) {
//     lastName: $lastName, firstName: $firstName, type: $type {
//       id, name
//     }
//   }
// `;
