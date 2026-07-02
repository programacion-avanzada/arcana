---
title: "Building Boxes — Descripción del problema"
problema: "LeetCode 1739 - Building Boxes"
---

## Nombre y enunciado

**[LeetCode 1739 — Building Boxes](https://leetcode.com/problems/building-boxes/)**

Tenemos una habitación cúbica cuyo ancho, largo y alto valen `n` unidades. Hay que ubicar `n`
cajas, donde cada caja es un cubo de lado unitario. Las reglas para apoyarlas son:

- Se puede colocar cualquier caja directamente sobre el piso.
- Si una caja `x` se apoya encima de una caja `y`, entonces cada uno de los cuatro lados
  verticales de `y` debe estar adyacente a otra caja o a una pared.

Dado `n`, hay que devolver la **mínima cantidad de cajas que tocan el piso**.

## Intuición

Lo interesante del problema es que la respuesta no depende de *dónde* ponemos cada caja, sino de
qué **forma** global adopta el conjunto. La regla de soporte es más exigente de lo que aparenta:
para poder apilar una caja encima de otra, la de abajo tiene que estar rodeada por sus cuatro
lados, ya sea con paredes o con otras cajas. No se puede apilar "en el aire" ni sobre una torre
aislada.

Eso genera una tensión: cada caja que subimos a un nivel más alto nos ahorra piso, pero para
sostenerla necesitamos que abajo haya suficiente estructura. Apilar de más sin respaldo es
inválido; apilar de menos desperdicia altura y gasta piso. El corazón del problema es encontrar
el equilibrio entre "cuánto apilo hacia arriba" y "cuánta base necesito para que eso se sostenga".

Además, el rango de `n` es grande, así que no alcanza con ir probando configuraciones o ubicando
cajas de a una: hay que entender la estructura del óptimo para poder calcularlo, no construirlo
paso a paso.

![Piso triangular](piso_triangular.svg)

## Definición formal

**Entrada.** Un entero `n`.

**Salida.** Un entero: la mínima cantidad de cajas que tocan el piso en alguna configuración
válida que contenga exactamente `n` cajas.

**Restricciones.**

$$
1 \le n \le 10^{9}
$$

El límite superior de $10^9$ es parte del problema: descarta cualquier enfoque que recorra las
`n` cajas de a una y empuja hacia soluciones que razonen sobre la estructura en lugar de
enumerarla.

## Ejemplos

Example 1:

Input: n = 3

Output: 3

Explanation: La figura representa el posicionamiento de tres cajas

![Representación de n3](boxes_n3.svg)

Example 2:

Input: n = 4

Output: 3

Explanation: La figura representa el posicionamiento de cuatro cajas

![Representación de n4](boxes_n4.svg)

Example 3:

Input: n = 10

Output: 6

Explanation: La figura representa el posicionamiento de diez cajas

![Representación de n10](boxes_n10.svg)


## Por dónde empezar

Un buen primer paso es dejar de pensar en cubos individuales y preguntarse **qué forma** deja
apilar la mayor cantidad de cajas por cada caja de piso. Conviene analizar cómo crece la
estructura cuando la construimos por niveles apoyada en el rincón, y qué relación hay entre el
tamaño de la base y la cantidad total de cajas que puede sostener.

A partir de ahí aparece una decisión natural: dado `n`, ¿cuál es la base más chica que alcanza?
Las soluciones del grupo atacan esa pregunta desde ángulos distintos —una **construye** la
respuesta directamente y la otra la **busca** aprovechando una propiedad de monotonía—, pero
ambas parten de entender primero esa relación entre base y capacidad total.

## Soluciones disponibles

- [**Greedy**](./1739_building_boxes_greedy.md)
- [**División y conquista**](./1739_building_boxes-division_y_conquista.md)

## Referencias

- [LeetCode 1739 — Building Boxes](https://leetcode.com/problems/building-boxes/)
- [Diagrama de Young](https://en.wikipedia.org/wiki/Young_diagram) — el layout de alturas no
  crecientes que induce la regla de soporte
