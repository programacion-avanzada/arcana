---
title: Leetcode1739 - Building Boxes
tags: ['b/leetcode']
---

## Nombre y enunciado

[LeetCode 1739 - Building Boxes](https://leetcode.com/problems/building-boxes/)

Tenemos una habitación cúbica cuyo ancho, largo y alto valen `m` unidades. Hay que ubicar `n`
cajas, donde cada caja es un cubo de lado unitario. Las reglas para apoyarlas son:

- Se puede colocar cualquier caja directamente sobre el piso.
- Si una caja `x` se apoya encima de una caja `y`, entonces cada uno de los cuatro lados
  verticales de `y` debe estar adyacente a otra caja o a una pared.

Dado `n`, hay que devolver la **mínima cantidad de cajas que tocan el piso**.

---

## Intuición

Para que la cantidad de cajas que tocan el piso sea la mínima, necesitamos apilar las cajas lo más alto posible. Esto se logra de la siguiente manera:

### Aprovechando las paredes

Para poner una caja arriba de otra, la caja de abajo tiene que tener sus 4 caras verticales adyacentes a otra caja o a una pared. Si armamos nuestra torre en el medio de la habitación, necesitamos rodear la caja base con 4 cajas. Pero si nos vamos a una esquina, las dos paredes de la habitación ya nos cubren 2 caras. Solo necesitamos poner 2 cajas adicionales para cubrir las caras restantes.

### Base

Para tener 1 caja en el nivel 2, la caja base (nivel 1, la que está justo en el vértice de la esquina) necesita estar rodeada por 2 cajas adyacentes. Esto forma un pequeño triángulo en el piso de 3 cajas.
Para tener 1 caja en el nivel 3, necesitás un triángulo de 3 cajas en el nivel 2. Y para sostener esas 3 cajas del nivel 2, necesitás un triángulo más grande en el piso (nivel 1) compuesto por 6 cajas.
Las bases de cada nivel terminan siendo números triangulares (la sucesión de cantidades que pueden representarse geométricamente como puntos ordenados en forma de triángulo equilátero).

![Piso triangular](piso_triangular.svg)

### Total de cajas

Si logramos armar una "pirámide de esquina" perfecta de altura k, la cantidad total de cajas que usamos es simplemente la suma de las cajas de todos esos niveles triangulares.
La suma acumulada de los números triangulares genera otra secuencia, los números tetraédricos (número figurado que representa la cantidad de objetos o esferas necesarios para formar una pirámide de base triangular).

El problema es muy interesante porque plantea un escenario físico de equilibrio y soporte 3D que, al ser analizado a fondo, se traduce directamente en un patrón de series matemáticas puras (números triangulares para el área). Obliga a pensar cómo maximizar el crecimiento vertical sacrificando la menor cantidad posible de crecimiento horizontal.

---

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

---

## Ejemplo concreto

Tomemos una instancia resuelta a mano: n = 10.
Para apilar la mayor cantidad de cajas con la menor base, empezamos encajándolas en el rincón.

Nivel 1 (Piso): Colocamos 6 cajas formando un triángulo rectángulo pegado a las paredes (poniendo 1 en la esquina de las paredes, 2 cajas más para cubrir la caja anterior y luego 3 cajas más para cubrir las 2 cajas anteriores).

Nivel 2: Sobre esas 6 cajas del piso, hay soporte exacto en el interior para colocar 3 cajas (formando un triángulo de 2 y 1).

Nivel 3: Sobre esas 3 cajas, hay soporte central para colocar exactamente 1 caja en la punta superior.
Suma de cajas apiladas = 6 (piso) + 3 + 1 = 10 cajas.
Respuesta final: 6 cajas tocan el suelo.

![Representación de n10](boxes_n10.svg)

---

## Por dónde empezar

Un buen primer paso es dejar de pensar en cubos individuales y preguntarse **qué forma** deja
apilar la mayor cantidad de cajas por cada caja de piso. Conviene analizar cómo crece la
estructura cuando la construimos por niveles apoyada en el rincón, y qué relación hay entre el
tamaño de la base y la cantidad total de cajas que puede sostener.

![Regla Esquina](regla_esquina.svg)

A partir de ahí aparece una decisión natural: dado `n`, ¿cuál es la base más chica que alcanza?
Las soluciones del grupo atacan esa pregunta desde ángulos distintos: una construye la
respuesta directamente y la otra la busca aprovechando una propiedad de monotonía. Ambas
parten de entender primero esa relación entre base y capacidad total.

---

## Soluciones disponibles

- [[1739_building_boxes-greedy]]
- [[1739_building_boxes-division_y_conquista]]

---

## Referencias

- [LeetCode 1739 - Building Boxes](https://leetcode.com/problems/building-boxes/)
- [Diagrama de Young](https://en.wikipedia.org/wiki/Young_diagram) - el layout de alturas no
  crecientes que induce la regla de soporte
