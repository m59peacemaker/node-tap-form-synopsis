const test = require('tape')
const formSynopsis = require('../')

test('forms synopsis', t => {
  t.plan(1)
  const s = formSynopsis()
  s.write(`
TAP version 13
# foo
ok 1 yay
whatever
# bar
not ok 2 sigh
1..2
  `)
  s.on('data', synopsis => t.deepEqual(synopsis, {
    time: synopsis.time,
    tests: 2,
    passed: [{type: 'test', value: 'ok 1 yay', parsed: {ok: true, point: 1, description: 'yay'}}],
    failed: [{type: 'test', value: 'not ok 2 sigh', parsed: {ok: false, point: 2, description: 'sigh'}}]
  }))
  s.end()
})
