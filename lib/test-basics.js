const test = require('tap').test
const through = require('through2')
const bl = require('bl')

const proxy = () => through(function (data, enc, cb) {
  this.push(data)
  cb()
})

module.exports = (name, store) => {
  test(`${name}: set Buffer, get Buffer`, t => {
    t.plan(3)
    let x = Buffer.from('asdf')
    store.set(x, (err, hash) => {
      t.error(err)
      store.getBuffer(hash, (err, buff) => {
        t.error(err)
        t.deepEquals(x, buff)
      })
    })
  })

  test(`${name}: set Stream, get Stream`, t => {
    t.plan(3)
    let p = proxy()
    let x = Buffer.from('asdf')
    store.set(p, (err, hash) => {
      t.error(err)
      let stream = store.getStream(hash)
      stream.on('error', err => { throw err })
      stream.pipe(bl((err, buff) => {
        t.error(err)
        t.deepEquals(x, buff)
      }))
    })
    p.write(x)
    p.end()
  })

  test(`${name}: consistent hashing w/ set API`, t => {
    t.plan(3)
    let buff = Buffer.from('asldkfjalskdjflkasdjf')
    store.set(buff, (err, hash) => {
      t.error(err)
      store.set(buff, (err, _hash) => {
        t.error(err)
        t.equals(hash, _hash)
      })
    })
  })

  test(`${name}: consistent hashing w/ hash API`, t => {
    t.plan(3)
    let buff = Buffer.from('asldkfjalskdjfldddkasdjf')
    store.hash(buff, (err, hash) => {
      t.error(err)
      store.hash(buff, (err, _hash) => {
        t.error(err)
        t.equals(hash, _hash)
      })
    })
  })

  test(`${name}: get Buffer from key that has not been stored`, t => {
    t.plan(1)
    store.getBuffer('notfound', (err, buff) => {
      t.type(err, 'Error')
      if (buff) throw new Error('Got buffer from key not stored.')
    })
  })

  test(`${name}: get Stream from key that has not been stored`, t => {
    let stream = store.getStream('notfound')
    t.plan(1)
    stream.on('error', err => t.type(err, 'Error'))
    stream.on('data', chunk => { throw new Error('Got data from key not stored.') })
  })

  test(`${name}: set Buffer, get Stream, validate identical`, t => {
    t.plan(3)
    let buff = Buffer.allocUnsafe(1024 * 1000 * 50)
    store.set(buff, (err, hash) => {
      t.error(err)
      let b = bl((err, _buff) => {
        t.error(err)
        t.deepEquals(_buff.slice(), buff)
      })
      let stream = store.getStream(hash)
      stream.pipe(b)
    })
  })
}

