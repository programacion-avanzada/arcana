---
title: 'LeetCode#174 - Dungeon Game - Branch & Bound'
tags: ['b/leetcode']
---

Solución por Branch & Bound para [[174_dungeon_game]].

## Técnicas utilizadas

Branch & Bound con backtracking: se recorre el espacio de soluciones mediante un árbol de búsqueda y se aplican **podas** para descartar ramas que no pueden mejorar la mejor solución encontrada hasta el momento.

## Idea de la solución

El objetivo es recorrer todos los caminos posibles desde `(0,0)` hasta `(m-1,n-1)`. Durante la exploración se mantienen dos valores:

- `current_health`: la vida actual del caballero en ese punto del camino.
- `min_health_needed`: la mínima vida inicial necesaria para haber llegado hasta aquí con vida.

### Criterio de poda

Si `vida_min_necesaria` ya es mayor o igual a la mejor solución encontrada, esa rama no puede mejorarla y se descarta:

```text
Si vida_min_necesaria >= mejor:
    Se poda la rama.
```

## Código

```python
def mazmorra_bb(mazmorra):
    m, n = len(mazmorra), len(mazmorra[0])
    mejor = float('inf')

    def dfs(i, j, vida_actual, vida_min_necesaria):
        nonlocal mejor

        # Actualizar vida actual
        vida_actual += mazmorra[i][j]

        # Si la vida baja a 0 o menos, ajustar la vida mínima necesaria
        if vida_actual <= 0:
            vida_min_necesaria += (1 - vida_actual)
            vida_actual = 1

        # Poda
        if vida_min_necesaria >= mejor:
            return

        # Llegó al destino
        if i == m - 1 and j == n - 1:
            mejor = min(mejor, vida_min_necesaria)
            return

        # Explorar abajo
        if i + 1 < m:
            dfs(i + 1, j, vida_actual, vida_min_necesaria)

        # Explorar derecha
        if j + 1 < n:
            dfs(i, j + 1, vida_actual, vida_min_necesaria)

    dfs(0, 0, 1, 1)
    return mejor
```

## Traza de ejemplo

**Entrada:**

```text
[-2, -3,  3]
[-5,-10,  1]
[10, 30, -5]
```

El algoritmo explora primero hacia abajo y luego hacia la derecha. Se muestran los eventos relevantes:
*R = right*
*D = down*

**Paso 1 — Camino D→D→R→R** (`best = ∞`):

| Celda  | Valor | vida_actual        | vida_min_necesaria |
|--------|-------|--------------------|-------------------|
| (0, 0) |  −2   | 1+(−2)=−1 → ajuste | 3                 |
| (1, 0) |  −5   | 1+(−5)=−4 → ajuste | 8                 |
| (2, 0) | +10   | 1+10=11            | 8                 |
| (2, 1) | +30   | 11+30=41           | 8                 |
| (2, 2) |  −5   | 41+(−5)=36         | 8 → **best = 8**  |

**Paso 2 — Intento D→R (hacia (1,1) desde (1,0))** (`best = 8`):

| Celda  | Valor | vida_actual        | vida_min_necesaria |
|--------|-------|--------------------|-------------------|
| (1, 1) | −10   | 1+(−10)=−9 → ajuste| 18 ≥ 8 → **PODA** ✂️ |

Esto descarta todos los caminos que pasan por (1,0)→(1,1).

**Paso 3 — Intento R→D (hacia (1,1) desde (0,1))** (`best = 8`):

| Celda  | Valor | vida_actual        | vida_min_necesaria |
|--------|-------|--------------------|-------------------|
| (0, 1) |  −3   | 1+(−3)=−2 → ajuste | 6                 |
| (1, 1) | −10   | 1+(−10)=−9 → ajuste| 16 ≥ 8 → **PODA** ✂️ |

Esto descarta todos los caminos que pasan por (0,1)→(1,1).

**Paso 4 — Camino R→R→D→D** (`best = 8`):

| Celda  | Valor | vida_actual        | vida_min_necesaria |
|--------|-------|--------------------|-------------------|
| (0, 1) |  −3   | (retomado) → ajuste| 6                 |
| (0, 2) |  +3   | 1+3=4              | 6                 |
| (1, 2) |  +1   | 4+1=5              | 6                 |
| (2, 2) |  −5   | 5+(−5)=0 → ajuste  | 7 → **best = 7**  |

Resultado: **7**. El algoritmo exploró solo 2 caminos completos y podó 2 ramas (que cubrían 4 de los 6 caminos posibles).

## Complejidad

- **Peor caso:** `O(2^(m+n))` — sin podas, equivale a la búsqueda exhaustiva.
- **Caso promedio:** significativamente menor gracias a las podas (depende de la instancia).
- **Espacio:** `O(m+n)` — profundidad máxima de la recursión.

## Cuándo usar esta técnica

### Favorable cuando
- El espacio de soluciones es grande pero con muchas ramas claramente subóptimas.
- Es posible definir una cota (*bound*) que descarte ramas sin explorarlas.
- Se quiere mejorar la fuerza bruta sin cambiar completamente el enfoque algorítmico.

### Limitaciones
- En el peor caso (sin podas efectivas) tiene la misma complejidad que la fuerza bruta.
- La calidad de las podas depende del orden de exploración: si las mejores soluciones se encuentran tarde, se podan pocas ramas. En el ejemplo, el algoritmo explora primero hacia abajo y encuentra el camino D→D→R→R con `best = 8` antes de llegar al óptimo R→R→D→D con `best = 7`. Si se explorara primero el camino óptimo, `best` caería a 7 antes y las podas serían más agresivas desde el principio.
- Este problema no admite cortes por restricción ya que todo camino de `(0,0)` a `(m-1,n-1)` es factible. La única poda disponible es por cota, lo que limita la agresividad de la exploración en comparación con problemas donde ramas enteras pueden declararse inviables.

## Comparación con Fuerza Bruta y Programación Dinámica

Branch & Bound supera a la fuerza bruta al descartar ramas enteras del árbol de búsqueda sin evaluarlas. Sin embargo, su complejidad en el peor caso sigue siendo exponencial, a diferencia de Programación Dinámica que garantiza `O(m×n)` independientemente de la instancia. Branch & Bound es útil cuando se necesita mejorar la fuerza bruta con un esfuerzo de implementación moderado, pero no compite con Programación Dinámica para este problema en términos de eficiencia.

## Referencias

- [LeetCode #174 - Dungeon Game](https://leetcode.com/problems/dungeon-game/)
