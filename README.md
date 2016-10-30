# tap-form-synopsis

Receives streaming TAP and emits a synopsis object when it ends.

## install

```sh
npm install tap-form-synopsis
```

## example

```js
const formSynopsis = require('tap-form-synopsis')

runTests() // streaming TAP
  .pipe(formSynopsis())
  .pipe(through((synopsis, enc, cb) => {
    // use synopsis for output
    this.push(`total: ${synopsis.tests}\n`)
    cb()
  }))
```

## synopsis

- time: {
  - start: `number` ms time tests started
  - end: `number` ms time tests ended
  - total: `number` ms total time
- tests: `number` amount of assertions
- passed: `[]` passing tests
- failed: `[]` failing tests
