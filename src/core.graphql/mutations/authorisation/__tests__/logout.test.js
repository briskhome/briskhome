import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import logout from '../logout';

import mockLog from 'core.log/__mocks__/index.mock.js';

const data = {
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  username: 'username',
  password: 'password',
  type: 'regular',
};

describe('core.graphql -> mutations -> authorisation -> logout', () => {
  let schema;
  let context;

  const mutation = `mutation ($id: String) {
    logout(input: {id: $id}) {
      result
    }
  }`;

  const mockSessionModel = {
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockDb = {
    model: jest.fn(() => mockSessionModel),
  };

  beforeEach(() => {
    mockSessionModel.findOne.mockReturnValue(Promise.resolve(data));

    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          logout,
        },
      }),
      mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
          logout,
        },
      }),
    });
    context = {
      db: mockDb,
      log: mockLog(),
      logout: jest.fn(() => Promise.resolve()),
      req: {
        sessionID: 'ID',
        user: {
          username: 'username',
          type: 'regular',
        },
      },
    };
  });

  it('mutation', async () => {
    expect(
      await graphql(schema, mutation, null, context, {}),
    ).toMatchSnapshot();
  });

  it('mutation with valid session', async () => {
    expect(
      await graphql(schema, mutation, null, context, {
        id: 'valid',
      }),
    ).toMatchSnapshot();
  });

  it('mutation with invalid session', async () => {
    mockSessionModel.findOne.mockReturnValueOnce(Promise.resolve(null));
    expect(
      await graphql(schema, mutation, null, context, {
        id: 'invalid',
      }),
    ).toMatchSnapshot();
  });

  it('mutation with error during logout', async () => {
    context.logout = jest.fn(() => Promise.reject());
    expect(
      await graphql(schema, mutation, null, context, {
        id: 'ID',
      }),
    ).toMatchSnapshot();
  });
});
