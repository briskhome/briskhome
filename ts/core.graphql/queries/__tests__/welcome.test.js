import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import welcome from "../welcome";
const query = `
  query {
    welcome
  }
`;
describe('core.graphql -> queries -> welcome', () => {
  let schema;
  const mockCount = jest.fn();
  const mockDb = {
    model: jest.fn(() => ({
      count: mockCount
    }))
  };
  beforeEach(() => {
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          welcome
        }
      })
    });
  });
  it('query', async () => {
    mockCount.mockReturnValueOnce(Promise.resolve(0));
    expect((await graphql(schema, query, null, {
      db: mockDb
    }))).toMatchSnapshot();
  });
  it('failed query', async () => {
    mockCount.mockReturnValueOnce(Promise.resolve(1));
    expect((await graphql(schema, query, null, {
      db: mockDb
    }))).toMatchSnapshot();
  });
});