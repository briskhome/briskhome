import {gql} from 'react-apollo';

export const usersQuery = gql`
  query users {
    users {
      id
      name
    }
  }
`;
