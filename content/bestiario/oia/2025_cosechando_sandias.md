---
title: 'OIA2025 - Cosechando sandías'
tags:
  - oia
  - bestia
---

## Nombre y enunciado

Juan y María tienen una quinta de sandías plantadas a lo largo de un camino. Para cosecharlas recorren el camino **una sola vez**, desde el comienzo hasta el final, con un carro que soporta a lo sumo $T$ kilos. En el recorrido pueden elegir qué sandías cosechar y cuáles dejar.

En el camino hay $N$ sandías maduras. La sandía $i$ está a $x_i$ metros del comienzo del camino y pesa $p_i$ kilos.

Además, el carro tarda en volver a cargar, así que **entre dos sandías cosechadas tiene que haber al menos $D$ metros de distancia**.

El problema es calcular el máximo peso de sandías que Juan y María pueden cosechar en su recorrido, junto con las ubicaciones de un conjunto de sandías que logre ese peso.

Es el Problema 3 del Nivel 3 del Certamen Nacional de la [Olimpíada Informática Argentina](https://www.oia.unsam.edu.ar/) 2025, contribución de Guillermo García. El enunciado no está publicado en línea. La versión con la distancia $D$ es la que se tomó en el parcial de la materia.

---

## Intuición

El problema combina dos restricciones que se condicionan entre sí.

La primera es la capacidad $T$. Hay que elegir sandías cuyos pesos sumen lo más posible sin pasarse, que es una **mochila 0/1** en la que el valor de cada sandía es su propio peso. Ya por esta restricción no alcanza con un algoritmo ávido. Con $T = 10$ y pesos $6, 5, 5$, tomar primero la sandía más pesada deja un total de $6$, cuando lo óptimo es $5 + 5 = 10$. Elegir una sandía condiciona qué otras entran en el carro.

La segunda es la distancia $D$, que crea dependencias **entre sandías cercanas en el camino**. Cosechar una sandía impide cosechar las que están a menos de $D$ metros. Por eso importa dónde está cada sandía y no solo cuánto pesa, y una combinación que llena bien el carro puede ser inválida. En el ejemplo de abajo, las sandías que más se acercan a $T$ incluyen dos que están a 1 metro una de otra, y hay que resignar una de ellas.

Como cada sandía se cosecha o se deja, hay $2^N$ formas de armar la cosecha. Con $N$ hasta $5000$ es imposible revisarlas todas.

---

## Definición formal

**Entrada**

- $T$, capacidad del carro en kilos.
- $N$, cantidad de sandías.
- $D$, distancia mínima en metros entre dos sandías cosechadas.
- $x_1 < x_2 < \dots < x_N$, ubicaciones de las sandías en orden estrictamente creciente (no hay dos sandías en el mismo lugar).
- $p_1, p_2, \dots, p_N$, pesos de las sandías.

**Salida**

- El peso máximo $W$ que se puede cosechar.
- Las ubicaciones de un conjunto de sandías que logra ese peso, en orden creciente.

Formalmente, se busca un conjunto $S \subseteq \{1, \dots, N\}$ que maximice

$$W = \sum_{i \in S} p_i$$

sujeto a

$$\sum_{i \in S} p_i \le T \qquad \text{y} \qquad x_j - x_i \ge D \ \text{ para todo par } i < j \text{ de } S$$

Como las ubicaciones están ordenadas, alcanza con exigir la distancia entre sandías cosechadas **consecutivas**. Si cada par consecutivo está a $D$ metros o más, cualquier otro par está todavía más lejos.

**Función a implementar.** `Sandias(T, D, x, p, ubicaciones)`, donde `x` y `p` son [[array|arreglos]] de $N$ enteros y `ubicaciones` es el arreglo en el que se cargan, en orden creciente, las ubicaciones de las sandías elegidas. La función retorna el peso máximo $W$.

- Si hay varios conjuntos que logran el peso máximo, se acepta cualquiera.
- Si no se puede cosechar ninguna sandía (por ejemplo, con $T = 0$), la función retorna $0$ y `ubicaciones` queda vacío.

**Evaluador local.** Lee de la entrada estándar los enteros $T$, $N$ y $D$, y luego $N$ pares $x_i$ $p_i$. Escribe una primera línea con el valor retornado y una segunda línea con el contenido de `ubicaciones` (vacía si no se cosecha nada).

**Restricciones**

- $1 \le N \le 5000$
- $0 \le T \le 5000$
- $0 \le D \le 10^9$
- $1 \le x_i \le 10^9$, con $x_i < x_{i+1}$
- $1 \le p_i \le 5000$

---

## Ejemplo concreto

**Entrada**

```text
41 6 10
1 20
15 1
16 2
20 7
48 17
87 5
```

**Salida**

```text
39
1 16 48
```

El carro soporta $T = 41$ kilos y entre dos sandías cosechadas tiene que haber al menos $D = 10$ metros.

| Sandía | Ubicación $x_i$ | Peso $p_i$ |
|:------:|----------------:|-----------:|
| 1      |               1 |         20 |
| 2      |              15 |          1 |
| 3      |              16 |          2 |
| 4      |              20 |          7 |
| 5      |              48 |         17 |
| 6      |              87 |          5 |

![Camino con las seis sandías; se cosechan las de las ubicaciones 1, 16 y 48](2025-cosechando-sandias-ejemplo.svg)

Algunas cosechas posibles.

| Ubicaciones elegidas | Peso | ¿Peso ≤ 41? | ¿Separación ≥ 10? | Resultado |
|----------------------|-----:|:-----------:|:-----------------:|-----------|
| 1, 15, 16, 48        |   40 | sí          | no (16 − 15 = 1)  | inválida  |
| 1, 20, 48            |   44 | no          | sí                | inválida  |
| 1, 48, 87            |   42 | no          | sí                | inválida  |
| 1, 15, 48            |   38 | sí          | sí                | válida    |
| 1, 16, 48            |   39 | sí          | sí                | **óptima** |

La combinación que más se acerca a la capacidad, $1, 15, 16, 48$ con $40$ kilos, no es válida porque las sandías en 15 y 16 están a 1 metro, menos que $D = 10$. Entre esas dos conviene quedarse con la de 16, que pesa más, y el máximo es $20 + 2 + 17 = 39$ kilos.

---

## Por dónde empezar

Para cada sandía hay que decidir si se **cosecha o se deja**. Una primera aproximación es probar todas las combinaciones, descartar las que superan $T$ o violan la distancia $D$ y quedarse con la de mayor peso. Es correcta, pero revisa $2^N$ conjuntos, así que solo sirve para instancias muy chicas o para comprobar otras soluciones.

Para mejorarla hay que ver qué pasa al cosechar la sandía $i$. La cosechada anterior tiene que estar en una ubicación $\le x_i - D$, y como las ubicaciones están ordenadas, esas sandías forman un prefijo $1, \dots, \text{prev}(i)$ del camino. Entonces "el mayor peso con las primeras $i$ sandías y capacidad $t$" se puede calcular a partir de la misma pregunta sobre prefijos más cortos. Esos subproblemas se repiten muchas veces, y eso permite resolverlo con programación dinámica, como una mochila 0/1.

---

## Soluciones disponibles

- [[2025_cosechando_sandias-fuerza-bruta]]
- [[2025_cosechando_sandias-programacion-dinamica]]
