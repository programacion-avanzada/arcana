---
title: LeetCode0818 - Race Car - BFS con Fuerza Bruta (no tan naive)
tags:
  - leetcode
  - solucion
---
## Técnicas utilizadas
Búsqueda en Anchura BFS: Exploración nivel por nivel con una [[queue]], para encontrar la ruta más corta en un espacio de estados.

## Idea de la solución
El problema se modela como un grafo dirigido donde cada nodo es un estado definido por `(posición, velocidad)` y las aristas son las decisiones `A` o `R`. Como se busca la secuencia mínima de instrucciones, aplicar BFS garantiza que la primera vez que la posición actual coincida con el `target`, se encontró la solución óptima.

Para que la búsqueda por fuerza bruta sea (masomenos) viable, se aplican dos optimizaciones:

- **Memorización de estados visitados:** Se descartan los estados `(posición, velocidad)` que ya fueron procesados, guardados en un [[set]].
- **Poda direccional:** Solo se aplica la reversa (`R`) si el próximo movimiento `A` nos pasa de largo del objetivo. Es decir, si nos adelantamos `target` yendo hacia adelante (velocidad positiva), o si nos alejamos más yendo hacia atrás (velocidad negativa).
- **Poda exceso:** En el caso de que la posición exceda o iguale el doble del target $(pos >= 2*Target)$ , se sabe que no va a ser una solución óptima, entonces lo cortamos.
- **Poda negativa:** También se comprobó que en una solución óptima, la posición jamás será negativa. Sabiendo esto se agrega un chequeo de $pos >= 0$ como condición de poda.

## Código

```python
from collections import deque
def racecar(target):
    cola = deque([(0, 0, 1)])
    visitados = set()
    while cola:
        ops, pos, speed = cola.popleft()
        if pos == target:
            return ops
        estado = (pos, speed)
        if estado in visitados:
            continue
        visitados.add(estado)
        new_pos = pos + speed
        if new_pos >= 0 and new_pos < target * 2:
            cola.append((ops + 1, new_pos, speed * 2))
        if (pos + speed > target and speed > 0) or (pos + speed < target and speed < 0):
            new_speed = -1 if speed > 0 else 1
            if pos >= 0 and pos < target * 2:
                cola.append((ops + 1, pos, new_speed))
    return 0
```

## Traza de ejemplo

Buscamos el objetivo `target = 3`.

| [[queue]] (`ops`, `pos`, `speed`) | Estado actual sacado | &nbsp;&nbsp;¿Es `target`?&nbsp;&nbsp; | Acción evaluada | ¿Pasa el filtro/poda? | Nuevos elementos a la [[queue]] |
|---|---|---|---|---|---|
| [(0, 0, 1)] | (0, 0, 1) | No (0 != 3) | `A` | Sí | (1, 1, 2) |
| | | | `R` | No (pos+speed no supera 3) | - |
| [(1, 1, 2)] | (1, 1, 2) | No (1 != 3) | `A` | Sí | (2, 3, 4) |
| | | | `R` | No (pos+speed no supera 3) | - |
| [(2, 3, 4)] | (2, 3, 4) | Sí (3 == 3) | - | - | - |

Resultado final: 2 operaciones (secuencia: `AA`).

## Complejidad

### Temporal
La complejidad es $O(T\log{T})$, esto es debido a que, con las condiciones de poda tenemos un espacio de $[0, 2T]$ de busqueda, es decir T, y sabemos que `speed` se mueve logaritmicamente $(\log_2)$ positiva y negativamente $(2 \times \log_2{T})$. Dejando una cantidad de estados *unicos* de $O(T\log{T})$

### Espacial
$O(T\log{T})$ también, ya que sabemos que habrá $T\log{T}$ estados nuevos en el peor caso. Esos estados se almacenarán en un [[set]] de visitados.

## Cuándo usar esta técnica

### Favorable cuando
- El valor del `target` es pequeño (no colapsa la memoria).

### Limitaciones
- No escala bien a `targets` altos ya que explora todas las opciones (con ligeras optimizaciones).
- Realiza cuentas innecesarias como seguir acelerando a pesar de ya haberse pasado de largo por amplia distancia.

## Comparación con Programación Dinámica
La solución con [[0818_race_car-programacion-dinamica]] es más ligera en espacio ($O(T)$ frente a $O(T\log{T})$ de BFS) y también en tiempo (en promedio), aunque en el peor caso sean iguales. DP analiza la distancia basándose en secuencias completas de aceleraciones antes de revertir, reduciendo el problema a subproblemas de menor escala y reduciendo el uso de memoria y procesamiento, en promedio, a costo de ser bastante más compleja a la comprensión.

## Referencias
- [Explicación de posición negativa](https://stackoverflow.com/questions/76770058/proof-of-dynamic-programming-solution-for-leetcode-818-racecar)
