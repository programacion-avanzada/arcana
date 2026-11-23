import assert from "node:assert/strict"
import test from "node:test"
import {
  buildTrace,
  frameAt,
  groupCoordinates,
  OIA_COORDINATES,
  parseValues,
  ringOutput,
} from "../quartz/static/aceitunas-comparacion/race-engine.js"

test("OIA: both algorithms agree and finish on different shared ticks", () => {
  const { values, keys } = groupCoordinates(OIA_COORDINATES)
  assert.deepEqual(values, [-1, 1, 0, 1, -1, -1, 2, -1])
  const kadane = buildTrace(values, "kadane")
  const brute = buildTrace(values, "brute")
  assert.equal(kadane.length - 1, 8)
  assert.equal(brute.length - 1, 36)
  assert.equal(frameAt(kadane, 0).step, 0)
  assert.equal(frameAt(brute, 0).step, 0)
  assert.equal(frameAt(kadane, 8).step, 8)
  assert.equal(frameAt(brute, 8).step, 8)
  assert.strictEqual(frameAt(kadane, 9), frameAt(kadane, 8))
  assert.deepEqual(kadane.at(-1).best, brute.at(-1).best)
  assert.equal(ringOutput(kadane.at(-1).best, keys), "6 90")
  assert.equal(frameAt(kadane, 1).step, 1)
  assert.equal(frameAt(kadane, 0).sum, 0)
})

test("traces match an independent maximum-sum oracle, including ties and empty optima", () => {
  const cases = [
    [-2, -1, -3],
    [0, 0, 0],
    [1],
    [-1],
    [0],
    [1, 2, 3],
    [2, -2, 2],
    [-2, 0, 2, -1, 3, -9, 4],
  ]
  let seed = 123
  for (let index = 0; index < 200; index++) {
    cases.push(
      Array.from({ length: 1 + (index % 32) }, () => {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return (seed % 11) - 5
      }),
    )
  }
  for (const values of cases) {
    let best = { start: -1, end: -1, sum: 0 }
    for (let start = 0; start < values.length; start++) {
      for (let end = start; end < values.length; end++) {
        const sum = values.slice(start, end + 1).reduce((a, b) => a + b, 0)
        if (sum > best.sum) best = { start, end, sum }
      }
    }
    for (const method of ["kadane", "brute"]) {
      const trace = buildTrace(values, method)
      assert.deepEqual(trace.at(-1).best, best)
      assert.equal(
        trace.length - 1,
        method === "kadane" ? values.length : (values.length * (values.length + 1)) / 2,
      )
      for (const frame of trace.slice(1)) {
        assert.equal(
          frame.sum,
          values.slice(frame.start, frame.end + 1).reduce((a, b) => a + b, 0),
        )
      }
    }
  }
})

test("input validation and exact integer radius grouping", () => {
  assert.deepEqual(parseValues("1, -2; 0 +3\n4"), [1, -2, 0, 3, 4])
  for (const invalid of ["", "1.2", "NaN", "10001", Array(65).fill(1).join(" ")])
    assert.throws(() => parseValues(invalid))
  for (const invalid of ["", "0 1", "1", "2000000001 1"])
    assert.throws(() => groupCoordinates(invalid))
  assert.deepEqual(groupCoordinates("3 4\n-4 3\n1 1"), { values: [1, 0], keys: ["2", "25"] })
  assert.deepEqual(groupCoordinates("2000000000 2000000000\n-2000000000 -2000000000"), {
    values: [0],
    keys: ["8000000000000000000"],
  })
  assert.equal(ringOutput({ start: -1, end: -1, sum: 0 }, ["2"]), "0 0")
  assert.equal(
    ringOutput({ start: 1, end: 1, sum: 1 }, ["8000000000000000000", "8000000000000000001"]),
    "8000000000000000001 8000000000000000001",
  )
  assert.throws(() => buildTrace([], "brute"))
})
