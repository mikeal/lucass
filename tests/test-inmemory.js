require('../lib/test-basics')('inmemory', require('../inmemory')())

const test = require('tap').test
const inmemory = require('../inmemory')

test('inmemory(implementation): hasher args', async t => {
  t.plan(2)
  const argHasher = async (buff, one, two, three) => {
    t.same([one, two, three], [1, 2, 3])
    return 'asdf'
  }
  let store = inmemory(argHasher)
  await store.set(Buffer.from('asdf'), 1, 2, 3)
  await store.hash(Buffer.from('asdf'), 1, 2, 3)
})
