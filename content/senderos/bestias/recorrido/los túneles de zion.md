---
title: Los Túneles de Zion
tags:
  - dfs
  - desafio
---
### Dificultad: ★★☆☆☆
Con Smith avanzando, un equipo necesita evacuar por los túneles de mantenimiento de Zion, una red de pasadizos angostos, mal iluminados, algunos de los cuales vuelven sobre sí mismos sin llevar a ninguna parte. Antes de arriesgarse a entrar, el equipo quiere dos cosas: un mapa de por dónde se puede salir sin dar vueltas en círculo, y la certeza de que no hay ningún sector del refugio completamente incomunicado del resto.

### Enunciado
La red de túneles es un grafo no dirigido $G=(V,E)$, donde cada vértice es un cruce o punto de interés y cada arista es un pasadizo transitable en ambos sentidos.

1. Explicar qué información, obtenida durante un DFS, permite determinar si el grafo tiene algún ciclo (relacionarlo con el concepto de arista de retroceso visto en clase) y qué determina si dos nodos pertenecen a la misma componente conexa.
2. Diseñar el algoritmo que recorra la red completa y devuelva: el árbol de recorrido, si existe al menos un ciclo, y la cantidad total de componentes conexas.
3. Trazar el DFS a mano empezando en "Entrada", mostrando el estado de la pila (o de las llamadas recursivas) y el array de visitados en cada paso, sobre la siguiente red:

| Extremo 1 | Extremo 2 |
|---|---|
| Entrada | Cruce 1 |
| Entrada | Cruce 2 |
| Cruce 1 | Cruce 3 |
| Cruce 2 | Cruce 3 |
| Cruce 3 | Cruce 4 |
| Cruce 4 | Cruce 5 |
| Cruce 5 | Refugio |
| Cruce 2 | Cruce 5 |
| Pasadizo Olvidado 1 | Pasadizo Olvidado 2 |
| Pasadizo Olvidado 2 | Pasadizo Olvidado 3 |

4. A partir de la traza: indicar cuántas componentes conexas tiene la red, si existe algún ciclo (y cuál es, en caso de que lo haya), y la complejidad del algoritmo en función de $V$ y $E$.
