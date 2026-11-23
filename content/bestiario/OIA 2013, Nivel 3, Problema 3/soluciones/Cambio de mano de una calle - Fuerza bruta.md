## Solución por fuerza bruta

## 1. Técnicas utilizadas

- **Fuerza bruta (búsqueda exhaustiva):** se prueban todas las candidatas (las `C` calles) y se queda la mejor.
- **Algoritmo de Dijkstra con cola de prioridad (heap):** calcula el camino mínimo en un [[Graph|grafo|]] dirigido con pesos positivos. Es la subrutina que evalúa cada candidata.

## 2. Idea de la solución

1. Modelar el barrio como un grafo dirigido y ejecutar Dijkstra desde `S`. La distancia a `T` es la **primera línea** de salida (`orig`).
2. Para cada calle `i = 1..C`:
    - Invertirla, es decir, cambiar `(u → v, d)` por `(v → u, d)`.
    - Volver a ejecutar Dijkstra desde `S` y obtener la distancia a `T`.
    - Si es menor que la mejor distancia hallada hasta ahora, guardar la distancia y el índice `i`.
3. Al final:
    - Si `mejor < orig`, imprimir `orig`, `mejor` e índice.
    - Si no, imprimir `NO ES POSIBLE MEJORAR`.

Como el enunciado acepta cualquier solución cuando hay empates, alcanza con guardar la primera mejor calle encontrada. Si una inversión deja a `T` inalcanzable, la distancia es ∞ y nunca resulta elegida.

## 3. Código (Python)

```python
import heapq, sys

INF = float('inf')

def dijkstra(n, adj, s, t):
    dist = [INF] * (n + 1)
    dist[s] = 0
    pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        if u == t:                      # poda: ya tenemos el mínimo a T
            return d
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist[t]

def construir(n, calles, invertida=-1):
    adj = [[] for _ in range(n + 1)]
    for i, (u, v, d) in enumerate(calles):
        if i == invertida:
            u, v = v, u                 # cambio de mano
        adj[u].append((v, d))
    return adj

def resolver(n, s, t, calles):
    orig = dijkstra(n, construir(n, calles), s, t)

    mejor, calle = orig, -1
    for i in range(len(calles)):        # fuerza bruta: probar cada calle
        d = dijkstra(n, construir(n, calles, i), s, t)
        if d < mejor:
            mejor, calle = d, i + 1     # numeración desde 1

    if calle == -1:
        return [orig, "NO ES POSIBLE MEJORAR"]
    return [orig, mejor, calle]

def main():
    data = sys.stdin.read().split()
    n, s, t = int(data[0]), int(data[1]), int(data[2])
    c = int(data[3])
    calles = [(int(data[4+3*i]), int(data[5+3*i]), int(data[6+3*i]))
              for i in range(c)]
    print("\n".join(map(str, resolver(n, s, t, calles))))

main()
```

> El enunciado menciona tanto `cambio.in` como `invertir.in`. En el código se lee de la entrada estándar para no depender del nombre.

## 4. Traza de ejemplo

**Entrada:** `E = 8`, `S = 2`, `T = 7`, `C = 13`

|#|Calle (u → v, d)|#|Calle (u → v, d)|
|---|---|---|---|
|1|2 → 4 (4)|8|1 → 6 (7)|
|2|2 → 1 (5)|9|8 → 4 (2)|
|3|2 → 3 (2)|10|6 → 8 (1)|
|4|3 → 1 (3)|11|8 → 7 (6)|
|5|4 → 1 (4)|12|6 → 7 (8)|
|6|7 → 5 (3)|13|5 → 3 (2)|
|7|1 → 5 (3)|||

### Paso 1: Dijkstra sobre el mapa original (desde 2)

Distancias finales: `d[2]=0`, `d[3]=2`, `d[4]=4`, `d[1]=5`, `d[5]=8`, `d[6]=12`, `d[8]=13`, `d[7]=19`.

El camino mínimo es 2 → 1 → 6 → 8 → 7 = 5 + 7 + 1 + 6 = **19** (primera línea de salida).

![[Cambio_de_mano_de_una calle_original.svg]]

### Paso 2: probar cada inversión

| Calle invertida        | Efecto                     | Dist. a 7 |
| ---------------------- | -------------------------- | --------- |
| 1 (2→4)                | el camino óptimo no la usa | 19        |
| 2 (2→1)                | 2→3→1 también cuesta 5     | 19        |
| 3 (2→3)                | 2→1 directo                | 19        |
| 4 (3→1)                | no se usa                  | 19        |
| 5 (4→1)                | no se usa                  | 19        |
| **6 (7→5 pasa a 5→7)** | **2→1→5→7 = 5+3+3**        | **11** ✔  |
| 7 (1→5)                | no se usa                  | 19        |
| 8 (1→6)                | 6 queda inalcanzable       | ∞         |
| 9 (8→4 pasa a 4→8)     | 2→4→8→7 = 4+2+6            | 12        |
| 10 (6→8)               | hay que ir por 6→7         | 20        |
| 11 (8→7)               | hay que ir por 6→7         | 20        |
| 12 (6→7)               | sigue 2→1→6→8→7            | 19        |
| 13 (5→3)               | no se usa                  | 19        |

El mínimo es **11**, obtenido al invertir la calle **6**. Como 11 < 19, hay mejora.

![[Cambio_de_mano_de_una calle_invertida.svg]]

### Salida

```
19
11
6
```

Coincide con la salida esperada del enunciado.

## 5. Complejidad

- **Tiempo:** cada Dijkstra con heap cuesta `O((E + C) log E)`. Se ejecuta `C + 1` veces, y reconstruir la lista de adyacencia en cada intento cuesta `O(C)` más. En total es **`O(C · (E + C) · log E)`**.
    - Con los límites máximos (`C = 250.000`, `E = 80.000`) son del orden de 10¹² operaciones, **inviable**. Solo sirve para instancias chicas (`C` del orden de unos pocos miles).
- **Espacio:** **`O(E + C)`**, por la lista de adyacencia, el arreglo de distancias y el heap. Solo hay una estructura activa a la vez.

## 6. Cuándo usar esta técnica

- **Contexto favorable:**
    - Instancias pequeñas, o como **solución de referencia** para validar otra más eficiente con casos aleatorios.
    - Es muy fácil de implementar y de razonar. Es correcta por construcción, porque prueba todas las posibilidades.
- **Limitaciones:** el costo es lineal en `C` veces un Dijkstra completo, así que con los límites del enunciado agotaría el tiempo y no obtendría el puntaje completo.
- **Comparación con la otra solución del grupo** (la solución óptima suele ser esta): se corre Dijkstra desde `S` sobre el grafo original y otro Dijkstra desde `T` sobre el grafo con todos los arcos invertidos. Así se obtienen `dS[x]` y `dT[x]` para todo nodo. Para cada calle `(u → v, d)`, el costo tras invertirla es `dS[v] + d + dT[u]`, y se toma el mínimo. Eso da **`O((E + C) log E)`** en total, ejecutando solo 2 Dijkstra en lugar de `C + 1`.
    - Esas distancias podrían usar la propia calle que se invierte, pero en ese caso el total nunca es menor que `orig`, así que no genera falsas mejoras.
    - La fuerza bruta es más simple y segura. La solución óptima es la única que escala a los límites del enunciado.

## 7. Referencias

- Enunciado: _Certamen Nacional OIA 2013, Nivel 3, Problema 3 "invertir"_ (Olimpíada Argentina de Informática), colaboración de Guillermo García.

