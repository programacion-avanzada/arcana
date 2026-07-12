---
title: LeetCode#0174 - Dungeon Game - Programación Dinámica - Top-down
tags:
  - b/leetcode
---

Solución por Programación Dinámica Top-Down para [[0174_dungeon_game]].
## Técnicas utilizadas

Programación Dinámica top-down con memoización: se resuelve el problema de forma recursiva y se almacena el resultado de cada subproblema para no repetir cálculos.

## Idea de la solución

La función `vida_minima_necesaria(mazmorra, fil, col)` responde: ¿cuánta vida mínima necesito en la celda `(fil, col)` para llegar al destino con vida?

La recurrencia es (donde $V(fil, col) = \text{vida\_minima\_necesaria}(fil, col)$):

$$
V(fil, col) = \max\big(1,\ \min(V(fil{+}1, col),\ V(fil, col{+}1)) - \text{mazmorra}[fil][col]\big)
$$

Se elige el camino que exige menos vida, y se descuenta el efecto de la celda actual. El `max(1, ...)` garantiza que la vida nunca baje de 1.

Los casos base son:
- **Destino `(m-1, n-1)`:** `max(1 - matrix[m-1][n-1], 1)`
- **Última fila** (solo se puede ir a la derecha): `max(need_derecha - matrix[fil][col], 1)`
- **Última columna** (solo se puede ir hacia abajo): `max(need_abajo - matrix[fil][col], 1)`

Cada celda se calcula una sola vez gracias al [[hash table#Idea de implementación|hash table]] `memo`. Las llamadas siguientes a la misma celda retornan directamente el valor almacenado.

![](/attachments/bestiario/leetcode/0174-grafo-dependencias.svg)

## Código

```python
def vida_minima_necesaria(mazmorra, fil, col, memo=None):
    if memo is None:
        memo = {}

    filas = len(mazmorra)
    columnas = len(mazmorra[0])
    clave = (fil, col)

    if clave in memo:
        return memo[clave]

    if fil == filas - 1 and col == columnas - 1:
        memo[clave] = max(1 - mazmorra[fil][col], 1)
        return memo[clave]

    if fil == filas - 1:
        memo[clave] = max(vida_minima_necesaria(mazmorra, fil, col + 1, memo) - mazmorra[fil][col], 1)
        return memo[clave]

    if col == columnas - 1:
        memo[clave] = max(vida_minima_necesaria(mazmorra, fil + 1, col, memo) - mazmorra[fil][col], 1)
        return memo[clave]

    memo[clave] = min(
        max(vida_minima_necesaria(mazmorra, fil + 1, col, memo) - mazmorra[fil][col], 1),
        max(vida_minima_necesaria(mazmorra, fil, col + 1, memo) - mazmorra[fil][col], 1)
    )
    return memo[clave]
```

## Traza de ejemplo

**Entrada:**

```text
[-2, -3,  3]
[-5,-10,  1]
[10, 30, -5]
```

Las celdas se calculan en el orden en que las requiere la recursión desde `(0,0)`. Las marcadas con **CACHE** no se recomputan:

```
(0,0) → necesita (1,0) y (0,1)
  (1,0) → necesita (2,0) y (1,1)
    (2,0) → necesita (2,1)
      (2,1) → necesita (2,2)
        (2,2) → DESTINO   → memo[(2,2)] = max(1-(-5), 1) = 6
      memo[(2,1)] = max(6 - 30, 1)  = 1
    memo[(2,0)] = max(1 - 10, 1)    = 1
    (1,1) → necesita (2,1) y (1,2)
      (2,1) → CACHE                 → 1
      (1,2) → necesita (2,2)
        (2,2) → CACHE               → 6
      memo[(1,2)] = max(6 - 1, 1)   = 5
    memo[(1,1)] = min(max(1+10, 1), max(5+10, 1)) = min(11, 15) = 11
  memo[(1,0)] = min(max(1+5, 1),  max(11+5, 1))  = min(6, 16)  = 6
  (0,1) → necesita (1,1) y (0,2)
    (1,1) → CACHE                   → 11
    (0,2) → necesita (1,2)
      (1,2) → CACHE                 → 5
    memo[(0,2)] = max(5 - 3, 1)     = 2
  memo[(0,1)] = min(max(11+3, 1), max(2+3, 1))   = min(14, 5)  = 5
memo[(0,0)] = min(max(6+2, 1),  max(5+2, 1))     = min(8, 7)   = 7
```

![](/attachments/bestiario/leetcode/0174-top-down-primera-vs-cache.svg)

Estado final del memo como matriz:

```text
[ 7,  5,  2]
[ 6, 11,  5]
[ 1,  1,  6]
```

**Resultado: 7**

## Como reconstruir el camino
Sabemos que solo se puede ir hacia la derecha o hacia abajo, entonces podemos preguntarnos ¿ Cuál de las dos opciones que tengo requiere menos vida inicial? y nos vamos por esa celda. 

## Complejidad

**Temporal:** $O(m \times n)$ — cada celda se computa exactamente una vez y se guarda en `memo`.

**Espacial:** $O(m \times n)$ — el diccionario `memo` almacena como máximo `m×n` entradas, más $O(m+n)$ de profundidad de la pila de recursión.

## Cuándo usar esta técnica

### Favorable cuando
- Existen subproblemas que se repiten: distintos caminos pasan por las mismas celdas.
- Se quiere la solución óptima global sin explorar todos los caminos.
- La estructura recursiva del problema es clara y la memoización se agrega naturalmente.

### Limitaciones
- Requiere memoria adicional proporcional a la cantidad de subproblemas ($O(m \times n)$).
- La recursión profunda puede causar stack overflow en matrices muy grandes; en ese caso conviene una versión iterativa (bottom-up).

## Comparación con Fuerza Bruta

Sobre una matriz 5×5, la recursión sin memoización realiza **251 llamadas** mientras que la versión con memoización realiza **41** (medido empíricamente con un contador de llamadas), obteniendo el mismo resultado (**6**). La diferencia crece exponencialmente con el tamaño de la entrada, ya que sin memo cada celda se recalcula múltiples veces.

La Programación Dinámica garantiza $O(m \times n)$ independientemente de la instancia, lo que la convierte en la técnica más eficiente para este problema.

## Referencias

- [LeetCode - Dungeon Game](https://leetcode.com/problems/dungeon-game/)
- [CP-Algorithms - Introduction to Dynamic Programming](https://cp-algorithms.com/dynamic_programming/intro-to-dp.html)
- [GeeksforGeeks - Dynamic Programming](https://www.geeksforgeeks.org/dsa/dynamic-programming/)
