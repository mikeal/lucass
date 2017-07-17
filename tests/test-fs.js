const path = require('path')
const fs = require('fs')
const fsStore = require('../fs')
const testdir = fs.mkdtempSync(path.join(__dirname, '.testtmp-'))

require('../lib/test-basics')('fs', fsStore(testdir))

let test = require('tap').test
let rimraf = require('rimraf')

process.on('beforeExit', () => {
  rimraf.sync(testdir)
})

// test('teardown', t => {
//   t.plan(1)
//   rimraf(testdir, err => {
//     t.error(err)
//   })
// })