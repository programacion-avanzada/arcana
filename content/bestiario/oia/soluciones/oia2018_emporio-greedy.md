---
title: 'OIA2018 - Creando un emporio - Greedy'
tags:
  - oia
  - solucion
---

Volver al enunciado: [[oia2018_emporio]]

## Técnicas utilizadas

Algoritmo [[greedy]] basado en el [[algoritmo de Kruskal]] para [[árbol generador mínimo]]: se procesan las rutas de mejor a peor y se toma cada una si conviene en ese momento, sin volver atrás. Para saber rápido si dos puntos ya están conectados se usa un [[union-find]] (conjuntos disjuntos) con compresión de caminos, guardado en un [[array]] `padre`. Las rutas elegidas se van agregando a un [[dynamic array]].

## Idea de la solución

Primero se reduce cada ruta a su ganancia neta $g_i = t_i \cdot d_i - m_i$.

Kruskal clásico construye un árbol: agrega una arista solo si une dos componentes distintas. Acá el resultado **no tiene por qué ser un árbol**, así que la regla cambia levemente:

> Recorrer las rutas en orden **decreciente** de ganancia. Agregar la ruta $i$ si **une dos componentes distintas** o si **$g_i > 0$**.

- Una ruta con $g_i > 0$ siempre suma, aunque cierre un ciclo: se toma.
- Una ruta con $g_i \le 0$ solo se toma si es necesaria para conectar. Como se recorren de mayor a menor, cuando se necesita unir dos componentes se usa la que menos pierde.

**¿Por qué es óptimo?** Sea $S^+$ el conjunto de rutas con $g > 0$. Cualquier solución óptima puede incluir todas las de $S^+$ sin empeorar (agregarlas no rompe la conectividad y suma). Después de contraer las componentes que forma $S^+$, lo que falta es conectar esas componentes con las rutas restantes ($g \le 0$) perdiendo lo menos posible, y eso es exactamente un árbol generador de peso máximo (o sea, de costo mínimo), que Kruskal resuelve de forma óptima por el argumento de intercambio habitual. El recorrido único de mayor a menor hace ambas cosas a la vez: primero pasan todas las positivas, después las no positivas en el orden en que las procesaría Kruskal.

## Código

```python
def find(padre, x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]      # compresión de caminos
        x = padre[x]
    return x

def emporio(P, a, b, t, d, m):
    R = len(a)
    g = [t[i] * d[i] - m[i] for i in range(R)]
    padre = list(range(P))
    ganancia, paseos = 0, []

    for i in sorted(range(R), key=lambda i: -g[i]):   # de mayor a menor ganancia
        ra, rb = find(padre, a[i]), find(padre, b[i])
        if ra != rb or g[i] > 0:
            padre[ra] = rb                # si ra == rb no cambia nada
            ganancia += g[i]
            paseos.append(i)

    return ganancia, paseos
```

## Traza de ejemplo

Con la instancia del [[oia2018_emporio|enunciado]]. Ganancias netas: $g = [2, 3, 3, 1, -1, -2, 4]$.

Orden de mayor a menor ganancia: 6, 1, 2, 0, 3, 4, 5.

| Paso | Ruta | Une | $g$ | ¿Componentes distintas? | Decisión | Ganancia acumulada | Componentes |
|:---:|:---:|:---:|:---:|:---:|---|:---:|---|
| 0 | — | — | — | — | — | 0 | {0} {1} {2} {3} {4} {5} |
| 1 | 6 | 3 – 5 | +4 | sí | ✓ tomar | 4 | {0} {1} {2} {3,5} {4} |
| 2 | 1 | 2 – 0 | +3 | sí | ✓ tomar | 7 | {0,2} {1} {3,5} {4} |
| 3 | 2 | 2 – 1 | +3 | sí | ✓ tomar | 10 | {0,1,2} {3,5} {4} |
| 4 | 0 | 0 – 1 | +2 | no | ✓ tomar ($g > 0$, ciclo que suma) | 12 | {0,1,2} {3,5} {4} |
| 5 | 3 | 3 – 4 | +1 | sí | ✓ tomar | 13 | {0,1,2} {3,4,5} |
| 6 | 4 | 5 – 4 | −1 | no | ✗ descartar | 13 | {0,1,2} {3,4,5} |
| 7 | 5 | 2 – 3 | −2 | sí | ✓ tomar (inevitable) | **11** | {0,1,2,3,4,5} |

Resultado: ganancia **11**, rutas **6, 1, 2, 0, 3, 5** (el mismo conjunto que `0 2 1 3 5 6`).

El paso 4 muestra la diferencia con Kruskal clásico: la ruta 0 cierra un ciclo, pero se toma porque gana dinero.

## Complejidad

### Temporal
$O(R \log R)$:
- Calcular las ganancias: $O(R)$.
- Ordenar las rutas: $O(R \log R)$, que domina.
- Recorrerlas haciendo dos `find` y a lo sumo una unión cada una. Con solo compresión de caminos, cada `find` cuesta $O(\log P)$ amortizado, así que el recorrido es $O(R \log P)$. Como el grafo es conexo, $P \le R + 1$, y esto queda dentro de $O(R \log R)$. (Si además se uniera por tamaño o rango, cada `find` bajaría a $O(\alpha(P))$, prácticamente constante; no cambia la cota total porque el ordenamiento domina).

Con $R = 500.000$ son del orden de $10^7$ operaciones: resuelve todas las subtareas.

### Espacial
$O(P + R)$: el union-find ocupa $O(P)$; las ganancias, el orden de las rutas y la lista de paseos ocupan $O(R)$.

## Cuándo usar esta técnica

### Favorable cuando
- El problema tiene **subestructura greedy**: una elección localmente óptima (la ruta de mayor ganancia disponible) nunca impide llegar al óptimo global. Esto se demuestra con un argumento de intercambio, como en Kruskal.
- Hay que conectar un grafo minimizando costo o maximizando beneficio: árboles generadores y sus variantes.
- Las entradas son grandes ($R$ de cientos de miles) y se necesita algo cercano a lineal.

### Limitaciones
- Su correctitud depende de una demostración. Si el problema cambia un poco (por ejemplo, "exactamente $k$ paseos" o "cada punto con a lo sumo dos rutas"), el greedy deja de ser válido y habría que pasar a [[backtracking]], [[branch and bound]] o [[programación dinámica]].
- Ojo con el desbordamiento: $t_i \cdot d_i$ puede ser $10^{12}$ y la suma total $\sim 5 \cdot 10^{17}$, así que en C/C++ hace falta `long long`.

## Comparación con la solución de fuerza bruta

La [[oia2018_emporio-fuerza-bruta|fuerza bruta]] prueba los $2^R$ subconjuntos y solo resuelve $R \le 15$. El greedy toma una única decisión por ruta y corre en $O(R \log R)$: con $R = 15$ la diferencia no se nota, pero con $R = 1.000$ la fuerza bruta necesitaría $2^{1000}$ iteraciones mientras el greedy hace unas pocas miles de operaciones.

A cambio, la fuerza bruta es correcta "por construcción" y no necesita demostración. Por eso se usaron juntas: se compararon ambas soluciones sobre 300 grafos aleatorios chicos y dieron siempre la misma ganancia, lo que respalda la correctitud del greedy.

## Referencias
- [Solucionario OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/03/solucionario-2018.pdf), pág. 79: la solución oficial plantea la misma idea (tomar todas las rutas que ganan y completar con Kruskal).
- [[COR2011]], capítulo 23 (Minimum Spanning Trees) y capítulo 21 (Data Structures for Disjoint Sets).
- [[KLE2005]], capítulo 4 (Greedy Algorithms), sección sobre árboles generadores mínimos y el argumento de intercambio.
