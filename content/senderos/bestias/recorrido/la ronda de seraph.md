---
title: La Ronda de Seraph
tags:
  - grafos
  - desafio
---
### Dificultad: ★★★☆☆
Seraph custodia el acceso a la mansión del Merovingio, y antes de que Zion se anime a pedirle un favor necesita confirmar algo: que puede recorrer cada pasillo de la mansión exactamente una vez, sin dejar ninguno sin revisar y sin pasar dos veces por el mismo. Volver a cruzar un pasillo ya recorrido es, para cualquiera que esté mirando, la señal más clara de que alguien está buscando algo.

### Enunciado
El plano de la mansión es un grafo no dirigido $G=(V,E)$, donde cada vértice es una habitación y cada arista es un pasillo que la conecta con otra.

1. Explicar el criterio (teorema de Euler) que determina, a partir del grado de los vértices, si un grafo tiene un circuito euleriano, un camino euleriano, o ninguno de los dos. Justificar por qué la cantidad de vértices de grado impar tiene que ser exactamente $0$ o exactamente $2$ para que exista alguna de las dos rutas, y no otro número.
2. Aplicar el criterio al siguiente plano y determinar si la ronda de Seraph es posible. En caso de que lo sea, indicar si se trata de un circuito o de un camino euleriano, y en qué habitación conviene empezar (y, si corresponde, en cuál termina necesariamente):

| Extremo 1 | Extremo 2 |
|---|---|
| Entrada | Vestíbulo |
| Vestíbulo | Salón |
| Salón | Biblioteca |
| Biblioteca | Comedor |
| Comedor | Bodega |
| Bodega | Oficina del Merovingio |
| Oficina del Merovingio | Entrada |
| Vestíbulo | Comedor |

3. Construir a mano una ronda válida: la secuencia completa de habitaciones que recorre cada pasillo exactamente una vez.
4. Determinar la complejidad de verificar la condición de Euler (contar los grados de todos los vértices) en función de $V$ y $E$. Explicar además por qué saber que la ronda existe no alcanza por sí solo para construirla: ¿qué información adicional hubo que usar en el punto 3 que no se necesitó en el punto 2?

---

<details>
    <summary>Ver solución</summary>

### 1. El criterio de Euler

Un circuito o camino euleriano recorre **cada arista exactamente una vez**. La clave para saber si existe está en contar, para cada vértice, cuántas veces se lo "usa de paso":

- Cada vez que la ronda **pasa por** un vértice (sin quedarse), entra por una arista y sale por otra: consume las aristas de ese vértice **de a pares**.
- Solo el vértice donde **empieza** la ronda puede tener una arista de salida sin una de entrada que la empareje, y solo el vértice donde **termina** puede tener una arista de entrada sin salida.

De ahí sale el criterio:

- Si $\deg(v)$ es par en todos los vértices $\Rightarrow$ existe un **circuito euleriano** (se puede empezar y terminar en el mismo lugar).
- Si exactamente **dos** vértices tienen grado impar $\Rightarrow$ existe un **camino euleriano**, y esos dos vértices son, necesariamente, el inicio y el fin.
- Si hay **más de dos** vértices de grado impar $\Rightarrow$ no existe ninguna de las dos rutas: no puede haber más de un vértice con una salida "sin pareja" y más de un vértice con una entrada "sin pareja" en una única ronda.

> **Importante:** También hace falta que el grafo sea conexo, o al menos que todas las aristas estén en una sola componente, porque si no ninguna ronda que arranca de un solo lugar puede llegar a recorrerlas todas.

### 2. Aplicación al plano de la mansión

| Habitación | Aristas incidentes | $\deg(v)$ |
|---|---|---|
| Entrada | Vestíbulo, Oficina del Merovingio | 2 |
| Vestíbulo | Entrada, Salón, Comedor | **3** |
| Salón | Vestíbulo, Biblioteca | 2 |
| Biblioteca | Salón, Comedor | 2 |
| Comedor | Biblioteca, Bodega, Vestíbulo | **3** |
| Bodega | Comedor, Oficina del Merovingio | 2 |
| Oficina del Merovingio | Bodega, Entrada | 2 |

Exactamente dos vértices de grado impar: **Vestíbulo** y **Comedor**. Por el criterio del punto 1, la ronda de Seraph **es posible**, pero como **camino** euleriano (no como circuito): tiene que empezar en una de esas dos habitaciones y terminar necesariamente en la otra.

### 3. Una ronda válida

Empezando en Vestíbulo y terminando en Comedor:

$$\text{Vestíbulo} \to \text{Entrada} \to \text{Oficina del Merovingio} \to \text{Bodega} \to \text{Comedor} \to \text{Biblioteca} \to \text{Salón} \to \text{Vestíbulo} \to \text{Comedor}$$

| Paso | Pasillo usado |
|---|---|
| 1 | Vestíbulo–Entrada |
| 2 | Entrada–Oficina del Merovingio |
| 3 | Oficina del Merovingio–Bodega |
| 4 | Bodega–Comedor |
| 5 | Comedor–Biblioteca |
| 6 | Biblioteca–Salón |
| 7 | Salón–Vestíbulo |
| 8 | Vestíbulo–Comedor |

Las 8 aristas aparecen una sola vez cada una, así que la ronda es válida. No es la única ronda posible: cualquier otro orden que respete "cada arista una sola vez" y arranque en Vestíbulo o Comedor también sirve.

> Notar que Seraph **pasa dos veces** por el Vestíbulo. Eso está permitido, lo único que no se puede repetir es el pasillo, no la habitación.

### 4. Complejidad, y qué falta para poder construirla

Contar el grado de cada vértice recorriendo una vez la lista de adyacencia cuesta $O(V+E)$: se visita cada vértice una vez y cada arista aporta a dos grados, así que el trabajo total es proporcional a $V+E$.

Pero ese chequeo solo mira **información local** (el grado de cada vértice, uno por uno). Alcanza para saber que la ronda existe, aunque no dice en qué orden recorrerla. Para construirla (punto 3) hubo que tener en cuenta algo más global: qué aristas ya se usaron y si, al elegir una arista para avanzar, no se deja "aislado" del resto un tramo todavía sin recorrer. Formalizar esa idea es exactamente lo que hacen los algoritmos de construcción de rutas eulerianas (Fleury, o el más eficiente, el de Hierholzer), fuera del alcance de este ejercicio, pero un buen próximo paso si querés ir más allá de trazarla a mano.

</details>
