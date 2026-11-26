---
title: Caradhras o Moria
tags:
  - dijkstra
  - desafio
---

### Dificultad: ★★☆☆☆

La Compañía llega a las puertas de las Montañas Nubladas con dos caminos posibles hacia Lothlórien: subir por Caradhras, expuestos a la tormenta, o bajar a las Minas de Moria, a oscuras y sin saber qué los espera. Gandalf recuerda, además, un desvío más largo que bordea la ladera y sale directo frente al Salón de Piedra, sin pasar por las Puertas de Moria. Necesita algo más que instinto para decidir: necesita saber, con números, cuál combinación sale más barata de verdad.

### Enunciado

Se modela la ruta como un grafo dirigido $G=(V, E)$, donde cada vértice es un punto del camino y el peso de cada arista combina tiempo y peligro en una sola cifra (cuanto más alto, peor).

1. Trazar Dijkstra a mano desde Rivendel sobre la siguiente red, mostrando en cada iteración los conjuntos $S$ y $V-S$, el nodo elegido, y los vectores de distancias y de predecesores:

| Desde | Hasta | Peso |
|---|---|---|
| Rivendel | Caradhras | 1 |
| Rivendel | Puertas de Moria | 2 |
| Rivendel | Salón de Piedra | 6 |
| Puertas de Moria | Salón de Piedra | 3 |
| Salón de Piedra | Puerta Este | 2 |
| Puerta Este | Lothlórien | 1 |
| Caradhras | Lothlórien | 8 |

2. A partir de la traza, indicar qué conviene: cruzar Caradhras o entrar a Moria, y reconstruir el camino completo usando el vector de predecesores.
3. Lothlórien recibe una distancia tentativa muy temprano en la traza, que varias iteraciones después termina mejorándose. Explicar, apoyándose en la propiedad vista en el Bloque 3 ($d[u] \geq d[w]$), por qué Dijkstra puede dejarlo sin cerrar durante todo ese tiempo, y qué hubiera pasado si se lo hubiera cerrado apenas recibió esa primera distancia.
4. Si un explorador élfico les avisara de un sendero directo entre Puertas de Moria y Lothlórien, ¿en qué cambiaría la traza? (No hace falta rehacerla completa: alcanza con explicar qué pasos se verían afectados).

---

<details>
    <summary>Ver solución</summary>

Numeramos los nodos igual que en el ejemplo del algoritmo visto en clase:

| Nodo | Lugar |
|---|---|
| 0 | Rivendel (origen) |
| 1 | Caradhras |
| 2 | Puertas de Moria |
| 3 | Salón de Piedra |
| 4 | Puerta Este |
| 5 | Lothlórien |

Y las aristas del enunciado quedan:

| Desde | Hasta | Peso |
|---|---|---|
| 0 | 1 | 1 |
| 0 | 2 | 2 |
| 0 | 3 | 6 |
| 2 | 3 | 3 |
| 3 | 4 | 2 |
| 4 | 5 | 1 |
| 1 | 5 | 8 |

### 1. Traza de Dijkstra

En cada iteración elegimos, entre los nodos de $V-S$, el de menor $D$ acumulada, lo cerramos (lo pasamos a $S$), y relajamos sus sucesores con

$$D[i] = \min\big(D[i],\; D[w] + C(w,i)\big)$$

| Iteración | S | V-S | w | D[0]/P[0] | D[1]/P[1] | D[2]/P[2] | D[3]/P[3] | D[4]/P[4] | D[5]/P[5] |
|---|---|---|---|---|---|---|---|---|---|
| Inicial | {0} | {1,2,3,4,5} | 0 | 0/− | 1/0 | 2/0 | 6/0 | ∞/− | ∞/− |
| 1 | {0,1} | {2,3,4,5} | 1 | 0/− | 1/0 | 2/0 | 6/0 | ∞/− | 9/1 |
| 2 | {0,1,2} | {3,4,5} | 2 | 0/− | 1/0 | 2/0 | **5/2** | ∞/− | 9/1 |
| 3 | {0,1,2,3} | {4,5} | 3 | 0/− | 1/0 | 2/0 | 5/2 | 7/3 | 9/1 |
| 4 | {0,1,2,3,4} | {5} | 4 | 0/− | 1/0 | 2/0 | 5/2 | 7/3 | **8/4** |
| 5 | {0,1,2,3,4,5} | ∅ | 5 | 0/− | 1/0 | 2/0 | 5/2 | 7/3 | 8/4 |

Dos celdas cambian a mitad de camino:

- $D[3]/P[3]$: arranca en $6/0$ (el desvío directo desde Rivendel) y en la iteración 2 baja a $5/2$, porque pasar primero por Puertas de Moria ($2+3=5$) resulta más barato que el atajo directo.
- $D[5]/P[5]$: recibe su primer valor tentativo muchísimo antes de cerrarse: en la iteración 1, al cerrar Caradhras, se fija en $1+8=9$. Recién en la iteración 4, al cerrar Puerta Este, se relaja $4\to5$ ($7+1=8$), mejor que el $9$ anterior, y se actualiza a $8/4$.

### 2. ¿Caradhras o Moria?

La distancia final a Lothlórien es $D[5]=8$. Reconstruyendo con el vector de predecesores:

$$5 \leftarrow 4 \leftarrow 3 \leftarrow 2 \leftarrow 0$$

es decir, **Rivendel → Puertas de Moria → Salón de Piedra → Puerta Este → Lothlórien**, con costo $2+3+2+1=8$.

La alternativa por Caradhras es Rivendel → Caradhras → Lothlórien, con costo $1+8=9$. **Conviene Moria**, aunque por muy poco: apenas $1$ punto de diferencia.

### 3. ¿Por qué Lothlórien no se cierra apenas recibe su primera distancia tentativa?

La propiedad $d[u] \geq d[w]$ garantiza que, cuando Dijkstra **cierra** un nodo $w$, ningún nodo todavía abierto puede después ofrecerle una mejora. Pero esa garantía es sobre el nodo que se cierra, no sobre uno que apenas **recibió** una distancia tentativa: mientras el nodo sigue en $V-S$, todavía puede bajar.

Eso es justo lo que pasa acá: en la iteración 1, Lothlórien queda con $D[5]=9$, pero en ese mismo momento el nodo 2 sigue abierto con $D[2]=2$, muchísimo menor a $9$. Como los pesos son positivos, no hay ninguna garantía todavía de que $9$ sea lo mejor posible, así que Dijkstra lo deja esperando tres iteraciones más, hasta que efectivamente aparece un camino mejor por Puerta Este.

Si se lo hubiera cerrado apenas llegó esa primera distancia tentativa, el algoritmo se hubiera quedado para siempre con $D[5]=9$ (la ruta por Caradhras), sin enterarse nunca de que existía un camino de costo $8$ atravesando Moria.

### 4. ¿Y si hubiera un sendero directo de Puertas de Moria a Lothlórien?

Agregar una arista $2\to5$ de peso $x$ solo puede cambiar el resultado si mejora el mejor camino ya encontrado ($8$). Como el nodo 2 se cierra muy temprano (iteración 2, con $D[2]=2$), esta arista daría una candidata de $2+x$. Cambia algo únicamente si $2+x < 8$, es decir, si el nuevo sendero pesara **menos de 6**. En ese caso Lothlórien recibiría una distancia mejor bastante antes en la traza (incluso antes que la propia tentativa por Caradhras), y el camino final ya no pasaría ni por Salón de Piedra ni por Puerta Este. Si pesara $6$ o más, la traza no cambia: la cadena completa por Moria sigue siendo al menos tan buena.

</details>
