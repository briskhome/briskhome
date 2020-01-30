import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import bcrypt from 'bcrypt';
import createUser from "../createUser";
import mockLog from "../../../../core.log/__mocks__/index.mock.js";
jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));
const data = {
  firstName: 'john',
  lastName: 'doe',
  username: 'jdoe',
  type: 'regular'
};
describe('core.graphql -> mutations -> users -> createUser', () => {
  let schema;
  let context;
  const mutation = `mutation ($firstName: String!, $lastName: String!, $password: String!, $type: UserTypeEnum!) {
    createUser(input: {firstName: $firstName, lastName: $lastName, password: $password, type: $type}) {
      firstName
      lastName
      username
      type
    }
  }`;
  const mockUserModel = jest.fn();
  mockUserModel.find = jest.fn();
  mockUserModel.prototype.save = jest.fn();
  const mockDb = {
    model: jest.fn(() => mockUserModel)
  };
  beforeEach(() => {
    bcrypt.hash.mockImplementation(x => x);
    mockUserModel.find.mockReturnValue(Promise.resolve([]));
    mockUserModel.prototype.save.mockReturnValue(data);
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          createUser
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
          createUser
        }
      })
    });
    context = {
      db: mockDb,
      log: mockLog()
    };
  });
  it('mutation', async () => {
    expect((await graphql(schema, mutation, null, context, {
      firstName: 'john',
      lastName: 'doe',
      password: 'password',
      type: 'regular'
    }))).toMatchSnapshot();
  });
  it('mutation with existing username', async () => {
    mockUserModel.find.mockReturnValue(Promise.resolve([data]));
    expect((await graphql(schema, mutation, null, context, {
      firstName: 'john',
      lastName: 'doe',
      password: 'password',
      type: 'regular'
    }))).toMatchSnapshot();
  });
});