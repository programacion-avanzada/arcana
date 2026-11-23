import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import vm from "node:vm"

const html = fs.readFileSync(
  new URL("../quartz/static/aceitunas-reducciones/index.html", import.meta.url),
  "utf8",
)
const source = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1]
const searchSource = source.slice(
  source.indexOf("function createSearch("),
  source.indexOf("function stopPlayback("),
)
const engine = vm.runInNewContext(`(() => {
  const emptyRange = { start: -1, end: -1, sum: 0 };
  ${searchSource}
  return { createSearch, advanceSearch, seekSearch };
})()`)

test("seeking in both directions reproduces every executed line and variable", () => {
  const cases = [
    [-1, 1, 0, 1, -1, -1, 2, -1],
    [],
    [-3, -1, -2],
    [0, 0, 0],
    [1],
    [2, -4, 3, 1, -2],
    Array(32).fill(1),
  ]
  let seed = 17
  for (let index = 0; index < 20; index++) {
    cases.push(
      Array.from({ length: 1 + (index % 12) }, () => {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return (seed % 9) - 4
      }),
    )
  }
  for (const values of cases) {
    for (const method of ["brute", "kadane"]) {
      const sequential = engine.createSearch(method, values)
      const frames = [structuredClone(sequential.frame)]
      while (sequential.frame.next) {
        engine.advanceSearch(sequential)
        frames.push(structuredClone(sequential.frame))
      }
      assert.equal(sequential.total, frames.length - 1)
      const seekable = engine.createSearch(method, values)
      const positions = [frames.length - 1, 0, Math.floor(frames.length / 2)]
      for (let step = frames.length - 1; step >= 0; step--) positions.push(step)
      for (const step of positions) {
        engine.seekSearch(seekable, step)
        assert.deepEqual(
          structuredClone(seekable.frame),
          frames[step],
          `${method}, step ${step}, values ${values}`,
        )
      }
      engine.seekSearch(seekable, 0)
      engine.advanceSearch(seekable)
      assert.deepEqual(structuredClone(seekable.frame), frames[1])
    }
  }
})
