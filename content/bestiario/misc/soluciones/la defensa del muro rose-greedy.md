---
title: 'La defensa del Muro Rose - Greedy'
tags:
  - solucion
---

## Técnicas utilizadas

El problema puede verse como una variante de **cobertura de intervalos**: se necesita cubrir completamente el intervalo $[L, R]$ usando la menor cantidad posible de segmentos.

La estrategia ávida consiste en mantener el punto más a la izquierda que todavía falta cubrir. En cada paso, se elige, entre todos los cañones cuyo inicio de cobertura sea menor o igual a ese punto, aquel que llegue más lejos hacia la derecha.

## Idea de la solución

Es decir:

1. convertir cada cañón en un intervalo $[x_i - r_i, x_i + r_i]$;
2. ordenar los intervalos por su extremo izquierdo;
3. comenzar desde $L$;
4. entre todos los intervalos que empiezan antes o en el punto actual, elegir el que tenga mayor extremo derecho;
5. avanzar el punto actual hasta ese extremo derecho;
6. repetir hasta cubrir $R$.

**Justificación de optimalidad:**

En cada paso, el algoritmo considera todos los cañones que pueden cubrir el primer punto del muro que aún no está protegido. Cualquier solución válida necesariamente debe elegir alguno de esos cañones, porque si no, ese punto quedaría descubierto.

Entre esas opciones, elegir el cañón que llega más lejos nunca perjudica la solución: cubre al menos tanto como cualquier otra alternativa posible para ese mismo punto. Por lo tanto, deja un tramo restante menor o igual para cubrir en los siguientes pasos.

Este argumento permite reemplazar la primera elección de una solución óptima por la elección ávida sin aumentar la cantidad total de cañones. Repitiendo el razonamiento en cada iteración, se obtiene una solución óptima.

## Código

```text
cubrirMuro(cañones, L, R):
    intervalos = []

    para cada cañón i:
        inicio = x_i - r_i
        fin = x_i + r_i
        agregar (inicio, fin, i) a intervalos

    ordenar intervalos por inicio ascendente

    seleccionados = []
    actual = L
    j = 0

    mientras actual < R:
        mejorFin = actual
        mejorCañon = null

        mientras j < cantidad(intervalos) y intervalos[j].inicio <= actual:
            si intervalos[j].fin > mejorFin:
                mejorFin = intervalos[j].fin
                mejorCañon = intervalos[j]
            j++

        si mejorCañon es null:
            error: no se puede cubrir el muro

        agregar mejorCañon a seleccionados
        actual = mejorFin

    devolver seleccionados
```

## Complejidad

### Temporal

Sea $n$ la cantidad de cañones disponibles.

- Convertir cañones en intervalos cuesta $O(n)$.
- Ordenar los intervalos cuesta $O(n \log n)$.
- Recorrer los intervalos cuesta $O(n)$, porque cada intervalo se analiza a lo sumo una vez.

Por lo tanto, la complejidad temporal total es:

$$O(n \log n)$$

### Espacial

$$O(n)$$

por almacenar los intervalos y la solución seleccionada.
