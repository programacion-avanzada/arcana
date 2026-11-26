---
title: El Reinicio del Núcleo
tags:
  - topologico
  - desafio
---

### Dificultad: ★★★★★
Con la amenaza contenida, Zion necesita reiniciar los sistemas de su propio núcleo (energía, refrigeración, soporte vital, sensores, comunicaciones, defensa) y ninguno puede encenderse antes que aquellos de los que depende. El operador a cargo tiene el mapa de dependencias entre subsistemas, pero sabe que un solo error de configuración, una sola dependencia mal puesta, puede dejar el reinicio completo esperando a sí mismo para siempre.

### Enunciado
El mapa de dependencias es un grafo dirigido $G=(V,E)$, donde cada vértice es un subsistema y una arista $(v, w)$ significa que $v$ tiene que estar activo antes de que $w$ pueda iniciarse.

1. Explicar por qué el orden topológico solo está definido cuando el grafo es un DAG (grafo dirigido acíclico), y qué relación tiene esto con la detección de ciclos mediante DFS.
2. Diseñar el algoritmo (a partir del DFS recursivo y su postorden) que determine un orden válido de inicialización de los subsistemas.
3. Dado el siguiente mapa de dependencias, obtener un orden topológico válido para el reinicio (puede existir más de uno; alcanza con dar uno):

| Antes | Después |
|---|---|
| Energía | Refrigeración |
| Energía | Soporte Vital |
| Refrigeración | Núcleo Central |
| Soporte Vital | Comunicaciones |
| Núcleo Central | Sensores |
| Núcleo Central | Defensa |
| Sensores | Enlace con el Oráculo |
| Defensa | Enlace con el Oráculo |

4. Un técnico agregó, por error, una dependencia adicional: "Comunicaciones" debe confirmar el estado de "Energía" antes de que este último pueda reiniciarse. Determinar si el reinicio sigue siendo posible con esta nueva dependencia y, si no lo es, identificar exactamente el ciclo que lo impide.
