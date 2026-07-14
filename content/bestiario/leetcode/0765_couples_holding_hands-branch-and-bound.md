---
title: Leetcode0765 - Couples Holding Hands - Branch and Bound
tags:
  - b/leetcode
---
## Técnicas utilizadas

Búsqueda por **branch and bound** sobre el espacio de intercambios, guiada por una **cota inferior** sobre la cantidad de swaps restantes: en cada estado se calcula cuántas parejas están mal ubicadas y se estima el mínimo de intercambios necesarios para resolverlas, descartando por completo cualquier rama cuya cota ya no pueda mejorar la mejor solución conocida.

> A diferencia de una búsqueda ciega por niveles, la cota permite decidir *antes* de expandir un estado si vale la pena explorarlo, eliminando subárboles enteros sin generarlos.

## Idea de la solución

El algoritmo mantiene una cola de prioridad (*best-first search*) ordenada por la cota estimada de cada estado. En cada iteración se extrae el estado más prometedor (menor cota) y:

1. Si su cota ya es mayor o igual que la mejor solución conocida (`upper`), se descarta sin explorarlo: esto elimina de una vez todo lo que quedaba pendiente de esa rama.
2. Si el estado es válido, se actualiza `upper` con la cantidad de swaps usados.
3. En caso contrario, se generan sus sucesores probando todos los intercambios posibles, y cada uno se encola solo si su cota es estrictamente menor que `upper`.

La cota inferior se calcula como:

$$
\text{cota}(actual) = swaps + \left[\frac{\text{malas\_parejas}(actual)}{2} \right]
$$

donde `malas_parejas` es la cantidad de bancos donde las dos personas sentadas no son pareja.

Esta cota es válida porque cada intercambio puede corregir como máximo **dos bancos a la vez** (esto ocurre cuando los dos bancos involucrados se completan mutuamente en un único swap), por lo que nunca hacen falta menos de `malas_parejas/2` intercambios, y la cota nunca sobreestima los swaps que faltan.

Para acotar el árbol desde el arranque, se inicializa `upper` con el resultado de una solución conocida, lo que permite empezar a podar desde el primer nivel en lugar de descubrir la cota recién al final de la búsqueda. En este problema, se puede utilizar [[0765_couples_holding_hands-greedy|greedy]] para inicializar `upper`, sin embargo, proporciona directamente la solución óptima haciendo que Branch and Bound deje de aportar una ventaja práctica.

## Código

```python
import heapq # Para utilizar la cola de prioridad

def pareja(x):
    return x + 1 if x % 2 == 0 else x - 1

def malas_parejas(row):
    count = 0
    for i in range(0, len(row), 2):
        if pareja(row[i]) != row[i + 1]:
            count += 1
    return count

def es_valido(row):
    return malas_parejas(row) == 0

def cota_inferior(row, swaps):
    return swaps + (malas_parejas(row) + 1) // 2

def branch_and_bound(row, upper=None):
    if upper is None:
        upper = len(row)  # cota trivial de arranque

    visitados = {tuple(row)}
    heap = []
    contador = 0
    heapq.heappush(heap, (cota_inferior(row, 0), contador, row[:], 0))

    while heap:
        cota, _, actual, swaps = heapq.heappop(heap)

        # se descarta el subárbol completo: ya no puede mejorar la mejor solución
        if cota >= upper:
            continue

        if es_valido(actual):
            upper = min(upper, swaps)
            continue

        for i in range(len(actual)):
            for j in range(i + 1, len(actual)):
                nuevo = actual[:]
                nuevo[i], nuevo[j] = nuevo[j], nuevo[i]
                estado = tuple(nuevo)

                if estado not in visitados:
                    visitados.add(estado)
                    nueva_cota = cota_inferior(nuevo, swaps + 1)

                    if nueva_cota < upper:
                        contador += 1
                        heapq.heappush(heap, (nueva_cota, contador, nuevo, swaps + 1))

    return upper
```

## Traza de ejemplo

Con el vector: `row = [0, 2, 1, 3]`

Las parejas son $(0, 1)$ y $(2, 3)$. Como `malas_parejas(row) = 2`, la cota inicial es:

$cota = 0 + [2/2] = 1$

Suponiendo que se arranca con `upper = 2` (por ejemplo, de una cota trivial):

| Estado extraído | Swaps | malas_parejas | Cota | ¿Válido? | Acción |
|---|---:|---:|---:|---|---|
| `[0,2,1,3]` | 0 | 2 | 1 | NO | Se expande (cota=1 < upper=2). De sus 6 sucesores posibles, solo 2 tienen cota estrictamente menor que `upper=2` y se encolan: `[3,2,1,0]` y `[0,1,2,3]` (ambos con cota=1). Los otros 4 sucesores tienen cota=2 y ni siquiera llegan a encolarse. |
| `[3,2,1,0]` | 1 | 0 | 1 | SÍ | `upper` se actualiza a 1 |
| `[0,1,2,3]` | 1 | 0 | 1 | SÍ | No llega a comprobarse: se descarta antes, porque cota=1 ≥ upper=1 (ya actualizado por el estado anterior) |

Había **dos** sucesores empatados en la mejor cota (1), ambos soluciones válidas con un solo swap. El orden de desempate en la cola hizo que se procesara primero `[3,2,1,0]`, fijando `upper=1`, por lo que el segundo quedó podado sin necesidad de evaluarlo.

Resultado: `1`

## Complejidad

### Temporal

Sea `m = 2n` la longitud del arreglo. En el peor caso (cuando la cota inferior no logra distinguir tempranamente las ramas subóptimas) el algoritmo puede llegar a explorar un número de estados del mismo orden que la fuerza bruta, ya que la cota basada en `malas_parejas` no siempre es ajustada. Por lo tanto, la cota superior teórica sigue siendo $O(m! \cdot m^2)$.

Sin embargo, en la práctica la poda por cota inferior elimina subárboles completos apenas se calculan (sin necesidad de generarlos), lo que reduce drásticamente el trabajo respecto a la fuerza bruta.

### Espacial

La cola de prioridad y el [conjunto](../../grimorio/data-structures/set) de visitados pueden almacenar en el peor caso hasta `m!` estados, cada uno de longitud `m`. Por lo tanto, una cota superior para la complejidad espacial es $O(m! \cdot m)$.

## Cuándo usar esta técnica

### Favorable cuando

- Se necesita garantizar la solución óptima, pero existe una cota inferior fácil de calcular que permita descartar ramas completas antes de expandirlas.
- El problema puede formularse como un árbol de decisiones y se dispone de una solución inicial razonable (por ejemplo, de un algoritmo greedy) para arrancar con un `upper` ajustado.
- El tamaño de entrada es pequeño o mediano, y la cota inferior es suficientemente informativa como para podar la mayor parte del árbol.

### Limitaciones

- Su peor caso sigue siendo factorial: si la cota inferior es débil (poco ajustada), la poda pierde efectividad y el algoritmo se acerca al comportamiento de la fuerza bruta.
- Requiere diseñar una función de cota válida (que nunca sobreestime) y, en lo posible, ajustada.
- Para este problema concreto, sigue siendo mejor utilizar [[0765_couples_holding_hands-greedy|greedy]], que evita explorar combinaciones y resuelve el problema en tiempo lineal.

## Comparación con las otras soluciones

Frente a [[0765_couples_holding_hands-fuerza-bruta|fuerza bruta]], branch and bound explora el mismo espacio de estados, pero en lugar de expandir exhaustivamente el árbol, usa una cota inferior para descartar subárboles completos sin generarlos, y explora primero los estados más prometedores mediante *best-first search*. Ambas técnicas conservan el mismo peor caso factorial, pero B&B reduce el trabajo redundante en la práctica.

Frente a [[0765_couples_holding_hands-greedy|greedy]], la diferencia es más fuerte: greedy no necesita explorar ramas alternativas ni mantener cotas, porque corrige cada banco con una decisión local segura y obtiene el óptimo en una sola pasada, sin necesidad de garantizar optimalidad mediante búsqueda.

## Referencias

- Estructura de datos: [[set]]
- Técnica de búsqueda: [Branch & Bound](https://www.geeksforgeeks.org/branch-and-bound-algorithm/)
