---
title: OIA - Vuelo amoroso
tags:
  - oia
  - bestia
---

## Nombre y enunciado

Un pajarito enamorado quiere seguir de cerca el vuelo de una pájara. Las alturas de ambos se miden cada 10 segundos:

- En cada medición la pájara puede mantenerse, subir 3 metros o bajar 3 metros.
- En cada medición el pajarito **debe** subir 1 metro o bajar 1 metro: no puede quedarse a la misma altura.
- Ambos salen del piso (altura 0).

Conocido el vuelo de la pájara, hay que encontrar la distancia total mínima y un recorrido del pajarito que la alcance. La distancia total es la suma de las diferencias absolutas entre las dos alturas en cada medición.

[Enunciado original de la OIA, Certamen Nacional, nivel 3, problema 2](https://www.oia.unsam.edu.ar/_media/prob/c3a09n3p2.pdf) 

## Intuición

A primera vista parece que alcanza con elegir, en cada medición, el movimiento que deja al pajarito más cerca de la pájara. La dificultad aparece cuando ella cambia de dirección. Puede bajar tres metros en un solo paso y el pajarito puede tardar varias mediciones en volver a acercarse. La altura que elige antes del descenso condiciona todo ese tramo.

En la medición 8 del ejemplo oficial, la pájara está a 9 metros y el pajarito viene de estar a 7. Subir a 8 cuesta 1 en ese paso y lleva a un costo total de 25 si el pajarito sigue eligiendo el movimiento que lo deja más cerca. Bajar a 6 cuesta 3 en ese paso y le permite anticipar el descenso de la pájara. Ese recorrido suma 23.

![Comparación del recorrido greedy y el óptimo entre las mediciones 6 y 13](vuelo-amoroso-greedy.svg)

## Definición formal

**Entrada:**

- Un entero $n$, la cantidad de mediciones ($1 \le n \le 40.000$).
- Un [[array]] $a_1, a_2, \dots, a_n$ con la altura de la pájara en cada medición ($1 \le a_t \le 300$).

**Salida:**

- La distancia total mínima $D$.
- Un recorrido $p_1, p_2, \dots, p_n$ del pajarito que la alcance (puede haber más de uno; cualquiera es válido).

**Restricciones sobre el recorrido:**

$$
p_0 = 0, \qquad |p_t - p_{t-1}| = 1, \qquad 0 \le p_t \le 300 \qquad (1 \le t \le n)
$$

Un recorrido que cumple todas las restricciones es **factible**. Si en algún momento el pajarito queda bajo tierra ($p_t < 0$) o por encima de los 300 metros ($p_t > 300$), el recorrido es **no factible** y se descarta.

**Objetivo:**

$$
D = \min_{p \text{ factible}} \sum_{t=1}^{n} |p_t - a_t|
$$

## Ejemplo concreto

El ejemplo oficial tiene 13 mediciones. La tabla muestra un recorrido que suma **23**.

| Medición $t$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Pájara $a_t$ | 3 | 3 | 3 | 6 | 9 | 12 | 9 | 9 | 6 | 3 | 3 | 3 | 3 |
| Pajarito $h_t$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 6 | 5 | 4 | 3 | 4 | 3 |
| Distancia | 2 | 1 | 0 | 2 | 4 | 6 | 2 | 3 | 1 | 1 | 0 | 1 | 0 |

![Alturas de la pájara y del pajarito en un recorrido óptimo de costo 23](vuelo-amoroso-ejemplo.svg)

Hasta la medición 7, el pajarito puede estar como máximo a $t$ metros en la medición $t$ y la pájara siempre está a esa altura o por encima. Las primeras siete distancias de la tabla son los mínimos posibles y suman 17.

La altura del pajarito tiene la misma paridad que el número de medición, así que en las mediciones 9, 10 y 12 la distancia es al menos 1. En la medición 8, si está a 6 metros o menos, suma al menos 3 ahí. Si está a 8 metros, suma 1 y en la medición 10 todavía está al menos a 6 metros, por lo que suma al menos 3 en esa medición. En ambos casos, las últimas seis mediciones aportan al menos 6. El recorrido de la tabla alcanza esa cota y da el mínimo $17+6=23$.

También podemos bajar a 2 en la medición 12 y volver a 3 en la 13. La distancia total sigue siendo 23.

## Por dónde empezar

Podemos empezar dibujando las opciones de subir y bajar en las primeras tres mediciones del ejemplo. Si seguimos todas las ramas hasta el final y elegimos el recorrido válido de menor costo, estamos aplicando fuerza bruta.

![El pajarito llega a 1 metro en la tercera medición por dos recorridos, con costos acumulados de 7 y 5](vuelo-amoroso-primeras-mediciones.svg)

Para mejorarla hay que preguntarse qué información del pasado importa realmente para decidir el futuro. Lo único que condiciona lo que puede pasar a partir de la medición $t$ es **a qué altura está el pajarito en ese momento**. Muchos vuelos distintos llegan a la misma altura en la misma medición, y de todos ellos solo interesa el que llegó con menor distancia acumulada. Esa observación lleva directo a **programación dinámica**.

## Soluciones disponibles

- [[vuelo_amoroso-greedy|Greedy]]
- [[vuelo_amoroso-fuerza-bruta|Fuerza bruta]]
- [[vuelo_amoroso-programacion-dinamica|Programación dinámica]]
