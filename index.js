const parser = require('tap_parser')
const writable = require('to2')

const collectData = (synopsis) => {
  return writable.obj((chunk, enc, cb) => {
    if (chunk.type === 'test') {
      ++synopsis.tests
      chunk.parsed.ok ? synopsis.passed.push(chunk) : synopsis.failed.push(chunk)
    }
    cb()
  })
}

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
  parserStream
    .pipe(collectData(synopsis))
  parserStream.on('end', () => {
    synopsis.time.end = new Date().getTime()
    synopsis.time.total = synopsis.time.end - synopsis.time.start
  })
  parserStream.getSynopsis = () => synopsis
  return parserStream
}

module.exports = formSynopsis
