## Nombre y enunciado

Un colectivo escolar recoge alumnos de un barrio lejano y viaja todas las mañanas hasta una escuela, eligiendo siempre el recorrido más corto posible. La ciudad se representa como un mapa de esquinas conectadas por calles de una sola mano con una distancia determinada.

Con el objetivo de reducir el tiempo de viaje matutino, el intendente ofrece cambiar el sentido de circulación de **una calle** cualquiera de la ciudad.

**Problema:** Dada la red vial de la ciudad, la esquina de partida del colectivo y la esquina donde se ubica la escuela, determinar:

1. La distancia del recorrido más corto actual (sin modificaciones).
2. La distancia mínima posible tras invertir el sentido de una única calle.
3. El número identificador de la calle que conviene invertir para lograr dicha reducción (o indicar si no existe mejora posible).

[Problema original](https://www.oia.unsam.edu.ar/_media/prob/c3a13n3p3.pdf)

## Intuición
El problema se puede interpretar a partir del caso de prueba dibujándolo para entender los caminos que se tienen en cuenta. Se considera que al invertir una calle, solo se puede reducir la distancia si el camino más corto luego de esa operación, pasa por esa calle invertida. Cualquier camino que no la use ya existía antes del cambio, así que no puede ser más corto que el recorrido original. Entonces, si la calle original es $u \to v$ y la invertimos a $v \to u$, el camino mejorado tiene 3 tramos:

- El tramo $S \rightsquigarrow v$ se puede calcular en el grafo **original**.
- El tramo $u \rightsquigarrow T$ también se puede calcular en el grafo **original**.
- En el medio se agrega la calle invertida, con el mismo costo $\mathbf{w}$, en esta parte está lo relevante. ¿Vale la pena usar esa calle para obtener un camino mínimo mejor?

Además, el camino nuevo nunca necesita usar la calle original $u \to v$ en esos tramos: si lo hiciera, el camino pasaría dos veces por $u$ *(formaría un ciclo)* y, como las distancias son positivas, no sería más corto que el recorrido original. La idea es que el camino invertido me otorgue alternativas para analizar otras posibilidades de encontrar un camino aún *más pequeño* en su costo.

Por eso alcanza con conocer, para **toda** esquina $x$:

- $d_S(x)$: distancia mínima de $S$ a $x$ *(Dijkstra desde S en G)*.
- $d_T(x)$: distancia mínima de $x$ a $T$ *(Dijkstra desde T en el grafo con todas las calles invertidas $G^T$)*.

Con esas dos tablas, probar una calle cuesta $O(1)$. En el caso de prueba, para la calle 6 (`7 5 3`) el camino nuevo es $2 \to 3 \to 1 \to 5 \to 7$ y su costo es $d_S(5) + 3 + d_T(7) = 8 + 3 + 0 = 11$.

## OEIS
No aplica. Este problema trabaja con distancias en un grafo y no define una secuencia de enteros que dependa de un parámetro $n$, por lo que no hay una entrada de la OEIS asociada.

## Definición formal
Sea $G = (V, A)$ un grafo dirigido y ponderado, con $V = \{1, \dots, E\}$ las esquinas y $A = \{a_1, \dots, a_C\}$ las calles. Cada calle es $a_i = (u_i, v_i, w_i)$, que va de $u_i$ a $v_i$ con distancia $w_i$, con $1 \le w_i \le 50$. Dadas la esquina de partida $S$ y la esquina de la escuela $T$:

- $d_G(x, y)$ es la longitud del camino más corto de $x$ a $y$ en $G$.
- Para cada $i \in \{1, \dots, C\}$, el grafo $G_i$ es $G$ con la calle $a_i$ reemplazada por $(v_i, u_i, w_i)$.

**Entrada:** 
- Se recibe el número de esquinas, el número de esquina donde parte el colectivo, y con el número de la esquina donde se ubica la escuela.
- Hay C líneas _(correspondientes a la cantidad de calles)_ que describen el número de esquina de salida de la calle, la correspondiente a la llegada y la asignación de distancia entre ambas.

**Salida:**

1. $D_0 = d_G(S, T)$. -> La distancia **antes** de cambiar o invertir el sentido de una calle
2. $D_1 = \min_{1 \le i \le C} d_{G_i}(S, T)$. -> La distancia **después** de cambiar o invertir el sentido de una calle
3. Un índice $i^*$ que alcance ese mínimo. -> ¿En qué calle se invirtió el sentido?

Si $D_1 \ge D_0$, significa que no se consiguió un camino mínimo más pequeño que el original luego de invertir un camino. Como alternativa, se devuelve la respuesta `NO ES POSIBLE MEJORAR`.

**Resultado clave** (para $d_S$ y $d_T$ definidas en la intuición):

Hay mejora **si y solo si** el segundo término es estrictamente menor que $D_0$. Los términos con $d_S(v_i)$ o $d_T(u_i)$ infinitos _(esquina inalcanzable)_ se descartan.

**Restricciones:** $1 \le E \le 80\,000$, $1 \le C \le 250\,000$, $1 \le w_i \le 50$.

----

## Ejemplo concreto
Consideremos una ciudad con $E = 8$ esquinas, partida en $S = 2$, escuela en $T = 7$ y $C = 13$ calles:

```
8 2 7
13
2 4 4
2 1 5
2 3 2
3 1 3
4 1 4
7 5 3
1 5 3
1 6 7
8 4 2
6 8 1
8 7 6
6 7 8
5 3 2
```
![[Cambio_de_mano_base.svg]]
- **Recorrido original más corto (**$2 \to 7$**):** El camino óptimo sin cambios es $2 \xrightarrow{2} 3 \xrightarrow{3} 1 \xrightarrow{7} 6 \xrightarrow{1} 8 \xrightarrow{6} 7$, con una longitud total de:  
![[Cambio_de_mano_de_una calle_original.svg]]
$$2 + 3 + 7 + 1 + 6 = 19 \text{ decámetros}$$
- **Evaluación de cambio de mano:** La calle número **6** va originalmente de la esquina $7$ a la esquina $5$ con distancia $3$ (`7 5 3`). Si se invierte su sentido para que vaya de $5 \to 7$ con costo $3$, se habilita el camino:  
![[Cambio_de_mano_de_una calle_invertida.svg]]
Cuya distancia total es:  
$$2 + 3 + 3 + 3 = 11 \text{ decámetros}$$
- **Resultado:** Se imprime `19`, `11` y `6`.
---
## Por dónde empezar

- **Modelado como grafo:** Representar la ciudad como un grafo dirigido y ponderado utilizando listas de adyacencia (dado que $E \le 80.000$, una matriz de adyacencia excedería la memoria disponible).

- **Aproximación inicial (Fuerza bruta):** Implementar el algoritmo de Dijkstra con cola de prioridad para calcular la distancia mínima original de $S$ a $T$. Luego, probar invertir cada una de las $C$ calles una por una y volver a ejecutar Dijkstra. Esto permite validar la lógica en instancias pequeñas, aunque tiene complejidad $O(C \cdot (C + E) \log E)$ y excederá el tiempo límite en los casos grandes.

- **Optimización (Programación Dinámica):** Evitar los recálculos ejecutando Dijkstra únicamente **dos veces**:
    - Una vez desde $S$ sobre el grafo original para obtener $d_G(S, x)$ para toda esquina $x$.
    - Una vez desde $T$ sobre el grafo transpuesto $G^T$ (con todas las calles invertidas) para obtener $d_G(x, T)$ para toda esquina $x$. Con ambas tablas precalculadas, evaluar cada calle en $O(1)$ para alcanzar una complejidad total de $O((C + E) \log E)$.
---

## Soluciones disponibles

- [[Cambio de mano de una calle - Fuerza bruta]]
- [[Cambio de mano de una calle - Programación dinámica]]
