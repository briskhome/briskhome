const on = jest.fn((e, fn) => {
  if (mockDb.listeners[e]) mockDb.listeners[e].push(fn);
  else mockDb.listeners[e] = [fn];
});

const mockDb = {
  connect: jest.fn(() => {
    setTimeout(() => mockDb.listeners['connected'][0]());
  }),
  connection: { on, once: on },
  listeners: {},
};

module.exports = mockDb;
