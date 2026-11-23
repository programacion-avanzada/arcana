import {
  buildTrace,
  frameAt,
  groupCoordinates,
  OIA_COORDINATES,
  parseValues,
  ringOutput,
} from "./race-engine.js"

const $ = (id) => document.getElementById(id)
const number = new Intl.NumberFormat("es-AR")
const format = (value) => number.format(value)
const baseDuration = 650
const methods = ["kadane", "brute"]
const code = {
  kadane: [
    ["init", "mejor = vacío; mejorSuma = 0"],
    ["init", "inicio = 0; suma = 0"],
    ["loop", "para fin = 0 … M−1:"],
    ["restart", "  si suma < 0:"],
    ["restart", "    suma = 0; inicio = fin"],
    ["add", "  suma += aportes[fin]"],
    ["compare", "  si suma > mejorSuma:"],
    ["save", "    guardar suma e intervalo"],
    ["return", "devolver mejor"],
  ],
  brute: [
    ["init", "mejor = vacío; mejorSuma = 0"],
    ["loop", "para inicio = 0 … M−1:"],
    ["restart", "  suma = 0"],
    ["loop", "  para fin = inicio … M−1:"],
    ["add", "    suma += aportes[fin]"],
    ["compare", "    si suma > mejorSuma:"],
    ["save", "      guardar suma e intervalo"],
    ["return", "devolver mejor"],
  ],
}
let values = [],
  keys = null,
  traces = {},
  tick = 0,
  running = false,
  timer
let preset = "oia"

for (const method of methods) {
  const name = method === "kadane" ? "Kadane" : "Fuerza bruta"
  const card = $(method + "-card")
  card.innerHTML = `
    <div class="algorithm-heading"><div><h2 id="${method}-title">${name}<span class="complexity-tag">${method === "kadane" ? "O(M)" : "O(M²)"}</span></h2><p>${method === "kadane" ? "Una pasada por el arreglo" : "Todos los intervalos posibles"}</p></div><span class="state-badge" data-field="badge">En espera</span></div>
    <div class="algorithm-body">
      <div class="method-progress"><div><span data-field="count"></span><span data-field="percent"></span></div><progress data-field="progress" value="0" max="1" aria-label="Progreso de ${name}"></progress></div>
      <div class="metrics"><div class="metric"><span>Suma actual</span><strong data-field="sum">0</strong></div><div class="metric best"><span>Mejor suma</span><strong data-field="best">0</strong></div><div class="metric range"><span>Rango actual</span><strong data-field="range">—</strong></div></div>
      <div class="run-array" tabindex="0" role="region" aria-label="Recorrido de ${name}"><div class="cells" data-field="cells"></div></div>
      <div class="legend"><span><i></i>Posición actual</span><span><i class="range-key"></i>Rango actual</span><span><i class="best-key"></i>Mejor rango</span></div>
      <section class="explanation"><h3 data-field="explanation-title">Todo listo</h3><p data-field="explanation"></p><span class="equation" data-field="equation"></span></section>
      <section class="code-section"><h3>Pseudocódigo</h3><div class="pseudocode" tabindex="0" role="region" aria-label="Pseudocódigo de ${name}">${code[method].map(([key, line]) => `<span class="code-line" data-line="${key}">${line.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</span>`).join("")}</div></section>
      <div class="card-result" data-field="result"></div>
    </div>`
}

function field(method, name) {
  return $(method + "-card").querySelector(`[data-field="${name}"]`)
}
function maxTick() {
  return traces.brute.length - 1
}
function stop() {
  clearTimeout(timer)
  timer = undefined
  running = false
}
function announce(message) {
  if ($("race-status").textContent !== message) $("race-status").textContent = message
}

function renderCard(method) {
  const frame = frameAt(traces[method], tick)
  const total = traces[method].length - 1
  const done = tick >= total
  const progress = field(method, "progress")
  progress.max = total
  progress.value = frame.step
  field(method, "count").textContent = `${format(frame.step)} / ${format(total)} evaluaciones`
  field(method, "percent").textContent = `${Math.round((frame.step / total) * 100)} %`
  const badge = field(method, "badge")
  badge.classList.toggle("done", done)
  badge.textContent = done
    ? `Terminó · pulso ${format(total)}`
    : tick === 0
      ? "En espera"
      : running
        ? "En curso"
        : "En pausa"
  field(method, "sum").textContent = format(frame.sum)
  field(method, "best").textContent = format(frame.best.sum)
  field(method, "range").textContent = frame.step ? `[${frame.start}, ${frame.end}]` : "—"
  for (const [index, cell] of [...field(method, "cells").children].entries()) {
    cell.classList.toggle("in-range", frame.step > 0 && index >= frame.start && index <= frame.end)
    cell.classList.toggle(
      "in-best",
      frame.best.start >= 0 && index >= frame.best.start && index <= frame.best.end,
    )
    cell.classList.toggle("current", frame.step > 0 && index === frame.end)
    cell.setAttribute(
      "aria-label",
      `Índice ${index}, aporte ${values[index]}${index === frame.end ? ", posición actual" : ""}${frame.best.start >= 0 && index >= frame.best.start && index <= frame.best.end ? ", mejor rango" : ""}`,
    )
  }
  const result = field(method, "result")
  result.classList.toggle("completed", done)
  const bestRange =
    frame.best.start < 0 ? "rango vacío" : `rango [${frame.best.start}, ${frame.best.end}]`
  const output = ringOutput(frame.best, keys)
  result.innerHTML = `<strong>${done ? "Óptimo confirmado" : "Mejor hasta ahora"}: ${format(frame.best.sum)}</strong> · ${bestRange}<small>${output !== null ? `Salida del aro: ${output} · ` : ""}${done ? `Completó ${format(total)} evaluaciones.` : "El resultado puede mejorar durante el recorrido."}</small>`

  let title = "Todo listo",
    explanation,
    equation = ""
  if (!frame.step) {
    explanation =
      method === "kadane"
        ? "Va a extender el rango mientras su suma no sea negativa. Si lo es, empezará de nuevo en la posición actual."
        : "Va a fijar un inicio y extender el final. Después repetirá la búsqueda desde el siguiente inicio."
  } else {
    title = frame.improved
      ? "Encontró una mejor suma"
      : method === "kadane" && frame.restarted
        ? "Descartó una suma negativa"
        : "Evalúa el siguiente intervalo"
    const decision = frame.improved
      ? `La suma ${frame.sum} mejora el máximo anterior: guarda [${frame.start}, ${frame.end}].`
      : `La suma ${frame.sum} no supera ${frame.best.sum}: conserva el mejor rango.`
    explanation =
      method === "kadane"
        ? `${frame.restarted ? `La suma previa era negativa. Empieza de nuevo en ${frame.end}.` : `Extiende el rango desde ${frame.start} hasta ${frame.end}.`} ${decision}`
        : `${frame.newRow ? `Fija inicio = ${frame.start} y reinicia la suma.` : `Mantiene inicio = ${frame.start} y avanza fin a ${frame.end}.`} ${decision}`
    equation = `${frame.base} + (${values[frame.end]}) = ${frame.sum}`
    if (done) {
      title = method === "kadane" && tick < maxTick() ? "Kadane ya terminó" : "Búsqueda completa"
      explanation =
        method === "kadane" && tick < maxTick()
          ? `Ya procesó las ${values.length} posiciones. Su resultado queda fijo mientras fuerza bruta sigue evaluando intervalos.`
          : `Evaluó ${format(total)} ${method === "kadane" ? "posiciones" : "intervalos"}. La mejor suma es ${frame.best.sum}; ${bestRange}.`
    }
  }
  field(method, "explanation-title").textContent = title
  field(method, "explanation").textContent = explanation
  field(method, "equation").textContent = equation
  const activeLines = !frame.step
    ? ["init"]
    : done
      ? ["return"]
      : [
          "loop",
          "add",
          "compare",
          ...(frame.improved ? ["save"] : []),
          ...(frame.restarted || frame.newRow ? ["restart"] : []),
        ]
  for (const line of $(method + "-card").querySelectorAll(".code-line")) {
    const active = activeLines.includes(line.dataset.line)
    line.classList.toggle("active", active)
    if (active) line.setAttribute("aria-current", "step")
    else line.removeAttribute("aria-current")
  }
  const viewport = $(method + "-card").querySelector(".run-array")
  if (!frame.step) viewport.scrollLeft = 0
  else {
    const cell = field(method, "cells").children[frame.end].getBoundingClientRect()
    const bounds = viewport.getBoundingClientRect()
    if (cell.right > bounds.right - 8) viewport.scrollLeft += cell.right - bounds.right + 8
    if (cell.left < bounds.left + 8) viewport.scrollLeft += cell.left - bounds.left - 8
  }
}

function render() {
  const finished = tick >= maxTick()
  $("start").hidden = running
  $("pause").hidden = !running
  $("start").textContent = finished
    ? "Volver a iniciar ambos"
    : tick
      ? "Continuar ambos"
      : "Start · iniciar ambos"
  $("back").disabled = tick === 0
  $("step").disabled = finished
  $("reset").disabled = tick === 0 && !running
  $("timeline").max = maxTick()
  $("timeline").value = tick
  $("timeline").setAttribute("aria-valuetext", `Pulso ${tick} de ${maxTick()}`)
  $("clock-label").textContent = `Pulso ${format(tick)} de ${format(maxTick())}`
  $("mobile-kadane").textContent =
    `Kadane: ${Math.min(tick, values.length)}/${values.length}${tick >= values.length ? " · listo" : ""}`
  $("mobile-brute").textContent = `F. bruta: ${tick}/${maxTick()}${finished ? " · listo" : ""}`
  if (finished) announce("Ambos terminaron · mismo óptimo")
  else if (tick >= values.length)
    announce(
      running ? "Kadane terminó · fuerza bruta continúa" : "Kadane terminó · fuerza bruta en pausa",
    )
  else announce(running ? "Ambos en marcha" : tick ? "Comparación en pausa" : "Listos para empezar")
  for (const method of methods) renderCard(method)
}

function schedule() {
  clearTimeout(timer)
  timer = setTimeout(
    () => {
      tick++
      if (tick >= maxTick()) stop()
      render()
      if (running) schedule()
    },
    baseDuration / Number($("speed").value),
  )
}

function applyData(data, name, selectedPreset = null) {
  stop()
  values = data.values
  keys = data.keys ?? null
  preset = selectedPreset
  traces = Object.fromEntries(methods.map((method) => [method, buildTrace(values, method)]))
  tick = 0
  $("dataset-description").textContent = name
  $("input-count").textContent = `${values.length} radios · misma entrada para ambos`
  $("shared-array").innerHTML = values
    .map(
      (value, index) =>
        `<span class="shared-cell" title="Índice ${index}${keys ? ` · Radio² = ${keys[index]}` : ""}"><small>${index}</small><strong class="${value > 0 ? "positive" : value < 0 ? "negative" : ""}">${value > 0 ? "+" : ""}${value}</strong></span>`,
    )
    .join("")
  for (const method of methods) {
    field(method, "cells").innerHTML = values
      .map((value, index) => `<span class="cell"><small>${index}</small><b>${value}</b></span>`)
      .join("")
  }
  for (const button of document.querySelectorAll("[data-preset]"))
    button.setAttribute("aria-pressed", String(button.dataset.preset === preset))
  const total = maxTick()
  const ratio = total / values.length
  $("takeaway-title").textContent =
    `${format(values.length)} evaluaciones frente a ${format(total)}`
  $("takeaway-text").textContent =
    ratio === 1
      ? "Con un único radio, ambos hacen una evaluación y terminan juntos. Probá más radios para ver la diferencia."
      : `Fuerza bruta hace ${number.format(ratio)} veces la cantidad de evaluaciones de Kadane. Al aumentar los radios, esta diferencia crece.`
  $("kadane-work").style.width = `${(values.length / total) * 100}%`
  $("brute-work").style.width = "100%"
  $("kadane-total").textContent = format(values.length)
  $("brute-total").textContent = format(total)
  $("data-error").textContent = ""
  $("data-input").removeAttribute("aria-invalid")
  closeEditor()
  render()
}

function closeEditor() {
  $("data-editor").hidden = true
  $("edit-data").setAttribute("aria-expanded", "false")
  $("draft-note").textContent = ""
}
function updateInputHelp() {
  const coordinates = $("input-type").value === "coordinates"
  $("data-label").textContent = coordinates
    ? "Coordenadas de los tiros"
    : "Aportes por radio, en orden"
  $("data-help").textContent = coordinates
    ? "Un par x y por renglón. x > 0: Olivares; x < 0: rival. Se agrupan por radio y se ordenan automáticamente."
    : "Enteros separados por espacios o comas. Hasta 64 aportes."
  $("data-input").value = coordinates ? OIA_COORDINATES : values.join(" ")
  $("data-error").textContent = ""
  $("data-input").removeAttribute("aria-invalid")
}
$("edit-data").addEventListener("click", () => {
  if (!$("data-editor").hidden) {
    closeEditor()
    return
  }
  stop()
  render()
  $("data-editor").hidden = false
  $("edit-data").setAttribute("aria-expanded", "true")
  $("input-type").value = "values"
  updateInputHelp()
  $("data-input").focus()
})
$("cancel-edit").addEventListener("click", () => {
  closeEditor()
  $("edit-data").focus()
})
$("input-type").addEventListener("change", updateInputHelp)
$("data-input").addEventListener("input", () => {
  $("draft-note").textContent = "Cambios sin aplicar"
})
$("data-editor").addEventListener("submit", (event) => {
  event.preventDefault()
  try {
    const coordinates = $("input-type").value === "coordinates"
    const data = coordinates
      ? groupCoordinates($("data-input").value)
      : { values: parseValues($("data-input").value) }
    applyData(
      data,
      coordinates
        ? "Tus coordenadas · radios agrupados y ordenados por distancia."
        : "Tus aportes · se conserva el orden ingresado.",
    )
    $("start").focus()
  } catch (error) {
    $("data-error").textContent = error.message
    $("data-input").setAttribute("aria-invalid", "true")
  }
})
for (const button of document.querySelectorAll("[data-preset]")) {
  button.addEventListener("click", () => {
    const name = button.dataset.preset
    if (name === "oia")
      applyData(
        groupCoordinates(OIA_COORDINATES),
        "Ejemplo OIA · radios agrupados y ordenados por distancia.",
        name,
      )
    else if (name === "negative")
      applyData(
        { values: [-2, -1, -3, -2, -4, -1, -2, -3] },
        "Todos negativos · descubrí por qué se conserva el rango vacío.",
        name,
      )
    else
      applyData(
        {
          values: [
            -2, 3, -1, 2, -4, 1, 2, -1, 3, -2, 1, -5, 4, 2, -1, 3, -6, 2, -1, 4, -2, 1, -3, 2,
          ],
        },
        "24 radios · una diferencia de trabajo mucho más visible.",
        name,
      )
  })
}
function revealComparison() {
  $("comparison").style.scrollMarginTop =
    `${document.querySelector(".playback").offsetHeight + 24}px`
  $("comparison").scrollIntoView({ block: "start", behavior: "instant" })
}
$("start").addEventListener("click", () => {
  if (tick >= maxTick()) tick = 0
  running = true
  render()
  schedule()
  revealComparison()
  $("pause").focus({ preventScroll: true })
})
$("pause").addEventListener("click", () => {
  stop()
  render()
  $("start").focus({ preventScroll: true })
})
$("back").addEventListener("click", () => {
  stop()
  tick = Math.max(0, tick - 1)
  render()
})
$("step").addEventListener("click", () => {
  const firstStep = tick === 0
  stop()
  tick = Math.min(maxTick(), tick + 1)
  render()
  if (firstStep) revealComparison()
})
$("reset").addEventListener("click", () => {
  stop()
  tick = 0
  render()
})
$("timeline").addEventListener("input", () => {
  stop()
  tick = Number($("timeline").value)
  render()
})
$("speed").addEventListener("change", () => {
  if (running) schedule()
})
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return
  if (
    event.target.closest("input, textarea, select, summary, a, [contenteditable], [role='region']")
  )
    return
  if (event.code === "Space" && event.target.closest("button")) return
  const action =
    event.code === "Space"
      ? running
        ? "pause"
        : "start"
      : event.key === "ArrowRight"
        ? "step"
        : event.key === "ArrowLeft"
          ? "back"
          : null
  if (action) {
    event.preventDefault()
    $(action).click()
  }
})
function showTheme() {
  const dark = document.documentElement.dataset.theme === "dark"
  $("theme-toggle").textContent = dark ? "Modo claro" : "Modo oscuro"
  $("theme-toggle").setAttribute("aria-pressed", String(dark))
}
$("theme-toggle").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem("aceitunas-comparison-theme", theme)
  } catch {}
  showTheme()
})
const entry = location.hash.slice(1)
if (entry.startsWith("kadane")) {
  $("article-link").href =
    "../../bestiario/oia/soluciones/lanzamiento-de-aceitunas-greedy#visualizaciones"
  $("article-link").textContent = "Volver a la resolución de Kadane"
} else if (entry.startsWith("fuerza-bruta")) {
  $("article-link").href =
    "../../bestiario/oia/soluciones/lanzamiento-de-aceitunas-fuerza-bruta#visualizaciones"
  $("article-link").textContent = "Volver a la resolución de fuerza bruta"
}
window.addEventListener("pagehide", stop)
showTheme()
applyData(
  groupCoordinates(OIA_COORDINATES),
  "Ejemplo OIA · radios agrupados y ordenados por distancia.",
  "oia",
)
