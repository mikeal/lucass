const path = require('path')
const fs = require('fs')
const fsStore = require('../fs')
const testdir = fs.mkdtempSync(path.join(__dirname, '.testtmp-'))

require('../lib/test-basics')('fs', fsStore(testdir))

const test = require('tap').test

test('fs(implementation): directory does not exist', t => {
  t.plan(1)
  t.throws(() => {
    fsStore('falskdjfoaisdfjoadfjodi8f9823')
  })
})

test('fs(implementation): hasher args', async t => {
  t.plan(2)
  const argHasher = async (buff, one, two, three) => {
    t.same([one, two, three], [1, 2, 3])
    return 'asdf'
  }
  let store = fsStore(testdir, argHasher)
  await store.set(Buffer.from('asdf'), 1, 2, 3)
  await store.hash(Buffer.from('asdf'), 1, 2, 3)
})

let rimraf = require('rimraf')

process.on('beforeExit', () => {
  rimraf.sync(testdir)
})
