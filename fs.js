const fs = require('fs')

// cas: content addressable storage
// cass: content addressable storage spec


class FileSystemContentAddressableStorage {
  constructor (dir) {
    if (!fs.isDirectorySync(dir)) throw new Error('Not a directory.')
    this.dir = dir
  }
  set (value, cb) {
    if (Buffer.isBuffer(value)) {
      return this._setBuffer(value, cb)
    }
    // TODO:
    // create random token
    // write to random token on fs
    // get the hash
    // move token file to file named that hash
  }
  _setBuffer (value, cb) {
  }
  _setStream (value, cb) {

  }
}