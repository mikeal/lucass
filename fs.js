const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const createHasher = require('multihasher')

const isDirectory = dir => fs.statSync(dir).isDirectory()
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

class FSAddressableStorage {
  constructor (dir, hasher = createHasher('sha256')) {
    /* This statement is tested but because it gets wrapped in a try/catch
       the coverage report doesn't notice. */
    /* istanbul ignore if */
    if (!isDirectory(dir)) throw new Error('Not a directory.')
    this.dir = dir
    this._hasher = hasher
  }
  async set (value, ...args) {
    if (!Buffer.isBuffer(value)) throw new Error('Invalid type.')
    let hash = await this.hash(value, ...args)
    await writeFile(path.join(this.dir, hash), value)
    return hash
  }
  async hash (value, ...args) {
    if (!Buffer.isBuffer(value)) throw new Error('Invalid type.')
    return this._hasher(value, ...args)
  }

  async get (hash) {
    return readFile(path.join(this.dir, hash))
  }
}

module.exports = (...args) => new FSAddressableStorage(...args)
