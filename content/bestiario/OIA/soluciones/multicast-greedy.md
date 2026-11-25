---
title: Multicast - Greedy
tags:
  - solucion
---
## Técnicas utilizadas

- **Greedy**: el algoritmo de Dijkstra es greedy. En cada paso fija definitivamente el nodo no visitado más cercano al origen y nunca revisa esa decisión. Funciona porque los costos son no negativos.
- **Árbol de caminos mínimos (SPT, Shortest Path Tree)**: guardando para cada nodo desde qué nodo lo alcanzamos (su predecesor), los caminos mínimos de Dijkstra forman un árbol con raíz en el origen.

---
## Idea de la solución

Como el ruteo del enunciado manda cada mensaje por el camino de menor costo, el mensaje multicast recorre el SPT: viaja junto mientras los caminos coinciden y se divide donde se separan. El costo es la suma de las aristas del SPT que llevan a algún destino, cada una contada una sola vez.

1. Corremos Dijkstra desde `O` y guardamos tres [[grimorio/data-structures/array|arreglos]]: `dist`, `padre` y `ultima` (costo de la arista `padre[v] → v`).
2. Desempate: si llegamos a un nodo todavía no fijado con la misma distancia que ya tenía, nos quedamos con el predecesor cuya última arista es más barata. Así, dentro de los caminos mínimos, preferimos los que comparten tramos largos.
3. Para cada destino subimos por `padre` hasta el origen, sumando `ultima[v]` y marcando `v`. Si llegamos a un nodo ya marcado cortamos: el resto del camino ya está pago.

---
## Código

```python
import heapq

def dijkstra(N, ady, O):
    dist, padre, ultima = [INF] * (N + 1), [None] * (N + 1), [INF] * (N + 1)
    fijo = [False] * (N + 1)
    dist[O] = 0
    pq = [(0, O)]
    while pq:
        d, u = heapq.heappop(pq)
        if fijo[u]:
            continue
        fijo[u] = True                                   # decisión greedy
        for v, c in ady[u]:
            if fijo[v]:
                continue
            if d + c < dist[v] or (d + c == dist[v] and c < ultima[v]):
                if d + c < dist[v]:
                    heapq.heappush(pq, (d + c, v))
                dist[v], padre[v], ultima[v] = d + c, u, c
    return dist, padre, ultima

def multicast(N, ady, O, destinos):
    dist, padre, ultima = dijkstra(N, ady, O)
    if any(dist[d] == INF for d in destinos):
        return "no hay solucion."
    marcado = [False] * (N + 1)
    marcado[O] = True
    total = 0
    for d in destinos:
        v = d
        while not marcado[v]:                            # subir hasta un tramo ya pago
            marcado[v] = True
            total += ultima[v]
            v = padre[v]
    return total
```

- `ady` es la lista de adyacencia del [[grimorio/data-structures/graph|grafo]]: `ady[u]` contiene pares `(v, c)`. La cola de prioridad es un heap binario (`heapq`).
- El chequeo `fijo[v]` no es decorativo. Con enlaces de costo 0, el desempate podría apuntar el `padre` de un nodo ya fijado hacia uno posterior y armar un ciclo.

---
## Traza de ejemplo

Usamos la instancia de [[multicast]]: origen `1` y destinos `{3, 4, 6}`.

| Paso | Se fija | Cálculo de distancias                                 | dist a 1, 2, 3, 4, 6 | padre de 2 |
| ---- | ------- | ----------------------------------------------------- | -------------------- | ---------- |
| 0    | -       | -                                                     | 0, ∞, ∞, ∞, ∞        | -          |
| 1    | 1 (d=0) | 2 ← 7 vía 1; 3 ← 6 vía 1                              | 0, 7, 6, ∞, ∞        | 1          |
| 2    | 3 (d=6) | 2: 6+1 = 7 empata, última arista 1 < 7 → cambia padre | 0, 7, 6, ∞, ∞        | 3          |
| 3    | 2 (d=7) | 4 ← 8 vía 2; 6 ← 8 vía 2                              | 0, 7, 6, 8, 8        | 3          |
| 4    | 4 (d=8) | -                                                     | igual                | 3          |
| 5    | 6 (d=8) | -                                                     | igual                | 3          |

SPT resultante: `padre = {2: 3, 3: 1, 4: 2, 6: 2}`.

**Reconstrucción:**

| Destino | Recorrido           | Aristas nuevas   | Total |
| ------- | ------------------- | ---------------- | ----- |
| 3       | 3 → 1 (marcado)     | 1–3 (6)          | 6     |
| 4       | 4 → 2 → 3 (marcado) | 2–4 (1), 3–2 (1) | 8     |
| 6       | 6 → 2 (marcado)     | 2–6 (1)          | 9     |

Sin el desempate del paso 2, el nodo 2 se quedaba con padre 1 y el resultado era 6 + 7 + 1 + 1 = 15.

---
## Complejidad
### Temporal

$O((N + M)\log N)$.

- Dijkstra con heap: cada arista se analiza lo sumo dos veces (una por extremo) y cada inserción o extracción del heap cuesta $O(\log N)$. Como solo insertamos ante una mejora estricta, hay a lo sumo $O(M)$ entradas en el heap.
- La reconstrucción es $O(N)$ en total: cada nodo se marca una sola vez y el bucle corta en cuanto encuentra un nodo marcado, así que ningún tramo se recorre dos veces.

Con $N, M \le 10000$, son unos cientos de miles de operaciones.
### Espacial

$O(N + M)$: la lista de adyacencia ocupa $O(N + M)$, los arreglos `dist`, `padre`, `ultima`, `fijo` y `marcado` ocupan $O(N)$, y el heap $O(M)$.

---
## Cuándo usar esta técnica
### Favorable cuando

- La red es grande: es la única de nuestras dos soluciones que escala a las restricciones del enunciado.
- Los caminos mínimos son únicos (por ejemplo, costos "en general" distintos): en ese caso el SPT está determinado y la respuesta es exacta.
### Limitaciones

* Empates. Si un destino tiene varios caminos mínimos, el desempate por "última arista más barata" es una heurística: decide mirando un solo nodo, sin saber qué caminos van a necesitar los otros destinos. 
	* La estructura que resuelve este problema es el **Árbol de Steiner mínimo** restringido a los caminos mínimos, pero encontrarlo es NP-duro, por lo que aún no se conoce ningún algoritmo eficiente que garantice encontrar la solución exacta en un tiempo razonable.
		* El algoritmo de **Dreyfus-Wagner** es un método de programación dinámica exacto que encuentra este árbol. Su complejidad temporal es $O(3^k n + 2^k n^2 + n(m + nlogn))$.
		* El algoritmo de aproximación **KMB (Kou-Markowsky-Berman)** garantiza en el peor caso $2 * OPT$, siendo $OPT$ el resultado óptimo.
* Requiere costos no negativos (el enunciado lo garantiza: $0 \le c$). Con costos negativos tampoco serviría Bellman-Ford: en un grafo no dirigido, una arista negativa ya forma un ciclo negativo (ir y volver por ella).

>[!note] ¿Por qué no buscamos el óptimo exacto?
>Con caminos mínimos empatados, el óptimo es un Árbol de Steiner (NP-duro): los algoritmos exactos, como Dreyfus-Wagner, son exponenciales en la cantidad de destinos y casi no se usan en la práctica. El enunciado pide «el menor costo **que logre determinar**», no el óptimo garantizado, así que elegimos Greedy: escala a las restricciones y es exacto cuando los caminos mínimos son únicos.

--- 
## Comparación con la solución por fuerza bruta

|                                     | Fuerza bruta         | Greedy           |
| ----------------------------------- | -------------------- | ---------------- |
| Tiempo                              | $O(2^M (N+M)\log N)$ | $O((N+M)\log N)$ |
| Espacio                             | $O(N+M)$             | $O(N+M)$         |
| ¿Óptima con caminos mínimos únicos? | Sí                   | Sí               |
| ¿Óptima con empates?                | Sí                   | No siempre       |
| Escala a $M = 10000$                | No                   | Sí               |

La fuerza bruta solo supera a esta solución en redes muy chicas con caminos mínimos empatados. Para el tamaño del problema, Dijkstra + SPT es la única opción viable, y en la instancia del enunciado da el resultado correcto (9).

--- 
## Referencias

* [[https://www.oia.unsam.edu.ar/_media/prob/c3a02n3p3.pdf|Enunciado original: OIA 2002, Nivel 3, Problema 3]]
* [[https://en.wikipedia.org/wiki/Steiner_tree_problem|Árbol de Steiner]]
- [[https://codeforces.com/blog/entry/91601|Algoritmo de Dreyfus-Wagner]]