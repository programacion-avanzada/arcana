---
title: Los Cinco Oráculos y el Cómputo de las Sombras
tags:
  - heaps
  - desafio
---
**Dificultad:** ★★★★☆

Cinco oráculos ciegos susurran presagios sin parar, cada uno en su propio orden creciente de espanto, cada uno ajeno a los demás. La Orden necesita una única secuencia que combine las cinco, sin detener a ningún oráculo y sin volver a ordenar lo que ya venía ordenado. El desorden total sería intolerable; pero reordenar todo desde cero, una herejía innecesaria.

**Enunciado**

Hay `k` secuencias, cada una ya ordenada de forma creciente, con `n` elementos en total entre todas.

1. Explicar por qué concatenar las `k` secuencias y volver a ordenar todo con un algoritmo de comparación general no es la mejor estrategia. ¿Cuál sería la complejidad de hacerlo así, en función de `k` y de `n`?
2. Diseñar un algoritmo que combine las `k` secuencias en una sola, ordenada, usando una cola de prioridad de tamaño `k`, donde en cada paso se extrae el mínimo actual y se inserta el siguiente elemento de la secuencia de la que provino. Describir el algoritmo paso a paso.
3. ¿Qué información hay que guardar en cada elemento de la cola de prioridad, además del valor del presagio, para saber de qué secuencia vino y cuál es su próximo elemento? Proponer una estructura concreta (por ejemplo, una tupla) para representarlo.
4. Determinar la complejidad total del algoritmo en función de `k` y `n`, y compararla con la del método ingenuo del punto 1.
5. Trazar a mano el algoritmo con estas tres secuencias:
   - Oráculo A: `[2, 9, 14]`
   - Oráculo B: `[4, 5, 20]`
   - Oráculo C: `[1, 8, 11, 30]`

   mostrando el estado de la cola de prioridad y la secuencia de salida generada en cada paso.

> **Susurro del Archivista Insomne.** Cada elemento que sacás de la cola te dice de qué secuencia vino. Apenas lo sacás, insertá el siguiente elemento de esa misma secuencia (si le queda alguno). La cola nunca crece más allá de `k` elementos, y ahí está la clave de por qué esto sale más barato que juntar y ordenar todo de una vez.

> **Reflexión.** Ahora supongamos que la Orden no necesita las amenazas combinadas y ordenadas por completo, sino solamente **las `m` amenazas más peligrosas de todo el conjunto** (con `m` mucho menor que `n`), sin importar el orden del resto. ¿Convendría usar una cola de prioridad de tamaño `n`? ¿De qué tamaño convendría que fuera, y por qué eso cambia el resultado?
