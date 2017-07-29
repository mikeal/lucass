require('../lib/test-basics')('inmemory', require('../inmemory')())

const test = require('tap').test
const inmemory = require('../inmemory')
const through = require('through2')

const failHasher = (cb) => {
  process.nextTick(() => cb(new Error('Test Error')))
  return through(() => {})
}

test('inmemory: (implementation) hash error in hash()', t => {
  t.plan(1)
  let store = inmemory(failHasher)
  store.hash(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

test('inmemory: (implementation) hash error in set()', t => {
  t.plan(1)
  let store = inmemory(failHasher)
  store.set(Buffer.from('asdf'), err => {
    t.type(err, 'Error')
  })
})

test('inmemory(implementation): hasher args', t => {
  t.plan(4)
  const argHasher = (one, two, three, cb) => {
    t.same([one, two, three], [1, 2, 3])
    return through(() => setTimeout(() => cb(null, 'asdf'), 100))
  }
  let store = inmemory(argHasher)
  store.set(Buffer.from('asdf'), 1, 2, 3, (err, hash) => {
    t.error(err)
  })
  store.hash(Buffer.from('asdf'), 1, 2, 3, (err, hash) => {
    t.error(err)
  })
})
