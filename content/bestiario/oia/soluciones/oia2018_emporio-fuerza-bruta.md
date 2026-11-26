---
title: 'OIA2018 - Creando un emporio - Fuerza Bruta'
tags:
  - oia
  - solucion
---

Volver al enunciado: [[oia2018_emporio]]

## Técnicas utilizadas

Búsqueda por [[fuerza bruta]]: se enumeran **todos** los subconjuntos posibles de rutas (representados como máscaras de bits) y para cada uno se verifica si cumple la condición (dejar el pueblo conectado) y cuánto gana. Para verificar la conectividad se usa un [[union-find]] (conjuntos disjuntos), guardado en un [[array]] `padre`; las rutas del subconjunto se acumulan en un [[dynamic array]].

## Idea de la solución

Cada subconjunto de rutas $S \subseteq \{0, \dots, R-1\}$ se codifica con un número `mask` entre $0$ y $2^R - 1$: el bit $i$ en 1 significa "instalar paseo en la ruta $i$".

Para cada máscara:
1. Se suma la ganancia neta $g_i = t_i \cdot d_i - m_i$ de las rutas elegidas.
2. Se unen en el union-find los extremos de cada ruta elegida, contando cuántas componentes quedan.
3. Si queda **una sola componente**, el subconjunto es un emporio válido y se compara con el mejor encontrado hasta el momento.

Como el grafo original es conexo, el subconjunto "todas las rutas" siempre es válido, así que siempre existe respuesta.

## Código

```python
def find(padre, x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]
        x = padre[x]
    return x

def emporio(P, a, b, t, d, m):
    R = len(a)
    g = [t[i] * d[i] - m[i] for i in range(R)]
    mejor, paseos = None, []

    for mask in range(1 << R):              # 2^R subconjuntos
        padre = list(range(P))
        componentes, ganancia, elegidas = P, 0, []
        for i in range(R):
            if mask >> i & 1:               # la ruta i está en el subconjunto
                ganancia += g[i]
                elegidas.append(i)
                ra, rb = find(padre, a[i]), find(padre, b[i])
                if ra != rb:
                    padre[ra] = rb
                    componentes -= 1
        if componentes == 1 and (mejor is None or ganancia > mejor):
            mejor, paseos = ganancia, elegidas

    return mejor, paseos
```

## Traza de ejemplo

Con la instancia del [[oia2018_emporio|enunciado]] hay $2^7 = 128$ máscaras. Ganancias netas: $g = [2, 3, 3, 1, -1, -2, 4]$.

Algunas máscaras representativas (el bit de la derecha es la ruta 0):

| Máscara | Rutas elegidas | Ganancia | Componentes | ¿Válida? | Mejor hasta ahora |
|---|---|:---:|:---:|:---:|:---:|
| `0000000` | — | 0 | 6 | ✗ | — |
| `0000111` | 0, 1, 2 | 8 | 4 | ✗ | — |
| `0001111` | 0, 1, 2, 3 | 9 | 3 | ✗ | — |
| `1001111` | 0, 1, 2, 3, 6 | 13 | 2 | ✗ (faltan los triángulos unidos) | — |
| ... | ... | ... | ... | ... | ... |
| `0101011` | 0, 1, 3, 5 | 4 | 2 | ✗ (5 queda aislado) | ... |
| `1101011` | 0, 1, 3, 5, 6 | 8 | 1 | ✓ | 8 |
| `1101111` | 0, 1, 2, 3, 5, 6 | **11** | 1 | ✓ | **11** |
| `1111111` | todas | 10 | 1 | ✓ | 11 |

Ninguna otra máscara supera 11: la única forma de unir los dos triángulos es la ruta 5 ($-2$), y lo mejor posible es tomar además todas las rutas positivas y descartar la 4.

Resultado: ganancia **11**, rutas **0, 1, 2, 3, 5, 6**.

## Complejidad

### Temporal
$O(2^R \cdot (R \cdot \alpha(P) + P))$. Hay $2^R$ subconjuntos; para cada uno se reinicializa el union-find en $O(P)$ y se recorren las $R$ rutas, cada una con un `find` prácticamente constante ($\alpha$ es la inversa de Ackermann). En la práctica es $O(2^R \cdot (R + P))$.

Con $R = 15$ son unas $32.768 \cdot 15 \approx 5 \cdot 10^5$ operaciones: instantáneo. Con $R = 30$ ya son $\sim 3 \cdot 10^{10}$, y con $R = 500.000$ es completamente inviable.

### Espacial
$O(P + R)$: el union-find ocupa $O(P)$ y el arreglo de ganancias y la lista de rutas elegidas $O(R)$. No se guardan los subconjuntos, se generan sobre la marcha con la máscara.

## Cuándo usar esta técnica

### Favorable cuando
- $R$ es muy chico (las subtareas con $R \le 15$).
- Se necesita una solución **obviamente correcta** para validar otra más eficiente: comparar la fuerza bruta con el greedy sobre muchos casos aleatorios chicos es la mejor forma de detectar errores.
- Todavía no se tiene una intuición sobre la estructura del problema.

### Limitaciones
- Crecimiento exponencial: cada ruta extra duplica el tiempo. Solo resuelve las subtareas de $R \le 15$ (16 de los 100 puntos).
- Hace muchísimo trabajo inútil: la mayoría de las máscaras ni siquiera conectan el grafo, y entre las que sí, casi todas incluyen rutas negativas innecesarias o excluyen positivas.

## Comparación con la solución greedy

La [[oia2018_emporio-greedy|solución greedy]] aprovecha dos propiedades que la fuerza bruta ignora: que las rutas con ganancia positiva siempre conviene tomarlas, y que para conectar lo que falta alcanza con elegir, de mayor a menor ganancia, las rutas que unen componentes distintas. Eso baja la complejidad de $O(2^R \cdot (R+P))$ a $O(R \log R)$ y resuelve todas las subtareas.

La fuerza bruta no necesita ninguna demostración de correctitud: explora todo. El greedy sí la necesita (un argumento de intercambio), y por eso la fuerza bruta es valiosa como verificador.

## Referencias
- [Solucionario OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/03/solucionario-2018.pdf)
