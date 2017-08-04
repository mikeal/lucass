const test = require('tap').test

module.exports = (name, store) => {
  test(`${name}: set Buffer, get Buffer`, async t => {
    t.plan(1)
    let x = Buffer.from('asdf')
    let hash = await store.set(x)
    let buff = await store.get(hash)
    t.same(x, buff)
  })

  test(`${name}: consistent hashing w/ set API`, async t => {
    t.plan(1)
    let buff = Buffer.from('asldkfjalskdjflkasdjf')
    let hash1 = await store.set(buff)
    let hash2 = await store.set(buff)
    t.same(hash1, hash2)
  })

  test(`${name}: consistent hashing w/ hash API, Buffer`, async t => {
    t.plan(1)
    let buff = Buffer.from('asldkfjalskdjfldddkasdjf')
    let hash1 = await store.hash(buff)
    let hash2 = await store.hash(buff)
    t.same(hash1, hash2)
  })

  test(`${name}: get Buffer from key that has not been stored`, async t => {
    t.plan(1)
    try {
      await store.get('notfound')
      throw new Error('Got buffer from key not stored.')
    } catch (e) {
      t.type(e, 'Error')
    }
  })

  test(`${name}: set invalid values`, async t => {
    t.plan(8)
    let tests = [
      async () => store.set({}),
      async () => store.set(null),
      async () => store.set('asdf'),
      async () => store.set(1123454)
    ]
    for (let _test of tests) {
      try {
        await _test()
      } catch (e) {
        t.type(e, 'Error')
        t.same(e.message, 'Invalid type.')
      }
    }
  })

  test(`${name}: hash invalid values`, async t => {
    t.plan(8)
    let tests = [
      async () => store.hash({}),
      async () => store.hash(null),
      async () => store.hash('asdf'),
      async () => store.hash(1123454)
    ]
    for (let _test of tests) {
      try {
        await _test()
      } catch (e) {
        t.type(e, 'Error')
        t.same(e.message, 'Invalid type.')
      }
    }
  })
}
