---
title: Leetcode0765 - Couples Holding Hands - Greedy
tags:
  - b/leetcode
---
## Técnicas utilizadas

Estrategia **greedy** basada en corrección local de parejas: se recorre la fila de izquierda a derecha en bloques de dos posiciones, y si una persona no está sentada junto a su pareja, se realiza inmediatamente el intercambio necesario para traerla a su lado.

> Cada swap corrige definitivamente un banco de asientos, sin necesidad de reconsiderarlo más adelante.

## Idea de la solución

La fila se procesa banco por banco. Para cada posición par *i*, se observa quién está sentado en `row[i]` y se calcula quién debería estar a su lado. Si esa pareja ya ocupa `row[i+1]`, no hace falta hacer nada. Si no, se busca en qué posición está el compañero correcto y se lo intercambia con la persona ubicada en `row[i+1]`.

La estrategia greedy se basa en las siguientes propiedades del problema:

- **Propiedad greedy:** si la pareja de la persona ubicada en `row[i]` no está en `row[i+1]`, cualquier solución válida deberá colocarla junto a ella en algún momento. Por lo tanto, realizar ese intercambio inmediatamente no perjudica la solución óptima y permite resolver ese banco de forma definitiva sin necesidad de reconsiderarlo.

- **Subestructura óptima:** una vez que una pareja queda correctamente ubicada, el resto de la fila conserva la misma estructura del problema original, pero con una pareja menos por acomodar. Por lo tanto, resolver óptimamente el problema restante junto con las decisiones ya tomadas produce una solución óptima global.

> Para conocer rápidamente la posición actual de cada persona, se mantiene un [map](../../grimorio/data-structures/map) donde la clave es la persona y el valor es su posición en la fila.

## Código

```python
def pareja(x):
    return x + 1 if x % 2 == 0 else x - 1

def intercambiar(row, i, j):
    row[i], row[j] = row[j], row[i]

def greedy(row):
    pos = {persona: i for i, persona in enumerate(row)}
    swaps = 0

    for i in range(0, len(row), 2):
        x = row[i]
        pareja_esperada = pareja(x)

        if row[i + 1] != pareja_esperada:
            j = pos[pareja_esperada]
            y = row[i + 1]

            intercambiar(row, i + 1, j)
            
            pos[y] = j
            pos[pareja_esperada] = i + 1
            swaps += 1

    return swaps
```

## Traza de ejemplo

Con el vector: row = $[0, 2, 5, 1, 4, 3]$

Las parejas son: $(0, 1)$, $(2, 3)$ y $(4, 5)$.

| Paso | Banco actual | Acción | Estado | Swaps |
|---|---|---|---|---|
| 1 | $(0,2)$ | La pareja de 0 es 1, no está al lado | $[0, 2, 5, 1, 4, 3]$ | 0 |
| 2 | $(0,2)$ | Se busca a 1 y se intercambia con 2 | $[0, 1, 5, 2, 4, 3]$ | 1 |
| 3 | $(5,2)$ | La pareja de 5 es 4, no está al lado | $[0, 1, 5, 2, 4, 3]$ | 1 |
| 4 | $(5,2)$ | Se busca a 4 y se intercambia con 2 | $[0, 1, 5, 4, 2, 3]$ | 2 |
| 5 | $(2,3)$ | 3 y 2 ya están sentados juntos | $[0, 1, 5, 4, 2, 3]$ | 2 |

Al finalizar el recorrido, todas las parejas quedaron juntas: $(0,1)$, $(5,4)$, $(2,3)$. El algoritmo obtiene la respuesta **2**, que coincide con la cantidad mínima de intercambios.

## Complejidad

### Temporal

El algoritmo recorre la fila una sola vez, avanzando de a dos posiciones. Para cada banco, verificar si la pareja está bien ubicada es $O(1)$, y encontrar la posición del compañero también es $O(1)$ gracias al diccionario de posiciones.

Por lo tanto, la complejidad temporal total es $O(m)$, donde $m = 2n$ es la longitud del arreglo. Como $m$ es lineal en $n$, también puede expresarse como $O(n)$ si $n$ representa la cantidad de parejas.

### Espacial

$O(m)$ porque se almacena un diccionario con la posición actual de cada persona en la fila. Como $m = 2n$, también es lineal respecto de la cantidad de parejas.

## Cuándo usar esta técnica

### Favorable cuando

- Existe una decisión local que corrige de forma segura una parte del problema.
- Puede demostrarse que esa decisión no perjudica la optimalidad global.
- Se necesita una solución eficiente para tamaños de entrada grandes.

### Limitaciones

- La parte más delicada no es implementarla, sino justificar por qué la decisión local siempre conduce a una solución óptima.
- No todos los problemas de minimización admiten una estrategia greedy correcta, hace falta una propiedad estructural que lo respalde.

## Comparación con las otras soluciones

Frente a [fuerza bruta](0765_couples_holding_hands-fuerza-bruta.md), greedy evita por completo la exploración de combinaciones posibles de swaps: en lugar de probar alternativas, corrige cada banco en el momento y avanza. Esto reduce la complejidad de factorial a lineal.

Frente a [branch and bound](0765_couples_holding_hands-branch-and-bound.md), la ventaja también es clara: branch and bound todavía necesita explorar un árbol de búsqueda y mantener una mejor solución parcial, mientras que greedy no explora ramas ni requiere podas, porque cada intercambio local ya forma parte de una solución óptima.

## Referencias

- Estructura de datos: [[map]]
- Libro Algorithm Design: [Algorithm Design - Kleinberg & Tardos](https://theswissbay.ch/pdf/Gentoomen%20Library/Algorithms/Algorithm%20Design%20-%20John%20Kleinberg%20-%20%C3%89va%20Tardos.pdf)
- [Artículo de referencia](https://repovive.com/roadmaps/greedy-algorithms/greedy-optimization/problem-couples-holding-hands)
