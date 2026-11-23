// These traces drive an educational animation; they are not a runtime benchmark.
export const MAX_VALUES = 64
export const OIA_COORDINATES = "9 3\n6 1\n9 8\n-1 -2\n8 -9\n-2 10\n5 -8\n-5 8\n-10 9\n-1 -10"

export function parseValues(text) {
  const tokens = text
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean)
  if (!tokens.length) throw new Error("Ingresá al menos un aporte para comparar.")
  if (tokens.length > MAX_VALUES)
    throw new Error(`Usá hasta ${MAX_VALUES} aportes para que cada paso sea legible.`)
  return tokens.map((token, index) => {
    const value = Number(token)
    if (!/^[+-]?\d+$/.test(token) || !Number.isSafeInteger(value) || Math.abs(value) > 10000) {
      throw new Error(`Aporte ${index + 1}: ingresá un entero entre −10.000 y 10.000.`)
    }
    return value
  })
}

export function groupCoordinates(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim())
  if (!lines.length) throw new Error("Ingresá al menos un tiro.")
  if (lines.length > 5000) throw new Error("Usá hasta 5.000 tiros en esta comparación.")
  const groups = new Map()
  for (const [index, line] of lines.entries()) {
    const pair = /^\s*([+-]?\d+)(?:\s*,\s*|\s+)([+-]?\d+)\s*$/.exec(line)
    if (!pair) throw new Error(`Tiro ${index + 1}: ingresá un par x y de enteros.`)
    const x = BigInt(pair[1]),
      y = BigInt(pair[2])
    if (x === 0n || x < -2000000000n || x > 2000000000n || y < -2000000000n || y > 2000000000n) {
      throw new Error(
        `Tiro ${index + 1}: x debe ser distinto de cero y las coordenadas no deben superar ±2.000.000.000.`,
      )
    }
    const radius = x * x + y * y
    groups.set(radius, (groups.get(radius) ?? 0) + (x > 0n ? 1 : -1))
  }
  if (groups.size > MAX_VALUES)
    throw new Error(`Usá hasta ${MAX_VALUES} radios distintos en esta comparación.`)
  const entries = [...groups].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return { values: entries.map(([, value]) => value), keys: entries.map(([key]) => String(key)) }
}

export function buildTrace(values, method) {
  if (
    !values.length ||
    values.length > MAX_VALUES ||
    values.some((value) => !Number.isSafeInteger(value) || Math.abs(value) > 10000)
  ) {
    throw new Error("La comparación necesita entre 1 y 64 aportes enteros válidos.")
  }
  if (method !== "brute" && method !== "kadane") throw new Error("Algoritmo desconocido.")
  let best = { start: -1, end: -1, sum: 0 }
  const trace = [
    {
      step: 0,
      start: -1,
      end: -1,
      sum: 0,
      base: 0,
      best,
      improved: false,
      restarted: false,
      newRow: false,
    },
  ]
  function record(start, end, base, restarted, newRow) {
    const sum = base + values[end]
    const improved = sum > best.sum
    if (improved) best = { start, end, sum }
    trace.push({ step: trace.length, start, end, sum, base, best, improved, restarted, newRow })
    return sum
  }
  if (method === "brute") {
    for (let start = 0; start < values.length; start++) {
      let sum = 0
      for (let end = start; end < values.length; end++) {
        sum = record(start, end, sum, false, start === end)
      }
    }
  } else {
    let start = 0,
      sum = 0
    for (let end = 0; end < values.length; end++) {
      const restarted = sum < 0
      if (restarted) {
        start = end
        sum = 0
      }
      sum = record(start, end, sum, restarted, false)
    }
  }
  return trace
}

export function frameAt(trace, tick) {
  return trace[Math.max(0, Math.min(trace.length - 1, Math.floor(tick)))]
}

export function ringOutput(best, keys) {
  if (!keys) return null
  if (best.start < 0) return "0 0"
  const inner = best.start === 0 ? 0n : BigInt(keys[best.start - 1]) + 1n
  return `${inner} ${keys[best.end]}`
}
