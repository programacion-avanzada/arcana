---
title: 'ACM138 - Street Numbers'
tags:
  - acm
  - bestia
---

## Nombre y enunciado

Una programadora vive en una calle con casas numeradas consecutivamente (desde 1) a lo largo de un lado de la calle. Cada tarde saca a pasear a su perro saliendo de su casa y girando aleatoriamente a la izquierda o a la derecha, caminando hasta el final de la calle y volviendo. Una noche suma los números de las casas que pasa (excluyendo la suya). La próxima vez que camina en la otra dirección repite esto y descubre, para su asombro, que las dos sumas son iguales. Aunque esto está determinado en parte por el número de su casa y en parte por la cantidad de casas en la calle, de todos modos siente que esta es una propiedad deseable para su casa y decide que todas sus casas futuras deberán tener esta propiedad.

**Problema:** Encontrar pares (número de casa, último número de la calle) tales que la suma de los números de las casas a la izquierda de la casa sea igual a la suma de los números a la derecha.

[Problema original](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=74)

---

## Intuición

A primera vista parece muy poco probable que esto ocurra: la suma de los números a la izquierda y a la derecha de una casa dependen de su posición, y en general son distintas. Lo curioso es que existen infinitas soluciones.

El problema conecta con la teoría de números y con las **ecuaciones de Pell**, que describen soluciones enteras de ciertas ecuaciones diofánticas cuadráticas. Dicho de otro modo: la condición de "equilibrio" no es un accidente aislado sino parte de una familia infinita de soluciones con estructura matemática profunda.

### OEIS
Siempre que haya problemas que involucren una secuencia de números, es buena idea buscarla dentro de la OEIS. Su buscador permite encontrar rápidamente secuencias relacionadas.

En este caso, la secuencia de soluciones (h, N) se encuentra en:
- h: [OEIS A001109](https://oeis.org/A001109)
- N: [OEIS A001108](https://oeis.org/A001108)

En ambos casos, las series inician en 0 y 1, pero los siguientes valores pueden considerarse soluciones sucesivas. En ambos casos explicita cómo hallarlos.

$$
h_n =
\begin{cases}
0 & \text{si } n = 0 \\
1 & \text{si } n = 1 \\
6 \times h_{n-1} - h_{n-2} & \text{si } n \geq 2
\end{cases}
$$

$$
N_{n} =
\begin{cases}
0 & \text{si } n = 0 \\
1 & \text{si } n = 1 \\
6 \times N_{n-1} - N_{n-2} + 2 & \text{si } n \geq 2
\end{cases}
$$

---

## Definición formal

**Entrada:** ninguna (el programa genera los resultados por sí solo).

**Salida:** 10 pares (h, N) donde:
- h es el número de la casa de la programadora (1 ≤ h ≤ N)
- N es el número de la última casa de la calle
- Se cumple que la suma 1 + 2 + ... + (h−1) es igual a la suma (h+1) + (h+2) + ... + N

**Restricción de formato:** cada par se imprime en una línea, con cada número justificado a la derecha en un campo de ancho 10.

**Condición matemática explícita:**

$$\sum_{i=1}^{h-1} i = \sum_{i=h+1}^{N} i$$

Lo que equivale a:

$$\frac{(h-1) \cdot h}{2} = \frac{N(N+1)}{2} - \frac{h(h+1)}{2}$$

Y simplificando: $2 \times h^2 = N(N+1)$

---

## Ejemplo concreto

Tomemos el primer par: h = 6, N = 8.

- Casas a la izquierda: 1, 2, 3, 4, 5 → suma = 15
- Casas a la derecha: 7, 8 → suma = 15

Verificación con la fórmula: $2 \times 6^2 = 72$ y $8 \times 9 = 72$

![Calle 1 a 8 con equilibrio en h igual a 6](138-street-numbers-ejemplo.svg)

---

## Por dónde empezar
Una primera aproximación razonable es fuerza bruta: iterar sobre todos los pares (h, N) con N acotado, calcular las dos sumas y verificar la igualdad. Eso permite encontrar las primeras soluciones y entender el patrón.

El siguiente paso es derivar una condición algebraica que relacione h y N, lo que convierte el problema de búsqueda en uno de resolución de ecuaciones.

Finalmente, si se quiere un programa eficiente se puede buscar una recurrencia que genere cada solución a partir de la anterior, evitando la búsqueda exhaustiva por completo.

---

## Soluciones disponibles

- [[138_street_numbers-fuerza-bruta]]
