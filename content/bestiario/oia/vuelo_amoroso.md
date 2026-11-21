---
title: OIA - Vuelo amoroso
tags:
  - oia
  - bestia
---

## Nombre y enunciado

Un pajarito quiere seguir de cerca el vuelo de una pájara. Ambos parten del piso y sus alturas se miden cada 10 segundos. Entre mediciones, la pájara puede subir 3 metros, bajar 3 metros o mantener su altura. El pajarito debe subir o bajar 1 metro.

Conocido el vuelo de la pájara, hay que encontrar la distancia total mínima y un recorrido del pajarito que la alcance. La distancia total es la suma de las diferencias absolutas entre las dos alturas en cada medición.

[Enunciado original de la OIA, Certamen Nacional 2009, nivel 3, problema 2](https://www.oia.unsam.edu.ar/_media/prob/c3a09n3p2.pdf)

## Intuición

A primera vista parece que alcanza con elegir, en cada medición, el movimiento que deja al pajarito más cerca de la pájara. La dificultad aparece cuando ella cambia de dirección. Puede bajar tres metros en un solo paso y el pajarito puede tardar varias mediciones en volver a acercarse. La altura que elige antes del descenso condiciona todo ese tramo.

Imaginemos que el pajarito está a 8 metros y que las próximas alturas de la pájara son 9, 6 y 3. Subir a 9 le permite alcanzarla enseguida. Aun si baja en los dos pasos siguientes, su recorrido $(9,8,7)$ acumula una distancia de $0+2+4=6$. Si empieza a bajar desde la primera medición, su recorrido $(7,6,5)$ acumula $2+0+2=4$. Alejarse en el primer paso le permite anticipar la bajada.

## Definición formal

- **Entrada.** La primera línea contiene la cantidad de mediciones $n$, con $1\le n\le 40\,000$. Cada una de las $n$ líneas siguientes contiene una altura entera $a_t$ de la pájara, con $1\le a_t\le 300$. Si $a_0=0$, cada diferencia $a_t-a_{t-1}$ pertenece a $\{-3,0,3\}$.
- **Recorrido válido.** Las alturas $h_1,\ldots,h_n$ del pajarito parten de $h_0=0$ y cumplen $|h_t-h_{t-1}|=1$ para todo $1\le t\le n$. Se toma el piso como altura mínima, de modo que $h_t\ge 0$.
- **Salida.** La distancia total mínima, seguida de las $n$ alturas de un recorrido óptimo, un valor por línea. Si hay empate, sirve cualquiera de los recorridos óptimos.

$$
D(h)=\sum_{t=1}^{n}|a_t-h_t|
$$

## Ejemplo concreto

Tomemos cinco mediciones con alturas de la pájara $(3,3,3,3,6)$. Un recorrido posible del pajarito es $(1,2,3,4,5)$.

| Medición $t$ | Altura de la pájara $a_t$ | Altura del pajarito $h_t$ | Distancia |
| ---: | ---: | ---: | ---: |
| 1 | 3 | 1 | 2 |
| 2 | 3 | 2 | 1 |
| 3 | 3 | 3 | 0 |
| 4 | 3 | 4 | 1 |
| 5 | 6 | 5 | 1 |

Las distancias de las mediciones 1, 2 y 5 son al menos 2, 1 y 1, respectivamente, porque después de $t$ pasos el pajarito puede estar como máximo a $t$ metros. En la medición 4 su altura debe ser par, así que queda al menos a 1 metro de la pájara. El recorrido de la tabla alcanza esas cotas y coincide con ella en la tercera medición. Por lo tanto, su distancia total de **5** es óptima.

## Por dónde empezar

Podemos empezar dibujando las opciones de subir y bajar en las primeras tres mediciones del ejemplo. Si seguimos todas las ramas hasta el final y elegimos el recorrido válido de menor costo, estamos aplicando fuerza bruta.

![El pajarito llega a 1 metro en la tercera medición por dos recorridos, con costos acumulados de 7 y 5](vuelo-amoroso-primeras-mediciones.svg)

En el dibujo, dos recorridos llegan a la misma altura en la misma medición. Desde ahí tienen las mismas opciones para continuar, así que podemos conservar el de menor costo. Esa es la idea de partida para la programación dinámica.

## Soluciones disponibles

- [[vuelo_amoroso-fuerza-bruta|Fuerza bruta]]
- [[vuelo_amoroso-programacion-dinamica|Programación dinámica]]
