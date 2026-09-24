---
title: El Camino a Bree
tags:
  - dijkstra
  - bfs
  - desafio
---

### Dificultad: ★☆☆☆☆

Los Jinetes Negros ya cruzaron el Bosque de Tejones buscando el Anillo, y la Compañía todavía no sabe cuántos días de ventaja tiene antes de que la búsqueda llegue a Bree. Por ahora, cada sendero entre dos puntos de la Comarca toma exactamente un día: la pregunta es simplemente cuántos días hacen falta, no cuáles convienen más.

### Enunciado

Se modela la red de senderos como un grafo no dirigido $G=(V, E)$, donde cada vértice es un punto de interés de la Comarca y cada arista es un sendero transitable en un día, sin importar el sentido.

1. Explicar por qué, si todos los tramos cuestan lo mismo, buscar el camino más corto es un caso particular de Dijkstra, y relacionarlo con el algoritmo que ya conocen para este tipo de grafos (BFS).
2. Resolver con BFS: indicar en qué día se llega a cada ubicación desde Hobbiton, mostrando la frontera de nodos alcanzados en cada ronda.
3. Correr Dijkstra sobre la misma red (con peso 1 en cada arista) y comprobar que el vector de distancias coincide exactamente con el del punto 2. Trazar sobre la siguiente red, empezando en Hobbiton:

| Extremo 1 | Extremo 2 |
|---|---|
| Hobbiton | Delagua |
| Hobbiton | Los Gamos |
| Delagua | Bosque Viejo |
| Los Gamos | Bosque Viejo |
| Los Gamos | Túmulos |
| Bosque Viejo | Túmulos |
| Túmulos | Bree |

Además de estos puntos, existe una ubicación llamada "La Guarida de los Tejones" sin ninguna conexión con el resto de la red. Indicar cuántos días tarda en llegarse a Bree y qué ocurre con la Guarida.

4. Si un tramo, por ejemplo cruzar el Bosque Viejo, tomara más de un día por lo denso de la vegetación, ¿dejaría de poder resolverse con BFS solamente? Explicar qué cambiaría.
