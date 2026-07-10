---
title: Leetcode0765 - Couples Holding Hands - Fuerza Bruta
tags:
  - b/leetcode
---
## Técnicas utilizadas

Búsqueda por fuerza bruta sobre el espacio de estados utilizando **BFS**: se exploran las configuraciones alcanzables de la fila, generando nuevos estados mediante intercambios entre pares de posiciones.

La búsqueda se realiza por niveles, donde cada nivel representa una cantidad fija de swaps realizados. Por lo tanto, la primera configuración válida encontrada corresponde a la menor cantidad de intercambios necesarios.

> Para evitar explorar repetidamente la misma configuración, se utiliza un [set](../../grimorio/data-structures/set) que almacena los estados ya visitados.

## Idea de la solución

El algoritmo realiza una búsqueda exhaustiva por niveles utilizando **BFS**. En cada nivel se consideran todas las configuraciones alcanzables con una misma cantidad de intercambios. Desde cada configuración se prueban todos los pares de índices posibles como candidatos a intercambiar.

Como se exploran todas las configuraciones posibles de la fila (evitando únicamente volver a recorrer estados ya visitados), el algoritmo garantiza encontrar la cantidad mínima real de swaps, aunque a costa de explorar una cantidad de estados que crece muy rápidamente.

## Código

```python
def pareja(x):
    return x + 1 if x % 2 == 0 else x - 1

def es_valido(row):
    for i in range(0, len(row), 2):
        if pareja(row[i]) != row[i + 1]:
            return False

    return True

def fuerza_bruta(row):
    visitados = {tuple(row)}
    nivel = [row]
    swaps = 0

    while nivel:
        siguiente = []

        for actual in nivel:
            if es_valido(actual):
                return swaps

            for i in range(len(actual)):
                for j in range(i + 1, len(actual)):
                    nuevo = actual[:]
                    nuevo[i], nuevo[j] = nuevo[j], nuevo[i]

                    estado = tuple(nuevo)

                    if estado not in visitados:
                        visitados.add(estado)
                        siguiente.append(nuevo)

        nivel = siguiente
        swaps += 1
```

## Traza de ejemplo

Con el vector: `row = [0, 2, 1, 3]`

Las parejas son $(0, 1)$ y $(2, 3)$.

El algoritmo explora las configuraciones por niveles. Primero evalúa la configuración inicial, que corresponde a 0 intercambios. Como no es válida, genera todas las configuraciones posibles aplicando un único swap.

| Configuración | Intercambios | ¿Válida? | Nota |
|---|---:|---|---|
| `[0, 2, 1, 3]` | 0 | NO | Estado inicial |
| `[2, 0, 1, 3]` | 1 | NO | Generada con $swap(0, 1)$ |
| `[1, 2, 0, 3]` | 1 | NO | Generada con $swap(0, 2)$ |
| `[3, 2, 1, 0]` | 1 | SÍ | Generada con $swap(0, 3)$ |

Al llegar a `[3, 2, 1, 0]`, las personas quedan sentadas junto a sus parejas: $(3, 2)$ y $(1, 0)$.

Como la exploración se realiza por niveles, primero se revisan todas las configuraciones con 0 intercambios, luego las de 1 intercambio, luego las de 2, y así sucesivamente. Por eso, la primera configuración válida encontrada garantiza la mínima cantidad de swaps.

Resultado: 1

## Complejidad

### Temporal

Sea $m = 2n$ la longitud del arreglo, donde $n$ es la cantidad de parejas. El algoritmo explora por niveles las distintas configuraciones posibles de la fila. Para evitar recorrer indefinidamente los mismos estados, cada configuración visitada se almacena en un [conjunto](../../grimorio/data-structures/set) y no vuelve a explorarse.

En el peor caso pueden visitarse hasta $m!$ configuraciones distintas, ya que cada una corresponde a una permutación de las personas en la fila. Desde cada estado pueden intentarse hasta $\binom{m}{2}=O(m^2)$ intercambios posibles.

Por lo tanto, una cota superior para la complejidad temporal es $O(m!\cdot m^2)$.

### Espacial

El conjunto de estados visitados puede llegar a almacenar hasta $m!$ configuraciones distintas, cada una de longitud $m$ (todas las configuraciones pendientes de explorar).

Por lo tanto, una cota superior para la complejidad espacial es $O(m!\cdot m)$.

## Cuándo usar esta técnica

### Favorable cuando

- La entrada es muy pequeña y se necesita una solución de referencia para validar otros algoritmos.
- No se conoce (o no se puede demostrar) una propiedad de decisión local segura que habilite un enfoque más eficiente.

### Limitaciones

- Es inviable para los tamaños de entrada reales del problema: el crecimiento factorial hace que el tiempo de ejecución sea impracticable ya con pocas decenas de personas.
- Explora combinaciones de swaps que nunca podrían formar parte de una solución óptima, haciendo trabajo redundante.

## Comparación con las otras soluciones

Frente a [branch and bound](0765_couples_holding_hands-branch-and-bound.md), la fuerza bruta no aprovecha ninguna poda: branch and bound explora el mismo espacio de búsqueda pero descarta ramas que ya no pueden mejorar la mejor solución encontrada, reduciendo el trabajo redundante sin perder la garantía de optimalidad.

Frente a [greedy](0765_couples_holding_hands-greedy.md), la diferencia es aún mayor: greedy identifica que alcanza con corregir cada banco de asientos de forma local, evitando por completo la necesidad de explorar combinaciones, y resuelve el problema en tiempo lineal.

## Referencias

- Estructura de datos: [[set]]
- Técnica de búsqueda: [BFS](https://algo.monster/problems/bfs_intro)
