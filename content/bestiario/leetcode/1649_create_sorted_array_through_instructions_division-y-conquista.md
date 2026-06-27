---
title: '1649 - Create Sorted Array through Instructions - División y Conquista'
tags: ['divide & conquer', 'merge sort', 'leetcode', 'python', 'división y conquista']
---

## Técnicas utilizadas

**División y Conquista (Merge Sort modificado):** se adapta el algoritmo de ordenamiento por fusión para contar, durante la etapa de merge, cuántos elementos anteriores son estrictamente menores que cada elemento. Esta es la misma técnica usada en el clásico problema de conteo de inversiones.

## Idea de la solución

Para cada posición `i`, necesitamos `less(i)`: la cantidad de elementos en `instructions[0..i-1]` que son estrictamente menores que `instructions[i]`.

La observación clave es que **Merge Sort cuenta comparaciones entre elementos de distintas mitades de forma gratuita**. Durante la fusión de dos subarreglos ya ordenados `left` y `right`, cuando un elemento de `right` es mayor que todos los restantes en `left`, sabemos exactamente cuántos elementos de `left` son menores que él.

### Reformulación

Aplicamos Merge Sort sobre los **índices** `[0, 1, ..., n-1]`, usando `instructions` como criterio de comparación. Definimos un arreglo auxiliar `less_count` donde `less_count[i]` acumulará cuántos índices `j` anteriores a `i` (en el arreglo original) tienen `instructions[j] < instructions[i]`.

Durante la fusión de `left` e `right` (listas de índices):

- Si `instructions[left[i]] <= instructions[right[j]]`, el elemento de `left` va primero. No aprendemos nada sobre `right[j]` aún.
- Si `instructions[left[i]] > instructions[right[j]]`, el elemento de `right` va primero, y **todos los elementos restantes de `left`** (desde `i` hasta el final) son menores que `instructions[right[j]]`. Sumamos ese conteo a `less_count[right[j]]`.

Una vez calculado `less_count[i]` para todo `i`, derivamos `greater(i)` usando:

```
equal(i)   = #{j < i : instructions[j] == instructions[i]}
greater(i) = i - equal(i) - less_count[i]
costo(i)   = min(less_count[i], greater(i))
```

## Código

```python
def createSortedArray(instructions):
    MOD = 10**9 + 7
    n = len(instructions)
    less_count = [0] * n

    def merge_sort(indices):
        if len(indices) <= 1:
            return indices
        mid = len(indices) // 2
        left  = merge_sort(indices[:mid])
        right = merge_sort(indices[mid:])
        return merge(left, right)

    def merge(left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            if instructions[left[i]] <= instructions[right[j]]:
                result.append(left[i])
                i += 1
            else:
                # Todos los left[i:] son menores que instructions[right[j]]
                less_count[right[j]] += len(left) - i
                result.append(right[j])
                j += 1
        result.extend(left[i:])
        result.extend(right[j:])
        return result

    merge_sort(list(range(n)))

    cost = 0
    freq = {}
    for i, v in enumerate(instructions):
        equal   = freq.get(v, 0)
        greater = i - equal - less_count[i]
        cost    = (cost + min(less_count[i], greater)) % MOD
        freq[v] = equal + 1

    return cost
```

## Traza de ejemplo

Para `instructions = [1, 5, 6, 2]`, los índices son `[0, 1, 2, 3]`.

**Árbol de recursión:**

```
merge_sort([0, 1, 2, 3])
├── merge_sort([0, 1])
│   ├── merge_sort([0])  →  [0]
│   └── merge_sort([1])  →  [1]
│   merge([0],[1]): instr[0]=1 ≤ instr[1]=5 → left va primero
│   Resultado: [0, 1]  (sin acumulaciones en less_count)
│
└── merge_sort([2, 3])
    ├── merge_sort([2])  →  [2]
    └── merge_sort([3])  →  [3]
    merge([2],[3]): instr[2]=6 > instr[3]=2 → right va primero
      less_count[3] += len([2]) - 0 = 1
    Luego instr[2]=6 va solo.
    Resultado: [3, 2]

merge([0,1], [3,2]):
  instr[0]=1 ≤ instr[3]=2 → left[0] va primero
  instr[1]=5 > instr[3]=2 → right[3] va primero
    less_count[3] += len([1]) - 0 = 1   →  less_count[3] = 2
  instr[1]=5 ≤ instr[2]=6 → left[1] va primero
  Luego right[2] va solo.
  Resultado: [0, 3, 1, 2]
```

**Estado final de `less_count`:**

| índice i | instructions[i] | less_count[i] |
|----------|-----------------|---------------|
| 0        | 1               | 0             |
| 1        | 5               | 1             |
| 2        | 6               | 2             |
| 3        | 2               | 1             |

**Cálculo del costo** (recorriendo `instructions` en orden original):

| i | v | equal | greater = i - equal - less | min(less, greater) | cost |
|---|---|-------|----------------------------|--------------------|------|
| 0 | 1 | 0     | 0 - 0 - 0 = 0              | min(0, 0) = 0      | 0    |
| 1 | 5 | 0     | 1 - 0 - 1 = 0              | min(1, 0) = 0      | 0    |
| 2 | 6 | 0     | 2 - 0 - 2 = 0              | min(2, 0) = 0      | 0    |
| 3 | 2 | 0     | 3 - 0 - 1 = 2              | min(1, 2) = 1      | 1    |

**Resultado: 1** ✓


## Complejidad

### Temporal

`O(n log n)`.

El Merge Sort divide el problema a la mitad en cada nivel de recursión (`log n` niveles) y hace trabajo `O(n)` en cada fusión. La recurrencia es:

```
T(n) = 2·T(n/2) + O(n)
```

Por el Teorema Maestro (caso 2): `T(n) = O(n log n)`.

El cálculo del costo final es `O(n)`, que no domina.

Con `n = 10⁵`, esto equivale a ~`1.7 × 10⁶` operaciones → viable dentro de los límites de LeetCode.

### Espacial

`O(n)` para los arreglos auxiliares del merge y el arreglo `less_count`. La pila de recursión ocupa `O(log n)` niveles adicionales.

## Cuándo usar esta técnica


### Favorable cuando

- El problema puede reformularse como **conteo de relaciones entre pares de elementos** (quién es menor que quién, cuántas inversiones hay, etc.).
- Se busca `O(n log n)` sin estructuras de datos adicionales complejas como árboles de Fenwick o segmentos.
- El espacio de valores es grande o no acotado, haciendo inviable un BIT por rango de valores.

### Limitaciones

- La implementación es más difícil de entender y depurar que la fuerza bruta.
- Requiere cuidado con los índices: se ordena por índice original, no por valor, y los conteos se acumulan de forma indirecta.
- El uso de `<=` en la comparación (en vez de `<`) es crítico para contar correctamente solo los estrictamente menores; un error ahí produce resultados incorrectos silenciosamente.

### Comparación con Fuerza Bruta

La fuerza bruta es directa y fácil de verificar, pero su costo `O(n²)` la hace inutilizable para `n = 10⁵`. División y Conquista obtiene el mismo resultado con `O(n log n)` al aprovechar el orden que el propio merge produce. El trade-off es complejidad de implementación a cambio de eficiencia.

## Referencias

- Cormen et al., *Introduction to Algorithms* (CLRS) — Sección 2.3: Merge Sort; Problema 2-4: Conteo de inversiones.
- [LeetCode #1649](https://leetcode.com/problems/create-sorted-array-through-instructions/)
- [LeetCode #315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) — problema análogo resuelto con la misma técnica.