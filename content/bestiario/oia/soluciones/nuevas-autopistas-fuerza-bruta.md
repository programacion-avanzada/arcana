---
title: 'Nuevas Autopistas - Fuerza Bruta'
tags:
  - solucion
---

## Técnicas utilizadas
* **Fuerza bruta acotada:** enumera y verifica sistemáticamente los candidatos posibles. Como conectar $N$ ciudades exige al menos $N - 1$ autopistas y tenemos $N + 1$, solo es posible descartar $K \in \{0, 1, 2\}$ autopistas (evitando probar los $2^{N+1}$ subconjuntos).
* **Búsqueda en Profundidad (DFS):** recorre el grafo en $\mathcal{O}(N)$ para comprobar si las $N$ ciudades siguen conectadas tras ignorar las autopistas descartadas.


## Idea de la solución
Calculamos el costo total $S$ de las $N + 1$ autopistas y buscamos descartar hasta $2$ autopistas que sumen el excedente $D = S - F$ sin desconectar el grafo:

1. **$K = 0$:** si $D < 0$, es imposible (`NO`). Si $D = 0$, no se descarta nada (`SI`, `0`).
2. **$K = 1$:** probamos cada autopista $i$. Si $c_i = D$ y el grafo sigue conexo sin $i$ (verificado con DFS), devolvemos esa autopista.
3. **$K = 2$:** si $K = 1$ falla, probamos todos los pares $(i, j)$. Si $c_i + c_j = D$ y el grafo sigue conexo sin $i$ ni $j$, devolvemos el par. Si ningún caso funciona, respondemos `NO`.

## Código

```text
FUNCIÓN SigueConexo(G, ignoradas):
    Visitar nodos desde la ciudad 1 con DFS sin usar aristas en 'ignoradas'
    RETORNAR (cantidad de nodos visitados == N)

PROCEDIMIENTO ResolverFuerzaBruta(N, autopistas, objetivos_F):
    S ← suma de costos de todas las autopistas

    PARA CADA F EN objetivos_F:
        D ← S - F
        SI D < 0: IMPRIMIR "NO"; CONTINUAR
        SI D == 0: IMPRIMIR "SI", 0; CONTINUAR

        // Caso K = 1
        SI existe autopista e = (u, v, c) con c == D Y SigueConexo(G, {e}):
            IMPRIMIR "SI", 1, (u, v); CONTINUAR

        // Caso K = 2
        SI existe par (e1, e2) con c1 + c2 == D Y SigueConexo(G, {e1, e2}):
            IMPRIMIR "SI", 2, extremos(e1), extremos(e2); CONTINUAR

        IMPRIMIR "NO"
```


## Traza de ejemplo

**Entrada:** $N = 6$, autopistas `0:(1-2, 1)`, `1:(2-3, 2)`, `2:(3-4, 3)`, `3:(4-2, 4)`, `4:(4-5, 5)`, `5:(3-6, 6)`, `6:(1-5, 7)`. Suma total $S = 28$.

* **$F_1 = 21 \implies D = 7$:**
  * En $K = 1$, la autopista `6:(1-5)` cuesta $7$. `SigueConexo` alcanza las $6$ ciudades $\rightarrow$ **`SI`, `1`, `1 5`**.
* **$F_2 = 22 \implies D = 6$:**
  * En $K = 1$, `5:(3-6)` cuesta $6$, pero `SigueConexo` da `FALSO` (aísla a la ciudad $6$).
  * En $K = 2$, el par `0:(1-2)` + `4:(4-5)` suma $6$, pero desconecta `{1, 5}` (`FALSO`). Luego, el par `1:(2-3)` + `3:(4-2)` suma $2 + 4 = 6$ y `SigueConexo` da `VERDADERO` $\rightarrow$ **`SI`, `2`, `2 3` y `4 2`**.
* **$F_3 = 30 \implies D = -2$:**
  * Como $D < 0$ $\rightarrow$ **`NO`**.


## Complejidad
* **Temporal — $\mathcal{O}(N^3)$:** para cada uno de los $3$ valores de $F$, el caso $K = 1$ evalúa $\mathcal{O}(N)$ autopistas y el caso $K = 2$ evalúa $\binom{N+1}{2} = \mathcal{O}(N^2)$ pares. En el peor caso (muchos pares suman $D$ pero desconectan el grafo), por cada par se ejecuta un DFS de $\mathcal{O}(N)$, totalizando $\mathcal{O}(N^2) \cdot \mathcal{O}(N) = \mathcal{O}(N^3)$.
* **Espacial — $\mathcal{O}(N)$:** la lista de adyacencia, la lista de $N + 1$ autopistas y el arreglo de visitados del DFS ocupan espacio lineal.

---

## Cuándo usar esta técnica
* **Contexto favorable:** instancias chicas ($N \le 300$), casos donde pocos pares suman $D$ (el filtro por suma evita casi todos los DFS), o como validador (*stress testing*) para contrastar soluciones más complejas.
* **Limitaciones:** recalcula la conectividad desde cero en cada intento sin recordar puentes ni ciclos; en casos adversos con $N = 2.000$ puede exceder el tiempo límite.
* **Comparación con las otras soluciones:**
  * *Vs. Backtracking con poda:* esta versión iterativa acotada a $K \le 2$ es más simple y evita explorar ramas recursivas profundas de construcción.
  * *Vs. Solución óptima ($\mathcal{O}(N \log N)$):* la óptima hace **un solo DFS** inicial para clasificar ciclos y luego busca sumas ordenando, bajando de $\mathcal{O}(N^3)$ a $\mathcal{O}(N \log N)$.


## Referencias
* OIA — Enunciado original *Nuevas Autopistas* (Jurisdiccional 2018, Nivel 3): https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/nautopistas.pdf

