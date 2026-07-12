---
title: LeetCode#0174 - Dungeon Game - Fuerza Bruta
tags:
  - b/leetcode
---

Solución por fuerza bruta para [[0174_dungeon_game]].

## Técnicas utilizadas

Fuerza bruta con recursividad: se generan todos los caminos posibles desde `(0,0)` hasta `(m-1, n-1)` y se calcula la vida mínima necesaria para sobrevivir cada uno.

## Idea de la solución

En una matriz `m×n`, cualquier camino válido tiene exactamente `m+n-2` pasos (solo se puede ir a la derecha o hacia abajo), lo que genera $C(m+n-2, m-1)$ caminos posibles.

Cada camino se representa como una [[dynamic array#Ejemplos de código|lista]] de valores. Para cada uno se simula la evolución de la vida del caballero celda por celda: si la vida cae a 0 o menos, se incrementa la vida inicial requerida para mantenerla en exactamente 1. Al terminar el recorrido se registra la vida inicial mínima necesaria para ese camino. El resultado final es el mínimo entre todos.

## Código

```python
def vida_minima_inicial(mazmorra):
    filas, columnas = len(mazmorra), len(mazmorra[0])

    def dfs(fila, columna, camino):
        camino.append(mazmorra[fila][columna])

        if fila == filas - 1 and columna == columnas - 1:
            return [camino.copy()]

        caminos = []

        if fila + 1 < filas:
            caminos += dfs(fila + 1, columna, camino)

        if columna + 1 < columnas:
            caminos += dfs(fila, columna + 1, camino)

        camino.pop()
        return caminos

    def vida_requerida(camino):
        vida_inicial = 1
        vida_actual = 1

        for valor in camino:
            vida_actual += valor

            if vida_actual <= 0:
                vida_inicial += (1 - vida_actual)
                vida_actual = 1

        return vida_inicial

    todos_los_caminos = dfs(0, 0, [])
    return min(vida_requerida(camino) for camino in todos_los_caminos)
```

## Traza de ejemplo

**Entrada:**

```text
[-2, -3,  3]
[-5,-10,  1]
[10, 30, -5]
```

Existen $C(4,2)=6$ caminos posibles (dos movimientos a la derecha y dos hacia abajo). A continuación, cada uno con la vida inicial mínima necesaria:
*R = right*
*D = down*

| Camino    | Celdas visitadas      | Vida requerida |
|-----------|-----------------------|----------------|
| R→R→D→D  | −2, −3, +3, +1, −5   | **7**          |
| R→D→R→D  | −2, −3, −10, +1, −5  | 20             |
| R→D→D→R  | −2, −3, −10, +30, −5 | 16             |
| D→R→R→D  | −2, −5, −10, +1, −5  | 22             |
| D→R→D→R  | −2, −5, −10, +30, −5 | 18             |
| D→D→R→R  | −2, −5, +10, +30, −5 | 8              |

Mínimo: **7** (camino R→R→D→D).

![](/attachments/bestiario/leetcode/0174-fuerza-bruta-arbol.svg)

El árbol de exploración completo para este ejemplo: cada hoja es uno de los 6 caminos, con la vida final requerida. Las celdas con borde grueso (`(1,1)`, `(1,2)`, `(2,1)`) se recalculan varias veces por distintos caminos, sin reutilizar ningún resultado — la raíz del problema que resuelve Programación Dinámica.

Detalle de `vida_requerida` para el camino óptimo:

| Celda  | Valor | vida_actual        | vida_inicial |
|--------|-------|--------------------|--------------|
| (0, 0) |  −2   | 1+(−2)=−1 → ajuste | 3            |
| (0, 1) |  −3   | 1+(−3)=−2 → ajuste | 6            |
| (0, 2) |  +3   | 1+3=4              | 6            |
| (1, 2) |  +1   | 4+1=5              | 6            |
| (2, 2) |  −5   | 5+(−5)=0 → ajuste  | 7            |

## Complejidad

**Temporal:** $O(C(m+n-2, m-1) × (m+n))$ — se exploran todos los caminos posibles y cada uno tiene longitud `m+n-1`. Para matrices cuadradas de lado `n` esto crece como $O(4^n / \sqrt{n})$.

**Espacial:** Depende de la implementación concreta. En esta en particular, `dfs` acumula todos los caminos en memoria antes de calcular el mínimo: cada camino tiene longitud `m+n-1` y hay $C(m+n-2, m-1)$ caminos posibles, lo que da $O(C(m+n-2, m-1) \times (m+n))$. La [[stack#Call stack en ejecución de programas|pila de recursión]] y el camino en curso ocupan $O(m+n)$, pero el almacenamiento de resultados domina y crece exponencialmente.

## Cuándo usar esta técnica

### Favorable cuando
- La matriz es muy pequeña (m, n ≤ 5 aproximadamente).
- Se busca una implementación sencilla para verificar la corrección de otros algoritmos.

### Limitaciones
- Escala exponencialmente: para una matriz 10×10 hay más de 48.000 caminos posibles.
- Recalcula prefijos compartidos entre caminos sin reutilizar ningún resultado intermedio.

## Comparación con Programación Dinámica

La fuerza bruta evalúa todos los caminos sin ninguna poda ni reutilización de resultados intermedios. Programación Dinámica resuelve cada celda exactamente una vez en $O(m×n)$, aprovechando que muchos caminos comparten subproblemas — algo que la fuerza bruta ignora por completo. Para instancias de tamaño real, esto la vuelve la técnica claramente preferible.

## Referencias

- [LeetCode - Dungeon Game](https://leetcode.com/problems/dungeon-game/)
- [CP-Algorithms - Introduction to Dynamic Programming](https://cp-algorithms.com/dynamic_programming/intro-to-dp.html)
- [GeeksforGeeks - Dynamic Programming](https://www.geeksforgeeks.org/dsa/dynamic-programming/)
