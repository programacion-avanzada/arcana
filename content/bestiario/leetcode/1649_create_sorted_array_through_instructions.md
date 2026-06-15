---
title: '1469 - Create Sorted Array through Instructions'
tags: ['']
---

## Nombre y enunciado

<!-- qué hay que resolver, en términos precisos pero accesibles. Aquí va el enlace al original, si hubiera. -->

Dado un arreglo de enteros `instructions`, se te pide crear un arreglo ordenado a partir de los elementos en `instructions`. Comienza con un contenedor vacío `nums`. Para cada elemento de **izquierda a derecha** en `instructions`, se inserta en `nums`. El **costo** de cada inserción es el **mínimo** de lo siguiente:

- El número de elementos actualmente en `nums` que son **estrictamente menores** que `instructions[i]`.
- El número de elementos actualmente en `nums` que son **estrictamente mayores** que `instructions[i]`.

Por ejemplo, si se inserta el elemento `3` en `nums = [1,2,3,5]`, el costo de la inserción es `min(2, 1)` (los elementos `1` y `2` son menores que `3`, el elemento `5` es mayor que `3`) y `nums` se convertirá en `[1,2,3,3,5]`.

Retorna el **costo total** para insertar todos los elementos de `instructions` en `nums`. Dado que la respuesta puede ser grande, retorna el resultado **módulo** `10^9 + 7`.

**Restricciones:**

- `1 <= instructions.length <= 105`
- `1 <= instructions[i] <= 105`

[Problema original](https://leetcode.com/problems/create-sorted-array-through-instructions/)

---

## Intuición

<!-- por qué el problema es interesante o no trivial. -->

El problema es interesante porque requiere mantener un conteo eficiente de elementos menores y mayores a medida que se insertan en un arreglo ordenado. La solución ingenua de insertar cada elemento y contar los menores y mayores para cada inserción sería ineficiente, especialmente para grandes entradas. Por lo tanto, se necesitan estructuras de datos avanzadas o técnicas como la programación dinámica para resolverlo de manera eficiente.

Una solución eficiente podría involucrar el uso de un árbol de Fenwick (Binary Indexed Tree) o un árbol segmentado para mantener un conteo acumulativo de los elementos insertados, lo que permitiría calcular el costo de cada inserción en tiempo logarítmico. Esto hace que el problema sea un buen ejercicio para aprender sobre estas estructuras de datos y su aplicación en problemas de conteo y ordenamiento.

---

## Definición formal

<!-- entrada, salida, restricciones. -->

**Entrada:** Un arreglo de enteros `instructions` de longitud `n`, donde cada elemento es un entero entre `1` y `10^5`.

**Salida:** Un entero que representa el costo total para insertar todos los elementos de `instructions` en un arreglo ordenado, retornado módulo `10^9 + 7`. 

**Restricción de formato:** El resultado debe ser un solo número entero.

**Condición matemática explícita:** 


---

## Ejemplo concreto

<!-- una instancia pequeña resuelta a mano. -->

---

## Por dónde empezar

<!-- cómo abordar el problema. -->


---

## Soluciones disponibles

| Técnica | Aplica  | Por qué |
| ------- | ------- | ------- |
| Recursividad | ⚠️ | Solo como herramienta, no paradigma principal |
| División y Conquista | ✔️ | Se puede resolver con merge sort modificado |
| Greedy | ❌ | No hay elección local |
| Fuerza Bruta | ❌ | Ineficiente |
| Backtracking | ❌ | No hay búsqueda de soluciones |
| Branch & Bound | ❌ | No hay poda de estados |
| Programación Dinámica | ✔️ | Reutiliza resultados con estructuras acumulativas |

<!-- lista con enlaces a los archivos de solución del grupo. -->