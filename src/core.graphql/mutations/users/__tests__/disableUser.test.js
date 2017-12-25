import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import disableUser from '../disableUser';

const data = { result: true };

describe('core.graphql -> mutations -> users -> disableUser', () => {
  let schema;
  let context;

  const mutation = `mutation ($username: String!) {
    disableUser(input: {username: $username}) {
      result
    }
  }`;

  const mockUserModel = jest.fn();
  mockUserModel.findOne = jest.fn();
  mockUserModel.save = jest.fn();

  const mockDb = {
    model: jest.fn(() => mockUserModel),
  };

  beforeEach(() => {
    mockUserModel.findOne.mockReturnValue(Promise.resolve(mockUserModel));
    mockUserModel.save.mockReturnValue(Promise.resolve(data));

    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          disableUser,
        },
      }),
      mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
          disableUser,
        },
      }),
    });
    context = {
      db: mockDb,
    };
  });

  it('mutation', async () => {
    expect(
      await graphql(schema, mutation, null, context, {
        username: 'jdoe',
      }),
    ).toMatchSnapshot();
  });
});
