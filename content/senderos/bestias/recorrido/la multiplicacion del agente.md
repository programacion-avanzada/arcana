---
title: La Multiplicación del Agente
tags:
  - bfs
  - desafio
---
### Dificultad: ★☆☆☆☆
Smith consiguió instalarse en un host cualquiera de la red del Matrix (le dicen "Terminal Cero") y desde ahí empezó a replicarse, salto a salto, hacia cualquier host directamente conectado. Zion no puede desconectar toda la red a la vez, así que necesita algo más preciso: saber, ronda por ronda, qué hosts van a caer y, sobre todo, cuántas rondas le quedan antes de que Smith llegue a un punto que no se pueden dar el lujo de perder.

### Enunciado
Se modela la red como un grafo no dirigido $G=(V,E)$, donde cada host es un vértice y cada conexión directa entre dos hosts es una arista. Smith se replica de a un salto por ronda: en la ronda 0 solo controla el host inicial; en cada ronda siguiente, controla además todo host conectado directamente a alguno que ya controlaba.

1. Justificar qué estructura de datos conviene usar para representar esta red, sabiendo que el Matrix tiene muchísimos hosts pero cada uno con relativamente pocas conexiones directas (un grafo disperso). Comparar explícitamente lista de adyacencia contra matriz de adyacencia para este caso.
2. Diseñar el algoritmo que, a partir del host inicial, determine en qué ronda cae cada host de la red.
3. Trazar el algoritmo a mano sobre la siguiente red, empezando en "Terminal Cero":

| Extremo 1 | Extremo 2 |
|---|---|
| Terminal Cero | Backdoor de Woo |
| Terminal Cero | Relé de Sati |
| Backdoor de Woo | Consola del Oráculo |
| Backdoor de Woo | Nodo del Merovingio |
| Relé de Sati | Nodo del Merovingio |
| Relé de Sati | Enlace del Trainman |
| Nodo del Merovingio | Servidor del Arquitecto |
| Enlace del Trainman | Servidor del Arquitecto |
| Servidor del Arquitecto | La Puerta de Sion |

Además de esta lista, existe un host llamado "Búnker Aislado" que no tiene ninguna conexión con el resto de la red. Indicar en qué ronda cae cada host, cuántas rondas tarda Smith en llegar a "La Puerta de Sion", y qué ocurre con el "Búnker Aislado".

4. Determinar la complejidad del algoritmo en función de $V$ y $E$, y explicar cómo cambiaría si se hubiese elegido, en el punto 1, la representación menos conveniente para este tipo de red.
