---
title: 'Nuevas Autopistas - Backtracking'
tags:
  - solucion
---

## Técnicas utilizadas
* **Backtracking:** explora recursivamente un árbol de decisiones binarias (construir o descartar cada autopista), revirtiendo los cambios sobre el grafo al retroceder cuando una rama no conduce a una solución válida.
* **Poda:** corta anticipadamente ramas enteras de recursión cuando es imposible alcanzar una solución válida (superar el presupuesto objetivo $F$, intentar descartar más de $2$ autopistas o desconectar el grafo).
* **Búsqueda en Profundidad (DFS):** verifica en $\mathcal{O}(N)$ si al descartar temporalmente una autopista $(u, v)$ sigue existiendo un camino alternativo entre $u$ y $v$.

## Idea de la solución
Recorremos la lista de $M = N + 1$ autopistas mediante una función recursiva que lleva el índice actual `idx`, el `costo` acumulado de las autopistas construidas y la lista de `cortadas`:

1. **Caso base (`idx == M`):** si procesamos todas las autopistas, verificamos si `costo == F`. De ser así, la lista `cortadas` contiene la respuesta.
2. **Rama 1 — Construir `idx`:** si sumar su costo no supera el presupuesto (`costo + c <= F`), avanzamos recursivamente incluyéndola.
3. **Rama 2 — Descartar `idx`:** si la Rama 1 no halló solución (o se pasó de $F$), intentamos descartarla aplicando dos podas inmediatas:
   * **Poda por cantidad:** `cortadas` debe tener menos de $2$ autopistas (quitar $3$ desconecta sí o sí un grafo de $N$ nodos y $N+1$ aristas).
   * **Poda por conectividad:** marcamos la autopista como eliminada y corremos un DFS desde $u$ hasta $v$. Solo si existe ruta alternativa seguimos explorando; al volver de la recursión restauramos la autopista (*backtrack*)


## Código

```text
FUNCIÓN HayCaminoAlternativo(G, u, v, eliminadas):
    Buscar camino desde u hasta v con DFS ignorando aristas en 'eliminadas'
    RETORNAR VERDADERO si se alcanza v, FALSO en caso contrario

FUNCIÓN Backtrack(idx, costo, F, cortadas):
    SI idx == M:
        RETORNAR (costo == F)

    (u, v, c) ← autopistas[idx]

    // Rama 1: Construir (poda por exceso de presupuesto)
    SI costo + c <= F:
        SI Backtrack(idx + 1, costo + c, F, cortadas):
            RETORNAR VERDADERO

    // Rama 2: Descartar (poda por tope K <= 2 y por conectividad)
    SI tamaño(cortadas) < 2:
        Marcar autopista idx como eliminada
        SI HayCaminoAlternativo(G, u, v, eliminadas):
            Agregar (u, v) a cortadas
            SI Backtrack(idx + 1, costo, F, cortadas):
                RETORNAR VERDADERO
            Quitar (u, v) de cortadas        // Backtrack
        Desmarcar autopista idx              // Backtrack

    RETORNAR FALSO
```


## Traza de ejemplo

**Entrada:** $N = 6$, autopistas `0:(1-2, 1)`, `1:(2-3, 2)`, `2:(3-4, 3)`, `3:(4-2, 4)`, `4:(4-5, 5)`, `5:(3-6, 6)`, `6:(1-5, 7)`.

* **$F_1 = 21$:**
  * Construye de `0` a `5` acumulando `costo = 1+2+3+4+5+6 = 21`.
  * En `idx = 6:(1-5, 7)`, construir daría $28 > 21$ (poda Rama 1). Pasa a Rama 2: descarta `(1-5)`, `HayCaminoAlternativo(1, 5)` da `VERDADERO` (`1-2-4-5`), llega a `idx = 7` con `costo == 21` $\rightarrow$ **`SI`, `1`, `1 5`**.
* **$F_2 = 22$:**
  * Construye `0` a `5` (`costo = 21`). En `6:(1-5, 7)` se pasa ($28 > 22$) y si la descarta termina en $21 \neq 22$. Retrocede (*backtrack*).
  * En `5:(3-6, 6)` intenta descartarla, pero `HayCaminoAlternativo(3, 6)` da `FALSO` (es puente). Poda y sigue retrocediendo.
  * Al retroceder hasta combinaciones previas, la rama que descarta `1:(2-3, 2)` y `3:(4-2, 4)` (ambas con camino alternativo válido) y construye el resto alcanza `idx = 7` con `costo = 1+3+5+6+7 = 22` $\rightarrow$ **`SI`, `2`, `2 3` y `4 2`**.
* **$F_3 = 30$:**
  * Aun construyendo las $7$ autopistas llega a $28 < 30$; todas las ramas de descarte suman menos y se agotan $\rightarrow$ **`NO`**.


## Complejidad
* **Temporal — $\mathcal{O}(N^3)$:** gracias a la poda `tamaño(cortadas) < 2`, el árbol de recursión solo puede ramificar hacia "descartar" a lo sumo $2$ veces en cualquier camino desde la raíz hasta una hoja. Esto acota la cantidad total de nodos visitados en el árbol de decisión a $\binom{M}{0} + \binom{M}{1} + \binom{M}{2} = \mathcal{O}(N^2)$ estados, y en cada intento de descarte se ejecuta un DFS de costo $\mathcal{O}(N)$, dando $\mathcal{O}(N^2) \cdot \mathcal{O}(N) = \mathcal{O}(N^3)$ en el peor caso.
* **Espacial — $\mathcal{O}(N)$:** al mutar y restaurar un único grafo en memoria (sin copiar estructuras), solo se consume espacio lineal para la lista de adyacencia, la pila de recursión de profundidad $M = N + 1$ y el arreglo `visitado` del DFS.


## Cuándo usar esta técnica
* **Contexto favorable:** problemas de decisión o búsqueda combinatoria donde las restricciones (`costo <= F`, conectividad y límite de descartes) cortan ramas muy arriba en el árbol, encontrando la primera solución válida sin generar todo el espacio de estados.
* **Limitaciones:** si $F$ es inalcanzable (respuesta `NO`) o la solución requiere descartar las primeras autopistas de la lista (las últimas en probarse al priorizar "construir"), recorre casi todo el árbol podado haciendo múltiples DFS repetidos.
* **Comparación con las otras soluciones:**
  * *Vs. Fuerza bruta:* el backtracking construye la solución incrementalmente y poda apenas supera el presupuesto o topa con un puente individual, evitando evaluar pares que contengan ese puente; sin embargo, tiene mayor sobrecarga recursiva y la misma cota asintótica $\mathcal{O}(N^3)$.
  * *Vs. Solución óptima ($\mathcal{O}(N \log N)$):* la óptima evita por completo el árbol de decisión recursivo y los DFS repetidos, precalculando los ciclos en un único recorrido inicial $\mathcal{O}(N)$.


## Referencias
* OIA — Enunciado original *Nuevas Autopistas* (Jurisdiccional 2018, Nivel 3): https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/nautopistas.pdf
