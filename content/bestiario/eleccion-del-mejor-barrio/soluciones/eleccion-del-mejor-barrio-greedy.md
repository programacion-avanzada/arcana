---
title: 'Elección del mejor barrio - Greedy'
tags:
  - oia
  - solucion
---

Problema: [[eleccion-del-mejor-barrio]]

## Técnicas utilizadas

**Greedy**, en la forma del **algoritmo de Dijkstra con varios orígenes**. En cada paso se toma la esquina con menor molestia pendiente y se la fija como definitiva, sin volver a revisarla nunca. Para elegir esa esquina rápido se usa una cola de prioridad implementada como heap binario de mínimos (`heapq` en Python).

## Idea de la solución

Igual que en la fuerza bruta, la ciudad es un [[graph]] implícito: cada esquina tiene como vecinas a sus hasta cuatro adyacentes, salvo las que están del otro lado de una cuadra cortada. Los cortes se guardan en un [[set]] de pares no ordenados.

La observación clave es que no hace falta recorrer la ciudad una vez por tumultuosa. Todas pueden propagarse **a la vez**, cada una arrancando con su molestia inicial $-v$:

1. Se cargan todas las tumultuosas en el heap con valor $-v$.
2. Se saca del heap la esquina con menor valor. Si ya estaba fijada, se descarta. Si no, ese valor es su molestia definitiva y se guarda en un [[map]].
3. Cada vecina todavía no fijada entra al heap con el valor de la esquina actual más 1, porque está a una cuadra más.
4. Cuando el heap se vacía, todas las esquinas tienen su molestia y se busca el máximo.

**Por qué la elección greedy es correcta.** Sea un origen ficticio $S$ conectado con cada tumultuosa $t$ por una arista de peso $1000 - v_t \ge 0$. La distancia desde $S$ hasta una esquina $c$ es

$$
\min_t \big(1000 - v_t + d(t, c)\big) = 1000 + m(c),
$$

o sea la molestia de $c$ más una constante. Todas las aristas tienen peso no negativo, así que vale la garantía de Dijkstra: cuando una esquina sale del heap con el menor valor pendiente, ningún otro camino puede mejorarla, porque todo lo que queda en el heap vale lo mismo o más y cada cuadra solo suma. El algoritmo de arriba es exactamente ese Dijkstra, con la constante 1000 restada de todos los valores.

En la imagen de los incendios: los fuegos se procesan en orden de llegada, y la primera vez que uno alcanza una esquina es el que más la molesta.

**Detalle importante: es un heap de mínimos.** Aunque el problema pide *maximizar*, el máximo se toma recién al final, sobre todas las esquinas. Para cada esquina se busca la tumultuosa que **más** la molesta, que es la de **menor** $d - v$. Si se usara un heap de máximos y se actualizara una esquina cuando el valor nuevo es mayor, el algoritmo nunca terminaría: ir a una vecina y volver suma 2, y eso siempre "mejora" el valor anterior.

## Código

```python
import heapq
import sys

def vecinos(x, y, M, N, cortes):
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 1 <= nx <= M and 1 <= ny <= N and frozenset({(x, y), (nx, ny)}) not in cortes:
            yield nx, ny

def mejor_barrio(M, N, tumultuosas, cortes):
    molestia = {}
    heap = [(-v, (x, y)) for x, y, v in tumultuosas]   # todos los orígenes a la vez
    heapq.heapify(heap)
    while heap:
        m, u = heapq.heappop(heap)
        if u in molestia:              # ya fijada con un valor menor o igual
            continue
        molestia[u] = m                # elección greedy: es definitiva
        for w in vecinos(*u, M, N, cortes):
            if w not in molestia:
                heapq.heappush(heap, (m + 1, w))
    maximo = max(molestia.values())
    return maximo, sorted(e for e, m in molestia.items() if m == maximo)

def main():
    datos = list(map(int, sys.stdin.read().split()))
    M, N, K = datos[0], datos[1], datos[2]
    tumultuosas = [tuple(datos[3 + 3 * i : 6 + 3 * i]) for i in range(K)]
    pos = 3 + 3 * K
    B = datos[pos]
    cortes = {frozenset({(datos[j], datos[j + 1]), (datos[j + 2], datos[j + 3])})
              for j in range(pos + 1, pos + 1 + 4 * B, 4)}
    maximo, esquinas = mejor_barrio(M, N, tumultuosas, cortes)
    salida = [str(maximo), str(len(esquinas))] + [f"{x} {y}" for x, y in esquinas]
    print("\n".join(salida))

if __name__ == "__main__":
    main()
```

Una esquina puede entrar varias veces al heap (una por cada vecina que la alcanza). Las copias sobrantes se descartan al salir. Si una esquina aparece repetida como tumultuosa, la de mayor intensidad sale primero y las demás se descartan, así que no hace falta tratar ese caso aparte.

`main` lee la entrada con el formato del enunciado, arma el set de cortes y muestra la salida en el formato pedido. Para probarlo con el ejemplo: `python barrio.py < barrio.in`.

## Traza de ejemplo

Usamos la instancia del [[eleccion-del-mejor-barrio#Ejemplo acotado|ejemplo acotado]]: cuadrícula de 5 × 4, A = (1, 1) con v = 0, B = (4, 4) con v = 2, y cuadras cortadas entre (3, 2)–(4, 2) y entre (3, 4)–(4, 4).

Heap inicial: `(−2, (4, 4))` y `(0, (1, 1))`.

| Paso | Sale del heap | Acción | Entran al heap |
|:----:|:--------------|:-------|:---------------|
| 1 | (4, 4) con −2 | Se fija B | (5, 4) y (4, 3) con −1. (3, 4) no, la cuadra está cortada. |
| 2 | (4, 3) con −1 | Se fija | (5, 3), (3, 3) y (4, 2) con 0 |
| 3 | (5, 4) con −1 | Se fija | (5, 3) con 0, otra vez |
| 4 | (1, 1) con 0 | Se fija A: recién ahora "arranca" | (2, 1) y (1, 2) con 1 |
| 5 | (3, 3) con 0 | Se fija | (2, 3), (3, 4) y (3, 2) con 1 |
| 6 | (4, 2) con 0 | Se fija | (5, 2) y (4, 1) con 1. (3, 2) no, la cuadra está cortada. |
| 7 | (5, 3) con 0 | Se fija | (5, 2) con 1, otra vez |
| — | (5, 3) con 0 | Copia repetida: se descarta | — |
| 8–14 | Las esquinas con 1 | Se fijan (1, 2), (2, 1), (2, 3), (3, 2), (3, 4), (4, 1) y (5, 2) | Sus vecinas libres, con 2 |
| 15–19 | Las esquinas con 2 | Se fijan (1, 3), (2, 2), (2, 4), (3, 1) y (5, 1) | (1, 4) con 3, dos veces |
| 20 | (1, 4) con 3 | Se fija la última esquina | — |

Entre los pasos 8 y 20 también salen y se descartan las copias repetidas de (5, 2), (1, 3), (2, 2), (2, 4), (3, 1), (5, 1) y (1, 4).

Algunas cosas para notar en la traza:

- A tiene intensidad 0, así que "arranca" dos niveles después que B (paso 4). Para entonces B ya fijó tres esquinas.
- (3, 4) es vecina directa de B, pero por el corte se fija recién con valor 1 (paso 5), rodeando por (3, 3).
- Las esquinas se fijan en orden creciente de molestia: −2, −1, 0, 1, 2, 3. Por eso la última en salir, (1, 4), es la que tiene la mayor molestia.

La molestia final de cada esquina es la misma que calcula la fuerza bruta:

![[barrio_acotado_minimo.svg|Menor molestia de cada esquina del ejemplo acotado|400]]

**Resultado:** `(3, [(1, 4)])`, que se imprime como:

```
3
1
1 4
```

## Complejidad

Sean $V = M \cdot N$ la cantidad de esquinas y $E \le 2 \cdot M \cdot N$ la cantidad de cuadras.

### Temporal

$O((M \cdot N + K) \log(M \cdot N + K))$.

Cada esquina se fija una sola vez y, al fijarse, empuja a lo sumo 4 vecinas al heap. Entonces el heap recibe a lo sumo $K + 4 \cdot M \cdot N$ inserciones, y cada inserción o extracción cuesta $O(\log)$ de su tamaño. `heapify` inicial es $O(K)$, armar los cortes es $O(B)$ y la pasada final para el máximo es $O(M \cdot N)$.

Con las cotas del problema son unas $4 \cdot 10^6$ operaciones sobre el heap, cada una de unos 22 pasos: del orden de $10^8$, viable.

**Tiempos medidos.** Con este código en Python 3.12, sobre ciudades generadas al azar (intensidades entre 0 y 1000 y cuadras cortadas al azar):

- 100 × 100 con K = 100: 0,03 s.
- 100 × 100 con K = 1000: 0,04 s. Multiplicar K por diez casi no cambia el tiempo, porque el recorrido de la ciudad se hace una sola vez.
- 1000 × 1000 con K = 100.000 (las cotas máximas): 7,1 s.

Los valores exactos dependen de la máquina, pero la proporción entre ellos no.

### Espacial

$O(M \cdot N + K + B)$.

El heap puede llegar a tener $K + 4 \cdot M \cdot N$ elementos por las copias repetidas, `molestia` tiene una entrada por esquina y el set de cortes ocupa $O(B)$.

## Cuándo usar esta técnica

### Favorable cuando

- Hay muchos orígenes. El costo casi no depende de K: las tumultuosas solo se insertan al principio.
- Los valores iniciales de los orígenes son distintos (como las intensidades). Un BFS común con varios orígenes no alcanza, porque supone que todos arrancan en 0; el heap respeta el orden aunque arranquen en valores distintos.
- Las aristas podrían tener pesos distintos de 1 (por ejemplo, cuadras más largas que otras): este enfoque sigue funcionando sin cambios, mientras que un BFS ya no.

### Limitaciones

- Requiere pesos no negativos en las cuadras. Las intensidades pueden hacer negativos los valores iniciales, pero eso no rompe nada porque es equivalente a desplazar todos los valores por una constante.
- Paga un factor $\log$ por el heap aunque todas las cuadras pesen 1.
- Solo devuelve la molestia mínima de cada esquina, no cuánto aporta cada tumultuosa por separado.

**Mejora posible.** Como todas las cuadras pesan 1 y los valores iniciales están acotados ($-1000 \le -v \le 0$), el heap se puede reemplazar por una lista de colas indexada por valor (el algoritmo de Dial): se procesan los niveles de menor a mayor y cada tumultuosa se agrega a la cola de su nivel $-v$. Es un BFS en el que los orígenes "entran" cuando el recorrido llega a su nivel, y cuesta $O(M \cdot N + K + 1000)$, sin el $\log$.

## Comparación con la solución por fuerza bruta

La [[eleccion-del-mejor-barrio-fuerza-bruta|solución por fuerza bruta]] hace un BFS completo desde cada tumultuosa y se queda con el mínimo en cada esquina: $O(K \cdot M \cdot N)$. La greedy hace un único recorrido en el que cada esquina se fija una sola vez.

| | Fuerza bruta | Greedy (Dijkstra multi-origen) |
|:--|:--|:--|
| Tiempo | $O(K \cdot M \cdot N)$ | $O((M \cdot N + K) \log(M \cdot N + K))$ |
| Espacio | $O(M \cdot N + B)$ | $O(M \cdot N + K + B)$ |
| Peor caso del problema | ~$10^{11}$ operaciones | ~$10^8$ operaciones |
| Peor caso medido en Python | ~3,5 días (estimado a partir de un BFS) | 7,1 s |
| Gana cuando | K es 1 o 2 | K es mediano o grande |

- **En tiempo**, la greedy es superior en cuanto hay más de un par de tumultuosas. Con las cotas del problema es la única de las dos que termina.
- **En espacio**, la greedy usa un poco más por las copias repetidas en el heap, pero las dos son lineales en el tamaño de la ciudad.
- **En simplicidad**, la fuerza bruta es la traducción literal de la definición. La greedy necesita un argumento de correctitud (el origen ficticio) y es fácil equivocarse con el sentido del heap.

## Referencias

- [[COR2011]] - Chapter 24.3 (Dijkstra's algorithm) y Chapter 6.5 (Priority queues).
- [[KLE2005]] - Chapter 4.4 (Shortest paths in a graph).
- Dial, R. B. (1969). *Algorithm 360: Shortest-path forest with topological ordering*. Communications of the ACM, 12(11), 632–633.
- [Documentación de `heapq`](https://docs.python.org/3/library/heapq.html)
