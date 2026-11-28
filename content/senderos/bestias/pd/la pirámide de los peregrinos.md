---
title: La Pirámide de los Peregrinos
tags:
  - programacion-dinamica
  - desafio
  - resuelto
---

### Dificultad: ★★★☆☆

En el suelo de la capilla de Velmora hay un mosaico triangular que los peregrinos recorren de rodillas. Empiezan en la losa de la cima y, en cada paso, solo pueden bajar a una de las dos losas que tienen debajo: la de la izquierda o la de la derecha. En cada losa, un maestro antiguo grabó **cuántos caminos distintos** llevan desde la cima hasta ella. Siglos de rodillas borraron las filas de abajo, y la Abadesa Ysolde le encargó al Copista Ilvar reconstruir los números de la **fila $n$** para que el hermano mosaiquista los vuelva a tallar.

Esto es lo que todavía se lee en las primeras filas (la cima es la fila $0$):

```text
            1
          1   1
        1   2   1
      1   3   3   1
    1   4   6   4   1
  1   5  10  10   5   1
```

Un aprendiz se ofreció a contar los caminos de cada losa a mano, uno por uno. Ilvar lo detuvo: *"Cada camino que llega a una losa pasó antes por una de las dos que tiene arriba. Los caminos hasta ellas ya están contados."*

### Enunciado

Se busca la fila $n$ del triángulo (numerando filas y posiciones desde $0$), es decir, los valores $P[n][0], P[n][1], \dots, P[n][n]$.

1. **El conteo del aprendiz.** Plantear una función recursiva que calcule $P[i][j]$ directamente a partir de la regla del mosaico, sin guardar nada. Mostrar con el cálculo de $P[4][2]$ qué subproblemas se recalculan. ¿Qué complejidad tiene obtener toda la fila $n$ de esta forma?
2. **El subproblema.** Explicar por qué este problema cumple las dos condiciones de la programación dinámica (subestructura óptima y subproblemas superpuestos). Escribir la recurrencia de $P[i][j]$ con sus casos base.
3. **Bottom-up.** Explicar en forma textual cómo obtener la fila $n$ completando una tabla fila por fila, y escribir un fragmento de pseudocódigo ilustrativo.
4. **Una sola fila.** Ilvar tiene un solo pergamino, en el que entra una única fila. Modificar el pseudocódigo para usar un solo arreglo de tamaño $n+1$, que se actualiza en el lugar. Trazar a mano el paso de la fila $5$ a la fila $6$, mostrando el arreglo después de cada actualización.
5. **Complejidad.** Determinar la complejidad temporal y espacial de la versión con tabla y de la versión con una sola fila.

> **Susurro del Copista Ilvar.** A la losa $j$ de la fila $i$ se llega solo desde dos losas: la $j-1$ y la $j$ de la fila de arriba. Las losas de los bordes tienen un único camino, porque se llega a ellas bajando siempre hacia el mismo lado.

> **Reflexión.** En la versión de una sola fila, ¿en qué sentido hay que recorrer las posiciones: de izquierda a derecha o de derecha a izquierda? ¿Qué números quedarían grabados si se recorriera en el sentido equivocado? Probarlo pasando de la fila $4$ a la fila $5$.

<details>
    <summary>Ver solución</summary>

### 1. El conteo del aprendiz

La regla del mosaico, escrita como función recursiva:

```text
función P(i, j):
    si j = 0 o j = i:
        devolver 1
    devolver P(i-1, j-1) + P(i-1, j)
```

Desarrollo de $P[4][2]$:

```text
P(4,2)
├── P(3,1)
│   ├── P(2,0) = 1
│   └── P(2,1)            ← primera vez
│       ├── P(1,0) = 1
│       └── P(1,1) = 1
└── P(3,2)
    ├── P(2,1)            ← se vuelve a calcular entero
    │   ├── P(1,0) = 1
    │   └── P(1,1) = 1
    └── P(2,2) = 1
```

$P(2,1)$ se calcula dos veces, y cuanto más abajo está la losa, más se repite: el aprendiz termina contando literalmente **cada camino por separado**, porque la recursión solo suma unos en las hojas. Por eso calcular $P[i][j]$ requiere $2 \cdot P[i][j] - 1$ llamadas, y obtener toda la fila $n$ cuesta del orden de la suma de la fila, que es $2^n$:

$$
T(n) = \sum_{j=0}^{n} \big(2 \cdot P[n][j] - 1\big) = 2^{n+1} - (n+1) = \Theta(2^n)
$$

### 2. Subproblema y recurrencia

- **Subestructura óptima:** la cantidad de caminos hasta una losa se obtiene a partir de las cantidades de caminos hasta las dos losas de arriba. Todo camino que llega a $(i, j)$ pasa por $(i-1, j-1)$ o por $(i-1, j)$, nunca por las dos, así que los caminos se suman sin contar ninguno dos veces.
- **Subproblemas superpuestos:** cada losa $(i-1, j)$ es usada por dos losas de la fila de abajo, $(i, j)$ y $(i, j+1)$. Como se vio en el punto 1, sin guardar resultados se recalculan una y otra vez.

$$
P[i][0] = P[i][i] = 1 \qquad P[i][j] = P[i-1][j-1] + P[i-1][j] \quad (0 < j < i)
$$

La respuesta es la fila completa $P[n][0..n]$.

### 3. Bottom-up con tabla

**En palabras:** se arma una tabla en la que la fila $i$ tiene $i+1$ casilleros. Se completa de arriba hacia abajo: la fila $0$ es solo un $1$, y cada fila siguiente pone un $1$ en cada borde y llena el interior sumando, para cada casillero, los dos casilleros de la fila anterior que tiene arriba. Cuando se llega a la fila $i$, la fila $i-1$ ya está completa, así que cada valor se calcula **una sola vez** y se lee las veces que haga falta. Al terminar, la última fila es la respuesta.

```text
función filaPascal(n):
    P ← tabla con n+1 filas; la fila i tiene i+1 casilleros
    para i desde 0 hasta n:
        P[i][0] ← 1
        P[i][i] ← 1
        para j desde 1 hasta i-1:
            P[i][j] ← P[i-1][j-1] + P[i-1][j]
    devolver P[n]
```

### 4. Una sola fila

Si la fila $i-1$ está en el arreglo, se puede transformar en la fila $i$ en el lugar: se agrega un $1$ al final y cada posición interior pasa a valer ella misma más la que tiene a su izquierda. La clave es recorrer **de derecha a izquierda**, para que la posición de la izquierda todavía tenga el valor de la fila anterior cuando se la lee (ver la reflexión).

```text
función filaPascal(n):
    fila ← arreglo de n+1 posiciones
    fila[0] ← 1
    para i desde 1 hasta n:
        fila[i] ← 1
        para j desde i-1 bajando hasta 1:
            fila[j] ← fila[j] + fila[j-1]
    devolver fila
```

**Traza de la fila 5 a la fila 6** (en negrita, la posición que se actualizó):

| Paso | Operación | Arreglo |
|---|---|---|
| fila 5 | — | `[1, 5, 10, 10, 5, 1]` |
| borde | `fila[6] ← 1` | `[1, 5, 10, 10, 5, 1, `**`1`**`]` |
| $j = 5$ | `fila[5] ← 1 + 5 = 6` | `[1, 5, 10, 10, 5, `**`6`**`, 1]` |
| $j = 4$ | `fila[4] ← 5 + 10 = 15` | `[1, 5, 10, 10, `**`15`**`, 6, 1]` |
| $j = 3$ | `fila[3] ← 10 + 10 = 20` | `[1, 5, 10, `**`20`**`, 15, 6, 1]` |
| $j = 2$ | `fila[2] ← 10 + 5 = 15` | `[1, 5, `**`15`**`, 20, 15, 6, 1]` |
| $j = 1$ | `fila[1] ← 5 + 1 = 6` | `[1, `**`6`**`, 15, 20, 15, 6, 1]` |

Fila 6: **`[1, 6, 15, 20, 15, 6, 1]`**. En cada paso, `fila[j-1]` todavía conserva el valor de la fila 5, porque está a la izquierda y no se tocó.

### 5. Complejidad

Para llegar a la fila $n$ se calculan las filas $0$ a $n$, y la fila $i$ tiene $i+1$ valores, cada uno en $O(1)$:

$$
\sum_{i=0}^{n} (i+1) = \frac{(n+1)(n+2)}{2} = \Theta(n^2)
$$

| Versión | Tiempo | Espacio |
|---|---|---|
| Recursión sin memoria (punto 1) | $\Theta(2^n)$ | $O(n)$ (profundidad de la recursión) |
| Tabla completa (punto 3) | $\Theta(n^2)$ | $\Theta(n^2)$ |
| Una sola fila (punto 4) | $\Theta(n^2)$ | $\Theta(n)$ |

El espacio de la versión de una fila es el mínimo posible, porque la respuesta misma ocupa $n+1$ posiciones.

> **Costo oculto.** Contar cada suma como $O(1)$ supone que los números entran en una palabra de máquina. Pero el valor del centro de la fila $n$ crece aproximadamente como $2^n/\sqrt{n}$, así que tiene $\Theta(n)$ bits. Con enteros de 64 bits con signo, el valor más grande de la fila $n$ entra hasta $n = 66$ y se desborda en $n = 67$. Para filas más grandes hacen falta enteros de precisión arbitraria, y cada suma pasa a costar $O(n)$.

### Respuesta a la reflexión

Hay que recorrer **de derecha a izquierda**. Para calcular la posición $j$ hacen falta `fila[j]` y `fila[j-1]` **de la fila anterior**. Yendo de derecha a izquierda, la posición $j-1$ está a la izquierda y todavía no se actualizó.

De izquierda a derecha, `fila[j-1]` ya contiene el valor **nuevo** cuando se lo lee. Pasando de la fila 4 a la fila 5:

| Paso | Operación | Arreglo |
|---|---|---|
| fila 4 + borde | `fila[5] ← 1` | `[1, 4, 6, 4, 1, 1]` |
| $j = 1$ | `fila[1] ← 4 + 1 = 5` | `[1, 5, 6, 4, 1, 1]` |
| $j = 2$ | `fila[2] ← 6 + 5 = 11` | `[1, 5, 11, 4, 1, 1]` |
| $j = 3$ | `fila[3] ← 4 + 11 = 15` | `[1, 5, 11, 15, 1, 1]` |
| $j = 4$ | `fila[4] ← 1 + 15 = 16` | `[1, 5, 11, 15, 16, 1]` |

El mosaiquista tallaría `[1, 5, 11, 15, 16, 1]` en lugar de `[1, 5, 10, 10, 5, 1]`, y ni siquiera queda simétrico. En lugar de sumar dos losas de la fila de arriba, cada posición acumula **todas** las de su izquierda: se están calculando sumas acumuladas (*prefix sums*), no el triángulo. Es el mismo cuidado que hay que tener en la mochila 0/1 con una sola fila: el sentido del recorrido decide si se lee el valor viejo o el que ya se pisó.

> **Para conectar.** El número grabado en la losa $(n, j)$ es el coeficiente binomial $\binom{n}{j}$: para llegar a ella hay que elegir en cuáles $j$ de los $n$ pasos se baja hacia la derecha. Con la fórmula $\binom{n}{j} = \frac{n!}{j!\,(n-j)!}$, los factoriales intermedios se desbordan mucho antes que el resultado ($21!$ ya no entra en 64 bits). La programación dinámica solo suma, y nunca maneja números más grandes que los de la propia fila.

</details>
