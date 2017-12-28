import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import me from '../me';

const data = {
  username: 'jdoe',
  name: 'John Doe',
  type: 'regular',
};

const query = `query {
  me {
    username
    name
    type
  }
}`;

describe('core.graphql -> queries -> me', () => {
  let schema;
  const mockDb = {
    model: jest.fn(() => ({
      fetchByUsername: jest.fn(() => data),
    })),
  };

  beforeEach(() => {
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          me,
        },
      }),
    });
  });

  it('query', async () => {
    expect(
      await graphql(schema, query, null, { db: mockDb, req: { user: data } }),
    ).toMatchSnapshot();
  });

  it('anonymous query', async () => {
    expect(
      await graphql(schema, query, null, { db: mockDb, req: { user: null } }),
    ).toMatchSnapshot();
  });
});
