---
title: LeetCode0818 - Race Car
tags:
  - leetcode
  - bestia
---
## Nombre y enunciado

Tu auto empieza en la posición `0` y tiene una velocidad inicial de `+1` en una recta infinita. El auto puede ejecutar dos instrucciones:

- `A` (Acelerar): El auto cambia su posición tal que `posición = posición + velocidad`, y la velocidad se duplica (`velocidad * 2`).
- `R` (Reversa): La posición no cambia. Si la velocidad es positiva, se convierte en `-1`. Si la velocidad es negativa, se convierte en `1`. (Es decir, se cambia de sentido de manejo).

**Problema:** Dado un entero `target`, devolver el camino de instrucciones más corto para llegar a esa posición.

[Problema original](https://leetcode.com/problems/race-car/)

---

## Intuición

A primera vista, el espacio de estados parece infinito. Como la velocidad crece exponencialmente ($2^k$), el auto avanza en bloques de la forma $2^k - 1$ (1, 3, 7, 15...). La intuición nos dice que la estrategia óptima siempre consistirá en una de dos opciones:

1. Acelerar hasta pasar el objetivo, frenar y volver hacia atrás.
2. Acelerar hasta llegar lo más cerca posible sin pasarse, frenar, retroceder para tomar impulso, volver a frenar y acelerar.

La clave es notar que cualquier posición se alcanza combinando saltos de tamaño $2^k - 1$ para acercarnos, frenar, retroceder de ser necesario y repetir el proceso. Esto transforma el problema de un espacio infinito en un árbol de decisiones acotado.

---

## Definición formal

**Entrada:** Un número entero `target` ($1$ <= `target` <= $10^4$).

**Estado del sistema:** Se define por una tupla `(posición, velocidad)`.

**Transiciones:**

- De `(pos, vel)` aplicando `A` → `(pos + vel, vel * 2)`
- De `(pos, vel)` aplicando `R` → `(pos, -1)` si `vel > 0`, o `(pos, 1)` si `vel < 0`.

**Salida:** Un entero que representa la profundidad mínima en el árbol de estados donde `pos == target`.

---

## Ejemplo concreto

Tomemos `target = 6`.
Podríamos pensar en avanzar paso a paso, pero la velocidad crece rápido.

1. Empezamos en `(0, 1)`.
2. `A`: posición = 1, velocidad = 2. (Secuencia: `A`)
3. `A`: posición = 3, velocidad = 4. (Secuencia: `AA`)
4. `A`: posición = 7, velocidad = 8. (Secuencia: `AAA` - se pasó)
5. `R`: posición = 7, velocidad = -1. (Secuencia: `AAAR`)
6. `A`: posición = 6, velocidad = -2. (Secuencia: `AAARA`)

Resultado: Llegamos a la posición 6 en 5 pasos. La longitud es 5.

---

## Por dónde empezar

La primera aproximación es fuerza bruta, donde se prueban las opciones (`A` y `R`) siempre. A esto le podemos agregar una optimización como solo meter reversas únicamente cuando tiene sentido, como cuando estamos por pasarnos del `target` o nos pasamos del `target`.

Luego podés descubrir que hay ciertas condiciones que delimitan la búsqueda como, la posición nunca va a ser menor a 0 y la posición nunca va a ser más que el doble del target: `Pos >= 0`, `Pos < target * 2`.

Finalmente para buscar una solución eficiente, se debe buscar la relación de recurrencia y dejar de pensar el problema como una simulación del movimiento del auto en un grafo infinito.

---

## Soluciones disponibles

- [[0818_race_car-bfs-fuerza-bruta]]
- [[0818_race_car-programacion-dinamica]]
