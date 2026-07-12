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

A diferencia del Merge Sort estándar (que solo fusiona y ordena) acá se agrega un arreglo auxiliar `greater_count` que se actualiza durante cada fusión: cuando un elemento de `left` supera al actual de `right`, se acumula en `greater_count[right[j]]` cuántos elementos de `left` son mayores, aprovechando que `left` ya está ordenado.

## Idea de la solución

El enunciado describe construir `nums` insertando elementos uno por uno, pero no hace falta simular esas inserciones. El costo de insertar `instructions[i]` depende solo de dos cantidades sobre los elementos anteriores: cuántos son menores y cuántos son mayores. Si conseguimos esos dos números para cada posición, el problema se resuelve sin mantener ningún arreglo ordenado.

Para obtenerlos usamos Merge Sort sobre los índices $[0, ..., n-1]$ (comparando por `instructions`). Durante cada fusión, cuando un elemento de `left` resulta mayor que el actual de `right`, sabemos (por estar `left` ordenado) que todo el resto de `left` desde ahí en adelante también es mayor que ese elemento de `right`. Eso permite sumar de una sola vez:

$$greater\_count[\text{right}[j]] \mathrel{+}= |\text{left}| - i$$

en vez de comparar elemento por elemento. Como cada par de posiciones queda en mitades distintas exactamente una vez durante toda la recursión, cada relación "mayor que" se cuenta una única vez.

Se elige acumular `greater_count[i]` (mayores) y derivar `less(i)` algebraicamente. Con `greater_count[i]` calculado, se recorre el arreglo una vez más:

$$\begin{aligned}
equal(i) &= \text{elementos iguales anteriores (diccionario de frecuencias)} \\
less(i) &= i - equal(i) - greater\_count(i) \\
costo(i) &= \min\bigl(less(i),\ greater\_count(i)\bigr)
\end{aligned}$$

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

`instructions = [1, 2, 3, 6, 5, 4]`. Merge Sort divide hasta elementos sueltos, sin conteos todavía:

```
[1,2,3,6,5,4] → [1,2,3] | [6,5,4] → [1] [2,3] | [6] [5,4] → [1] [2] [3] [6] [5] [4]
```

**Mitad izquierda** (`[1] [2] [3]`): todas las fusiones cumplen `<=`, se copian sin generar conteos.

**Mitad derecha** (`[6] [5] [4]`):
- Fusión `[5]` con `[4]`: `5 > 4` → `greater_count[4] += 1`
- Fusión `[6]` con `[4,5]`: `6 > 4` → `greater_count[4] += 1` → `greater_count[4] = 2`; luego `6 > 5` → `greater_count[5] += 1`

**Fusión final** `[1,2,3]` con `[4,5,6]`: todas cumplen `<=`, sin nuevos conteos.

Resultado: `greater_count = [0, 0, 0, 0, 2, 1]` para índices `[0,1,2,3,4,5]` — antes del valor 5 (índice 4) hay un mayor (el 6); antes del valor 4 (índice 5) hay dos mayores (el 6 y el 5).

**Cálculo del costo:**

| $i$ | valor | equal | greater | $less = i - equal - greater$ | $costo = \min(less, greater)$ |
|-----|-------|-------|---------|------------------------------|-------------------------------|
| 0   | 1     | 0     | 0       | 0                            | 0                             |
| 1   | 2     | 0     | 0       | 1                            | 0                             |
| 2   | 3     | 0     | 0       | 2                            | 0                             |
| 3   | 6     | 0     | 0       | 3                            | 0                             |
| 4   | 5     | 0     | 1       | 3                            | 1                             |
| 5   | 4     | 0     | 2       | 3                            | 2                             |

Costo total: $0+0+0+0+1+2 = 3$ ✓

## Complejidad

### Temporal

$O(n \log n)$.

El Merge Sort divide el problema a la mitad en cada nivel de recursión ($\log n$ niveles) y hace trabajo $O(n)$ en cada fusión. La recurrencia es:

$$T(n) = 2 \cdot T\!\left(\frac{n}{2}\right) + O(n)$$

Por el Teorema Maestro (caso 2): $T(n) = O(n \log n)$.

El cálculo del costo final es $O(n)$, que no domina.

Con $n = 10^5$, esto equivale a ~$1.7 \times 10^6$ operaciones → viable dentro de los límites de LeetCode.

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
