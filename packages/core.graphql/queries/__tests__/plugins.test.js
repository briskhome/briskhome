import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import plugins from '../plugins';

jest.mock('../../../utilities/plugins', () => ({
  plugins: jest.fn(() => ['briskhome-plugin']),
  inspectPlugin: jest.fn(() => ({
    name: 'briskhome-plugin',
    description: 'BRISKHOME plugin',
    version: '0.0.0',
    author: 'John Doe <jdoe@briskhome.com>',
    disabled: false,
    plugin: {
      name: 'briskhome-plugin',
      consumes: [],
      provides: ['plugin'],
    },
  })),
}));

describe('core.graphql -> queries -> plugins', () => {
  let query;
  let schema;

  beforeEach(() => {
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          plugins,
        },
      }),
    });
  });

  it('query', async () => {
    query = `query {
      plugins {
        name
        version
        author
        disabled
        consumes
        provides
      }
    }`;

    expect(await graphql(schema, query, null, {})).toMatchSnapshot();
  });
});
