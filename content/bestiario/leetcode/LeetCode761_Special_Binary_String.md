---
title: LeetCode0761 - Special Binary String
tags:
  - b/leetcode
---

## Nombre y enunciado

Un **Special Binary String** (Cadena Binaria Especial) es una [[string|cadena]] compuesta únicamente por caracteres `'0'` y `'1'` que cumple las siguientes condiciones:

1. El número de caracteres `'1'` es igual al número de caracteres `'0'`.
2. Para cualquier prefijo de la [[string|cadena]], el número de caracteres `'1'` es mayor o igual al número de caracteres `'0'`.

Se nos permite realizar una operación: elegir dos subcadenas especiales consecutivas, no vacías, e intercambiarlas. Dos subcadenas son consecutivas si el final de la primera coincide inmediatamente con el inicio de la segunda. El objetivo es realizar cualquier cantidad de estos intercambios para obtener la [[string|cadena]] **lexicográficamente más grande** posible.

[Problema original en LeetCode](https://leetcode.com/problems/special-binary-string/)

---

## Intuición

A primera vista, el problema de intercambiar subcadenas consecutivas para maximizar lexicográficamente el resultado parece complejo de modelar directamente sobre cadenas binarias. La clave para simplificar el problema radica en realizar una analogía matemática:

Si reemplazamos cada `'1'` por un paréntesis de apertura `(` y cada `'0'` por un paréntesis de cierre `)`, las dos propiedades de una [[string|cadena]] binaria especial se traducen exactamente en las reglas de una **secuencia de paréntesis balanceada**:
- La cantidad de `(` es igual a la de `)`.
- En ningún prefijo hay más `)` que `(`.

Además, dado que toda [[string|cadena]] especial empieza con `'1'` y termina con `'0'`, podemos pensar en cada componente especial básico como un bloque rodeado por un par de paréntesis más externo que contiene a su vez otra secuencia balanceada (posiblemente vacía): `( ... )`, lo que en binario equivale a `1 + especial_interno + 0`.

Bajo esta perspectiva:
- Las subcadenas especiales consecutivas son **hermanos** dentro del árbol de anidamiento de los paréntesis.
- Intercambiar subcadenas consecutivas equivale a reordenar estos hermanos.
- Dado que queremos maximizar la [[string|cadena]] lexicográficamente (es decir, poner los `'1'` (`(`) lo más a la izquierda posible y los `'0'` (`)`) lo más a la derecha), la estrategia óptima para reordenar un conjunto de subcadenas especiales hermanas es simplemente ordenarlas en **orden descendente**.

Esta estructura recursiva permite resolver el problema descomponiendo la [[string|cadena]] en sus componentes independientes de nivel superior, optimizando recursivamente el interior de cada componente, y luego ordenándolos de manera ávida (greedy).

---

## Definición formal

**Entrada:**
- Una [[string|cadena]] de caracteres $S$ de longitud $N$ ($2 \le N \le 50$), compuesta únicamente por `'0'` y `'1'`, que se garantiza que es una [[string|cadena]] binaria especial.

**Salida:**
- La [[string|cadena]] binaria especial lexicográficamente más grande obtenida tras aplicar cualquier número de intercambios válidos de subcadenas especiales consecutivas.

**Restricciones:**
- $N$ es par (debido a la cantidad igual de ceros y unos).
- La entrada es siempre una [[string|cadena]] binaria especial válida.

---

## Ejemplo concreto

Tomemos la [[string|cadena]] binaria especial $S = \text{"11011000"}$.

1. **Descomposición de primer nivel:**
   Comenzamos a recorrer de izquierda a derecha manteniendo un contador de balance (incrementado por `'1'`, decrementado por `'0'`).
   - `S[0] = '1'` (balance = 1)
   - `S[1] = '1'` (balance = 2)
   - `S[2] = '0'` (balance = 1)
   - `S[3] = '1'` (balance = 2)
   - `S[4] = '1'` (balance = 3)
   - `S[5] = '0'` (balance = 2)
   - `S[6] = '0'` (balance = 1)
   - `S[7] = '0'` (balance = 0) $\to$ Alcanzamos balance 0 al final.

   Esto significa que toda la [[string|cadena]] $S$ es una única subcadena especial en el nivel superior.
   Se expresa como: `1` + $S_{interno}$ + `0`, donde $S_{interno} = \text{"101100"}$.

2. **Resolución recursiva de $S_{interno}$:**
   Analizamos $S_{interno} = \text{"101100"}$ y lo descomponemos en sus componentes de nivel superior:
   - `S_int[0] = '1'` (balance = 1)
   - `S_int[1] = '0'` (balance = 0) $\to$ Primer bloque especial: $A = \text{"10"}$.
   - `S_int[2] = '1'` (balance = 1)
   - `S_int[3] = '1'` (balance = 2)
   - `S_int[4] = '0'` (balance = 1)
   - `S_int[5] = '0'` (balance = 0) $\to$ Segundo bloque especial: $B = \text{"1100"}$.

   Tenemos dos subcadenas especiales consecutivas: $A = \text{"10"}$ y $B = \text{"1100"}$.

3. **Llamadas recursivas para $A$ y $B$:**
   - Para $A = \text{"10"}$, el interior es vacío $\to$ Retorna $\text{"10"}$.
   - Para $B = \text{"1100"}$, el interior es $\text{"10"}$. Al procesar el interior $\text{"10"}$, retorna $\text{"10"}$. Reconstruyendo $B$: `1` + $\text{"10"}$ + `0` = $\text{"1100"}$.

4. **Combinación y reordenamiento de los bloques en $S_{interno}$:**
   Tenemos los bloques procesados: $A = \text{"10"}$ y $B = \text{"1100"}$.
   Dado que son consecutivos y de nivel superior dentro de $S_{interno}$, podemos intercambiarlos.
   Para maximizar lexicográficamente, los ordenamos de forma descendente:
   - Comparación: $\text{"1100"} > \text{"10"}$.
   - Resultado ordenado: $\text{"1100"} + \text{"10"} = \text{"110010"}$.

5. **Reconstrucción del nivel superior:**
   Reconstruimos el resultado final envolviendo la versión óptima de $S_{interno}$ con el `'1'` inicial y `'0'` final correspondientes al nivel superior:
   - $\text{"1"} + \text{"110010"} + \text{"0"} = \text{"11100100"}$.

**Resultado final:** $\text{"11100100"}$.

---

## Por dónde empezar

Para abordar este problema, es fundamental:

1. **Entender la analogía de los paréntesis:** Visualizar la [[string|cadena]] como un árbol de anidamiento de subcadenas balanceadas.
2. **Definir el caso base de la recursión:** Las cadenas vacías o cadenas de longitud 2 ($\text{"10"}$) no se pueden descomponer ni reordenar internamente.
3. **Pensar en la estrategia Greedy:** ¿Por qué ordenar de forma descendente las subcadenas especiales hijas garantiza que la [[string|cadena]] resultante sea la lexicográficamente más grande?
4. **Contrastar con Fuerza Bruta:** Para entender el impacto de la estructura de paréntesis, conviene implementar primero un Backtracking clásico que intente realizar todas las permutaciones posibles de subcadenas especiales consecutivas en cualquier parte de la [[string|cadena]] y evalúe la ineficiencia exponencial que esto genera.

---

## Soluciones disponibles

- [[LeetCode761_Special_Binary_String-Backtracking]]
- [[LeetCode761_Special_Binary_String-RecursivoGreedy]]
