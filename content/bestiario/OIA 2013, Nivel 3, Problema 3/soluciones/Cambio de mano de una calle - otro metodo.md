## Técnicas utilizadas
- **Grafo dirigido y ponderado**: con listas de adyacencia.
- **Algoritmo de Dijkstra**: con cola de prioridad, válido porque todas las distancias son positivas.
- **Grafo transpuesto**: $G^T$ que es el mismo grafo con todas las calles invertidas, que permite calcular distancias *hacia* un nodo.
- **Precálculo de distancias**: desde los dos extremos ($S$ y $T$) para evaluar cada calle en tiempo constante.

## Idea de la solución
Probar cada calle invertida y rehacer Dijkstra cuesta demasiado, sería una solución por fuerza bruta que fue desarrollada en [[Cambio de mano de una calle - Fuerza bruta]]. La clave es que un camino mejorado encontrado **tiene que usar la operación de invertir la calle**, así que tiene la forma:

$$S \rightsquigarrow v \|\to\ |u \rightsquigarrow T$$

donde la calle original era $u \to v$ con costo $w$. Entonces alcanza con conocer dos tablas:

1. $d_S(x)$: distancia mínima **desde $S$ hasta $x$** en $G$. Se calcula con Dijkstra desde $S$ sobre $G$.
2. $d_T(x)$: distancia mínima **desde $T$ hasta $x$** en $G^T$ _(grafo con las calles invertidas)_. Se calcula con Dijkstra desde $T$ sobre $G^T$.

Con esas tablas, el costo de usar la calle $i$ invertida es:
$$d_S(v_i) + w_i + d_T(u_i)$$

Con el ejemplo del caso de prueba de la consigna, cada cuenta significa lo siguiente, teniendo en cuenta que se parte de 2 y se recorre hasta 7:

- **$$d_S(5)$$** **= 8** $\to$ es la distancia desde el inicio hasta el vertice v, que es la esquina 5, en la cual una arista de ese vertice se invertirá.
- **w = 3** $\to$ es la calle invertida, que iba de 5 a 7 originalmente, ahora va de 7 a 5.
- **$$d_T(7)$$ = 0** $\to$ ya estoy en la escuela, porque de 7 a 7, tengo distancia 0

Así que la distancia resultante es 11, como en la consigna original.

## Código
```java
import java.io.*;
import java.util.*;

public class CambioManoCalle {
    static final int INF = Integer.MIN_VALUE;

    static int[] dijkstra(int origen, int n, List<List<int[]>> ady) {
        int[] dist = new int[n + 1];
        Arrays.fill(dist, INF);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        dist[origen] = 0;
        pq.add(new int[]{0, origen});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0];
            int x = top[1];
            if (d > dist[x]) continue;
            for (int[] calle : ady.get(x)) {
                int y = calle[0];
                int nuevo = d + calle[1];
                if (dist[y] == INF || nuevo < dist[y]) {
                    dist[y] = nuevo;
                    pq.add(new int[]{nuevo, y});
                }
            }
        }
        return dist;
    }

    static int[] resolver(int E, int S, int T, int C, int[] U, int[] V, int[] W) {
        List<List<int[]>> G = new ArrayList<>();
        List<List<int[]>> GT = new ArrayList<>();
        for (int i = 0; i <= E; i++) {
            G.add(new ArrayList<>());
            GT.add(new ArrayList<>());
        }
        for (int i = 1; i <= C; i++) {
            G.get(U[i]).add(new int[]{V[i], W[i]});
            GT.get(V[i]).add(new int[]{U[i], W[i]});
        }

        int[] dS = dijkstra(S, E, G);
        int[] dT = dijkstra(T, E, GT);

        int D0 = dS[T];
        int mejor = D0;
        int calle = -1;

        for (int i = 1; i <= C; i++) {
            if (dS[V[i]] == INF || dT[U[i]] == INF) {
                continue;
            }
            int costo = dS[V[i]] + W[i] + dT[U[i]];
            if (costo < mejor) {
                mejor = costo;
                calle = i;
            }
        }
        return new int[]{D0, mejor, calle};
    }

    public static void main(String[] args) throws IOException {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new FileReader("invertir.in")));
        in.nextToken();
        int E = (int) in.nval;
        in.nextToken();
        int S = (int) in.nval;
        in.nextToken();
        int T = (int) in.nval;
        in.nextToken();
        int C = (int) in.nval;

        int[] U = new int[C + 1];
        int[] V = new int[C + 1];
        int[] W = new int[C + 1];
        for (int i = 1; i <= C; i++) {
            in.nextToken(); U[i] = (int) in.nval;
            in.nextToken(); V[i] = (int) in.nval;
            in.nextToken(); W[i] = (int) in.nval;
        }

        int[] res = resolver(E, S, T, C, U, V, W);

        PrintWriter out = new PrintWriter(new FileWriter("invertir.out"));
        out.println(res[0]);
        if (res[2] == -1) {
            out.println("NO ES POSIBLE MEJORAR");
        } else {
            out.println(res[1]);
            out.println(res[2]);
        }
        out.close();
    }
}
```

## Traza de ejemplo
Teniendo en cuenta los siguientes parámetros de entrada: 
- $E = 9$
- $S = 1$
- $T = 9$
- Las 16 calles del ejemplo que se detallarán más adelante.

Acá se visualiza como ingresan los datos en el programa
```
9 1 9
16
5 6 8
7 3 1
4 1 6
3 2 11
4 7 5
8 3 10
1 6 8
6 2 3
7 9 7
8 4 5
3 9 6
9 5 11
2 4 6
9 4 7
5 8 6
7 6 2
```

Pero, en el formato de tabla, se puede entender mejor como se conectan los datos brindados:

| Calle | $u \to v$ | $w$ |
|---|---|---|
| 1 | 5 → 6 | 8 |
| 2 | 7 → 3 | 1 |
| 3 | 4 → 1 | 6 |
| 4 | 3 → 2 | 11 |
| 5 | 4 → 7 | 5 |
| 6 | 8 → 3 | 10 |
| 7 | 1 → 6 | 8 |
| 8 | 6 → 2 | 3 |
| 9 | 7 → 9 | 7 |
| 10 | 8 → 4 | 5 |
| 11 | 3 → 9 | 6 |
| 12 | 9 → 5 | 11 |
| 13 | 2 → 4 | 6 |
| 14 | 9 → 4 | 7 |
| 15 | 5 → 8 | 6 |
| 16 | 7 → 6 | 2 |

**Dijkstra desde $S = 1$ en $G$.** Orden en que se fijan las esquinas: 
- 1: 0
- 6: 8
- 2: 11
- 4: 17
- 7: 22
- 3: 23
- 9: 29
- 5: 40
- 8: 46

**Dijkstra desde $T = 9$ en $G^T$.** En este caso, los resultados se ven de esta manera: 
- 9: 0
- 3: 6
- 7: 7
- 4: 12
- 8: 16
- 2: 18
- 6: 21
- 5: 22
- 1: 29

| Esquina / Función | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| $d_S(x)$ | 0 | 11 | 23 | 17 | 40 | 8 | 22 | 46 | 29 |
| $d_T(x)$ | 29 | 18 | 6 | 12 | 22 | 21 | 7 | 16 | 0 |

La distancia mínima original, desde la esquina de partida hasta la escuela es $D_0 = d_S(9) = 29$.

**Evaluación de cada calle**
El costo de usar cada calle invertida es el siguiente, que ya analizamos anteriormente:

$$d_S(v) + w + d_T(u)$$

| Calle | $u \to v$ | $d_S(v)$ | $w$ | $d_T(u)$ | Costo |
|---|---|---|---|---|---|
| 1 | 5 → 6 | 8 | 8 | 22 | 38 |
| 2 | 7 → 3 | 23 | 1 | 7 | 31 |
| 3 | 4 → 1 | 0 | 6 | 12 | 18 |
| 4 | 3 → 2 | 11 | 11 | 6 | 28 |
| 5 | 4 → 7 | 22 | 5 | 12 | 39 |
| 6 | 8 → 3 | 23 | 10 | 16 | 49 |
| 7 | 1 → 6 | 8 | 8 | 29 | 45 |
| 8 | 6 → 2 | 11 | 3 | 21 | 35 |
| 9 | 7 → 9 | 29 | 7 | 7 | 43 |
| 10 | 8 → 4 | 17 | 5 | 16 | 38 |
| 11 | 3 → 9 | 29 | 6 | 6 | 41 |
| 12 | 9 → 5 | 40 | 11 | 0 | 51 |
| 13 | 2 → 4 | 17 | 6 | 18 | 41 |
| 14 | 9 → 4 | 17 | 7 | 0 | 24 |
| 15 | 5 → 8 | 46 | 6 | 22 | 74 |
| **16** | **7 → 6** | **8** | **2** | **7** | **17** |

El mínimo es **17**, en la calle **16**, y es menor que $D_0 = 29$. La salida es:

```
29
17
16
```

El camino resultante es $1 \to 6 \to 7 \to 9$. La calle 3 queda segunda con costo 18 _(camino $1 \to 4 \to 7 \to 9$)._

## Complejidad

### Temporal
- Para leer la entrada y construir ambos grafos, tanto $G$ como $G^T$: **$O(E + C)$**, porque cada calle se agrega una sola vez a la lista de adyacencia de $G$ y una sola vez a la de $G^T$.
- El algoritmo de Dijkstra utiliza la cola de prioridad, ejecutado dos veces, para tener en cuenta los tramos con los caminos normales e invertidos _(desde $S$ en $G$ y desde $T$ en $G^T$)_: **$O((E + C) \log E)$**, esta complejidad se corresponde a cada una.
- Recorrer las $C$ calles evaluando $d_S(v_i) + w_i + d_T(u_i)$: $O(C)$, ya que cada evaluación es una suma de valores precalculados, es decir, **$O(1)$** por calle.

Por lo tanto, teniendo en cuenta esto, el total de la complejidad temporal, sería sumando las sub-complejidades por cada uno de los 3 renglones, como el $O(E + C)$ y $O(1)$ son constantes, solo se tiene en cuenta la complejdad implicada en el algoritmo de Dijkstra, resulta en → **Total: $O((E + C) \log E)$.**.

### Espacial
$O(E + C)$:
- Las listas de adyacencia de $G$ y $G^T$ guardan $C$ aristas cada una.
- Los arrays $U$, $V$ y $W$ tienen tamaño $C + 1$.
- Las tablas $d_S$ y $d_T$ tienen tamaño $E + 1$.
- La cola de prioridad guarda, como máximo, una entrada por cada arista relajada, es decir, $O(C)$.

## Cuándo usar esta técnica
- En el momento que hay que evaluar **muchas modificaciones de una sola arista** y comparar el camino mínimo que resulta de cada una.
- Cuando las distancias son **no negativas**, para poder usar Dijkstra.
- Cuando el grafo es **grande**, donde una matriz de adyacencia no entra en memoria y conviene optar por usar listas de adyacencia.

Viendolo de un punto de vista mas pesimista...

## Cuándo NO usar esta técnica
- Si hay pesos negativos _(habría que usar otro algoritmo que los acepte, como Bellman-Ford)_
- Cuando el grafo no tiene pesos _(alcanzaría con BFS)_
- En el caso que se permita modificar **más de una arista a la vez**, porque los tramos dejan de ser independientes entre sí.

## Referencias
- [[Cambio de mano de una calle - Fuerza bruta]]
- [Problema original, Certamen Nacional OIA 2013](https://www.oia.unsam.edu.ar/_media/prob/c3a13n3p3.pdf)
