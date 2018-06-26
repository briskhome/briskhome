import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import devices from '../devices';

const data = [
  {
    id: '19a967d4-62cb-45ec-8938-8d590960266c',
    name: 'Lorem Ipsum',
    sensors: [],
  },
];

describe('core.graphql -> queries -> devices', () => {
  let query;
  let schema;
  const mockDb = {
    model: jest.fn(() => ({
      find: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(() => data),
      sensorsByDeviceId: jest.fn(() => data),
    })),
  };
  const mockDataloader = {
    deviceById: {
      loadAll: jest.fn(() => data),
      loadMany: jest.fn(() => data),
    },
  };

  beforeEach(() => {
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          devices,
        },
      }),
    });
  });

  it('query', async () => {
    query = `query {
      devices {
        id
        name
      }
    }`;

    expect(
      await graphql(schema, query, null, {
        dataloader: mockDataloader,
        db: mockDb,
      }),
    ).toMatchSnapshot();
  });

  it('query by id', async () => {
    query = `query ($id: String) {
      devices(id: $id) {
        id
        name
      }
    }`;

    expect(
      await graphql(
        schema,
        query,
        null,
        {
          dataloader: mockDataloader,
          db: mockDb,
        },
        { id: '19a967d4-62cb-45ec-8938-8d590960266c' },
      ),
    ).toMatchSnapshot();
  });

  it('query by location', async () => {
    query = `query ($location: String) {
      devices(location: $location) {
        id
        name
      }
    }`;

    expect(
      await graphql(
        schema,
        query,
        null,
        {
          dataloader: mockDataloader,
          db: mockDb,
        },
        { location: '19a967d4-62cb-45ec-8938-8d590960266c' },
      ),
    ).toMatchSnapshot();
  });

  it('query by location with no results', async () => {
    query = `query ($location: String) {
      devices(location: $location) {
        id
        name
      }
    }`;

    const mockDb = {
      model: jest.fn(() => ({
        find: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn(() => []),
      })),
    };

    expect(
      await graphql(
        schema,
        query,
        null,
        {
          dataloader: mockDataloader,
          db: mockDb,
        },
        { location: '19a967d4-62cb-45ec-8938-8d590960266c' },
      ),
    ).toMatchSnapshot();
  });
});
