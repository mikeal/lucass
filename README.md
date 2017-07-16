# lucass (Lightweight Universal Content Addressabile Storage Spec)

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

## Filesystem Implementation