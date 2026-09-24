---
title: El Destierro del Horror Mayor
tags:
  - heaps
  - desafio
---
**Dificultad:** ★★☆☆☆

Cuando se acerca el amanecer, la Orden debe enfrentar a la amenaza más peligrosa registrada hasta el momento y desterrarla, para que la Torre pueda respirar un día más. Pero el Registro no puede quedar vacío en su cima: algo debe ocupar ese lugar, y ese algo tiene que abrirse paso hacia abajo hasta encontrar su verdadero sitio.

**Enunciado**

1. Describir en palabras el algoritmo de extracción del máximo (`extract-max`): qué se hace con el último elemento del arreglo y cómo se restaura la propiedad de montículo mediante descenso (*sift-down* / *heapify-down*).
2. Trazar a mano `extract-max` sobre el montículo `[30, 21, 15, 4, 8, 12, 9]`, mostrando el arreglo completo después de cada paso del descenso.
3. Determinar y justificar la complejidad de una extracción, relacionándola con la altura del árbol (de la misma forma que analizaste la inserción en el Ejercicio 1, pero ahora para el descenso).
4. Completar la siguiente tabla con la complejidad de cada operación para tres estructuras distintas, y estar preparado para justificar cada celda:

   | Estructura            | Encontrar el máximo | Insertar | Extraer el máximo |
   |------------------------|:---:|:---:|:---:|
   | Arreglo sin ordenar    |     |     |     |
   | Arreglo ordenado       |     |     |     |
   | Montículo (heap)       |     |     |     |

> **Susurro del Archivista Insomne.** El descenso no es solo "bajar": en cada nivel hay que elegir con cuál de los dos hijos comparar. Si el nodo es menor que alguno de sus hijos, tiene que intercambiar con el **mayor** de los dos... si intercambiara con el menor, la propiedad de montículo podría quedar rota un nivel más abajo.

> **Reflexión.** Si la Orden necesitara encontrar la amenaza más peligrosa **una sola vez**, sin volver a insertar ni a extraer nada más, ¿seguiría siendo el montículo la mejor estructura para el trabajo? ¿Por qué sí o por qué no?
