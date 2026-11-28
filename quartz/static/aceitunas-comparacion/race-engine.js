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
    const aporte = Number(token)
    if (!/^[+-]?\d+$/.test(token) || !Number.isSafeInteger(aporte) || Math.abs(aporte) > 10000) {
      throw new Error(`Aporte ${index + 1}: ingresá un entero entre −10.000 y 10.000.`)
    }
    return aporte
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
    const distCuad = x * x + y * y
    const aporte = x > 0n ? 1 : -1
    groups.set(distCuad, (groups.get(distCuad) ?? 0) + aporte)
  }
  if (groups.size > MAX_VALUES)
    throw new Error(`Usá hasta ${MAX_VALUES} radios distintos en esta comparación.`)
  const entries = [...groups].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return {
    values: entries.map(([, aporte]) => aporte),
    keys: entries.map(([distCuad]) => String(distCuad)),
  }
}

export function buildTrace(aportes, method) {
  if (
    !aportes.length ||
    aportes.length > MAX_VALUES ||
    aportes.some((aporte) => !Number.isSafeInteger(aporte) || Math.abs(aporte) > 10000)
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
  function record(ini, fin, suma, base, restarted, newRow) {
    const improved = suma > best.sum
    if (improved) best = { start: ini, end: fin, sum: suma }
    trace.push({
      step: trace.length,
      start: ini,
      end: fin,
      sum: suma,
      base,
      best,
      improved,
      restarted,
      newRow,
    })
  }
  if (method === "brute") {
    for (let ini = 0; ini < aportes.length; ini++) {
      let suma = 0
      for (let fin = ini; fin < aportes.length; fin++) {
        const anterior = suma
        suma += aportes[fin]
        record(ini, fin, suma, anterior, false, ini === fin)
      }
    }
  } else {
    let inicio = 0
    let suma = 0
    for (let fin = 0; fin < aportes.length; fin++) {
      const aporte = aportes[fin]
      const anterior = suma
      const restarted = aporte > suma + aporte
      if (restarted) {
        inicio = fin
        suma = aporte
      } else suma += aporte
      record(inicio, fin, suma, restarted ? 0 : anterior, restarted, false)
    }
  }
  return trace
}

export function frameAt(trace, tick) {
  return trace[Math.max(0, Math.min(trace.length - 1, Math.floor(tick)))]
}

export function ringOutput({ start: ini, end: fin }, radiosCuad) {
  if (!radiosCuad) return null
  if (ini < 0) return "0 0"
  const inner = ini === 0 ? 0n : BigInt(radiosCuad[ini - 1]) + 1n
  return `${inner} ${radiosCuad[fin]}`
}
