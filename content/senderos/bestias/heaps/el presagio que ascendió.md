---
title: El Presagio que Ascendió
tags:
  - heaps
  - desafio
---
**Dificultad:** ★☆☆☆☆

Cada vez que una nueva pesadilla toca las puertas de la Torre, un aprendiz debe anotar su nivel de amenaza y ubicarla en el Registro de las Profundidades sin desordenar lo ya construido. La regla es simple y absoluta: lo más terrible siempre tiene que poder alcanzarse en un instante, sin recorrer el registro entero. Esta noche llegaron cinco presagios, uno detrás del otro, y te toca a vos acomodarlos.

**Enunciado**

El Registro es un montículo binario de máximos (*max-heap*), representado como un arreglo.

1. Explicar cómo se representa un montículo binario en un arreglo: dar las fórmulas para calcular el padre y los hijos de una posición `i`, y justificar por qué esta representación implícita ahorra memoria frente a un árbol con nodos y punteros.
2. Describir en palabras el algoritmo de inserción con ascenso (*sift-up* / *bubble-up*): dónde se coloca el nuevo elemento y cómo se restaura la propiedad de montículo.
3. Trazar a mano la inserción secuencial de los presagios `[15, 8, 21, 4, 30]` en un montículo inicialmente vacío, mostrando el arreglo completo después de cada inserción.
4. Determinar la complejidad de una única inserción en función de la altura del árbol, y justificar por qué esa altura es $O(\log n)$ para un árbol binario completo.

> **Susurro del Archivista Insomne.** Pensá el arreglo como si fuera el árbol recorrido nivel por nivel, de izquierda a derecha. Si una amenaza está en la posición `i` (contando desde 0), sus hijos están en `2i+1` y `2i+2`, y su padre en `(i-1)//2`. El ascenso compara la nueva amenaza con su padre: mientras sea más terrible que él, intercambian de lugar.

> **Reflexión.** La propiedad de montículo dice que un padre es siempre más terrible (o igual) que sus hijos. Sin embargo, eso **no** implica que el arreglo esté ordenado de mayor a menor. Construí un contraejemplo concreto con 4 o 5 elementos: un arreglo que cumpla la propiedad de montículo pero que, leído de izquierda a derecha, no esté ordenado.
