require('../lib/test-basics')('inmemory', require('../inmemory')())

const test = require('tap').test
const inmemory = require('../inmemory')
const through = require('through2')

const failHasher = (algo, cb) => {
  process.nextTick(() => cb(new Error('Test Error')))
  return through(() => {})
}

test('inmemory: (implementation) hash error in hash()', t => {
  t.plan(1)
  let store = inmemory('noop', failHasher)
  store.hash(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

test('inmemory: (implementation) hash error in set()', t => {
  t.plan(1)
  let store = inmemory('noop', failHasher)
  store.set(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})
