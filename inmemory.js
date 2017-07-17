let createHasher = require('hashes-stream')
let bl = require('bl')
let through = require('through2')

const proxy = () => through(function (data, enc, cb) {
  this.push(data)
  cb()
})

class InMemoryContentAddressableStorage {
  constructor (algo = 'sha256', _createHasher = createHasher) {
    this._store = new Map()
    this._algo = algo
    this._createHasher = _createHasher
  }

  getBuffer (hash, cb) {
    let value = this._store.get(hash)
    process.nextTick(() => cb(value ? null : new Error('Not found.'), value ? value.slice() : null))
  }

  getStream (hash) {
    let value = this._store.get(hash)
    let stream = proxy()
    process.nextTick(() => {
      if (!value) return stream.emit('error', new Error('Not found.'))
      stream.write(value.slice())
      stream.end()
    })
    return stream
  }

  hash (value, cb) {
    let hasher = this._createHasher(this._algo, (err, hash) => {
      if (err) return cb(err)
      cb(null, hash)
    })
    if (Buffer.isBuffer(value)) {
      hasher.write(value)
      hasher.end()
      return
    }
    if (value && typeof value === 'object' && value.readable) {
      return value.pipe(hasher)
    }
    process.nextTick(() => cb(new Error('value is a not a valid type')))
  }

  set (value, cb) {
    let _value = bl()
    let hasher = this._createHasher(this._algo, (err, hash) => {
      if (err) return cb(err)
      this._store.set(hash, _value)
      cb(null, hash)
    })
    if (Buffer.isBuffer(value)) {
      _value.write(value)
      _value.end()
      hasher.write(value)
      hasher.end()
      return
    }
    if (value && typeof value === 'object' && value.readable) {
      value.pipe(hasher)
      value.pipe(_value)
      return
    }
    process.nextTick(() => cb(new Error('value is a not a valid type')))
  }
}

module.exports = (algo, createHasher) => new InMemoryContentAddressableStorage(algo, createHasher)
