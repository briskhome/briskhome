const mockJob = { attrs: { name: 'mockJob' } };
module.exports = jest.fn().mockImplementation(function() {
  this.listeners = {};
  setTimeout(() => this.listeners['ready'][0]());

  this.define = jest.fn();
  this.every = jest.fn();
  this.start = jest.fn(() => this.listeners['start'][0](mockJob));
  this.on = jest.fn((e, fn) => {
    if (this.listeners[e]) this.listeners[e].push(fn);
    else this.listeners[e] = [fn];
  });
});
module.exports.mockJob = mockJob;
