---
title: Leetcode0218 - The Skyline Problem
tags:
  - b/leetcode
---
## Nombre y enunciado

El skyline de una ciudad es el contorno exterior de la silueta que forman todos sus edificios vistos desde lejos, como si se mirara la ciudad recortada contra el horizonte. Dados los edificios (cada uno un rectángulo apoyado sobre el suelo a altura 0), se quiere reconstruir ese contorno.

Cada edificio está descripto por su borde izquierdo, su borde derecho y su altura. El resultado es la línea que sube y baja marcando, en cada posición del eje x, la altura del edificio más alto que la cubre.

**Problema:** dado un conjunto de edificios rectangulares, devolver la lista ([array](../../grimorio/data-structures/array.md)) de puntos clave que describen el contorno superior de la silueta colectiva, sin segmentos horizontales redundantes.

[Problema original](https://leetcode.com/problems/the-skyline-problem/description/)

## Intuición

A primera vista uno tiende a pensar en cada edificio por separado, pero la dificultad real está en que los edificios **se superponen**: en una misma posición x puede haber varios edificios apilados, y lo único que aporta al contorno es el más alto de todos ellos. El skyline no es la suma de las siluetas individuales sino su "envolvente superior".

La segunda observación clave es que el contorno **solo cambia en los bordes de los edificios** (donde uno empieza o termina), nunca en el medio. Entre dos bordes consecutivos la altura es constante. Visto esto, basta con analizar un número finito de puntos críticos.

Por último, hay un detalle de la representación: si un tramo del contorno se mantiene a la misma altura aunque por debajo cambien los edificios que lo sostienen, ese tramo debe quedar como una única línea. No se permiten puntos intermedios que repitan la altura anterior.

## Definición formal

**Entrada:** un arreglo `buildings` donde cada edificio `i` es una terna $[l_i, r_i, h_i]$, con:

- $l_i$: coordenada x del borde izquierdo
- $r_i$: coordenada x del borde derecho
- $h_i$: altura del edificio

Restricciones:
$$
\begin{aligned}
&1 \leq \text{buildings.length} \leq 10^4 \\
&0 \leq l_i < r_i \leq 2^{31} - 1 \\
&1 \leq h_i \leq 2^{31} - 1
\end{aligned}
$$
Además, `buildings` viene ordenado por $l_i$ en orden no decreciente.

**Función de altura del contorno.** Para cada posición $x$, definimos la altura del skyline como la mayor altura entre los edificios que cubren ese punto:

$$H(x) = \max \{\, h_i \;:\; l_i \leq x < r_i \,\}$$

con la convención $H(x) = 0$ cuando ningún edificio cubre $x$.

**Salida:** la lista de **puntos clave** $[[x_1, y_1], [x_2, y_2], \dots]$ ordenada por $x$, que describe la función $H$. Cada punto $[x_k, y_k]$ marca el extremo izquierdo de un segmento horizontal a altura $y_k = H(x_k)$. Debe cumplirse:

- El último punto tiene $y = 0$ y marca el final del contorno (donde termina el edificio más a la derecha).
- No hay dos puntos consecutivos con la misma altura: $y_k \neq y_{k+1}$ para todo $k$.

## Ejemplo concreto

Tomemos el conjunto:

```
buildings = [[2,9,10], [3,7,15], [5,12,12], [15,20,10], [19,24,8]]
```

El contorno resultante es:

```
[[2,10], [3,15], [7,12], [12,0], [15,10], [20,8], [24,0]]
```

Verificación leyendo la función $H$ tramo por tramo:

- En x=2 entra el primer edificio: $H$ sube a 10.
- En x=3 entra el edificio de altura 15: $H$ sube a 15.
- En x=7 termina el de 15; el más alto que queda activo es el de 12: $H$ baja a 12.
- En x=12 terminan todos los del primer grupo: $H$ cae a 0 (hueco de piso).
- En x=15 empieza el segundo grupo: $H$ sube a 10.
- En x=20 baja a 8.
- En x=24 termina el último edificio: $H$ cae a 0.

En x=5, por ejemplo, hay tres edificios activos simultáneamente (alturas 10, 15 y 12), pero como el de 15 ya dominaba desde x=3, el contorno no cambia y no se agrega ningún punto.

## Representación visual del ejemplo

![[skyline_problem_ejemplo.svg]]
## Por dónde empezar

Una primera aproximación razonable es **fuerza bruta**: reunir todas las coordenadas x relevantes (los bordes de todos los edificios) y, para cada una, recorrer todos los edificios calculando $H(x)$ directamente. Emitir un punto solo cuando la altura cambia. Esto encuentra el contorno correcto pero a costa cuadrático, $O(n^2)$.

El siguiente paso es notar que el skyline es **combinable**: el contorno de dos grupos de edificios juntos es el máximo, punto a punto, de sus dos contornos individuales. Eso habilita **división y conquista**: partir el arreglo en dos mitades, resolver cada una recursivamente y fusionar los dos contornos en tiempo lineal, igual que el merge del merge sort. La complejidad baja a $O(n \log n)$.

En ambos enfoques, la regla de no repetir alturas se maneja igual: recordando la última altura emitida y agregando un punto nuevo únicamente cuando la altura cambia.

## Soluciones disponibles

- [[LeetCode218_The_Skyline_Problem-Fuerza-Bruta]]
- [[LeetCode218_The_Skyline_Problem-DyC]]

