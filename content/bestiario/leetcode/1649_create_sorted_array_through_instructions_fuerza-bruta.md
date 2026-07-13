---
title: '1649 - Create Sorted Array through Instructions - Fuerza Bruta'
tags:
  - 'leetcode'
  - 'brute force'
  - 'bisect'
  - 'fuerza bruta'
---

## Técnicas utilizadas

**Fuerza bruta con simulación directa:** se mantiene una lista ordenada `nums` y, por cada nuevo elemento, se usan búsquedas binarias para contar cuántos valores son estrictamente menores y cuántos son estrictamente mayores. El mínimo de ambos conteos se acumula como costo.

## Idea de la solución

Para cada elemento `v = instructions[i]`, necesitamos dos cantidades:
- `less`: cuántos elementos ya en `nums` son `< v`
- `greater`: cuántos elementos ya en `nums` son `> v`

Como `nums` siempre está ordenado, podemos usar `bisect` para obtener ambas cantidades en $O(\log n)$. Sin embargo, `bisect.insort` tiene un cuello de botella: aunque encuentra la posición de inserción en $O(\log n)$, el desplazamiento de todos los elementos posteriores en memoria para hacer lugar cuesta $O(n)$. Ese desplazamiento es el que domina la complejidad total.

```python
# Ejemplo ilustrativo del uso de bisect:

import bisect

nums = [1, 3, 4, 7]

posLeft = bisect.bisect_left(nums, 5)
print(posLeft)   # 3 → hay 3 elementos menores que 5

posRight = bisect.bisect_right(nums, 3)
print(posRight)  # 2 → se insertaría después del 3

print(len(nums) - posRight)  # 2 → hay dos elementos mayores que 3 (4 y 7)

bisect.insort(nums, 5)
print(nums)  # [1, 3, 4, 5, 7]
```

## Código

```python
import bisect

def createSortedArray(instructions):
    MOD = 10**9 + 7
    nums = []
    cost = 0

    for v in instructions:
        less    = bisect.bisect_left(nums, v)               # cantidad de elementos < v
        greater = len(nums) - bisect.bisect_right(nums, v)  # cantidad de elementos > v
        cost = (cost + min(less, greater)) % MOD
        bisect.insort(nums, v)  # inserta v manteniendo el orden

    return cost
```

> `bisect_left(nums, v)` devuelve el primer índice donde insertar `v` manteniendo el orden, que coincide con la cantidad de elementos estrictamente menores. `bisect_right(nums, v)` devuelve el índice posterior al último `v`, por lo que `len(nums) - bisect_right(nums, v)` da los estrictamente mayores.

## Traza de ejemplo

Para `instructions = [1, 5, 6, 2]`:

| Paso | v | nums (antes)   | `bisect_left` | `bisect_right` | less | greater | min | cost |
|------|---|----------------|---------------|----------------|------|---------|-----|------|
| 1    | 1 | []             | 0             | 0              | 0    | 0       | 0   | 0    |
| 2    | 5 | [1]            | 1             | 1              | 1    | 0       | 0   | 0    |
| 3    | 6 | [1, 5]         | 2             | 2              | 2    | 0       | 0   | 0    |
| 4    | 2 | [1, 5, 6]      | 1             | 1              | 1    | 2       | 1   | 1    |

En el paso 4: `bisect_left([1,5,6], 2) = 1` (hay un elemento menor: el 1). `bisect_right([1,5,6], 2) = 1`, entonces `greater = 3 - 1 = 2`. `min(1, 2) = 1`.

**Resultado: 1** ✓

## Complejidad

### Temporal

$O(n^2)$ en el peor caso.

- El bucle principal itera $n$ veces.
- `bisect_left` y `bisect_right` son $O(\log n)$ cada uno.
- `bisect.insort` hace la búsqueda en $O(\log n)$ pero el **desplazamiento** de elementos en la lista para insertar cuesta $O(n)$.
- En total: $n \times O(n) = O(n^2)$.

Con $n = 10^5$, cada inserción puede desplazar hasta $10^5$ elementos, y hay $10^5$ inserciones: $10^5 \times 10^5 = 10^{10}$ operaciones en el peor caso → excede el límite de tiempo de LeetCode (TLE), aunque en la práctica Python puede pasarlo al borde por las optimizaciones internas de `bisect`.

### Espacial

$O(n)$ para almacenar `nums`.

## Cuándo usar esta técnica

### Favorable cuando

- $n$ es pequeño (hasta $\sim 10^3$ elementos).
- Se necesita una solución rápida para verificar y comparar contra otras implementaciones.
- La claridad del código importa más que la eficiencia.

### Limitaciones

- No escala bien con las restricciones del problema ($n \leq 10^5$): roza el límite de tiempo de LeetCode.
- El cuello de botella no está en el conteo, que se resuelve en $O(\log n)$ usando `bisect`, sino en el desplazamiento de memoria al insertar en una lista de Python.
- No hay forma de mejorar el algoritmo en su forma actual sin cambiar la estructura de datos subyacente.

### Comparación con División y Conquista

La solución de **Merge Sort modificado** obtiene el mismo resultado en $O(n \log n)$ reformulando el problema como conteo durante una fusión ordenada. No mantiene `nums` explícitamente ni requiere inserciones en listas, ya que opera sobre índices. Es más difícil de entender, pero escala correctamente con las restricciones del problema.

## Referencias

- Documentación de Python: [`bisect`](https://docs.python.org/3/library/bisect.html)
