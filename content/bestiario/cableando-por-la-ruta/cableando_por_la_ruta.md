---
title: Cableando por la ruta
tags:
  - oia
  - bestia
---

## Nombre y enunciado

Una conocida empresa proveedora de internet ha entrado recientemente en un partido bonaerense, y sus tentadoras promociones han generado el interés de usuarios en varios pueblitos ubicados justo a un lado de una ruta.

La empresa debe lograr conectar todos los pueblitos a sus megacentrales proveedoras de internet. Estas centrales serán ubicadas en pueblos de esa misma ruta. Lógicamente, la empresa quiere realizar estas conexiones utilizando la mínima longitud posible de cable, para así ahorrar costos.

No es necesario que cada pueblo tenga su propio cable directo e ininterrumpido hasta la megacentral: si hay un cable entre los pueblos A y B, y a su vez hay un cable entre el pueblo B y la central, eso es suficiente para abastecer de internet a ambos pueblos A y B. Si un pueblo cuenta con una megacentral, este se considera provisto de conexión.

**Problema:** dadas las ubicaciones de los $N$ pueblitos y la cantidad $C$ de megacentrales, calcular la mínima longitud total de cable (en kilómetros) necesaria para que todos los pueblitos tengan internet.

[Problema original](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/cableando.pdf) (Certamen Provincial OIA 2017, Nivel 3, Problema 1; contribución de Agustín Santiago Gutiérrez. Adaptado para cumplir con las modificaciones del enunciado del parcial)

---

## Intuición

Con una central, la respuesta sale casi sola: como todo está sobre una recta, alcanza con cablear desde el pueblo más a la izquierda hasta el que está más a la derecha. El total es $\max - \min$.

Con $C$ centrales aparece una decisión que, a primera vista, parece costosa: ¿en qué pueblitos conviene poner las centrales? Probar todas las formas de elegir $C$ pueblitos entre $N$, y para cada una decidir cómo cablear el resto, da una cantidad de combinaciones enorme.

La clave está en mirar el problema al revés. Poner una central en un pueblito **no cuesta cable**: lo que cuesta son los cables. La pregunta real no es *«¿dónde van las centrales?»* sino *«¿qué tramos de la ruta conviene dejar sin cable?»*.

Además, **solo hacen falta cables entre pueblitos vecinos**. Un cable A–C que pasa por encima de B mide lo mismo que A–B más B–C, y la segunda opción es preferible porque conecta a los tres pueblos con la misma longitud.

---

## Definición formal

**Entrada:**

- Primera línea: un entero $N$, la cantidad de pueblitos.
- Segunda línea: un entero $C$, la cantidad de megacentrales a instalar.
- Tercera línea: $N$ enteros $k_1, \dots, k_N$, el kilómetro de cada pueblito, separados por espacio y desordenados.

**Salida:** un único entero que representa la mínima longitud total de cable para proveer a los pueblitos de internet.

**Restricciones:**

- Cada central se ubica en el kilómetro de un pueblito, no en cualquier punto de la ruta.
- $1 \leq N \leq 200.000$,
- $1 \leq C \leq N$
- $0 \leq k_i \leq 10^9$

---

## Ejemplo concreto

Entrada:

```text
4
2
5 15 2 22
```

Hay 4 pueblitos y se pueden instalar 2 megacentrales.

1. **Ordenar los kilómetros:** `2, 5, 15, 22`.
2. **Medir los tramos entre vecinos:** 2–5 mide **3**, 5–15 mide **10** y 15–22 mide **7**. Cablear todo cuesta $3 + 10 + 7 = 20$.
3. **Elegir qué pueblos conectar:** conviene conectar los dos pueblos con menor distancia (3 y 7 km). También podemos pensarlo como cortar el cable de mayor longitud: en este caso sería el **10**.
4. **Ubicar las centrales:** quedan dos componentes, $\{2, 5\}$ con 3 km de cable y $\{15, 22\}$ con 7 km. Cada uno pone su central en cualquiera de sus pueblitos.

![Ruta con pueblitos en los km 2, 5, 15 y 22; el tramo de 10 km queda sin cable y se forman dos componentes con una central cada uno](cableando-por-la-ruta-ejemplo.svg)

**Resultado:** `10`

Así quedaría para otros valores de $C$ con los mismos pueblitos:

| $C$ | Tramo(s) sin cable | Cable(s) usado(s) | Resultado |
| --- | ------------------ | ----------------- | --------- |
| 1   | ninguno            | 3, 10 y 7         | 20        |
| 2   | 10                 | 3 y 7             | 10        |
| 3   | 10 y 7             | 3                 | 3         |
| 4   | todos              | Ninguno           | 0         |

---

## Por dónde empezar

Un primer enfoque es la ***fuerza bruta***: una vez que se ve que solo importan los cables entre vecinos, cada uno de los $N-1$ tramos tiene dos opciones, con cable o sin cable. Se prueban las $2^{N-1}$ combinaciones y se elige la más barata que deje a lo sumo $C$ componentes. Garantiza el óptimo y sirve para validar otras soluciones, pero su costo es exponencial.

El paso siguiente es notar que el costo siempre es *«todos los tramos menos los que se dejan sin cable»*, y que dejar sin cable un tramo largo siempre conviene más que dejar uno corto, porque cualquiera de los dos agrega exactamente un componente. Eso habilita una estrategia ***greedy***: dejar sin cable, una y otra vez, el tramo más largo que quede, hasta hacer $C-1$ cortes, de tal modo que cada conexión de pueblitos tenga solo una megacentral asignada. Con un montículo de máximos, cada elección es rápida. Si vemos el problema como un grafo, es lo mismo que correr Kruskal y frenarlo cuando quedan $C$ componentes.

---

## Soluciones disponibles

- [[cableando_por_la_ruta-fuerza-bruta|Fuerza bruta]]
- [[cableando_por_la_ruta-greedy|Greedy]]
