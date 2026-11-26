---
tags:
  - hub
  - sendero
title: La Anomalía en la Matrix
---

Se dice que Smith es "la anomalía": el resultado inevitable de un sistema que, tarde o temprano, empieza a copiarse a sí mismo sin pedir permiso. Zion lo sabe, y por eso antes de actuar necesita entender la red en la que se mueve. Qué tan lejos puede llegar una amenaza, si hay caminos de vuelta, si conviene revisar cada rincón una sola vez o si un reinicio puede completarse sin trabarse en sí mismo. Este sendero recorre cuatro problemas distintos sobre la misma pregunta de fondo: ¿qué se puede saber de una red, sin recorrerla entera a ciegas, antes de decidir qué hacer con ella?

Vas a seguir la propagación de Smith apenas consigue su primer host, vas a acompañar a un equipo que busca una salida por los túneles de mantenimiento de Zion, vas a caminar con Seraph una ronda que no admite un solo paso de más, y vas a terminar reiniciando el núcleo de Zion pieza por pieza, con la certeza de que un solo error de dependencia puede dejarlo todo trabado para siempre.

---

![[la multiplicacion del agente]]

---

![[los túneles de zion]]

---

![[la ronda de seraph]]

---

![[el reinicio del nucleo]]

---

Si este sendero te dejó pensando en cuánto se puede llegar a saber de una red sin perderse en ella: DFS y BFS son apenas la puerta de entrada. La misma idea de "explorar sistemáticamente" es la base de Dijkstra (BFS, pero con pasillos que no cuestan todos lo mismo) y de Kruskal y Prim (para conectar toda una red gastando lo menos posible). En todos los casos el desafío nunca es mirar el grafo entero de una sola vez: es encontrar la forma correcta de recorrerlo, un paso genuino por vez.
