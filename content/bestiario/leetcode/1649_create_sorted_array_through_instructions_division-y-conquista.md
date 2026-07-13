---
title: '1649 - Create Sorted Array through Instructions - División y Conquista'
tags:
  - 'leetcode'
  - 'divide & conquer'
  - 'merge sort'
  - 'división y conquista'
---

## Técnicas utilizadas

**División y Conquista (Merge Sort modificado):** se adapta Merge Sort para que, durante cada fusión, además de ordenar, cuente cuántos elementos anteriores son estrictamente mayores que cada elemento. Es la misma idea que se utiliza en el problema de conteo de inversiones.

Se mantiene la división recursiva por la mitad y la fusión lineal de dos mitades ordenadas. Lo que se agrega respecto al Merge Sort clásico:
- Se ordena por **índices** (`list(range(n))`) en lugar de valores, para poder acumular el conteo en la posición original.
- Un arreglo auxiliar `greater_count`, persistente entre llamadas, que se completa durante las fusiones: cuando un elemento de `left` supera al actual de `right`, se suma de una sola vez `len(left) - i` a `greater_count[right[j]]` (aprovechando que `left` ya está ordenado, en vez de comparar uno por uno).
- La comparación usa `<=` y no `<`, para no contar los elementos iguales como "mayores".

## Idea de la solución

El enunciado describe construir `nums` insertando elementos uno por uno, pero no hace falta simular esas inserciones. El costo de insertar `instructions[i]` depende solo de dos cantidades sobre los elementos anteriores: cuántos son menores y cuántos son mayores. Si conseguimos esos dos números para cada posición, el problema se resuelve sin mantener ningún arreglo ordenado.

Para obtenerlos usamos Merge Sort sobre los índices $[0, ..., n-1]$ (comparando por `instructions`). Durante cada fusión, cuando un elemento de `left` resulta mayor que el actual de `right`, sabemos (por estar `left` ordenado) que todo el resto de `left` desde ahí en adelante también es mayor que ese elemento de `right`. Eso permite sumar de una sola vez:

$$\text{greaterCount}[\text{right}[j]] \mathrel{+}= |\text{left}| - i$$

En vez de comparar elemento por elemento. Como cada par de posiciones queda en mitades distintas exactamente una vez durante toda la recursión, cada relación "mayor que" se cuenta una única vez.

Se elige acumular `greater_count[i]` (mayores) y derivar `less(i)` algebraicamente. Con `greater_count[i]` calculado, se recorre el arreglo una vez más:

$$
\begin{aligned}
\text{equal}(i) &= \text{elementos iguales anteriores (diccionario de frecuencias)} \\
\text{less}(i) &= i - \text{equal}(i) - \text{greater\_count}(i) \\
\text{costo}(i) &= \min\bigl(\text{less}(i), \text{greater\_count}(i)\bigr)
\end{aligned}
$$

## Código

```python
def createSortedArray(instructions):
    n = len(instructions)
    greater_count = [0] * n  # agregado respecto al Merge Sort estándar

    def merge(left, right):
        result, i, j = [], 0, 0
        while i < len(left) and j < len(right):
            if instructions[left[i]] <= instructions[right[j]]:
                result.append(left[i]); i += 1
            else:
                # Modificación clave: left[i:] son todos mayores que instructions[right[j]]
                greater_count[right[j]] += len(left) - i
                result.append(right[j]); j += 1
        return result + left[i:] + right[j:]

    def merge_sort(indices):
        if len(indices) <= 1:
            return indices
        mid = len(indices) // 2
        return merge(merge_sort(indices[:mid]), merge_sort(indices[mid:]))

    merge_sort(list(range(n)))

    cost, freq = 0, {}
    for i, value in enumerate(instructions):
        equal = freq.get(value, 0)
        greater = greater_count[i]
        less = i - equal - greater
        cost += min(less, greater)
        freq[value] = equal + 1

    return cost % (10**9 + 7)
```

## Traza de ejemplo

`instructions = [1, 5, 6, 2]`. Merge Sort divide hasta elementos sueltos, sin conteos todavía:

```
[1,5,6,2] → [1,5] | [6,2] → [1] [5] | [6] [2]
```

**Mitad izquierda** (`[1]` con `[5]`): `1 <= 5`, se copia sin generar conteos. Resultado: `[1,5]`.

**Mitad derecha** (`[6]` con `[2]`):
- Fusión `[6]` con `[2]`: `6 > 2` → `greater_count[3] += 1` (el `3` es el índice del valor `2` en `instructions`)

**Fusión final** `[1,5]` con `[2,6]`:
- `1 <= 2` → se copia el `1` sin generar conteo.
- `5 > 2` → `greater_count[3] += (len(left) - i) = 2 - 1 = 1` → `greater_count[3] = 1 + 1 = 2`
- `5 <= 6` → se copia el `5` sin generar conteo.

Resultado: `greater_count = [0, 0, 0, 2]` para índices `[0,1,2,3]` — antes del valor `2` (índice 3) hay dos mayores (el `5` y el `6`).

**Cálculo del costo:**

| $i$ | valor | equal | greater | $less = i - equal - greater$ | $costo = \min(less, greater)$ |
|-----|-------|-------|---------|------------------------------|-------------------------------|
| 0   | 1     | 0     | 0       | 0                            | 0                             |
| 1   | 5     | 0     | 0       | 1                            | 0                             |
| 2   | 6     | 0     | 0       | 2                            | 0                             |
| 3   | 2     | 0     | 2       | 1                            | 1                             |

Costo total: $0+0+0+1 = 1$ ✓

## Complejidad

### Temporal

$O(n \log n)$.

El Merge Sort divide el problema a la mitad en cada nivel de recursión ($\log n$ niveles) y hace trabajo $O(n)$ en cada fusión. La recurrencia es:

$$T(n) = 2 \cdot T\left(\frac{n}{2}\right) + O(n)$$

Por el Teorema Maestro (caso 2): $T(n) = O(n \log n)$.

El cálculo del costo final es $O(n)$, que no domina.

Con $n = 10^5$, esto equivale a $\sim 1.7 \times 10^6$ operaciones → viable dentro de los límites de LeetCode.

### Espacial

$O(n)$. Por `greater_count` y los arreglos temporales de cada fusión, más $O(\log n)$ de pila de recursión.

## Cuándo usar esta técnica

### Favorable cuando

- El problema puede reformularse como **conteo de relaciones entre pares de elementos** (quién es menor que quién, cuántas inversiones hay, etc.).
- Se busca $O(n \log n)$ sin estructuras de datos adicionales complejas como árboles de Fenwick o de segmentos.
- Se busca evitar el $O(n^2)$ de comparar todo contra todo.
- El espacio de valores es grande o no acotado, haciendo inviable un BIT por rango de valores.

### Limitaciones

- La implementación es más difícil de entender y depurar que la fuerza bruta.
- Requiere cuidado con los índices: se ordena por índice original, no por valor, y los conteos se acumulan de forma indirecta.
- El uso de `<=` en la comparación (en vez de `<`) es crítico para contar correctamente solo los estrictamente mayores; un error ahí produce resultados incorrectos silenciosamente.

### Comparación con Fuerza Bruta

La fuerza bruta mantiene `nums` explícitamente e inserta cada elemento contando menores/mayores entre los ya insertados, con costo $O(n^2)$ — inviable para $n = 10^5$. Esta solución logra el mismo resultado en $O(n \log n)$ al obtener esos conteos como subproducto del propio ordenamiento. El trade-off es complejidad de implementación a cambio de eficiencia.

## Referencias

- Cormen et al., *Introduction to Algorithms* (CLRS) — Sección 2.3 (Merge Sort) y Problema 2-4 (conteo de inversiones).
- [LeetCode #315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)
