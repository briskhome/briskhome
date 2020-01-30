import { gql } from 'react-apollo';
export const me = gql`
  query {
    me {
      firstName
      lastName
      username
      type
    }
  }
`;