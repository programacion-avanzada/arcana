---
title: 'Nuevas Autopistas - Recursion'
tags:
  - solucion
---

## Técnicas utilizadas
* **Recursividad y pila de llamadas:** la exploración del grafo se formula de manera recursiva (un nodo delega la exploración a sus vecinos no visitados). El propio árbol de llamadas recursivas define qué nodos son ancestros activos en cada instante y permite mantener sincronizada una pila explícita con las aristas del camino en curso (apilando antes de la llamada recursiva y desapilando al retornar).
* **DFS con pila de camino:** recorre el grafo en profundidad aprovechando los estados de la recursión (`NO_VISITADO`, `EN_PILA` / activo en recursión, y `CERRADO` / recursión finalizada). Al chocar con un nodo `EN_PILA`, detecta un ciclo y retrocede por la pila marcando sus aristas.
* **Ordenamiento y Búsqueda binaria (Dividir y conquistar):** organiza las autopistas eliminables de menor a mayor costo y localiza en $\mathcal{O}(\log N)$ —dividiendo sucesivamente el intervalo de búsqueda a la mitad— si existe una autopista con el costo exacto necesario para cubrir el excedente $D = S - F$.


## Idea de la solución
Un grafo conexo de $N$ ciudades y $N + 1$ autopistas contiene exactamente 2 ciclos fundamentales. Ejecutamos un único DFS recursivo desde la ciudad `1` para clasificar todas las autopistas de una sola pasada:

* **Rol de la recursividad en la detección de ciclos:** cuando la función recursiva entra en una ciudad `u`, la marca como `EN_PILA` (su llamada sigue abierta en la pila de ejecución). Antes de invocarse recursivamente sobre un vecino `v`, apila la autopista `(u, v)`, y justo al retornar de esa llamada recursiva la desapila (restaurando el camino exacto desde la raíz hasta `u`). Si en cambio `v` ya estaba `EN_PILA`, significa que `v` es un ancestro cuya llamada recursiva aún no terminó: acabamos de cerrar un ciclo y sus aristas están en el tope de la pila. Al agotar los vecinos de `u`, su llamada termina y pasa a estado `CERRADO`.
* Sumando `1` a las aristas del primer ciclo detectado y `2` a las del segundo, cada autopista queda clasificada en cuatro grupos:
  * **Grupo `0` (Puentes):** nunca formaron parte de un ciclo; no pueden eliminarse.
  * **Grupos `1`, `2` y `3`:** pertenecen solo al ciclo 1, solo al ciclo 2, o a la intersección de ambos (`1 + 2 = 3`).

**Propiedad clave:** se puede eliminar cualquier autopista individual de los grupos `1`, `2` o `3`; y se pueden eliminar **2 autopistas simultáneamente si y solo si pertenecen a grupos distintos** (quitar dos del mismo grupo desconecta el grafo).

Finalmente, guardamos las autopistas de los grupos `1`, `2` y `3` en listas ordenadas (`L[1]`, `L[2]`, `L[3]`) y para cada $F$ buscamos cubrir el excedente $D = S - F$:
1. **$K = 0$:** si $D < 0$ respondemos `NO`; si $D = 0$ respondemos `SI`, `0`.
2. **$K = 1$:** buscamos con búsqueda binaria una autopista de costo $D$ en `L[1]`, `L[2]` o `L[3]`.
3. **$K = 2$:** para cada par de listas distintas `(L[1], L[2])`, `(L[1], L[3])` y `(L[2], L[3])`, fijamos una autopista de costo $c_1$ en la primera y buscamos `D - c1` con búsqueda binaria en la segunda.


## Código

```text
PROCEDIMIENTO ClasificarCiclosDFS(u, arista_padre):
    estado[u] ← EN_PILA                      // Llamada recursiva activa para 'u'

    PARA CADA (v, id_arista) EN adj[u] (con id_arista ≠ arista_padre):
        SI estado[v] == NO_VISITADO:
            Apilar (u, id_arista) en pila_camino
            ClasificarCiclosDFS(v, id_arista) // Paso recursivo: descender al hijo 'v'
            Desapilar de pila_camino          // Al retornar de la recursión, restaurar camino
        SINO SI estado[v] == EN_PILA:         // Caso de ciclo: 'v' es un ancestro activo
            grupo[id_arista] += num_ciclo
            Retroceder en pila_camino hasta hallar 'v', sumando num_ciclo a cada arista
            num_ciclo ← num_ciclo + 1

    estado[u] ← CERRADO                      // Fin de la llamada recursiva para 'u'

PROCEDIMIENTO ResolverOptimo(N, autopistas, objetivos_F):
    S ← suma de costos de todas las autopistas
    ClasificarCiclosDFS(1, -1)
    Agrupar autopistas con grupo > 0 en L[1], L[2], L[3] y ordenar cada lista por costo

    PARA CADA F EN objetivos_F:
        D ← S - F
        SI D < 0: IMPRIMIR "NO"; CONTINUAR
        SI D == 0: IMPRIMIR "SI", 0; CONTINUAR

        // Caso K = 1: búsqueda binaria directa
        SI BusquedaBinaria(L[g], D) halla autopista e en algún g ∈ {1, 2, 3}:
            IMPRIMIR "SI", 1, extremos(e); CONTINUAR

        // Caso K = 2: iterar un grupo y búsqueda binaria en otro grupo distinto
        PARA CADA par de grupos distintos (g1, g2) EN {(1,2), (1,3), (2,3)}:
            PARA CADA autopista e1 de costo c1 EN L[g1] (mientras c1 < D):
                SI BusquedaBinaria(L[g2], D - c1) halla autopista e2:
                    IMPRIMIR "SI", 2, extremos(e1), extremos(e2); PASAR AL SIGUIENTE F

        IMPRIMIR "NO"
```


## Traza de ejemplo

**Entrada:** $N = 6$, autopistas `(1-2, 1)`, `(2-3, 2)`, `(3-4, 3)`, `(4-2, 4)`, `(4-5, 5)`, `(3-6, 6)`, `(1-5, 7)`. Suma total $S = 28$.

1. **Preprocesamiento recursivo (DFS + Ordenamiento):**
   * Las llamadas recursivas anidadas descienden por `DFS(1) -> DFS(2) -> DFS(3) -> DFS(4)` manteniendo esas cuatro ciudades `EN_PILA`:
     * Desde `4`, al inspeccionar `2` (que sigue `EN_PILA`), detecta el **Ciclo 1** (`num_ciclo = 1`) y suma `1` a `(2-3)`, `(3-4)` y `(4-2)`.
     * `DFS(4)` continúa hacia `DFS(5)`, que al inspeccionar `1` (`EN_PILA`) detecta el **Ciclo 2** (`num_ciclo = 2`) y suma `2` a `(1-2)`, `(2-3)`, `(3-4)`, `(4-5)` y `(1-5)`.
     * La recursión desapila y retorna desde `5` y `4` hacia `DFS(3)`, que explora `DFS(6)` y retorna sin choques (`(3-6)` queda con `grupo = 0`, puente).
   * Listas ordenadas resultantes `(costo, u-v)`:
     * `L[1]` (solo Ciclo 1): `[(4, 4-2)]`
     * `L[2]` (solo Ciclo 2): `[(1, 1-2), (5, 4-5), (7, 1-5)]`
     * `L[3]` (ambos ciclos, `1+2`): `[(2, 2-3), (3, 3-4)]`

2. **Consultas:**
   * **$F_1 = 21 \implies D = 7$:** en $K = 1$, `BusquedaBinaria` halla `(7, 1-5)` en `L[2]` $\rightarrow$ **`SI`, `1`, `1 5`**.
   * **$F_2 = 22 \implies D = 6$:** en $K = 1$ ninguna lista tiene costo $6$. En $K = 2$, al cruzar `(L[1], L[3])`, toma `(4, 4-2)` de `L[1]` y busca $6 - 4 = 2$ en `L[3]`, hallando `(2, 2-3)` $\rightarrow$ **`SI`, `2`, `4 2` y `2 3`**.
   * **$F_3 = 30 \implies D = -2$:** como $D < 0$ $\rightarrow$ **`NO`**.


## Complejidad
* **Temporal — $\mathcal{O}(N \log N)$:**
  * El DFS realiza exactamente $N$ llamadas recursivas (una por ciudad, gracias al control de `estado`) e inspecciona las $N + 1$ aristas en $\mathcal{O}(N)$; el retroceso por la pila ocurre solo $2$ veces recorriendo a lo sumo $N$ aristas cada vez ($\mathcal{O}(N)$).
  * Ordenar `L[1]`, `L[2]` y `L[3]` cuesta $\mathcal{O}(N \log N)$.
  * Cada consulta realiza hasta $3$ búsquedas binarias para $K = 1$ ($\mathcal{O}(\log N)$) y hasta $\mathcal{O}(N)$ búsquedas binarias para $K = 2$, costando $\mathcal{O}(N \log N)$.
* **Espacial — $\mathcal{O}(N)$:** tanto la pila de llamadas recursivas del sistema (*call stack*, que puede alcanzar profundidad $N$ si el grafo es una cadena, por lo que en Python se ajusta el límite de recursión) como `pila_camino`, la lista de adyacencia y `L[1..3]` ocupan memoria lineal $\mathcal{O}(N)$.



## Cuándo usar esta técnica
* **Contexto favorable:** instancias medianas y grandes ($N = 2.000$ e incluso escalable hasta $N = 100.000$), o escenarios con múltiples consultas $F_i$ sobre el mismo grafo, ya que la recursión del DFS clasifica toda la topología una única vez al principio.
* **Limitaciones:** en lenguajes con límite estricto de pila de recursión (como Python, cuyo tope por defecto es $1.000$), un árbol DFS de profundidad $N = 2.000$ requiere ampliar dicho límite (`sys.setrecursionlimit`) o simular la recursión de forma iterativa. Además, la clasificación en 3 grupos aprovecha específicamente que $M = N + 1$ ($2$ ciclos fundamentales).
* **Comparación con las otras soluciones:**
  * *Vs. Fuerza bruta y Backtracking ($\mathcal{O}(N^3)$):* mientras que el backtracking usa la recursividad para probar combinaciones exponenciales/cuadráticas de descartes y repite un DFS en cada paso, esta solución usa la recursividad una sola vez para recorrer estructuralmente el grafo ($\mathcal{O}(N)$) y delega la búsqueda de sumas a búsqueda binaria, bajando a $\mathcal{O}(N \log N)$.


## Referencias
* OIA — Enunciado original *Nuevas Autopistas* (Jurisdiccional 2018, Nivel 3): https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/nautopistas.pdf
