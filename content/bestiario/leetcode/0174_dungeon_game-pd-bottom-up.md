---
title: LeetCode#0174 - Dungeon Game - Programación Dinámica - Bottom-up
tags:
  - b/leetcode
---

Solución por Programación Dinámica Bottom-Up para [[0174_dungeon_game]].

## Técnicas utilizadas

Programación Dinámica bottom-up (iterativa): se recorre la matriz desde el destino hacia el origen, resolviendo primero los subproblemas de los que dependen los demás, sin recursión ni memoización explícita.

## Idea de la solución

En lugar de calcular la vida mínima desde la celda inicial hacia el destino, se recorre la matriz en sentido inverso: se empieza por la **celda destino** y se avanza hacia `(0,0)`.

La vida mínima necesaria en una celda depende de la vida requerida en las celdas a las que se puede avanzar (derecha o abajo), es decir, de celdas que ya deben estar resueltas. Por eso conviene procesar la matriz de abajo hacia arriba y de derecha a izquierda: cada celda se resuelve exactamente una vez, con sus dependencias ya calculadas.

Como cada fila solo depende de la fila inmediatamente inferior, alcanza con mantener un único vector `dp` de tamaño `n` que se va sobrescribiendo fila por fila, en lugar de guardar la matriz completa.

![](/attachments/bestiario/leetcode/0174-grafo-dependencias.svg)

## Recurrencia

Sea `dp[i][j]` la cantidad mínima de vida necesaria para entrar a la celda `(i,j)`.

$$
dp[i][j]=\max\left(1,\min(dp[i+1][j],dp[i][j+1])-dungeon[i][j]\right)
$$

donde:

- `min(...)` elige el camino que requiere menos vida futura.
- `max(1, ...)` garantiza que la vida nunca sea menor que **1**.

## Código

```python
def calculateMinimumHP(dungeon):
    if not dungeon or not dungeon[0]:
        return 1

    m = len(dungeon)
    n = len(dungeon[0])

    # dp[j] almacenará la salud mínima necesaria para la fila actual
    dp = [0] * n

    # Caso base: destino (m-1, n-1)
    dp[n - 1] = max(1, 1 - dungeon[m - 1][n - 1])

    # Completar la última fila (solo podemos movernos hacia la derecha)
    for j in range(n - 2, -1, -1):
        dp[j] = max(1, dp[j + 1] - dungeon[m - 1][j])

    # Procesar el resto de la matriz desde abajo hacia arriba
    for i in range(m - 2, -1, -1):

        # Última columna
        dp[n - 1] = max(1, dp[n - 1] - dungeon[i][n - 1])

        # Resto de columnas
        for j in range(n - 2, -1, -1):
            # Elijo el camino con menor vida requerida
            min_next = min(dp[j], dp[j + 1])
            dp[j] = max(1, min_next - dungeon[i][j])

    return dp[0]
```

## Traza de ejemplo

**Entrada:**

```text
[-2, -3,  3]
[-5,-10,  1]
[10, 30, -5]
```

El vector `dp` se actualiza fila por fila, de derecha a izquierda:

```text
Destino (2,2): dp[2] = max(1, 1-(-5)) = 6                          → dp = [0, 0, 6]

Fila 2 (solo derecha):
  dp[1] = max(1, dp[2]-30) = max(1, -24) = 1
  dp[0] = max(1, dp[1]-10) = max(1, -9)  = 1                       → dp = [1, 1, 6]

Fila 1:
  dp[2] = max(1, dp[2]-1)                = max(1, 5)   = 5          (solo abajo)
  dp[1] = max(1, min(dp[1],dp[2])-(-10)) = max(1, 1+10) = 11
  dp[0] = max(1, min(dp[0],dp[1])-(-5))  = max(1, 1+5)  = 6         → dp = [6, 11, 5]

Fila 0:
  dp[2] = max(1, dp[2]-3)                = max(1, 2)   = 2          (solo abajo)
  dp[1] = max(1, min(dp[1],dp[2])-(-3))  = max(1, 2+3) = 5
  dp[0] = max(1, min(dp[0],dp[1])-(-2))  = max(1, 5+2) = 7          → dp = [7, 5, 2]
```

![](/attachments/bestiario/leetcode/0174-bottom-up-celda-cualquiera.svg)

Evolución del vector `dp`:

| Paso              | Fila procesada  | Estado del vector `dp` |
| ------------------ | --------------- | ----------------------- |
| Inicialización     | Destino         | `[0, 0, 6]`              |
| Fin de la Fila 2   | Fila inferior   | `[1, 1, 6]`              |
| Fin de la Fila 1   | Fila intermedia | `[6, 11, 5]`             |
| Fin de la Fila 0   | Fila superior   | `[7, 5, 2]`              |

**Resultado: `dp[0] = 7`**. El caballero necesita comenzar con **7 puntos de vida** para garantizar que nunca su salud caiga por debajo de 1 y pueda rescatar a la princesa.

## Cómo funciona la optimización de memoria

Una implementación clásica usa una matriz `dp[m][n]`. Pero recorriendo la matriz desde la esquina inferior derecha hacia la superior izquierda, cada celda únicamente necesita conocer el valor inmediatamente debajo y el valor inmediatamente a la derecha — no hace falta conservar todas las filas ya calculadas.

Por eso alcanza con reutilizar un único arreglo de longitud `n`, actualizándolo fila por fila, lo que reduce la complejidad espacial de $O(m \times n)$ a $O(n)$ sin modificar la complejidad temporal.

## Complejidad

### Temporal
$O(m \times n)$ — cada celda se calcula exactamente una vez.

### Espacial
$O(n)$ — un único vector auxiliar de tamaño `n`, reutilizado fila por fila.

## Cuándo usar esta técnica

### Favorable cuando
- Se quiere la solución óptima sin el overhead de la recursión ni memoria proporcional a `m × n`.
- El orden de dependencias entre subproblemas es fijo y conocido (de destino a origen), sin necesidad de resolverlo dinámicamente como hace la recursión con memoización.
- Interesa minimizar la memoria usada, por ejemplo con mazmorras muy grandes donde conservar la matriz completa no es necesario.

### Limitaciones
- Si se necesita reconstruir el camino exacto, el vector de una sola fila no alcanza: hay que guardar la matriz `dp[m][n]` completa, perdiendo la ventaja de espacio $O(n)$.
- Requiere identificar de antemano el orden correcto de recorrido; en problemas con dependencias menos regulares esto puede ser menos natural que dejar que la recursión con memoización las resuelva sola.

## Comparación con Top-Down

Ambas versiones comparten la misma complejidad temporal ($O(m \times n)$), por lo que no es lo que las diferencia. La ventaja del bottom-up es de memoria y de constantes prácticas: evita el $O(m \times n)$ del memo y la pila de recursión del top-down, reemplazándolos por un único vector $O(n)$, y evita el overhead de las llamadas a función y el hashing de claves en cada acceso al memo.

Con las restricciones de este problema ($m, n \le 200$, profundidad de recursión máxima $m+n-2 = 398$) el top-down no corre un riesgo real de stack overflow — esa no es la razón para preferir bottom-up aquí.

| Característica              | Top-Down (Recursivo)                            | Bottom-Up (Iterativo) |
| ---------------------------- | ------------------------------------------------ | ----------------------- |
| Complejidad temporal         | $O(m \times n)$                                  | $O(m \times n)$          |
| Complejidad espacial         | $O(m \times n)$ + stack                          | $O(n)$                   |
| Riesgo de stack overflow     | Bajo/nulo dado $m, n \le 200$ (profundidad $\le 398$) | Nulo (no aplica)    |
| Overhead de llamada/hashing  | Presente (call stack + memo dict)                | Ausente                  |
| Reconstrucción del camino    | Directa (memo completo disponible)               | Requiere guardar la matriz completa |
| Facilidad para depurar       | Media                                            | Alta                     |

## Referencias

- [LeetCode - Dungeon Game](https://leetcode.com/problems/dungeon-game/)
- [CP-Algorithms - Introduction to Dynamic Programming](https://cp-algorithms.com/dynamic_programming/intro-to-dp.html)
- [GeeksforGeeks - Dynamic Programming](https://www.geeksforgeeks.org/dsa/dynamic-programming/)
