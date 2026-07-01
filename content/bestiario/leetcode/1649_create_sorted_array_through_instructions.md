---
title: '1469 - Create Sorted Array through Instructions'
tags: ['leetcode', 'python', 'fenwick tree', 'binary indexed tree', 'merge sort', 'divide and conquer']
---

## Nombre y enunciado

<!-- qué hay que resolver, en términos precisos pero accesibles. Aquí va el enlace al original, si hubiera. -->

Dado un arreglo de enteros `instructions`, se te pide crear un arreglo ordenado a partir de los elementos en `instructions`. Comienza con un contenedor vacío `nums`. Para cada elemento de **izquierda a derecha** en `instructions`, se inserta en `nums`. El **costo** de cada inserción es el **mínimo** de lo siguiente:

- El número de elementos actualmente en `nums` que son **estrictamente menores** que `instructions[i]`.
- El número de elementos actualmente en `nums` que son **estrictamente mayores** que `instructions[i]`.

Por ejemplo, si se inserta el elemento `3` en `nums = [1,2,3,5]`, el costo de la inserción es `min(2, 1)` (los elementos `1` y `2` son menores que `3`, el elemento `5` es mayor que `3`) y `nums` se convertirá en `[1,2,3,3,5]`.

Retorna el **costo total** para insertar todos los elementos de `instructions` en `nums`. Dado que la respuesta puede ser grande, retorna el resultado **módulo** `10^9 + 7`.

**Restricciones:**

- `1 <= instructions.length <= 10^5`
- `1 <= instructions[i] <= 10^5`

[Problema original](https://leetcode.com/problems/create-sorted-array-through-instructions/)

---

## Intuición

<!-- por qué el problema es interesante o no trivial. -->

A primera vista parece un problema de simulación directa: insertar cada elemento y contar cuántos son menores y mayores. El problema es que con hasta 10⁵ elementos, una simulación no inteligente requiere recorrer el arreglo completo en cada inserción, dando ``O(n²)`` operaciones en total, lo cual no es eficiente.

Lo interesante es que el costo no depende de dónde se inserta el elemento, sino de cuántos elementos ya insertados caen a cada lado de él en el orden numérico. Esto convierte el problema en uno de consultas de rango sobre un conjunto dinámico: para cada nuevo valor ``v``, necesitamos saber cuántos valores previos son ``< v`` y cuántos son ``> v``, de forma eficiente.

El problema, entonces, no es de simulación sino de estructura de datos: ¿cómo mantener un multiconjunto de enteros y responder consultas de prefijo en O(log n)?

---

## Definición formal

<!-- entrada, salida, restricciones. -->

**Entrada:** Un arreglo de enteros `instructions` de longitud `n`, donde cada elemento es un entero entre `1` y `10^5`.

**Salida:** Un entero que representa el costo total para insertar todos los elementos de `instructions` en un arreglo ordenado, retornado módulo `10^9 + 7`. 

**Restricción de formato:** El resultado debe ser un solo número entero.

**Condición matemática explícita:** 

---

## Ejemplo concreto

<!-- un ejemplo de entrada y salida, con explicación paso a paso. -->

Tomemos `instructions = [1, 5, 6, 2]`.

| Paso | Valor | nums antes       | Menores | Mayores | Costo |
|------|-------|------------------|---------|---------|-------|
| 1    | 1     | []               | 0       | 0       | 0     |
| 2    | 5     | [1]              | 1       | 0       | 0     |
| 3    | 6     | [1, 5]           | 2       | 0       | 0     |
| 4    | 2     | [1, 5, 6]        | 1       | 2       | 1     |

Costo total = `0 + 0 + 0 + 1 = 1`.

Al insertar el 2, hay 1 elemento menor (el 1) y 2 mayores (el 5 y el 6). `min(1, 2) = 1`.

---

## Por dónde empezar

<!-- cómo abordar el problema. -->

Una primera aproximación razonable es **fuerza bruta**: mantener `nums` como lista ordenada y, por cada elemento nuevo, recorrerla para contar menores y mayores. Eso es `O(n²)` pero permite entender el problema y verificar resultados.

El siguiente paso es notar que solo necesitamos saber, para cada nuevo valor `v`, cuántos de los valores anteriores caen en `[1, v-1]`. Esto es una **suma de prefijo sobre frecuencias**, lo que sugiere usar un árbol de Fenwick (Binary Indexed Tree) o un árbol de segmentos. Con cualquiera de estas estructuras, cada consulta e inserción cuesta `O(log(max_val))`.

Una alternativa que no requiere estructuras de datos adicionales es usar **Merge Sort**: al ordenar los índices por valor, el proceso de fusión permite contar elementos menores de forma implícita, en el espíritu del conteo de inversiones.

---

## Soluciones disponibles

<!-- lista con enlaces a los archivos de solución del grupo. -->

- [Fuerza Bruta](./1649_create_sorted_array-fuerza-bruta.md)
- [División y Conquista (Merge Sort)](./1649_create_sorted_array-division-y-conquista.md)