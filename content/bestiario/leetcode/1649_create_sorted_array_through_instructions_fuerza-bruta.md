---
title: '1649 - Create Sorted Array through Instructions - Fuerza Bruta'
tags: 
  - 'leetcode'
  - 'brute force'
  - 'bisect'
  - 'fuerza bruta'
---

## Técnicas utilizadas

**Fuerza bruta con simulación directa:** se mantiene una lista ordenada `nums` y, por cada nuevo elemento, se recorre para contar cuántos valores son estrictamente menores y cuántos son estrictamente mayores. El mínimo de ambos conteos se acumula como costo.

## Idea de la solución

Para cada elemento `v = instructions[i]`, necesitamos dos cantidades:
- `less`: cuántos elementos ya en `nums` son `< v`
- `greater`: cuántos elementos ya en `nums` son `> v`

La forma más directa es recorrer `nums` elemento por elemento y contarlos. Luego se inserta `v` en su posición correcta (para mantener el orden y facilitar las búsquedas).

Como `nums` siempre está ordenado, podemos usar `bisect` para encontrar la posición de inserción en $O(\log n)$, facilitando el conteo de menores y mayores que también se resuelve en $O(\log n)$ usando `bisect_left` y `bisect_right`.
Sin embargo, `bisect.insort` tiene un cuello de botella: aunque encuentra la posición en $O(\log n)$, el desplazamiento de elementos en memoria para hacer lugar a la inserción cuesta $O(n)$.

```python
# Código de ejemplo para ilustrar el uso de bisect:

import bisect

nums = [1, 3, 4, 7]

# Buscar dónde insertar el 5
posLeft = bisect.bisect_left(nums, 5)
print(posLeft)  # 3 → se insertaría antes del 7 (esto también significa que hay 3 elementos menores que 5)

# Buscar dónde insertar el 3
posRight = bisect.bisect_right(nums, 3)
print(posRight)  # 2 → se insertaría después del 3, antes del 4

print(len(nums) - posRight)  # 2 → hay dos elementos mayores que 3 (4 y 7)

bisect.insort(nums, 5)  # Inserta el 5 en la posición correcta
print(nums)  # [1, 3, 4, 5, 7]
```

## Código

```python
# Código de fuerza bruta para el problema:

import bisect

def createSortedArray(instructions):
    MOD = 10**9 + 7
    nums = []
    cost = 0

    for v in instructions:
        less    = bisect.bisect_left(nums, v)        # índice = cantidad de elementos < v
        greater = len(nums) - bisect.bisect_right(nums, v)  # elementos > v
        cost = (cost + min(less, greater)) % MOD
        bisect.insort(nums, v) # inserta v en nums manteniendo el orden

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

`O(n²)` en el peor caso.

- El bucle principal itera `n` veces.
- `bisect_left` y `bisect_right` son $O(\log n)$ cada uno.
- `bisect.insort` hace la búsqueda en $O(\log n)$ pero el **desplazamiento** de elementos en la lista para insertar cuesta $O(n)$.
- En total: $n × O(n) = O(n²)$.

Con $n = 10⁵$, esto implica del orden de $10¹⁰$ operaciones en el peor caso → al borde del límite de tiempo de LeetCode (TLE).

### Espacial

$O(n)$ para almacenar `nums`.

## Cuándo usar esta técnica

### Favorable cuando

- `n` es pequeño (hasta ~`10³` elementos).
- Se necesita una solución rápida de verificar para comparar contra otras implementaciones.
- La claridad del código importa más que la eficiencia.

### Limitaciones

- No escala con valores superiores a las retricciones del problema (`n ≤ 10⁵`): produce TLE en LeetCode.
- El cuello de botella no está en el conteo (que `bisect` hace en $O(\log n)$) sino en el desplazamiento de memoria al insertar en una lista de Python.
- No hay forma de mejorar el algoritmo en su forma actual sin cambiar la estructura de datos subyacente.

### Comparación con División y Conquista

La solución de Merge Sort obtiene el mismo resultado en $O(n \times \log{n})$ reformulando el problema como conteo durante una fusión ordenada. No mantiene `nums` explícitamente ni requiere inserciones en listas ya que opera sobre índices. Es más difícil de entender, pero escala correctamente con las restricciones del problema.

## Referencias

- Documentación de Python: [`bisect`](https://docs.python.org/3/library/bisect.html)
