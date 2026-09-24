---
title: El Camino más corto a Mordor
tags:
  - hub
  - sendero
---

Frodo lleva el Anillo desde la Comarca, y cada tramo del camino tiene un costo que no siempre se mide en kilómetros: a veces es tiempo, a veces es peligro, y cerca del final hasta la voluntad de quien lo lleva empieza a pesar en contra. Este sendero recorre tres problemas distintos sobre la misma pregunta de fondo: ¿cuál es el camino que menos cuesta, cuando "costo" puede significar varias cosas a la vez, y qué pasa cuando esa cuenta deja de tener sentido?

---

![[el camino a bree]]

---

![[caradhras o moria]]

---

![[la sombra del anillo]]

---

Si este sendero te dejó pensando en qué pasa cuando el costo deja de sumar y empieza a restar: eso es exactamente lo que resuelve Bellman-Ford, más lento que Dijkstra pero capaz de tolerar pesos negativos y hasta detectar cuando un ciclo negativo hace que la pregunta "¿cuál es el camino más corto?" directamente deje de tener respuesta. Y en el otro extremo, cuando lo que hay que optimizar no es cómo llegar de un punto a otro sino cómo conectar toda una red gastando lo menos posible (unir cada reino de la Tierra Media con el menor número de puentes, por ejemplo), ahí empiezan Kruskal y Prim.
