---
title: La Sombra del Anillo
tags:
  - dijkstra
  - desafio
---

### Dificultad: ★★★☆☆

Cerca de Cirith Ungol, Gollum promete un atajo. Frodo, cada vez más rendido al peso del Anillo, siente que aceptarlo cuesta menos de lo que debería, y ese es exactamente el problema: en esta red, algunos tramos "restan" en lugar de sumar, y hay un rincón cerca del túnel de Ella-Laraña del que, una vez adentro, cuesta muchísimo salir.

### Enunciado

Se modela la situación como un grafo dirigido $G=(V,E)$ con pesos que pueden ser negativos: un peso negativo representa un tramo que el Anillo hace sentir "más liviano" de lo que en verdad es.

1. Sobre la siguiente red, intentar correr Dijkstra a mano desde las Escaleras de Cirith Ungol:

| Desde                     | Hasta                 | Peso |
| ------------------------- | --------------------- | ---- |
| Escaleras de Cirith Ungol | Túnel de Ella-Laraña  | 4    |
| Escaleras de Cirith Ungol | Paso de los Espías    | 10   |
| Túnel de Ella-Laraña      | Atajo de Gollum       | -3   |
| Atajo de Gollum           | Túnel de Ella-Laraña  | -2   |
| Túnel de Ella-Laraña      | Paso de los Espías    | 6    |
| Paso de los Espías        | Torre de Cirith Ungol | 3    |

Indicar en qué punto exacto se rompe el argumento de la propiedad de corte: cuál sería el nodo $w$ que Dijkstra cerraría de más, y qué nodo $u$ tiene, en realidad, un camino más corto que Dijkstra nunca llegaría a encontrar.

2. Identificar el ciclo negativo de la red: cuáles son sus aristas y cuánto vale su peso total. Explicar, en términos de la historia, qué representa quedar atrapado en un ciclo negativo en este contexto.
3. ¿Qué algoritmo sí permite detectar este problema? Explicar a alto nivel, sin trazarlo a mano, qué tendría que hacer distinto de Dijkstra para lograrlo.
4. Si el ciclo negativo no existiera pero igual hubiera algún tramo con peso negativo, ¿alcanzaría con ignorar esos tramos y correr Dijkstra normalmente sobre el resto? Justificar.
