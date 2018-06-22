'use strict';

const path = jest.genMockFromModule('path');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

function resolve(...args) {
  if ([...args].pop() === '..') args.pop();
  return args.join('/');
}

path.__setMockFiles = __setMockFiles;
path.resolve = resolve;

module.exports = path;
