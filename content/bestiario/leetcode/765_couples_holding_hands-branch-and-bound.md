---
title: 'Leetcode765 - Couples Holding Hands - Branch and Bound'
tags: ['b/leetcode']
---

## Técnicas utilizadas

Búsqueda por **branch and bound** sobre el espacio de intercambios: se generan distintas configuraciones de la fila probando swaps entre pares de posiciones, pero se descartan de forma anticipada aquellas ramas que ya no pueden mejorar la mejor solución encontrada hasta el momento.

> Se conserva la mejor solución válida hallada, y toda rama cuya cantidad parcial de intercambios ya no pueda superarla se poda.

## Idea de la solución

El algoritmo explora distintas configuraciones de la fila generadas por intercambios, y en cada estado verifica si la fila ya quedó resuelta; en ese caso, actualiza la mejor cantidad de swaps encontrada. Si todavía no está resuelta, sigue probando nuevos intercambios entre pares de posiciones.

La diferencia con [[765_couples_holding_hands-fuerza-bruta|fuerza bruta]] es que acá no se recorren ciegamente todas las ramas del árbol de búsqueda. Si una rama ya acumuló una cantidad de intercambios mayor o igual a la mejor solución conocida, se interrumpe inmediatamente porque ya no puede conducir a una respuesta óptima.

### Código

```python
def pareja(x):
    return x + 1 if x % 2 == 0 else x - 1

def es_valido(row):
    for i in range(0, len(row), 2):
        if pareja(row[i]) != row[i + 1]:
            return False
    return True

def branch_and_bound(row):
    mejor = None
    visitados = {tuple(row)}
    nivel = [(row, 0)]

    while nivel:
        siguiente = []
        for actual, swaps in nivel:
            #solo procesamos si el camino es mejor que el encontrado hasta ahora
            if mejor is None or swaps < mejor:
                
                #si es válido, actualizamos el mejor
                if es_valido(actual):
                    mejor = swaps
                #si no es válido, intentamos expandir
                else:
                    for i in range(len(actual)):
                        for j in range(i + 1, len(actual)):
                            nuevo = actual[:]
                            nuevo[i], nuevo[j] = nuevo[j], nuevo[i]
                            estado = tuple(nuevo)
                            
                            if estado not in visitados:
                                visitados.add(estado)
                                siguiente.append((nuevo, swaps + 1))
        nivel = siguiente
    return mejor
```

### Traza de ejemplo

Con el vector: $row = [0, 2, 1, 3]$

Las parejas son $(0, 1)$ y $(2, 3)$.

El algoritmo explora configuraciones por niveles, igual que la fuerza bruta, pero mantiene una variable *mejor* con la mejor solución encontrada hasta el momento. Si una configuración ya tiene una cantidad de swaps mayor o igual a *mejor*, no se sigue expandiendo.

Al comienzo:

*mejor = None*


Todavía no se conoce ninguna solución válida.

| Configuración | Intercambios | ¿Válida? | ¿Se poda? | Nota |
|---|---:|---|---|---|
| $[0, 2, 1, 3]$ | 0 | NO | NO | Estado inicial |
| $[2, 0, 1, 3]$ | 1 | NO | NO | Todavía no hay mejor solución |
| $[1, 2, 0, 3]$ | 1 | NO | NO | Todavía no hay mejor solución |
| $[3, 2, 1, 0]$ | 1 | SÍ | NO | Se encuentra una solución válida |

Cuando se encuentra la configuración $[3, 2, 1, 0]$, se actualiza:

*mejor = 1*

A partir de ese momento, cualquier configuración pendiente que tenga 1 o más intercambios no puede mejorar la mejor solución conocida. Por lo tanto, no se expande.

| Configuración pendiente | Intercambios | ¿Se poda? | Motivo |
|---|---:|---|---|
| Cualquier configuración restante del nivel | 1 | SÍ | Ya no puede mejorar *mejor = 1* |
| Configuraciones generadas con 2 swaps | 2 | SÍ | Tienen más swaps que la mejor solución |

Resultado: 1


> La poda no cambia la respuesta final, pero evita seguir explorando ramas que ya no pueden producir una solución mejor que la encontrada.

## Complejidad

### Temporal

Sea $m = 2n$ la longitud del arreglo, donde $n$ es la cantidad de parejas. Al igual que en la fuerza bruta, desde cada estado pueden intentarse hasta $\binom{m}{2}=O(m^2)$ intercambios posibles.

Para evitar recorrer repetidamente una misma configuración, los estados ya explorados se almacenan en un conjunto. Además, el algoritmo incorpora una poda: cuando la cantidad de intercambios realizados ya no puede mejorar la mejor solución encontrada hasta el momento, la rama se descarta sin seguir explorándola.

Esta poda reduce significativamente la cantidad de estados visitados en muchos casos prácticos. Sin embargo, en el peor caso la mejor solución puede encontrarse recién al final de la exploración, por lo que el algoritmo puede recorrer una cantidad de estados del mismo orden que la fuerza bruta.

En consecuencia, una cota superior para la complejidad temporal es: $O(m!\cdot m^2)$.

### Espacial

El conjunto de estados visitados puede llegar a almacenar hasta $m!$ configuraciones distintas, cada una de longitud $m$. Este costo domina al de la pila de recursión.

Por lo tanto, una cota superior para la complejidad espacial es $O(m!\cdot m)$.

## Cuándo usar esta técnica

### Favorable cuando

- Se necesita garantizar la solución óptima, pero se quiere evitar parte del trabajo redundante de la fuerza bruta.
- El problema puede formularse como un árbol de decisiones donde sea posible descartar ramas usando una cota sobre la mejor solución conocida.
- El tamaño de entrada es pequeño o mediano, y todavía no se dispone de una estrategia más directa.

### Limitaciones

- Su peor caso sigue siendo exponencial.
- La mejora depende de qué tan efectiva sea la poda; si se encuentra una buena solución tarde, el beneficio puede ser pequeño.
- Para este problema concreto, sigue siendo mejor utilizar [greedy](765_couples_holding_hands-greedy.md), que evita explorar combinaciones y resuelve el problema en tiempo lineal.

## Comparación con las otras soluciones

Frente a [fuerza bruta](765_couples_holding_hands-fuerza-bruta.md), branch and bound explora el mismo espacio de búsqueda pero incorpora una poda por optimalidad: cuando una rama ya no puede superar la mejor solución conocida, se descarta sin seguir profundizando. Esto reduce trabajo redundante, aunque ambas técnicas conservan el mismo peor caso exponencial.

Frente a [greedy](765_couples_holding_hands-greedy.md), la diferencia es más fuerte: greedy no necesita explorar ramas alternativas ni mantener una mejor solución parcial, porque corrige cada banco con una decisión local segura y obtiene el óptimo en una sola pasada.

## Referencias
N/A
