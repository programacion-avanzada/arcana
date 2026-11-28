---
title: Multicast - Fuerza Bruta
tags:
  - solucion
---
## Técnicas utilizadas

- **Fuerza bruta**: generamos todas las configuraciones posibles (todos los subconjuntos de enlaces) y nos quedamos con la mejor que cumpla las condiciones del problema. No aprovecha ninguna estructura del problema; por eso es exacta, pero exponencial.
- **Algoritmo de Dijkstra (como herramienta auxiliar)**: lo usamos solo para verificar cada candidato, calculando distancias mínimas desde el origen.

---
## Idea de la solución

El enunciado dice que los mensajes siempre viajan por el camino de menor costo. Entonces no alcanza con que un conjunto de enlaces "conecte" el origen con los destinos: tiene que permitir llegar a cada destino con su distancia mínima real.

Modelamos la red como un [[grimorio/data-structures/graph|grafo]] no dirigido con pesos en las aristas.
1. Calculamos una sola vez `dist_G[v]`: la distancia mínima desde `O` a cada nodo usando todos los enlaces. Si algún destino es inalcanzable, la respuesta es “*no hay solucion*.”.
2. Probamos los $2^M$ subconjuntos de enlaces. Cada subconjunto se codifica con una máscara de bits: el bit `i` encendido significa "el enlace `i` está activo".
3. Para cada subconjunto calculamos `dist_S`, las distancias usando solo los enlaces activos. El subconjunto es válido si `dist_S[d] == dist_G[d]` para todo destino `d`.
4. El costo de un subconjunto válido es la suma de sus enlaces (cada enlace se paga una vez, aunque lo usen varios mensajes). La respuesta es el mínimo entre los válidos.

#### ¿Por qué no alcanza con BFS/DFS?

Podemos utilizar los recorridos BFS o DFS a fin de verificar que, para cada subconjunto de aristas, los destinos fueran **alcanzables**. Sin embargo, no verifican que se llegue por el **camino mínimo**.

---
## Código

```python
INF = float("inf")

def fuerza_bruta(N, aristas, O, destinos):
    dist_G = distancias(N, aristas, O)        # Dijkstra con todos los enlaces
    if any(dist_G[d] == INF for d in destinos):
        return "no hay solucion."

    mejor = INF
    for mask in range(1 << len(aristas)):     # 2^M subconjuntos
        activas = [aristas[i] for i in range(len(aristas)) if mask >> i & 1]
        dist_S = distancias(N, activas, O)
        if all(dist_S[d] == dist_G[d] for d in destinos):
            mejor = min(mejor, sum(c for _, _, c in activas))
    return mejor
```

- `distancias(N, aristas, O)` es un Dijkstra estándar que devuelve un [[grimorio/data-structures/array|arreglo]] con la distancia mínima desde `O` a cada nodo (`INF` si no se alcanza).

---
## Traza de ejemplo

Usamos la instancia de [[multicast]]: origen `1` y destinos `{3, 4, 6}`.

| Bit | Enlace | Costo |
| --- | ------ | ----- |
| e0  | 1-2    | 7     |
| e1  | 2-3    | 1     |
| e2  | 1-3    | 6     |
| e3  | 2-4    | 1     |
| e4  | 2-6    | 1     |
- Paso 1: con todos los enlaces, `dist_G[3] = 6`, `dist_G[4] = 8`, `dist_G[6] = 8`.
- Paso 2: recorremos las 32 máscaras. Algunas representativas:

| Enlaces activos    | dist a 3, 4, 6 | ¿Válido? | Costo | Motivo                            |
| ------------------ | -------------- | -------- | ----- | --------------------------------- |
| e2, e3, e4         | 6, ∞, ∞        | No       | 8     | 4 y 6 quedan aislados             |
| e0, e3, e4         | ∞, 8, 8        | No       | 9     | no llega a 3                      |
| e0, e1, e3, e4     | 8, 8, 8        | No       | 10    | llega a 3, pero por 1→2→3 (8 > 6) |
| e0, e2, e3, e4     | 6, 8, 8        | Sí       | 15    | 4 y 6 vía 1→2 directo             |
| **e1, e2, e3, e4** | **6, 8, 8**    | **Sí**   | **9** | **4 y 6 vía 1→3→2**               |
| todos              | 6, 8, 8        | Sí       | 16    | sobra un enlace                   |

De las 32 máscaras, solo 3 son válidas. La mínima cuesta **9**: el mensaje viaja junto por 1→3→2 y recién ahí se separa hacia 4 y 6. La fila `e0, e3, e4` muestra por qué no basta con mirar el costo: también suma 9, pero no es una solución.

---
## Complejidad
### Temporal

$O(2^M \cdot (N + M)\log N)$

- Hay $2^M$ subconjuntos.
- Para cada uno, armar la lista de enlaces activos cuesta $O(M)$ y correr Dijkstra cuesta $O((N + M)\log N)$.
- El Dijkstra inicial con todos los enlaces se hace una sola vez y no cambia el orden.

Con $M = 30$ ya son más de mil millones de subconjuntos: solo es viable para $M \lesssim 20$.
### Espacial

$O(N + M)$: la lista de enlaces activos, la lista de adyacencia y los arreglos de distancias de un solo subconjunto a la vez.

---
## Cuándo usar esta técnica
### Favorable cuando

- La red es muy chica (pocas decenas de enlaces).
- Necesitamos una respuesta garantizada óptima para validar otra solución. Sirve como oráculo para testear la solución con Dijkstra en grafos aleatorios chicos.
- Hay empates entre caminos mínimos: la fuerza bruta siempre elige la combinación más barata.
### Limitaciones

- Crece como $2^M$. Con las restricciones del enunciado ($M \le 10000$) es inutilizable.
- Repite trabajo: corre un Dijkstra completo por cada subconjunto, aunque dos subconjuntos difieran en un solo enlace.

---
## Comparación con la solución greedy

|                                     | Fuerza Bruta         | Greedy           |
| ----------------------------------- | -------------------- | ---------------- |
| Tiempo                              | $O(2^M (N+M)\log N)$ | $O((N+M)\log N)$ |
| Espacio                             | $O(N+M)$             | $O(N+M)$         |
| ¿Óptima con caminos mínimos únicos? | Sí                   | Sí               |
| ¿Óptima con empates?                | Sí                   | No siempre       |
| Escala a $M = 10000$                | No                   | Sí               |

La solución greedy la supera en cualquier entrada realista. La fuerza bruta solo gana cuando hay varios caminos mínimos empatados y conviene elegir los que comparten más tramos.

---
## Referencias

- [[https://www.oia.unsam.edu.ar/_media/prob/c3a02n3p3.pdf|Enunciado original: OIA 2002, Nivel 3, Problema 3]]
- Cormen, Leiserson, Rivest y Stein. _Introduction to Algorithms_, capítulo de caminos mínimos de fuente única (Dijkstra).
