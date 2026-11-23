---
title: 'OIA2025 - Cosechando sandías - Fuerza Bruta'
tags:
  - oia
  - solucion
---

Solución por fuerza bruta para [[2025_cosechando_sandias]].

## Técnicas utilizadas

**Fuerza bruta:** se generan todas las soluciones candidatas, se verifica cada una contra las restricciones del problema y se conserva la mejor. No se usa ninguna propiedad del problema para evitar candidatos, así que es correcta por construcción, pero su costo crece con el tamaño del espacio de búsqueda.

**Recursividad** como mecanismo de generación: una función recursiva toma una decisión por nivel ("cosechar o dejar la sandía $i$") y así recorre el árbol completo de decisiones hasta producir los $2^N$ subconjuntos posibles.

## Idea de la solución

Una cosecha queda determinada por una decisión binaria para cada sandía. Eso forma un árbol binario de profundidad $N$: en el nivel $i$ se decide sobre la sandía $i$, la rama izquierda la cosecha y la derecha la deja. Cada una de las $2^N$ hojas es un subconjunto distinto de sandías.

La función `Explorar(i)` construye ese árbol. Mantiene en `elegidas`, un [[dynamic array|arreglo dinámico]] usado como pila (se agrega y se quita al final), los índices de las sandías cosechadas en el camino actual desde la raíz. Al llegar a una hoja ($i > N$) ya se decidió sobre todas las sandías, y recién entonces se verifica el candidato:

1. que la suma de pesos no supere $T$;
2. que cada par de sandías elegidas consecutivas esté a $D$ metros o más.

Si el candidato es válido y pesa más que el mejor encontrado hasta el momento, se lo guarda. Como los índices se agregan en orden creciente y las ubicaciones están ordenadas, `elegidas` ya queda en el orden que pide la salida.

La verificación se hace **solo en las hojas**: aunque una rama ya viole la distancia o la capacidad en un nivel intermedio, se la sigue recorriendo hasta el final. Eso es lo que distingue a la fuerza bruta de un backtracking, que cortaría esa rama en cuanto deja de ser viable.

## Código

```text
ALGORITMO Sandias(T, D, x, p, ubicaciones)
    N ← |x|
    mejorPeso ← 0
    mejorConjunto ← arreglo vacío
    elegidas ← arreglo vacío

    Explorar(1)

    PARA k ← 1 HASTA |mejorConjunto| HACER
        Agregar(ubicaciones, x[mejorConjunto[k]])
    RETORNAR mejorPeso

FUNCIÓN Explorar(i)
    SI i > N ENTONCES
        SI EsValido(elegidas, T, D, x, p) ENTONCES
            peso ← SumaDePesos(elegidas, p)
            SI peso > mejorPeso ENTONCES
                mejorPeso ← peso
                mejorConjunto ← Copia(elegidas)
        RETORNAR

    Agregar(elegidas, i)
    Explorar(i + 1)
    QuitarUltimo(elegidas)
    Explorar(i + 1)

FUNCIÓN EsValido(elegidas, T, D, x, p)
    SI SumaDePesos(elegidas, p) > T ENTONCES
        RETORNAR FALSO

    PARA k ← 1 HASTA |elegidas| - 1 HACER
        SI x[elegidas[k + 1]] - x[elegidas[k]] < D ENTONCES
            RETORNAR FALSO

    RETORNAR VERDADERO
```

`Explorar` usa directamente las variables de `Sandias` (`mejorPeso`, `mejorConjunto` y `elegidas`). Los arreglos se indexan desde 1. El conjunto vacío es una de las hojas y es siempre válido, así que si no se puede cosechar nada la función retorna $0$ con `ubicaciones` vacío.

## Traza de ejemplo

Instancia de [[2025_cosechando_sandias]]: $T = 41$, $D = 10$ y las sandías

| Sandía | 1 | 2 | 3 | 4 | 5 | 6 |
|--------|--:|--:|--:|--:|--:|--:|
| $x_i$  | 1 | 15 | 16 | 20 | 48 | 87 |
| $p_i$  | 20 | 1 | 2 | 7 | 17 | 5 |

Con $N = 6$, el árbol tiene $2^6 = 64$ hojas. Como la rama "cosechar" se explora primero, la primera hoja es el conjunto con las seis sandías y la última es el conjunto vacío.

![Primeros niveles del árbol de decisiones de la fuerza bruta sobre el ejemplo](2025-cosechando-sandias-fuerza-bruta-arbol.svg)

Las primeras 8 hojas cuelgan del nodo en el que ya se cosecharon las sandías en 1, 15 y 16. Todas son inválidas, porque 15 y 16 están a 1 metro, pero la fuerza bruta igual las genera y las verifica una por una:

| Hoja | Ubicaciones elegidas   | Peso | ¿Peso ≤ 41? | ¿Separación ≥ 10? | `mejorPeso` |
|-----:|------------------------|-----:|:-----------:|:-----------------:|------------:|
|    1 | 1, 15, 16, 20, 48, 87  |   52 | no          | no                |           0 |
|    2 | 1, 15, 16, 20, 48      |   47 | no          | no                |           0 |
|    3 | 1, 15, 16, 20, 87      |   35 | sí          | no                |           0 |
|    4 | 1, 15, 16, 20          |   30 | sí          | no                |           0 |
|    5 | 1, 15, 16, 48, 87      |   45 | no          | no                |           0 |
|    6 | 1, 15, 16, 48          |   40 | sí          | no                |           0 |
|    7 | 1, 15, 16, 87          |   28 | sí          | no                |           0 |
|    8 | 1, 15, 16              |   23 | sí          | no                |           0 |

La hoja 6 es justamente la respuesta de la versión sin distancia ($D = 0$): pesa 40 pero viola la separación. El mejor valor solo cambia dos veces en todo el recorrido:

| Hoja | Ubicaciones elegidas | Peso | Válida | `mejorPeso` antes → después |
|-----:|----------------------|-----:|:------:|:---------------------------:|
|   14 | 1, 15, 48            |   38 | sí     | 0 → **38**                  |
|   22 | 1, 16, 48            |   39 | sí     | 38 → **39**                 |

Las 42 hojas restantes (de la 23 a la 64) no mejoran ese valor. Resumen del recorrido completo:

| Hojas | Violan la distancia | Superan $T$ | Violan ambas | Inválidas | Válidas |
|------:|--------------------:|------------:|-------------:|----------:|--------:|
|    64 |                  32 |          12 |            7 |        37 |      27 |

Resultado: `mejorPeso = 39` y `ubicaciones = [1, 16, 48]`.

## Complejidad

### Temporal

$O(N \cdot 2^N)$.

- El árbol tiene $2^N$ hojas y $2^N - 1$ nodos internos. Cada nodo interno hace trabajo constante (agregar o quitar un elemento al final de `elegidas` y dos llamadas).
- En cada hoja, `EsValido` recorre `elegidas` (hasta $N$ elementos) para sumar pesos y revisar distancias, y la suma de pesos y la posible copia a `mejorConjunto` también son $O(N)$.

El total es $O(2^N) + O(N \cdot 2^N) = O(N \cdot 2^N)$. El valor de $T$ no influye: el costo depende únicamente de cuántas sandías hay.

Para dimensionarlo: con $N = 30$ ya son más de $10^9$ hojas, y con el máximo del enunciado ($N = 5000$) la cantidad de hojas, $2^{5000}$, tiene más de 1500 dígitos.

### Espacial

$O(N)$ auxiliar.

- La recursión tiene profundidad $N + 1$, así que la [[stack#Pila implícita en recursión|pila de llamadas]] guarda a lo sumo $N + 1$ marcos de tamaño constante.
- `elegidas` y `mejorConjunto` tienen a lo sumo $N$ elementos cada uno.

A diferencia de otras implementaciones de fuerza bruta, no se almacenan todos los candidatos: cada hoja se evalúa y se descarta en el momento.

## Cuándo usar esta técnica

### Favorable cuando

- $N$ es muy chico (del orden de 20 a 25 sandías como máximo).
- Se necesita una solución de referencia, simple y obviamente correcta, para comprobar los resultados de una solución más eficiente sobre muchos casos chicos.
- $T$ es enorme y $N$ es chico: como el costo no depende de $T$, en ese escenario puede convenir más que una solución pseudo-polinomial en $T$.

### Limitaciones

- Crecimiento exponencial: cada sandía extra duplica el trabajo. Con las restricciones del enunciado es completamente inviable.
- No aprovecha nada de la estructura del problema. Ramas que ya son inválidas en los primeros niveles (como todo el subárbol que cosecha 15 y 16) se recorren completas, y el mismo estado parcial (mismas sandías consideradas, mismo peso acumulado) se vuelve a resolver desde cero en ramas distintas.

### Comparación con programación dinámica

La [[2025_cosechando_sandias-programacion-dinamica|solución por programación dinámica]] usa exactamente la misma decisión (cosechar o dejar la sandía $i$), pero en lugar de recorrer cada camino del árbol por separado, agrupa todos los caminos que llegan al mismo estado, "¿cuál es el mayor peso con las primeras $i$ sandías y capacidad $t$?". Hay solo $(N + 1)(T + 1)$ estados de ese tipo, y cada uno se resuelve una vez en tiempo constante, con un costo total de $O(N \cdot T)$.

| Criterio | Fuerza bruta | Programación dinámica |
|----------|--------------|-----------------------|
| Tiempo | $O(N \cdot 2^N)$ | $O(N \cdot T)$ |
| Espacio auxiliar | $O(N)$ | $O(N \cdot T)$ |
| Depende de $T$ | no | sí (pseudo-polinomial) |
| Máximo del enunciado ($N = T = 5000$) | inviable | unos $2{,}5 \cdot 10^7$ pasos |

La fuerza bruta solo gana cuando $2^N$ es menor que $T$, es decir, con muy pocas sandías y una capacidad muy grande, y en espacio, porque no necesita la tabla. Con las restricciones del enunciado, programación dinámica es la única de las dos que resuelve el problema.

## Referencias

- Material de la cátedra - DA Fuerza Bruta.
