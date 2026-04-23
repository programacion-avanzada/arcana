---
title: La Profecía de los Mercaderes
tags:
  - b/dyc
---
Los mercaderes del Imperio registran el precio de la Gema Celeste día a día. Un vidente afirma que si comprás la gema en el día `i` y la vendés en el día `j` (con `i < j`), podés maximizar tu ganancia. Pero con siglos de registros, los mercaderes necesitan un algoritmo eficiente: buscar todas las parejas `(i, j)` es demasiado lento.

## Enunciado — Máxima Ganancia por Subarray
Dado un arreglo `precios[0..n-1]`, encuentra el par de índices `(i, j)` con `i < j` que maximiza `precios[j] - precios[i]`.

1. **Enfoque fuerza bruta:** describir el algoritmo $O(n^2)$ sin codificarlo.
2. **Enfoque división y conquista:** el truco está en que al dividir el arreglo en dos mitades, la ganancia máxima puede venir de (a) solo la mitad izquierda, (b) solo la mitad derecha, o (c) comprando en la mitad izquierda y vendiendo en la derecha. Plantear cómo calcular el caso (c) eficientemente.
3. Escribir la recurrencia y determinar la complejidad.

> **Semilla del Oráculo** El caso (c) se resuelve con el **mínimo de la mitad izquierda** y el **máximo de la mitad derecha**. Ambos pueden calcularse en $O(n)$ en total. La recurrencia resultante es `T(n) = 2·T(n/2) + O(n)`. ¿A qué caso del Teorema Maestro corresponde?

> **Variante (opcional):** ¿Cómo cambiaría la solución si el arreglo representara _ganancias diarias_ (pueden ser negativas) y se quisiera el subarreglo contiguo de suma máxima? Este problema se conoce como _Maximum Subarray_. ¿Coincide la recurrencia?