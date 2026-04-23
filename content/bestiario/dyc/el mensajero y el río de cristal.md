---
title: 'El Mensajero y el Río de Cristal'
tags: [b/dyc]
---
El mensajero Aldric debe cruzar el Río de Cristal, dividido en n secciones. Cada sección tiene una altura de corriente. Aldric necesita encontrar la sección con la corriente más alta para evitarla. No tiene tiempo de recorrer todo el río: debe hacerlo en el menor tiempo posible.

## Enunciado
Dado un arreglo de `n` enteros que representa las alturas de corriente de cada sección del río, plantea un algoritmo de división y conquista para encontrar el valor máximo.

1. Describir el caso base y el paso recursivo en palabras.
2. Escribir la recurrencia de tiempo T(n).
3. Usar el Teorema Maestro para resolverla y obtener la complejidad final.
4. ¿Es esta una mejora respecto a una búsqueda lineal? Justificar.

> **Pista del Oráculo.** La recurrencia que encontrarás es T(n) = 2·T(n/2) + O(1). El trabajo de combinar dos soluciones (comparar dos máximos) es constante. Aplica el Caso 1 del Teorema Maestro.

> ⚠ Reflexión Trampa. Antes de responder el punto 4, pensalo bien: ¿obtener el máximo con división y conquista es asintóticamente mejor que un simple recorrido lineal? ¿Por qué alguien lo usaría (o no)?