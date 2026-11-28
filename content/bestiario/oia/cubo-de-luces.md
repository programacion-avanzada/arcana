---
title: 'Cubo de Luces'
tags:
  - cubo-de-luces
  - bestia
  - fuerza-bruta
  - backtracking
---

## Nombre y enunciado

Agustina tiene un tablero de n × n donde se cumple que $1\le n\le 1000$, formado por $n^{2}$ cuadraditos unitarios idénticos. Cada cuadradito unitario tiene una luz que puede estar encendida o apagada.
Se tiene además, por cada rectángulo de 1 × n del tablero (cada fila o columna) un botón que cambia de estado esas n luces del rectángulo (las apagadas se encienden, y las encendidas se apagan). Dada una configuración inicial, tu tarea consiste en indicarle a Agustina la mínima cantidad de pulsaciones de botones que deja todas las luces encendidas. Si no es posible lograrlo, debes indicarlo con −1.

**Problema**: Hallar la mínima cantidad de pulsaciones de botones que deja todas las luces encendidas. Si no es posible lograrlo, debes indicarlo con −1.

[Problema original](https://www.oia.unsam.edu.ar/wp-content/uploads/2021/03/cubo.pdf) (OIA, Nivel 3, Problema 3, Jurisdiccional 2020)

### Modificaciones respecto del original

En el enunciado original, Agustina tiene un **cubo** de $n \times n \times n$ luces, con $3 \le n \le 8$. Hay un botón por cada prisma de $1 \times 1 \times n$ en cada una de las 3 direcciones ($3n^2$ botones en total), y la entrada es un [[array]] tridimensional $v$, donde $v[i][j][k]$ indica el estado de la luz en la posición $(i, j, k)$.

La versión que resolvemos tiene estos cambios:

- En lugar de un cubo hay un **tablero** de $n \times n$ luces.
- La cota pasa a ser $1 \le n \le 1000$.
- Hay un botón por cada fila y uno por cada columna ($2n$ botones), y cada uno invierte todas las luces de su fila o columna.
- La entrada trae $n$ y luego $n$ líneas de $n$ caracteres con el estado de cada luz.
- Se pide la mínima cantidad de pulsaciones para encender todas las luces, o $-1$ si es imposible.

---

## Intuición
A primera vista, pareciera que el problema se resuelve apretando los botones de aquellas filas o columnas con luces apagadas. Sin embargo, esto no siempre es así, ya que cada botón invierte toda una fila o columna: al encender las luces apagadas también se apagan las que ya estaban encendidas en esa misma fila o columna. Por lo tanto, es necesario analizar cuidadosamente la configuración inicial y determinar la secuencia óptima de pulsaciones de botones para lograr el objetivo.

---

## Definición formal

**Entrada:** Un entero n y luego n líneas de n caracteres cada una, con valores 0 o 1, donde 0 representa una luz apagada y 1 representa una luz encendida. Las soluciones reciben el tablero ya cargado en una matriz (un array bidimensional) $matriz$ de n × n, donde $matriz[i][j]$ es el estado de la luz en la fila i y la columna j.

**Salida:** Un valor entero que representa la mínima cantidad de pulsaciones de botones necesarias para encender todas las luces. Si no es posible lograrlo, se debe retornar −1.

**Restricciones**: n es un número entero tal que $1\le n\le 1000$.

---

## Ejemplo concreto

Si la entrada es:

```
4
0110
1001
1001
0110
```

la salida esperada es:

```
4
```

Es decir, n = 4 y la configuración inicial es:

```
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
```

Para este caso, la mínima cantidad de pulsaciones de botones necesarias para encender todas las luces es 4. Una posible secuencia de pulsaciones sería:

1. Pulsar el botón de la primera fila.

```
1 0 0 1
1 0 0 1
1 0 0 1
0 1 1 0
```

2. Pulsar el botón de la última fila.

```
1 0 0 1
1 0 0 1
1 0 0 1
1 0 0 1
```

3. Pulsar el botón de la segunda columna.

```
1 1 0 1
1 1 0 1
1 1 0 1
1 1 0 1
```
4. Pulsar el botón de la tercera columna.

```
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
```

---

## Por dónde empezar

La primera observación clave es que el orden de las pulsaciones no importa y que pulsar dos veces el mismo botón es lo mismo que no pulsarlo. Por lo tanto, alcanza con decidir para cada uno de los $2n$ botones si se pulsa o no.

Una primera aproximación es usar fuerza bruta: probar las $2^{2n}$ combinaciones posibles, simular cada una y quedarse con la que enciende todas las luces usando menos pulsaciones. Es fácil de escribir, pero solo sirve para $n$ muy chico: con $n = 1000$ es intratable.

La segunda observación es que cada luz $(i, j)$ depende solo de su estado inicial, del botón de su fila y del botón de su columna. Con backtracking se puede aprovechar esto: si primero se decide la fila 0, cada columna queda forzada por la luz de la fila 0 que le corresponde, y después cada fila queda forzada por sus luces. Así se descartan de inmediato las opciones que dejan una luz apagada, quedan a lo sumo 2 ramas completas y el problema se resuelve en $O(n^2)$, incluso con $n = 1000$.

---

## Soluciones disponibles

- [[cubo-de-luces-fuerza-bruta]]
- [[cubo-de-luces-backtracking]]
