let createHasher = require('multihasher')

class InMemoryContentAddressableStorage {
  constructor (hasher = createHasher('sha256')) {
    this._store = new Map()
    this._hasher = hasher
  }

  async get (hash, cb) {
    let buff = this._store.get(hash)
    if (typeof buff === 'undefined') throw new Error('Not found.')
    return buff
  }

  async hash (value, ...args) {
    if (!Buffer.isBuffer(value)) throw new Error('Invalid type.')
    return this._hasher(value, ...args)
  }

  async set (value, ...args) {
    if (!Buffer.isBuffer(value)) throw new Error('Invalid type.')
    let hash = await this._hasher(value, ...args)
    this._store.set(hash, value)
    return hash
  }

  async missing (hashes) {
    let have = new Set(this._store.keys())
    let diff = new Set(hashes.filter(h => !have.has(h)))
    return Array.from(diff)
  }
}

module.exports = hasher => new InMemoryContentAddressableStorage(hasher)
