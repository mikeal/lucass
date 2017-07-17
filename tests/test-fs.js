const path = require('path')
const fs = require('fs')
const fsStore = require('../fs')
const testdir = fs.mkdtempSync(path.join(__dirname, '.testtmp-'))

require('../lib/test-basics')('fs', fsStore(testdir))

const test = require('tap').test
const through = require('through2')

const failHasher = (algo, cb) => {
  process.nextTick(() => cb(new Error('Test Error')))
  return through(() => {})
}

test('fs(implementation): directory does not exist', t => {
  t.plan(1)
  try {
    fsStore('falskdjfoaisdfjoadfjodi8f9823')
  } catch (e) {
    t.type(e, 'Error')
  }
})

test('fs(implementation): hash error in hash()', t => {
  t.plan(1)
  let store = fsStore(testdir)
  store._createHasher = failHasher
  store.hash(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

test('fs(implementation): hash error in set()', t => {
  t.plan(1)
  let store = fsStore(testdir)
  store._createHasher = failHasher
  store.set(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

let rimraf = require('rimraf')

process.on('beforeExit', () => {
  rimraf.sync(testdir)
})
