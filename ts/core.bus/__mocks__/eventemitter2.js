module.exports = jest.fn().mockImplementation(function() {
  this.listeners = {};
  setTimeout(() => this.listeners['ready'][0]());

  this.on = jest.fn((e, fn) => {
    if (this.listeners[e]) this.listeners[e].push(fn);
    else this.listeners[e] = [fn];
  });
});
