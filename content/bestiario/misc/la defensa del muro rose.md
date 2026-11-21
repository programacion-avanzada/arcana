---
title: La defensa del Muro Rose
tags:
  - bestia
---

## Nombre y enunciado

El cuerpo de Ingenieros de la Legión de Reconocimiento fue asignado a proteger el **Muro Rose** ante un inminente ataque de titanes.

A lo largo del muro se instalaron cañones de defensa. Cada cañón tiene un alcance limitado, que le permite cubrir una porción específica del muro. Sin embargo, activar un cañón consume una gran cantidad de pólvora y recursos, por lo que solo deben encenderse los estrictamente necesarios para proteger toda la sección crítica del muro.

---

## Definición formal

**Entrada:**

El tramo de muro a defender está representado por el intervalo:

$$[L, R]$$

Cada cañón posee:

- una posición $x_i$, que indica su ubicación sobre el muro, medida en metros desde el punto $0$;
- un alcance $r_i$, medido en metros.

Por lo tanto, el cañón $i$ cubre el segmento:

$$[x_i - r_i, x_i + r_i]$$

Además, se asegura que:

- es posible cubrir todo el tramo $[L, R]$ con los cañones disponibles;
- todos los valores son positivos y reales.

**Salida:**

Activar la menor cantidad posible de cañones de forma que cada punto del muro dentro del intervalo $[L, R]$ esté protegido por al menos un cañón. La salida debe indicar:

1. el número mínimo de cañones activados;
2. la lista de cañones seleccionados, ya sea por índice o por posición.

---

## Ejemplo concreto

Tramo a defender:

$$[L, R] = [0, 20]$$

Los ingenieros disponen de los siguientes cañones:

| Cañón | Posición $(x_i)$ | Alcance $(r_i)$ | Segmento cubierto |
|---|---:|---:|---|
| C1 | 2 | 3 | $[-1, 5]$ |
| C2 | 7 | 5 | $[2, 12]$ |
| C3 | 14 | 4 | $[10, 18]$ |
| C4 | 17 | 6 | $[11, 23]$ |
| C5 | 20 | 2 | $[18, 22]$ |
| C6 | 5 | 1 | $[4, 6]$ |

Salida esperada:

```text
Cañones seleccionados: C1, C2 y C4
Número mínimo: 3 cañones activados
```

---

## Por dónde empezar

La tarea consiste en diseñar un algoritmo de defensa **ávido** que determine qué cañones deben activarse para que toda la muralla quede bajo protección, minimizando la cantidad de cañones encendidos.

---

## Soluciones disponibles

- [[la defensa del muro rose-greedy]]
