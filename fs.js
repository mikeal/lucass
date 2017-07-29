const fs = require('fs')
const path = require('path')
const once = require('once')
const createHasher = require('hashes-stream')

const isDirectory = dir => fs.statSync(dir).isDirectory()

class FileSystemContentAddressableStorage {
  constructor (dir, _createHasher = (cb) => createHasher('sha256', cb)) {
    /* This statement is tested but because it gets wrapped in a try/catch
       the coverage report doesn't notice. */
    /* istanbul ignore if */
    if (!isDirectory(dir)) throw new Error('Not a directory.')
    this.dir = dir
    this._createHasher = _createHasher
  }
  set (value, ...args) {
    if (Buffer.isBuffer(value)) {
      return this._setBuffer(value, ...args)
    }
    if (value && typeof value === 'object' && value.readable) {
      return this._setStream(value, ...args)
    }
    let cb = args.pop()
    process.nextTick(() => cb(new Error('value is a not a valid type')))
  }
  hash (value, ...args) {
    let cb = args.pop()
    let hasher = this._createHasher(...args, cb)
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
  _setBuffer (value, ...args) {
    let cb = args.pop()
    this.hash(value, ...args, (err, hash) => {
      if (err) return cb(err)
      fs.writeFile(path.join(this.dir, hash), value, err => {
        if (err) return cb(err)
        cb(null, hash)
      })
    })
  }
  _setStream (value, ...args) {
    let cb = once(args.pop())
    let hash
    let closed
    let tmpfile = path.join(this.dir, '.' + Date.now() + Math.random())
    let finish = () => {
      fs.rename(tmpfile, path.join(this.dir, hash), err => {
        if (err) return cb(err)
        cb(null, hash)
      })
    }
    let hasher = this._createHasher(...args, (err, _hash) => {
      if (err) return cb(err)
      hash = _hash
      if (closed) finish()
    })
    let file = fs.createWriteStream(tmpfile)
    file.on('error', cb)
    file.on('close', () => {
      closed = true
      if (hash) finish()
    })
    value.pipe(file)
    value.pipe(hasher)
  }

  getBuffer (hash, cb) {
    fs.readFile(path.join(this.dir, hash), cb)
  }
  getStream (hash, cb) {
    return fs.createReadStream(path.join(this.dir, hash))
  }
}

module.exports = (dir, algo, ch) => new FileSystemContentAddressableStorage(dir, algo, ch)
