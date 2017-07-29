const path = require('path')
const fs = require('fs')
const bl = require('bl')
const fsStore = require('../fs')
const testdir = fs.mkdtempSync(path.join(__dirname, '.testtmp-'))

require('../lib/test-basics')('fs', fsStore(testdir))

const test = require('tap').test
const through = require('through2')

const failHasher = cb => {
  process.nextTick(() => cb(new Error('Test Error')))
  return through(() => {})
}

test('fs(implementation): directory does not exist', t => {
  t.plan(1)
  t.throws(() => {
    fsStore('falskdjfoaisdfjoadfjodi8f9823')
  })
})

test('fs(implementation): hash error in hash()', t => {
  t.plan(1)
  let store = fsStore(testdir, failHasher)
  store.hash(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

test('fs(implementation): hash error in set()', t => {
  t.plan(2)
  let store = fsStore(testdir, failHasher)
  store.set(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
  let stream = bl()
  store.set(stream, err => {
    t.type(err, 'Error')
  })
  stream.write(Buffer.from('asdf'))
  stream.end()
})

test('fs(implementation): filesystem errors, fs.rename()', t => {
  t.plan(1)
  let _rename = fs.rename
  fs.rename = (x, y, cb) => cb(new Error('Test Error.'))
  let store = fsStore(testdir)
  let stream = bl()
  store.set(stream, err => {
    fs.rename = _rename
    t.type(err, 'Error')
  })
  stream.write(Buffer.from('asdf'))
  stream.end()
})

test('fs(implementation): filesystem errors, fs.writeFile()', t => {
  t.plan(1)
  let _writeFile = fs.writeFile
  fs.writeFile = (path, buff, cb) => cb(new Error('Test Error.'))
  let store = fsStore(testdir)
  store.set(Buffer.from('asdf'), err => {
    fs.writeFile = _writeFile
    t.type(err, 'Error')
  })
})

test('fs(implementation): slow hasher', t => {
  t.plan(2)
  const slowHasher = cb => {
    return through(() => setTimeout(() => cb(null, 'asdf'), 100))
  }
  let store = fsStore(testdir, slowHasher)
  let stream = bl()
  store.set(stream, (err, hash) => {
    t.error(err)
    t.equal(hash, 'asdf')
  })
  stream.write(Buffer.from('asdf'))
  stream.end()
})

let rimraf = require('rimraf')

process.on('beforeExit', () => {
  rimraf.sync(testdir)
})
