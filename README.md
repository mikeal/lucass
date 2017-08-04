# lucass (Lightweight Universal Content Addressable Storage Spec)

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
  async set (value, cb) {
    // value is either a Buffer or a Stream, both must be supported.
    // cb(Error, Hash)
    // Hash must be consistent. Data written with Buffer or Stream should
    // be identical.
    // Hash must be a String.
  }
  async get (hash, cb) {
    // Hash must be a String.
    // returns a buffer.
  }
  async hash (value, cb) {
    // Identical method signature to set but MUST NOT store the value.
  }
}
```

There are also optional APIs. These are not required as they may not be
possible on top of certain storage but *may* be required by certain users
of an implementation.

```javascript
class Store {
  async set (value, ...args) {
    // Optional args are sent to the hashing function..
  }
  async hash (value, ...args) {
    // Optional args are sent to the hashing function.
  }
}
```

## In-Memory Implementation

```javascript
let store = require('lucass/inmemory')()
let hasher = await store.set(Buffer.from('asdf'))
let value = await store.getBuffer(hash)
console.log(value.toString()) // 'asdf'
```

Additionally, all methods in the spec are implemented.

## Filesystem Implementation

```javascript
let store = require('lucass/fs')('/var/custom-directory')
let hasher = await store.set(Buffer.from('asdf'))
let value = await store.getBuffer(hash)
console.log(value.toString()) // 'asdf'
```

Additionally, all methods in the spec are implemented.
