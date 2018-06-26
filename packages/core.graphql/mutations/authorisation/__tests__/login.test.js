import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import bcrypt from 'bcrypt';
import login from '../login';

import mockLog from 'core.log/__mocks__/index.mock.js';
jest.mock('bcrypt', () => ({ compare: jest.fn() }));

const data = {
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  username: 'username',
  password: 'password',
  type: 'regular',
};

describe('core.graphql -> mutations -> authorisation -> login', () => {
  let schema;
  let context;

  const mutation = `mutation ($username: String!, $password:String!) {
    login(input: {username: $username, password: $password}) {
      username
      lastName
      firstName
      type
    }
  }`;

  const mockUserModel = {
    fetchByUsername: jest.fn(),
  };

  const mockDb = {
    model: jest.fn(() => mockUserModel),
  };

  beforeEach(() => {
    bcrypt.compare.mockImplementation((x, y) => x === y);
    mockUserModel.fetchByUsername.mockReturnValue(Promise.resolve(data));

    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          login,
        },
      }),
      mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
          login,
        },
      }),
    });
    context = {
      db: mockDb,
      log: mockLog(),
      login: jest.fn(() => Promise.resolve()),
      req: {
        headers: { 'user-agent': '' },
        session: { useragent: '' },
      },
    };
  });

  it('mutation', async () => {
    expect(
      await graphql(schema, mutation, null, context, {
        username: 'username',
        password: 'password',
      }),
    ).toMatchSnapshot();
  });

  it('mutation with invalid username', async () => {
    mockUserModel.fetchByUsername.mockReturnValueOnce(Promise.resolve(null));
    expect(
      await graphql(schema, mutation, null, context, {
        username: 'username',
        password: 'password',
      }),
    ).toMatchSnapshot();
  });

  it('mutation with invalid password', async () => {
    bcrypt.compare.mockImplementation(() => false);
    expect(
      await graphql(schema, mutation, null, context, {
        username: 'username',
        password: 'password',
      }),
    ).toMatchSnapshot();
  });

  it('mutation with error during login', async () => {
    context.login = jest.fn(() => Promise.reject());
    expect(
      await graphql(schema, mutation, null, context, {
        username: 'username',
        password: 'password',
      }),
    ).toMatchSnapshot();
  });
});
