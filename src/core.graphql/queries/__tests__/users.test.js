import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import users from '../users';

const data = [
  {
    username: 'jdoe',
    name: 'John Doe',
    type: 'regular',
  },
];

describe('core.graphql -> queries -> users', () => {
  let query;
  let schema;
  const mockDb = {
    model: jest.fn(() => ({
      find: jest.fn(() => ({ exec: jest.fn(() => data) })),
      fetchByUsername: jest.fn(() => data),
    })),
  };

  beforeEach(() => {
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          users,
        },
      }),
    });
  });

  it('query', async () => {
    query = `query users {
      users {
        username
        name
        type
      }
    }`;

    expect(
      await graphql(schema, query, null, { db: mockDb }),
    ).toMatchSnapshot();
  });

  it('query by username', async () => {
    query = `query ($username: String) {
      users(username: $username) {
        username
        name
        type
      }
    }`;

    expect(
      await graphql(schema, query, null, { db: mockDb }, { username: 'jdoe' }),
    ).toMatchSnapshot();
  });
});
