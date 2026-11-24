---
title: 'OIA 2013 N3P3 - Cambio de mano de una calle - Programación Dinámica'
tags:
  - oia
  - solucion
---

Solución optimizada para [[Cambio de mano de una calle (OIA 2013, Nivel 3, Problema 3)]].

## Técnicas utilizadas
- **Programación dinámica (tabulación):** se resuelven y guardan en dos [[array|tablas]] ($d_S$ y $d_T$) los subproblemas de camino mínimo desde $S$ y hacia $T$, para reutilizarlos sin recalcular y evaluar cada calle invertida en $O(1)$.
- **Algoritmo de Dijkstra:** aporta el orden de evaluación por distancia creciente para llenar las tablas de PD aun en presencia de ciclos (válido porque todos los pesos son positivos).
- **Grafo dirigido y ponderado:** representado con listas de adyacencia.
- **Grafo transpuesto ($G^T$):** el mismo grafo con todas las calles invertidas, que permite calcular distancias *hacia* $T$ saliendo desde $T$.

## Idea de la solución
Probar cada calle invertida y rehacer Dijkstra desde cero cuesta demasiado (esa es la solución de [[Cambio de mano de una calle - Fuerza bruta]], que repite los mismos subproblemas $C$ veces). La clave es que cualquier camino mejorado **tiene que usar la calle invertida**, así que tiene la forma:

$$S \rightsquigarrow v \to u \rightsquigarrow T$$

donde la calle original era $u \to v$ con costo $w$. Para no recalcular esos tramos, definimos dos **tablas de programación dinámica**:

1. **$d_S(y)$:** distancia mínima desde $S$ hasta $y$ en $G$.
   $$d_S(S) = 0, \qquad d_S(y) = \min_{(x \to y) \in G} \big(d_S(x) + w(x, y)\big)$$
2. **$d_T(x)$:** distancia mínima desde $x$ hasta $T$ en $G$ (equivalente a salir desde $T$ en $G^T$).
   $$d_T(T) = 0, \qquad d_T(x) = \min_{(x \to y) \in G} \big(w(x, y) + d_T(y)\big)$$

- **Subestructura óptima y subproblemas solapados:** en el ejemplo de la consigna, $d_T(7) = 0$ (caso base) y $d_T(8) = 6$. Al calcular $d_T(6) = \min(1 + d_T(8),\, 8 + d_T(7)) = 7$, se reutiliza $d_T(8)$ sin recalcular $8 \to 7$; luego ese mismo resultado se reutiliza para $d_T(1) = 14$, $d_T(3) = 17$ y $d_T(2) = 19$.
- **Por qué el orden lo da Dijkstra:** como el grafo tiene ciclos (por ejemplo, $6 \to 8 \to 4 \to 1 \to 6$), una recursión con memoización directa se trabaría en un ciclo. Al ser todos los pesos positivos, Dijkstra procesa los nodos de menor a mayor distancia y garantiza que al extraer un nodo del heap su valor en la tabla ya es definitivo.
- **Combinación en $O(1)$ por calle:** con ambas tablas llenas, invertir la calle $i$ ($u_i \to v_i$) se evalúa en $O(1)$ reutilizando los dos subproblemas:
  $$\text{candidato}(i) = d_S(v_i) + w_i + d_T(u_i)$$
  Aunque $d_S(v_i)$ o $d_T(u_i)$ usen la arista original $u_i \to v_i$ guardada en la tabla, eso formaría un ciclo de peso positivo y nunca resultaría menor que el camino original, por lo que no genera falsas mejoras.

En el ejemplo de la consigna (partida en 2, escuela en 7), para la calle 6 (`7 5 3`) cada término es:

- **$d_S(5) = 8$** $\to$ distancia mínima desde el inicio (2) hasta la esquina 5.
- **$w = 3$** $\to$ costo de la calle invertida, que iba de 7 a 5 originalmente y ahora va de 5 a 7.
- **$d_T(7) = 0$** $\to$ ya estamos en la escuela (caso base).

Así que la distancia resultante es $8 + 3 + 0 = 11$, como en la consigna original.

## Código (Python)
```python
import heapq, sys

INF = float('inf')

# Calcula las distancias mínimas desde origen hacia todas las esquinas (Dijkstra)
def dijkstra(n, adj, origen):
    dist = [INF] * (n + 1)
    dist[origen] = 0
    pq = [(0, origen)]                  # cola de prioridad (min-heap): (distancia, esquina)
    while pq:
        d, x = heapq.heappop(pq)
        if d > dist[x]:                 # ignorar entradas viejas que ya fueron mejoradas
            continue
        for y, w in adj[x]:             # relajar las aristas salientes de x
            if d + w < dist[y]:
                dist[y] = d + w
                heapq.heappush(pq, (dist[y], y))
    return dist

def resolver(n, s, t, calles):
    # 1. Construir el grafo original G y el transpuesto GT (todas las calles invertidas)
    G = [[] for _ in range(n + 1)]
    GT = [[] for _ in range(n + 1)]
    for u, v, w in calles:
        G[u].append((v, w))             # arista original: u -> v
        GT[v].append((u, w))            # arista invertida: v -> u

    # 2. Llenar las tablas de PD con distancias desde S (en G) y hacia T (desde T en GT)
    dS = dijkstra(n, G, s)
    dT = dijkstra(n, GT, t)

    # 3. Combinar ambas tablas de PD en O(1) para evaluar cada calle invertida
    d0 = dS[t]
    mejor, calle = d0, -1
    for i, (u, v, w) in enumerate(calles, 1):
        costo = dS[v] + w + dT[u]       # S ~> v -> u ~> T
        if costo < mejor:
            mejor, calle = costo, i

    # 4. Armar la salida según haya mejora o no
    if calle == -1:
        return [d0, "NO ES POSIBLE MEJORAR"]
    return [d0, mejor, calle]

# Lee la entrada (E, S, T, C y las C calles), ejecuta resolver e imprime cada línea de salida
def main():
    data = sys.stdin.read().split()
    n, s, t, c = int(data[0]), int(data[1]), int(data[2]), int(data[3])
    calles = [(int(data[4 + 3*i]), int(data[5 + 3*i]), int(data[6 + 3*i]))
              for i in range(c)]        # agrupa cada terna (salida, llegada, distancia)
    print("\n".join(map(str, resolver(n, s, t, calles))))

main()
```

> Lee de la entrada estándar para no depender del nombre del archivo (`cambio.in` / `invertir.in`). Se asume que $T$ es alcanzable desde $S$ originalmente (como garantiza la consigna) y se reutiliza Dijkstra sin poda temprana en `t`, ya que se necesitan llenar las tablas para todas las esquinas.

## Traza de ejemplo
Teniendo en cuenta los siguientes parámetros de entrada: 
- $E = 9$
- $S = 1$
- $T = 9$
- Las 16 calles del ejemplo que se detallarán más adelante.

Acá se visualiza cómo ingresan los datos en el programa:
```
9 1 9
16
5 6 8
7 3 1
4 1 6
3 2 11
4 7 5
8 3 10
1 6 8
6 2 3
7 9 7
8 4 5
3 9 6
9 5 11
2 4 6
9 4 7
5 8 6
7 6 2
```

Pero, en el formato de tabla, se puede entender mejor cómo se conectan los datos brindados:

| Calle | $u \to v$ | $w$ |
|---|---|---|
| 1 | 5 → 6 | 8 |
| 2 | 7 → 3 | 1 |
| 3 | 4 → 1 | 6 |
| 4 | 3 → 2 | 11 |
| 5 | 4 → 7 | 5 |
| 6 | 8 → 3 | 10 |
| 7 | 1 → 6 | 8 |
| 8 | 6 → 2 | 3 |
| 9 | 7 → 9 | 7 |
| 10 | 8 → 4 | 5 |
| 11 | 3 → 9 | 6 |
| 12 | 9 → 5 | 11 |
| 13 | 2 → 4 | 6 |
| 14 | 9 → 4 | 7 |
| 15 | 5 → 8 | 6 |
| 16 | 7 → 6 | 2 |

**Dijkstra desde $S = 1$ en $G$.** Orden en que se fijan las esquinas: 
- 1: 0
- 6: 8
- 2: 11
- 4: 17
- 7: 22
- 3: 23
- 9: 29
- 5: 40
- 8: 46

**Dijkstra desde $T = 9$ en $G^T$.** En este caso, los resultados se ven de esta manera: 
- 9: 0
- 3: 6
- 7: 7
- 4: 12
- 8: 16
- 2: 18
- 6: 21
- 5: 22
- 1: 29

| Esquina / Función | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| $d_S(x)$ | 0 | 11 | 23 | 17 | 40 | 8 | 22 | 46 | 29 |
| $d_T(x)$ | 29 | 18 | 6 | 12 | 22 | 21 | 7 | 16 | 0 |

La distancia mínima original, desde la esquina de partida hasta la escuela es $D_0 = d_S(9) = 29$.

**Evaluación de cada calle**
El costo de usar cada calle invertida es el siguiente, que ya analizamos anteriormente:

$$d_S(v) + w + d_T(u)$$

| Calle | $u \to v$ | $d_S(v)$ | $w$ | $d_T(u)$ | Costo |
|---|---|---|---|---|---|
| 1 | 5 → 6 | 8 | 8 | 22 | 38 |
| 2 | 7 → 3 | 23 | 1 | 7 | 31 |
| 3 | 4 → 1 | 0 | 6 | 12 | 18 |
| 4 | 3 → 2 | 11 | 11 | 6 | 28 |
| 5 | 4 → 7 | 22 | 5 | 12 | 39 |
| 6 | 8 → 3 | 23 | 10 | 16 | 49 |
| 7 | 1 → 6 | 8 | 8 | 29 | 45 |
| 8 | 6 → 2 | 11 | 3 | 21 | 35 |
| 9 | 7 → 9 | 29 | 7 | 7 | 43 |
| 10 | 8 → 4 | 17 | 5 | 16 | 38 |
| 11 | 3 → 9 | 29 | 6 | 6 | 41 |
| 12 | 9 → 5 | 40 | 11 | 0 | 51 |
| 13 | 2 → 4 | 17 | 6 | 18 | 41 |
| 14 | 9 → 4 | 17 | 7 | 0 | 24 |
| 15 | 5 → 8 | 46 | 6 | 22 | 74 |
| **16** | **7 → 6** | **8** | **2** | **7** | **17** |

El mínimo es **17**, en la calle **16**, y es menor que $D_0 = 29$. La salida es:

```
29
17
16
```

El camino resultante es $1 \to 6 \to 7 \to 9$. La calle 3 queda segunda con costo 18 _(camino $1 \to 4 \to 7 \to 9$)._

## Complejidad

### Temporal
- Para leer la entrada y construir ambos grafos, tanto $G$ como $G^T$: **$O(E + C)$**, porque cada calle se agrega una sola vez a la lista de adyacencia de $G$ y una sola vez a la de $G^T$.
- El algoritmo de Dijkstra utiliza la cola de prioridad, ejecutado dos veces, para tener en cuenta los tramos con los caminos normales e invertidos _(desde $S$ en $G$ y desde $T$ en $G^T$)_: **$O((E + C) \log E)$**, esta complejidad se corresponde a cada una.
- Recorrer las $C$ calles evaluando $d_S(v_i) + w_i + d_T(u_i)$: $O(C)$, ya que cada evaluación es una suma de valores precalculados, es decir, **$O(1)$** por calle.

Sumando los tres pasos, tanto $O(E + C)$ como $O(C)$ quedan dominados por la complejidad de Dijkstra. **Total: $O((E + C) \log E)$.**

### Espacial
$O(E + C)$:
- Las listas de adyacencia de $G$ y $G^T$ guardan $C$ aristas cada una.
- La lista de entrada `calles` tiene tamaño $C$.
- Las tablas $d_S$ y $d_T$ tienen tamaño $E + 1$.
- La cola de prioridad guarda, como máximo, una entrada por cada arista relajada, es decir, $O(C)$.

## Cuándo usar esta técnica
- En el momento que hay que evaluar **muchas modificaciones de una sola arista** y comparar el camino mínimo que resulta de cada una.
- Cuando las distancias son **no negativas**, para poder usar Dijkstra.
- Cuando el grafo es **grande**, donde una matriz de adyacencia no entra en memoria y conviene optar por usar listas de adyacencia.

### Limitaciones (cuándo NO usarla)
- Si hay pesos negativos _(habría que usar otro algoritmo que los acepte, como Bellman-Ford)_.
- Cuando el grafo no tiene pesos _(la idea del grafo transpuesto sigue sirviendo, pero no hace falta Dijkstra: alcanza con BFS)_.
- En el caso que se permita modificar **más de una arista a la vez**, porque los tramos dejan de ser independientes entre sí.

### Comparación con Fuerza bruta
Respecto a [[Cambio de mano de una calle - Fuerza bruta]]:

| Aspecto | Fuerza bruta | Esta solución (PD + grafo transpuesto) |
|---|---|---|
| **Ejecuciones de Dijkstra** | $C + 1$ (una por cada calle invertida) | **2** (desde $S$ a todos en $G$, y desde $T$ a todos en $G^T$) |
| **Evaluar cada calle** | $O((E + C) \log E)$ | **$O(1)$** (reutilizando `dS` y `dT`) |
| **Tiempo total** | $O(C \cdot (E + C) \log E)$ | **$O((E + C) \log E)$** |
| **Memoria** | $O(E + C)$ (un solo grafo) | $O(E + C)$ (duplica el grafo: $G$ y $G^T$) |

- **Cuándo conviene Fuerza bruta:** solo en instancias muy chicas, donde el tiempo no es un problema y se prioriza la implementación más directa.
- **Cuándo conviene esta solución:** sirve para cualquier tamaño de entrada y es la única viable cuando el grafo crece (como en los límites del enunciado, $E \le 80\,000$ y $C \le 250\,000$), porque evita multiplicar Dijkstra por $C$.

## Referencias
- [[Cambio de mano de una calle (OIA 2013, Nivel 3, Problema 3)]]
- [[Cambio de mano de una calle - Fuerza bruta]]
- [Problema original, Certamen Nacional OIA 2013](https://www.oia.unsam.edu.ar/_media/prob/c3a13n3p3.pdf)
