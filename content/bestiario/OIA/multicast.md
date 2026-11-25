---
title: Multicast
tags:
  - bestia
---
## Nombre y enunciado

Una red informática permite el envío de mensajes entre computadoras conectadas por la misma. Cada computadora se conecta mediante enlaces (en nuestro caso siempre punto a punto) con otras y coopera de modo de posibilitar que cualquiera pueda mandarle un mensaje a cualquier otra: cuando un mensaje es recibido y su destinatario es otra computadora, el mensaje es retransmitido “hacia” su destino, y así hasta llegar.

A los efectos de controlar el uso de la red, la transmisión de un mensaje por un enlace tiene un costo asociado (entero `c`, $0\le$ `c`) y el costo total de mandar un mensaje de una computadora a otra es la suma de los costos de los enlaces utilizados. Para minimizar los costos, las computadoras utilizan esquemas de ruteo de modo que los mensajes siempre vayan por el camino de menor costo. (En nuestro caso, el costo de enviar un mensaje no depende de cual de los extremos del enlace envía el mensaje, y se considera que el costo de mandarse un mensaje a sí mismo es 0).

Los mensajes normales tienen un origen y un destino, y se los denomina unicast. Hay otra categoría denominada multicast: estos mensajes son mandados por una computadora origen a un cierto conjunto de computadoras destino. Para calcular el costo de dichos mensajes se suman los costos de todas las transmisiones necesarias para que el mensaje llegue a todos sus destinatarios, siempre teniendo en cuenta que las computadoras minimizan dicho costo automáticamente.

**Problema**: Dada una red de computadoras conectadas entre sí mediante enlaces, determinar el menor costo posible para enviar un mensaje desde una computadora origen hacia un conjunto determinado de computadoras destino.

[Problema original](https://www.oia.unsam.edu.ar/_media/prob/c3a02n3p3.pdf)

---
## Intuición

A primera vista, el problema parece resolverse calculando el camino más corto desde el origen hacia cada destino y sumando los enlaces utilizados. Sin embargo, esa estrategia falla porque minimizar cada ruta individual no garantiza minimizar el costo total de la red. En un envío multicast, cuando dos o más destinos comparten un mismo enlace en su recorrido, el costo de ese enlace se paga una sola vez; por lo tanto, cuando un destino tiene varios caminos mínimos empatados, conviene elegir el que comparte más tramo con los demás. Lo que no se puede es desviar un mensaje por un camino más largo: el ruteo siempre usa el de menor costo.

---
## Definición formal

**Entrada:** Un archivo de texto `mcast.in`, que contiene:
- 1 línea con dos números separados por un blanco, el número `N` de computadoras y el número `M` de enlaces.
- `M` líneas con tres números separados por un blanco, indicando extremo `a`, extremo `b` y costo `c` de cada enlace.
- 1 línea con dos números separados por un blanco, indicando el origen `O`, y la cantidad `D` de destinos de un mensaje multicast.
- `D` líneas con un número indicando cada destino del mensaje.

**Salida:** Un archivo de texto `mcast.out` con una línea conteniendo el menor costo que logre determinar para el envío del mensaje. De no ser factible enviar el mensaje, una línea con la leyenda “*no hay solucion*.”.

**Restricciones:**

- $0 \le N, M \le 10000$
- $0 \le O, D \le 10000$
- $0 \le c$

---
## Ejemplo concreto

**Entrada:**
```text
6 5
1 2 7
2 3 1
1 3 6
2 4 1
2 6 1
1 3
3
4
6
```

**Salida:**
```text
9
```

**Representación gráfica de la red:**

![Ejemplo concreto de multicast](attachments/bestiario/OIA/multicast/EjemploConcreto.svg)

El nodo origen es el 1, y los nodos destinos son el 3, 4 y 6.

- Para llegar al nodo 3: enlace 1→3, costo 6.
- Costo adicional para llegar al nodo 4 = 2 (3→2→4; el tramo 1→3 ya está pago).
- Costo adicional para llegar al nodo 6 = 1 (2→6; el tramo 1→3→2 ya está pago).

De esta forma, el costo total = 6 + 2 + 1 = 9.

---
## Por dónde empezar

Una primera aproximación razonable es **fuerza bruta**: modelar la red como un [[grimorio/data-structures/graph|grafo]] con pesos y probar todos los $2^M$ subconjuntos posibles de enlaces. Luego, usando solo las aristas activas de ese subconjunto, calcular las distancias desde el origen `O` y quedarse con el subconjunto más barato que permita llegar a cada destino **con su distancia mínima real** (la calculada con todos los enlaces). No alcanza con que los destinos sean alcanzables: eso permitiría caminos más largos que el ruteo no usaría.

El siguiente paso es usar el algoritmo de Dijkstra desde el origen, guardando no solo la distancia sino también el predecesor de cada nodo. Los predecesores forman un árbol de caminos mínimos (SPT); el costo del multicast es la suma de las aristas de ese árbol que llevan a algún destino, contando cada enlace una sola vez. Además, hay que decidir qué hacer con los empates: si un nodo se alcanza con la misma distancia por dos caminos, el predecesor elegido cambia el resultado. En la solución **greedy** desempatamos por la última arista más barata, y analizamos cuándo eso no alcanza.

---
## Soluciones disponibles

* [[multicast-fuerza-bruta]]
* [[multicast-greedy]]