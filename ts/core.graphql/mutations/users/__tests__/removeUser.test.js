import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import removeUser from "../removeUser";
const data = {
  result: true
};
describe('core.graphql -> mutations -> users -> removeUser', () => {
  let schema;
  let context;
  const mutation = `mutation ($username: String!) {
    removeUser(input: {username: $username}) {
      result
    }
  }`;
  const mockUserModel = jest.fn();
  mockUserModel.remove = jest.fn();
  const mockDb = {
    model: jest.fn(() => mockUserModel)
  };
  beforeEach(() => {
    mockUserModel.remove.mockReturnValue(Promise.resolve(data));
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          removeUser
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
          removeUser
        }
      })
    });
    context = {
      db: mockDb
    };
  });
  it('mutation', async () => {
    expect((await graphql(schema, mutation, null, context, {
      username: 'jdoe'
    }))).toMatchSnapshot();
  });
});