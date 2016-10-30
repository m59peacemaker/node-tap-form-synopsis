const {obj: through} = require('throo')
const parser = require('tap_parser')
const duplex = require('duplexer')

const formSynopsis = () => {
  const synopsis = {
    time: {
      start: new Date().getTime(),
      end: undefined,
      total: undefined
    },
    tests: 0,
    passed: [],
    failed: []
  }

  const parserStream = parser()
  const synopsisStream = parserStream
    .pipe(through((push, chunk, enc, cb) => {
      if (chunk.type === 'test') {
        ++synopsis.tests
        chunk.parsed.ok ? synopsis.passed.push(chunk) : synopsis.failed.push(chunk)
      }
      cb()
    }, (push, cb) => {
      synopsis.time.end = new Date().getTime()
      synopsis.time.total = synopsis.time.end - synopsis.time.start
      push(synopsis)
      cb()
    }))
  return duplex(parserStream, synopsisStream)
}

module.exports = formSynopsis
