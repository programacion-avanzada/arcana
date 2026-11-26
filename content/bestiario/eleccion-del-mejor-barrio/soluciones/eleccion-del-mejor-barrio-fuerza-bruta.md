---
title: 'Elección del mejor barrio - Fuerza Bruta'
tags:
  - oia
  - solucion
---

Problema: [[eleccion-del-mejor-barrio]]

## Técnicas utilizadas

**Fuerza bruta**: se evalúan explícitamente todos los pares (esquina tumultuosa, esquina de la ciudad). Para obtener cada distancia se usa un **BFS** (búsqueda en anchura) con una [[queue]], que en un grafo con aristas de peso 1 encuentra los caminos más cortos desde un origen.

## Idea de la solución

La ciudad se modela como un [[graph]] implícito: cada esquina `(x, y)` es un vértice y sus vecinos son las hasta cuatro esquinas adyacentes, salvo las que queden fuera de la cuadrícula o del otro lado de una cuadra cortada. No hace falta construir listas de adyacencia: los vecinos se calculan al vuelo.

Las cuadras cortadas se guardan en un [[set]]. Cada cuadra es un par **no ordenado** de esquinas (un `frozenset`), así que el corte bloquea el paso en los dos sentidos sin tener que guardarlo dos veces.

El algoritmo aplica la definición tal cual:

1. Para cada esquina tumultuosa `t`, se hace un BFS desde `t` que da la distancia `d` a todas las esquinas.
2. En cada esquina se actualiza la molestia acumulada con `min(actual, d - v_t)`. Las molestias se guardan en un [[map]] de esquina a valor.
3. Al terminar, se toma el máximo de las molestias y se listan las esquinas que lo alcanzan.

## Código

```python
import sys
from collections import deque

def vecinos(x, y, M, N, cortes):
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 1 <= nx <= M and 1 <= ny <= N and frozenset({(x, y), (nx, ny)}) not in cortes:
            yield nx, ny

def bfs(origen, M, N, cortes):
    dist = {origen: 0}
    cola = deque([origen])
    while cola:
        u = cola.popleft()
        for w in vecinos(*u, M, N, cortes):
            if w not in dist:
                dist[w] = dist[u] + 1
                cola.append(w)
    return dist

def mejor_barrio(M, N, tumultuosas, cortes):
    molestia = {}
    for x, y, v in tumultuosas:                  # un BFS completo por tumultuosa
        for esquina, d in bfs((x, y), M, N, cortes).items():
            molestia[esquina] = min(molestia.get(esquina, float('inf')), d - v)
    maximo = max(molestia.values())
    return maximo, sorted(e for e, m in molestia.items() if m == maximo)

def main():
    datos = list(map(int, sys.stdin.read().split()))
    M, N, K = datos[0], datos[1], datos[2]
    tumultuosas = [tuple(datos[3 + 3 * i : 6 + 3 * i]) for i in range(K)]
    pos = 3 + 3 * K
    B = datos[pos]
    cortes = {frozenset({(datos[j], datos[j + 1]), (datos[j + 2], datos[j + 3])})
              for j in range(pos + 1, pos + 1 + 4 * B, 4)}
    maximo, esquinas = mejor_barrio(M, N, tumultuosas, cortes)
    salida = [str(maximo), str(len(esquinas))] + [f"{x} {y}" for x, y in esquinas]
    print("\n".join(salida))

if __name__ == "__main__":
    main()
```

`main` lee la entrada con el formato del enunciado, arma el set de cortes y muestra la salida en el formato pedido. Para probarlo con el ejemplo: `python barrio.py < barrio.in`.

## Traza de ejemplo

Usamos la instancia del [[eleccion-del-mejor-barrio#Ejemplo acotado|ejemplo acotado]]: cuadrícula de 5 × 4, A = (1, 1) con v = 0, B = (4, 4) con v = 2, y cuadras cortadas entre (3, 2)–(4, 2) y entre (3, 4)–(4, 4).

**Primera iteración: BFS desde A.** Ningún corte alarga un camino desde A, así que las distancias coinciden con la distancia Manhattan. Como `molestia` está vacío, queda igual a `d − 0`:

![[barrio_acotado_A.svg|Molestia de la esquina tumultuosa A en el ejemplo acotado|400]]

**Segunda iteración: BFS desde B.** La cola procesa las esquinas por niveles de distancia:

| Distancia | Esquinas que entran a la cola | Comentario |
|:---------:|:------------------------------|:-----------|
| 0 | (4, 4) | Origen. (3, 4) no es vecina: la cuadra está cortada. |
| 1 | (5, 4), (4, 3) | |
| 2 | (5, 3), (3, 3), (4, 2) | |
| 3 | (5, 2), (2, 3), (3, 4), (3, 2), (4, 1) | (3, 4) recién se alcanza rodeando por (3, 3). (3, 2) llega desde (3, 3), no desde (4, 2), por el otro corte. |
| 4 | (1, 3), (2, 4), (2, 2), (3, 1), (5, 1) | |
| 5 | (1, 4), (1, 2), (2, 1) | |
| 6 | (1, 1) | |

Con esas distancias, `d − 2` da:

![[barrio_acotado_B.svg|Molestia de la esquina tumultuosa B en el ejemplo acotado|400]]

y la actualización `min(actual, d − 2)` deja en `molestia`:

![[barrio_acotado_minimo.svg|Menor molestia de cada esquina del ejemplo acotado|400]]

Por ejemplo, en (1, 2) A aporta 1 y B aporta 3, así que queda 1. En (1, 4) ambas aportan 3.

**Resultado:** el máximo es 3 y solo lo alcanza (1, 4). La función devuelve `(3, [(1, 4)])`, que se imprime como:

```
3
1
1 4
```

## Complejidad

Sean $V = M \cdot N$ la cantidad de esquinas y $E \le 2 \cdot M \cdot N$ la cantidad de cuadras.

### Temporal

$O(K \cdot M \cdot N)$.

Cada BFS visita cada esquina una vez y revisa cada cuadra a lo sumo dos veces (una por extremo), con consultas al set de cortes en $O(1)$ en promedio. Eso da $O(V + E) = O(M \cdot N)$ por BFS, y se hacen K. La actualización de molestias también es $O(M \cdot N)$ por tumultuosa. Armar el set de cortes cuesta $O(B)$ y la pasada final para el máximo, $O(M \cdot N)$.

Con las cotas del problema son $10^5 \cdot 10^6 = 10^{11}$ operaciones: **inviable** para el peor caso.

**Tiempos medidos.** Con este código en Python 3.12, sobre ciudades generadas al azar (intensidades entre 0 y 1000 y cuadras cortadas al azar):

- 100 × 100 con K = 100: 2,3 s.
- 100 × 100 con K = 1000: 23,8 s. Diez veces más tumultuosas, diez veces más tiempo, como predice $O(K \cdot M \cdot N)$.
- 1000 × 1000: cada BFS tarda unos 3 s, así que con K = 100.000 serían unos 3,5 días.

Los valores exactos dependen de la máquina, pero la proporción entre ellos no.

### Espacial

$O(M \cdot N + B)$.

El diccionario `molestia` y el `dist` del BFS en curso tienen a lo sumo una entrada por esquina, y la cola nunca supera $M \cdot N$ elementos. Como cada BFS se descarta al terminar, la memoria no se multiplica por K. El set de cortes ocupa $O(B)$.

## Cuándo usar esta técnica

### Favorable cuando

- K es chico. Con una sola tumultuosa es exactamente un BFS, $O(M \cdot N)$, y no hay forma de hacerlo mejor.
- Se necesita un resultado de referencia para validar una solución más elaborada: es la traducción directa de la definición $\min_t (d(t, c) - v_t)$, fácil de verificar a mano.
- Además de la molestia mínima interesa información por tumultuosa (por ejemplo, qué tumultuosa molesta más a cada esquina, o cuánto molesta cada una), porque cada BFS la calcula por separado.

### Limitaciones

- Repite K veces un recorrido completo de la ciudad, aunque casi todo ese trabajo sea inútil: la mayoría de las tumultuosas no son la que más molesta a casi ninguna esquina.
- Con K y M · N grandes a la vez, como en las cotas del problema, no termina en un tiempo razonable.

## Comparación con la solución greedy

La [[eleccion-del-mejor-barrio-greedy|solución greedy]] (Dijkstra con varios orígenes) evita repetir el recorrido: pone todas las tumultuosas en una cola de prioridad desde el principio, cada una con valor inicial $-v$, y fija cada esquina una sola vez. Su costo es $O((M \cdot N + K) \log(M \cdot N + K))$, independiente de cuántas tumultuosas haya más allá de insertarlas.

| | Fuerza bruta | Greedy (Dijkstra multi-origen) |
|:--|:--|:--|
| Tiempo | $O(K \cdot M \cdot N)$ | $O((M \cdot N + K) \log(M \cdot N + K))$ |
| Peor caso del problema | ~$10^{11}$ operaciones | ~$10^8$ operaciones |
| Peor caso medido en Python | ~3,5 días (estimado a partir de un BFS) | 7,1 s |
| Mejor caso | K = 1: un BFS, sin heap | Siempre paga el $\log$ del heap |
| Facilidad de verificación | Directa, sigue la definición | Requiere justificar por qué la primera visita ya es la mínima |

La fuerza bruta gana solo cuando K es muy chico (una o dos tumultuosas). En cuanto K crece, la greedy es claramente superior.

## Referencias

- [[COR2011]] - Chapter 22.2 (Breadth-first search).
- [Documentación de `collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque)
