---
title: Cableando por la ruta - Greedy
tags:
  - oia
  - solucion
---

## Técnicas utilizadas

  

Se utiliza la técnica **greedy** (algoritmo ávido): la solución se construye con una secuencia de decisiones, en cada paso se elige la opción que parece mejor en ese momento y esa decisión no se vuelve a revisar. Esta técnica solo garantiza el óptimo cuando el problema cumple dos propiedades:

  

-  **Elección voraz:** se sabe que la solución óptima incluye la elección local que hace el algoritmo.

-  **Subestructura óptima:** después de esa elección, lo que queda por resolver es un subproblema del mismo tipo.

  

En este problema se cumplen las dos, como se podrá ver en la siguiente sección.

  

Para tomar cada decisión de forma eficiente se usa un **montículo de máximos**, que implementa una cola de prioridad: permite obtener el elemento más grande en $O(1)$ y extraerlo en $O(\log N)$.

 

  

## Idea de la solución

  

Si los pueblitos están ordenados por kilómetro, conectarlos a todos cuesta la suma de las distancias entre cada par de vecinos, que llamamos **tramos**. Las centrales pueden ubicarse en cualquiera de los pueblitos sin costo adicional.

  

Con $C$ centrales, los pueblitos se reparten en $C$  **componentes conexos**: grupos de pueblitos consecutivos unidos por cable, cada uno con su propia central. No conviene que dos componentes se conecten, porque tendríamos dos megacentrales proveyendo internet al componente siendo que con una sola basta. Separar en $C$ componentes equivale a no tender cable en $C - 1$ tramos, por lo que el costo es la suma de todos los tramos menos los que se dejan sin cable.

  

La **elección voraz** consiste en dejar siempre sin cable el tramo más largo que quede disponible.

  

### ¿Por qué es correcta?

  

-  **Elección voraz:** supongamos que una solución óptima deja sin cable un tramo corto $t_a$ y cablea uno más largo $t_b$ ($t_a \leq t_b$). Si se intercambian, cableando $t_a$ y dejando sin cable $t_b$, la cantidad de componentes no cambia. El costo, sin embargo, cambia en $t_a - t_b \leq  0$, o sea que mejora (o por lo menos no empeora). Por lo tanto, siempre existe una solución óptima que deja sin cable el tramo más largo.

-  **Subestructura óptima:** después de dejar sin cable el tramo más largo, queda el mismo problema con los tramos restantes y un corte menos por hacer ($C - 2$). Repetir la misma elección $C - 1$ veces lleva al óptimo.

-  **Usar todas las centrales nunca empeora:** cada tramo que cortamos baja el costo o lo deja igual (los tramos miden $\geq  0$). Por eso conviene hacer exactamente $C - 1$ cortes.

  

### Los pasos con montículos

  

1.  **Ordenar los pueblitos:** se arma un max-heap con la [[dynamic array|lista]] de kilómetros en $O(N)$. Después se extrae la raíz $N$ veces, y los kilómetros quedan de mayor a menor. Esto se conoce como **heapsort**.

2.  **Calcular los tramos:** se calcula la diferencia entre cada pueblito y el siguiente en ese orden, y con esas $N - 1$ distancias se arma un segundo max-heap.

3.  **Elegir los cortes:** se extrae $C - 1$ veces la raíz del montículo de tramos. Cada extracción es una elección voraz: el tramo más largo que queda se corta.

4.  **Calcular el resultado:** se suman los tramos que quedaron en el heap. Esa suma es la longitud mínima de cable.

  

## Código

  

```python

import heapq
# heapq es un min-heap así que para usarlo como max-heap se guardan los valores en negativo.


def  cable_minimo(c, kms):

  kms = [-k for k in kms]

  heapq.heapify(kms) # Arma el max-heap

  # Extraemos para efectuar el heap sort
  ordenados = [-heapq.heappop(kms) for _ in  range(len(kms))]

  tramos = [-(ordenados[i] - ordenados[i + 1]) for i in  range(len(ordenados) - 1)]

  heapq.heapify(tramos) # Max-heap de los tramos

  for _ in  range(c - 1):

    heapq.heappop(tramos) # Elección voraz: el tramo más largo queda sin cable

  return -sum(tramos) # La longitud mínima es la suma de los tramos que quedan

```

  

## Traza de ejemplo

  

Con `c = 2` y `kms = [5, 15, 2, 22]`, $N = 4$, y tenemos que hacer $C - 1 = 1$ corte.

  

| Paso | Acción | Estado |
|---|---|---|
| 1 | Guardar los km en un max-heap | Max-heap de kilómetros con raíz = **22** |
| 2 | Extraer la raíz 4 veces (heapsort) | `ordenados = [22, 15, 5, 2]` |
| 3 | Calcular los tramos entre vecinos | 22–15 = **7**, 15–5 = **10**, 5–2 = **3** |
| 4 | Guardar los tramos en un max-heap | Max-heap de tramos, raíz = **10** |
| 5 | Extraer $C-1$ veces (elección voraz) | Sale **10**: el tramo 5–15 queda sin cable. Quedan 7 y 3 |
| 6 | Sumar lo que quedó en el heap | $7 + 3 = 10$ |

  

Quedan dos componentes conexos, $\{2, 5\}$ y $\{15, 22\}$. Cada uno pone su central en uno de sus pueblitos, por ejemplo en el km 2 y en el km 22.

  

Resultado: **10**, el mismo que obtiene [[cableando_por_la_ruta-fuerza-bruta|la solución por fuerza bruta]] revisando las 8 combinaciones.

  

## Complejidad

  

### Temporal

  

$O(N \log N)$:

  

| Paso | Costo |
|---|---|
| Heapsort | $O(N \log N)$ |
| Calcular los $N - 1$ tramos | $O(N)$ |
| Insertar los tramos en el heap | $O(N)$ |
| Extraer los $C - 1$ tramos más largos | $O(C \log N)$ |
| Sumar lo que queda en el heap | $O(N)$ |

  

El ordenamiento es el que domina el costo. La extracción de los cortes es $O(C \log N)$, que llega a $O(N \log N)$ solo en el peor caso ($C \approx N$).

  

### Espacial

  

$O(N)$. Se usan tres listas de tamaño $N$: el heap de pueblitos (que se va vaciando a medida que se llena la lista de ordenados), la lista de ordenados y el heap de tramos. Se podría reducir el espacio extra reutilizando la misma lista (heapsort *in place* y tramos calculados sobre ella), pero la entrada ya ocupa $O(N)$, así que el total no cambia.

  

## Cuándo usar esta técnica

  

### Favorable cuando

  

- La entrada es grande (cientos o miles de pueblitos) y se necesita la respuesta exacta rápido.

- Se necesitan pocos máximos de muchos datos: el max-heap da los $C - 1$ tramos más largos sin ordenar todos.

  

### Limitaciones

  

- La correctitud depende de la estructura del problema y hay que justificarla. Si los cables pudieran tener costos que no son distancias sobre una recta (un grafo general), ya no alcanzaría con mirar tramos entre vecinos y haría falta utilizar un algoritmo para grafos no lineales, como Kruskal. Y si a cada central se le agregara un costo de instalación, la elección dejaría de ser tan directa y habría que replantear el modelo.

  

### Comparación con la solución de fuerza bruta

  

Frente a [[cableando_por_la_ruta-fuerza-bruta|la solución por fuerza bruta]], la greedy no explora combinaciones. En lugar de probar las $2^{N-1}$ formas de cablear, toma $C - 1$ decisiones (qué tramos quedan sin cable) usando el montículo. Eso baja la complejidad de exponencial a $O(N \log N)$, que es muchísimo más rápido para el tamaño real del problema.

  

A cambio, su correctitud no es evidente y necesita justificación. La fuerza bruta sirve para validar la correctitud de la implementación en instancias chicas.

  

## Referencias

  

- [[cableando_por_la_ruta|Enunciado original]]

- Cátedra de Programación Avanzada (2026). [DA: Algoritmos Ávidos](http://bit.ly/3PNCKYL). Universidad Nacional de La Matanza.

- Cátedra de Programación Avanzada (2026). [TDA: Montículos - Cola de Prioridad](http://bit.ly/48BWhln). Universidad Nacional de La Matanza.

- Python Software Foundation. [heapq — Heap queue algorithm](https://docs.python.org/3/library/heapq.html).