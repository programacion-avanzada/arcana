---
title: La Balanza de la Medianoche
tags:
  - heaps
  - desafio
---
**Dificultad:** ★★★★★

En el centro de la Torre cuelga una balanza que nadie recuerda haber construido. No pesa objetos: pesa presagios, y siempre debe señalar cuál es el nivel de amenaza que divide exactamente a la mitad todo lo registrado hasta el momento (ni más liviano, ni más pesado). Los presagios no dejan de llegar, y la balanza no puede detenerse jamás a reordenar el archivo completo para responder.

**Enunciado**

El objetivo es mantener la **mediana** de un flujo de valores que van llegando de a uno, pudiendo consultarla en cualquier momento sin volver a ordenar todo lo recibido hasta ahí.

1. Explicar la idea general de resolver este problema con **dos montículos**: uno de máximos, con la mitad "menor" de los valores vistos hasta el momento, y otro de mínimos, con la mitad "mayor", de forma que la raíz de cada uno quede siempre cerca del centro de la distribución.
2. Describir el invariante de tamaños que hay que mantener entre ambos montículos después de cada inserción, necesario para poder calcular la mediana en $O(1)$ a partir de sus raíces.
3. Diseñar el algoritmo de inserción de un nuevo valor: a qué montículo entra primero, en qué condición hay que "pasar" un elemento de un montículo al otro para restaurar el invariante del punto 2, y cómo se calcula la mediana según la paridad de la cantidad total de elementos.
4. Trazar a mano la inserción, uno por uno, de los presagios `[12, 5, 27, 8, 19, 3, 15]`, mostrando el estado de ambos montículos y la mediana reportada después de cada inserción.
5. Determinar la complejidad de insertar un nuevo valor y de consultar la mediana, y comparar con la alternativa de mantener en todo momento un arreglo completamente ordenado.

> **Susurro del Archivista Insomne.** Si en algún momento un montículo queda con más de un elemento de diferencia respecto al otro, movés la raíz del más grande hacia el otro. La mediana sale de la raíz del montículo con más elementos (si los tamaños son distintos) o del promedio de ambas raíces (si son iguales).

> **Reflexión final.** ¿Por qué no alcanza con un solo montículo para resolver este problema? ¿Qué información se pierde si se intenta usar únicamente un max-heap, o únicamente un min-heap, con todos los valores adentro?
