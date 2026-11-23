---
title: 'OIA2025 - Cosechando sandías - Programación Dinámica'
tags:
  - oia
  - solucion
---

Solución por programación dinámica para [[2025_cosechando_sandias]].

## Técnicas utilizadas

**Programación dinámica bottom-up.** Cada subproblema se resuelve una sola vez y se guarda en una tabla que se llena de forma iterativa, desde el caso sin sandías hasta el problema completo. Además se usan dos técnicas auxiliares.

- **Dos punteros**, para calcular en tiempo lineal qué sandías anteriores son compatibles con cada una.
- **Reconstrucción hacia atrás**, para recuperar de la tabla qué sandías forman la cosecha óptima.

## Idea de la solución

### El subproblema

Es una mochila 0/1 en la que el valor de cada sandía es su propio peso. Se define

$$M[i][t] = \text{mayor peso que se puede cosechar con las sandías } 1, \dots, i \text{ sin pasar de } t \text{ kilos, respetando la distancia } D$$

para $0 \le i \le N$ y $0 \le t \le T$. La respuesta es $M[N][T]$.

### Sandías compatibles con la $i$

Si se cosecha la sandía $i$, la cosechada anterior tiene que estar en una ubicación $\le x_i - D$. Como las ubicaciones están ordenadas, esas sandías forman un prefijo del camino. Se define

$$\text{prev}(i) = \max \{\, j < i : x_j \le x_i - D \,\} \qquad (0 \text{ si no hay ninguna})$$

Las sandías $1, \dots, \text{prev}(i)$ están a $D$ metros o más de la $i$, y las que van de $\text{prev}(i) + 1$ a $i - 1$ están demasiado cerca.

Como $x_i - D$ crece con $i$, $\text{prev}(i)$ nunca retrocede, así que se puede calcular con un solo puntero $j$ que avanza. El costo total es $O(N)$.

### La recurrencia

Para la sandía $i$ hay dos opciones.

- **Dejarla.** Queda el mismo problema con las sandías $1, \dots, i - 1$, o sea $M[i-1][t]$.
- **Cosecharla.** Si entra en el carro ($p_i \le t$), suma $p_i$ kilos y el resto de la capacidad se llena con sandías compatibles con ella, es decir del prefijo $1, \dots, \text{prev}(i)$. Eso es $p_i + M[\text{prev}(i)][t - p_i]$.

$$
M[i][t] =
\begin{cases}
0 & \text{si } i = 0 \\
M[i-1][t] & \text{si } i \ge 1 \text{ y } p_i > t \\
\max\big(M[i-1][t],\ p_i + M[\text{prev}(i)][t - p_i]\big) & \text{si } i \ge 1 \text{ y } p_i \le t
\end{cases}
$$

Es la recurrencia de la mochila 0/1 con un solo cambio. Al cosechar, en lugar de pasar a la fila $i - 1$ se salta a la fila $\text{prev}(i)$. Con $D = 0$ vale $\text{prev}(i) = i - 1$ y queda la mochila 0/1 de siempre.

Las dos opciones miran filas anteriores ($i - 1$ y $\text{prev}(i) < i$), así que llenando la tabla de arriba hacia abajo cada celda se calcula con sus dependencias ya resueltas.

![Dependencias de una celda de la tabla y punteros prev del ejemplo](2025-cosechando-sandias-pd-dependencias.svg)

### Reconstrucción

La tabla da el peso máximo, pero no qué sandías lo logran. Para recuperarlas se recorre hacia atrás desde $(N, T)$, igual que en la mochila 0/1.

- Si $M[i][t] = M[i-1][t]$, la sandía $i$ no hace falta. Se la deja y se pasa a $i - 1$.
- Si no, la sandía $i$ está en la cosecha. Se la agrega, se resta $p_i$ de $t$ y se salta a $\text{prev}(i)$.

El recorrido termina cuando $i = 0$. Las sandías salen de la última a la primera, así que al final se invierte el orden. Si hay varios conjuntos óptimos se devuelve uno de ellos, y el enunciado acepta cualquiera.

## Código

```text
ALGORITMO Sandias(T, D, x, p, ubicaciones)
    N ← |x|

    prev ← arreglo de N + 1 posiciones
    j ← 0
    PARA i ← 1 HASTA N HACER
        MIENTRAS j + 1 < i Y x[j + 1] ≤ x[i] - D HACER
            j ← j + 1
        prev[i] ← j

    M ← matriz de (N + 1) × (T + 1) posiciones en 0
    PARA i ← 1 HASTA N HACER
        PARA t ← 0 HASTA T HACER
            M[i][t] ← M[i - 1][t]
            SI p[i] ≤ t ENTONCES
                M[i][t] ← max(M[i][t], p[i] + M[prev[i]][t - p[i]])

    elegidas ← arreglo vacío
    i ← N
    t ← T
    MIENTRAS i > 0 HACER
        SI M[i][t] = M[i - 1][t] ENTONCES
            i ← i - 1
        SI NO
            Agregar(elegidas, x[i])
            t ← t - p[i]
            i ← prev[i]

    PARA k ← |elegidas| HASTA 1 HACER
        Agregar(ubicaciones, elegidas[k])
    RETORNAR M[N][T]
```

Primero se calcula `prev` con dos punteros, después se llena la tabla `M` y al final se reconstruye la cosecha. `x` y `p` se indexan desde 1. `prev` es un [[array|arreglo]] de enteros, `M` una matriz de enteros y `elegidas` un [[dynamic array|arreglo dinámico]] que se recorre al revés para dejar `ubicaciones` en orden creciente. Si no se puede cosechar nada, $M[N][T] = 0$ y `ubicaciones` queda vacío.

## Traza de ejemplo

Instancia de [[2025_cosechando_sandias]] con $T = 41$ y $D = 10$.

### Paso 1. Cálculo de prev

| $i$ | $x_i$ | $p_i$ | $x_i - D$ | $\text{prev}(i)$ |
|----:|------:|------:|----------:|-----------------:|
|   1 |     1 |    20 |        −9 |                0 |
|   2 |    15 |     1 |         5 |                1 |
|   3 |    16 |     2 |         6 |                1 |
|   4 |    20 |     7 |        10 |                1 |
|   5 |    48 |    17 |        38 |                4 |
|   6 |    87 |     5 |        77 |                5 |

El puntero `j` pasa de 0 a 1 en $i = 2$, a 4 en $i = 5$ y a 5 en $i = 6$. Nunca retrocede.

### Paso 2. Llenado de la tabla

La tabla completa tiene $7 \times 42$ celdas. Estas son algunas columnas.

| $i$ \ $t$ | 0 | 1 | 2 | 7 | 17 | 20 | 21 | 22 | 24 | 27 | 37 | 38 | 39 | 41 |
|----------:|:-:|:-:|:-:|:-:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
|         0 | 0 | 0 | 0 | 0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |
|         1 | 0 | 0 | 0 | 0 |  0 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 |
|         2 | 0 | 1 | 1 | 1 |  1 | 20 | 21 | 21 | 21 | 21 | 21 | 21 | 21 | 21 |
|         3 | 0 | 1 | 2 | 2 |  2 | 20 | 21 | 22 | 22 | 22 | 22 | 22 | 22 | 22 |
|         4 | 0 | 1 | 2 | 7 |  7 | 20 | 21 | 22 | 22 | 27 | 27 | 27 | 27 | 27 |
|         5 | 0 | 1 | 2 | 7 | 17 | 20 | 21 | 22 | 24 | 27 | 37 | 38 | 39 | 39 |
|         6 | 0 | 1 | 2 | 7 | 17 | 20 | 21 | 22 | 24 | 27 | 37 | 38 | 39 | 39 |

En la fila 3 se ve el efecto de la distancia. Para $t = 22$, dejar la sandía en 16 da $M[2][22] = 21$, y cosecharla da $2 + M[\text{prev}(3)][20] = 2 + M[1][20] = 22$. Se salta a la fila 1 y no a la 2, así que nunca se combinan las sandías en 15 y 16. Por eso la fila 3 se queda en 22 aunque haya capacidad de sobra. Con $D = 0$ se saltaría a la fila 2 y $M[3][41]$ valdría 23.

### Paso 3. Reconstrucción

$M[6][41] = 39$, así que el peso máximo es 39.

| Paso | $i$ | $t$ | $M[i][t]$ | $M[i-1][t]$ | Acción |
|-----:|----:|----:|----------:|------------:|--------|
|    1 |   6 |  41 |        39 |          39 | se deja la sandía en 87; $i = 5$ |
|    2 |   5 |  41 |        39 |          27 | se cosecha la sandía en 48; $t = 41 - 17 = 24$; $i = \text{prev}(5) = 4$ |
|    3 |   4 |  24 |        22 |          22 | se deja la sandía en 20; $i = 3$ |
|    4 |   3 |  24 |        22 |          21 | se cosecha la sandía en 16; $t = 24 - 2 = 22$; $i = \text{prev}(3) = 1$ |
|    5 |   1 |  22 |        20 |           0 | se cosecha la sandía en 1; $t = 22 - 20 = 2$; $i = \text{prev}(1) = 0$ |

Con $i = 0$ termina el ciclo con `elegidas = [48, 16, 1]`. Invertido queda `ubicaciones = [1, 16, 48]` y la función retorna $39$. Los 2 kilos que sobran en $t$ son la capacidad que queda libre en el carro. En el paso 4 se salta de la fila 3 directo a la fila 1, así que la sandía en 15 nunca se considera porque está a menos de $D$ metros de la de 16.

## Complejidad

### Temporal

$O(N \cdot T)$.

- **Cálculo de prev.** $O(N)$, porque el puntero `j` avanza a lo sumo $N$ veces en total.
- **Llenado de la tabla.** $O(N \cdot T)$, con $N \cdot (T + 1)$ celdas de costo constante.
- **Reconstrucción.** $O(N)$, porque en cada vuelta $i$ baja al menos 1.

Es una complejidad **pseudo-polinomial**, polinomial en $N$ y en el *valor* de $T$ pero no en la cantidad de bits de $T$. Con los máximos del enunciado son unas $5000 \cdot 5001 \approx 2{,}5 \cdot 10^7$ celdas. $D$ puede llegar a $10^9$ y no influye en el costo, solo cambia los valores de `prev`.

### Espacial

$O(N \cdot T)$ por la tabla `M` de $(N + 1) \times (T + 1)$ enteros. Con los máximos del enunciado son unos $2{,}5 \cdot 10^7$ valores. `prev` y `elegidas` ocupan $O(N)$.

En la mochila 0/1 clásica, si solo interesa el peso máximo, alcanza con una sola fila de $T + 1$ valores, porque cada fila depende solo de la anterior. Acá la fila $i$ depende de la fila $\text{prev}(i)$, que con $D$ grande puede estar muy atrás, y además la reconstrucción consulta filas anteriores. Por eso se guarda la tabla completa.

## Cuándo usar esta técnica

### Favorable cuando

- $N \cdot T$ es moderado, hasta unos $10^8$ celdas. El costo es lineal en $N$, así que miles de sandías no son problema.
- El problema es de tipo mochila y la restricción entre elementos se puede expresar como un salto a un prefijo, como $\text{prev}(i)$.

### Limitaciones

- Con $T$ muy grande, por ejemplo $10^{12}$, la tabla no entra en memoria. Con $N$ chico convendría una técnica que no dependa de $T$, como branch and bound.
- Calcula la tabla completa, incluso las capacidades que no llevan al óptimo.

### Comparación con fuerza bruta

La [[2025_cosechando_sandias-fuerza-bruta|solución por fuerza bruta]] toma la misma decisión (cosechar o dejar la sandía $i$), pero recorre uno por uno los $2^N$ caminos del árbol de decisiones, y muchos repiten la misma pregunta. En el ejemplo, "¿cuánto peso se puede juntar solo con la sandía en 1?" aparece al cosechar la sandía en 15, la de 16 y la de 20, porque las tres tienen $\text{prev} = 1$. La fuerza bruta la responde en cada rama y la programación dinámica una sola vez, en la fila 1 de la tabla. Como cada pregunta queda identificada por el par $(i, t)$, el trabajo pasa de exponencial en $N$ a proporcional a $N \cdot T$.

| Criterio | Fuerza bruta | Programación dinámica |
|----------|--------------|-----------------------|
| Tiempo | $O(N \cdot 2^N)$ | $O(N \cdot T)$ |
| Espacio auxiliar | $O(N)$ | $O(N \cdot T)$ |
| Depende de $T$ | no | sí (pseudo-polinomial) |
| Máximo del enunciado ($N = T = 5000$) | inviable | unos $2{,}5 \cdot 10^7$ pasos |
| Simplicidad | muy simple, sirve para validar | requiere definir estado, `prev` y reconstrucción |

La programación dinámica cambia tiempo exponencial por una tabla de $O(N \cdot T)$. La fuerza bruta solo conviene con muy pocas sandías y una capacidad enorme.

## Referencias

- Material de la cátedra - DA Programación Dinámica 1 y 2 (mochila 0/1).
