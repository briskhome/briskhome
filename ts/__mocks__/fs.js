'use strict';

const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = file.substring(0, file.lastIndexOf('/'));

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(file.split('/').pop());
  }
}

function readdir(directoryPath, callback) {
  return callback(null, mockFiles[directoryPath] || []);
}

function realpath(...args) {
  const callback = args.pop();
  const directory = `./${args
    .join('/')
    .split('./')
    .join('')}`;
  if (directory in mockFiles) return callback(null, directory);
  return callback(new Error());
}

fs.__setMockFiles = __setMockFiles;
fs.readdir = readdir;
fs.realpath = realpath;
fs.realpath.native = realpath;

module.exports = fs;
