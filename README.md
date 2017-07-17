# lucass (Lightweight Universal Content Addressabile Storage Spec)

[![Coverage Status](https://coveralls.io/repos/github/mikeal/lucass/badge.svg?branch=master)](https://coveralls.io/github/mikeal/lucass?branch=master)
[![Build Status](https://travis-ci.org/mikeal/lucass.svg?branch=master)](https://travis-ci.org/mikeal/lucass)
[![dependencies Status](https://david-dm.org/mikeal/lucass/status.svg)](https://david-dm.org/mikeal/lucass)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/mikeal/lucass.svg)](https://greenkeeper.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

There are a bunch of content addressable stores out there, and even some abstract store specs. A few things that are different about lucass:

* There is **NO** requirement that implementations use a specific hashing method, only that the method they use is consistent.
  * This means that there can be many more types of implementations but that they aren't compatible by default. Users of each implementation may need to configure the hashing methods.
* Requires support for both Buffers and Streams as values.

This module contains compliance tests and two reference implementations (filesystem and inmemory).

## Spec

```javascript
class Store {
  set (value, cb) {
    // value is either a Buffer or a Stream, both must be supported.
    // cb(Error, Hash)
    // Hash must be consistent. Data written with Buffer or Stream should
    // be identical.
    // Hash must be a String.
  }
  getBuffer (hash, cb) {
    // Hash must be a String.
    // cb(Error, Buffer)
  }
  getStream (hash) {
    // Returns a stream.
    // If hash is not found in store emit an error.
    // All stored hashes must be accessible as Buffer or Stream.
  }
  hash (value, cb) {
    // Identical method signature to set but MUST NOT store the value.
  }
}
```

## In-Memory Implementation

```javascript
let store = require('lucass/inmemory')()
store.set(Buffer.from('asdf'), (err, hash) => {
  store.getBuffer(hash, (err, value) => {
    console.log(value.toString) // 'asdf'
  })
})
```

Additionally, all methods in the spec are implemented.

## Filesystem Implementation

```javascript
let store = require('lucass/fs')('/var/custom-directory')
store.set(Buffer.from('asdf'), (err, hash) => {
  store.getBuffer(hash, (err, value) => {
    console.log(value.toString) // 'asdf'
  })
})
```

Additionally, all methods in the spec are implemented.
