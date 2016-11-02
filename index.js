const parser = require('tap_parser')
const writable = require('to2')

const transformToWritable = (transformStream, writableStream, options) => {
  return writable(options, (chunk, enc, cb) => {
    transformStream.write(chunk)
    cb()
  }, (cb) => {
    writableStream.on('finish', cb)
    transformStream.end()
  })
}

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
  const collectStream = parserStream
    .pipe(collectData(synopsis))
  const s = transformToWritable(parserStream, collectStream)
  s.on('finish', () => {
    synopsis.time.end = new Date().getTime()
    synopsis.time.total = synopsis.time.end - synopsis.time.start
  })
  s.getSynopsis = () => synopsis
  return s
}

module.exports = formSynopsis
