---
title: LeetCode0818 - Race Car - Programación Dinámica (Top-Down y Bottom-up)
tags:
  - leetcode
  - solucion
---

## Programación dinámica - Top-Down

### Técnicas utilizadas
Programación dinámica - Top Down: resolución mediante la división en subproblemas, calculando sus resultados y almacenándolos en memoria. El enfoque utilizado es top-down, por lo que se utiliza recursividad y se llama a la misma función con subproblemas más pequeños. También se emplea una estructura de datos auxiliar para guardar los resultados intermedios.

### Idea de la solución
Para aplicar programación dinámica (top-down) a este problema, debemos abstraer el movimiento del auto e identificar cómo un problema grande (llegar al `target` original) se puede descomponer en subproblemas más pequeños. Para ello, decidimos enfocarnos únicamente en resolver la distancia absoluta restante a recorrer: la posición inicial siempre es relativa y poner reversa siempre reinicia la velocidad a 1, creando un subproblema idéntico al original. De este modo, el `target` se puede ir reduciendo hasta llegar a algún caso que se pueda solucionar.

La aplicación de la técnica se estructura en las siguientes partes:

1. **Definición de la función recursiva y el caso base:** Definimos la función recursiva `resolver(target)` que se encarga de obtener la cantidad mínima de instrucciones para recorrer una distancia exacta `target`. Sabemos por las reglas del problema que si sólo aceleramos, nuestras posiciones forman la serie de hitos $2^k - 1$ (1, 3, 7, 15, 31...). Nuestro caso base ocurre cuando la distancia `target` es exactamente igual a una de estas posiciones de referencia (`target` = $2^k - 1$). En este caso, la respuesta es `k` aceleraciones, sin tener que usar reversa.
2. **Transiciones (Descomposición del problema):** Si `target` no es una de las posiciones representadas por el caso base, entonces estará entre uno contenido entre dos valores: $2^{k-1} - 1 < t < 2^k - 1$. Desde estos puntos, se procede a evaluar todas las decisiones óptimas posibles para reducir la distancia. Para ello, se utilizan dos estrategias:
   - **Pasarse y retroceder:** Aceleramos `k` veces hasta pasarnos del objetivo, ponemos reversa y nos queda una nueva distancia absoluta por recorrer hacia atrás. Se reduce el problema a Costo = `k` + 1 + `resolver`($2^k - 1$ - `target`)
   - **Quedarse corto y tomar envión:** Aceleramos `k-1` veces, frenando antes del objetivo. Esto implica poner reversa, y luego acelerar `i` veces en dirección contraria $(0 ≤ i < {k-1})$ y volvemos a poner reversa para apuntar al objetivo. Esto genera una nueva distancia restante y se reduce el problema a: Costo = (`k` - 1) + 1 + `i` + 1 + `resolver(nuevaDistancia)`
3. **Memoización y solapamiento de subproblemas:** Dado que las estrategias calculan distancias absolutas restantes, el árbol de recursividad pedirá resolver las mismas distancias múltiples veces por diferentes caminos (por ejemplo, si se tiene `target = 10`, entonces `resolver(3)` puede surgir tanto pasandose y retrocediendo como quedándose corto y tomando envión). Para agilizar estos cálculos, se almacena el costo mínimo calculado para cada distancia en un [[map]]. Antes de evaluar las transiciones para un `target` consultamos si esa distancia ya fue resuelta, retornamos el valor en tiempo $O(1)$, evitando que el árbol de decisiones crezca de forma exponencial.


### Código

```python
def resolver(target: int, map: dict | None = None) -> int:
    if map is None:
        map = {}
    return _resolver(target, map)


def _resolver(target: int, map: dict) -> int:
    k = abs(target).bit_length()

    if target in map:
        return map[target]

    dist2 = (1 << k) - 1

    if dist2 == target:
        map[target] = k
        return k

    # me paso y retrocedo
    targetMax = dist2 - target
    pasosMin = k + 1 + _resolver(targetMax, map)

    # me quedo corto y tomo envión
    dist1 = (1 << (k - 1)) - 1
    targetMin = target - dist1
    i = 0
    a = 0

    while i < (k - 1):
        pasosAct = (k - 1) + 1 + (i + 1) + _resolver(targetMin, map)
        i += 1
        a = (1 << i) - 1
        targetMin = (target - dist1) + a
        pasosMin = min(pasosMin, pasosAct)

    map[target] = pasosMin
    return pasosMin
```

### Traza de ejemplo

![](arbol-top-down.svg)
La imagen ilustra el árbol de recursividad generado al ejecutar el algoritmo para `target = 6`.

**Explicación del árbol de recursividad:**

Iniciamos con `_resolver(6, map)` y un [[map]] `map` vacío. Para `target = 6`, el número de aceleraciones que nos pasa del objetivo es `k = 3` (ya que la posición superior es $2^3 - 1 = 7$ y el inferior es $2^{3-1} - 1 = 3$).

1. **Llamada Principal → `resolver(6)`**
   - Estrategia 1: Pasarse → Aceleramos `k = 3` veces hasta llegar a 7. La distancia restante hacia atrás es 7 - 6 = 1. Se realiza la llamada recursiva `_resolver(1)`. Al ser un caso base, retorna el costo de 1 aceleración y lo guarda en el mapa. Costo total de esta rama: 3 + 1 (reversa) + 1 = 5
   - Estrategia 2: Quedarse corto → Aceleramos `k-1 = 2` veces hasta llegar a 3. Faltan recorrer 3 unidades, pero debemos evaluar los retrocesos (`i`):
     - Si `i = 0` (retroceder pero no avanzar en dirección contraria): Ponemos reversa dos veces y la distancia restante es 6 - 3 + 0 = 3. Se realiza la llamada recursiva: `_resolver(3)`. Al ser un caso base, retorna 2 aceleraciones. Costo total de esta rama: 2 + 1 (reversa) + 0 + 1 (reversa) + 2 = 6.
     - Si `i = 1` (retroceder y avanzar en dirección contraria 1 vez): Retrocedemos 1 espacio, quedando a una distancia total de 6 - 3 + 1 = 4. Se realiza la llamada recursiva: `_resolver(4)`

   (El algoritmo pausa la resolución de 6 para evaluar el subproblema `_resolver(4)`).

2. **Expansión del subproblema: `_resolver(4)`** Para `target = 6`, calculamos un nuevo `k = 3` (posiciones entre 3 y 7). Se abren nuevas ramas:
   - Pasarse → Dado que se está en la posición 7, la distancia restante es 7 - 4 = 3. Llamamos a `_resolver(3)`. Como el costo de `_resolver(3)` fue calculado y guardado previamente, se lo busca en el [[map]].
   - Quedarse corto:
     - Si `i = 0`: Llegamos a 3 y no retrocedemos. Distancia restante: 4 - 3 + 0 = 1. Llamamos a `_resolver(1)` y se lo encuentra en el [[map]].
     - Si `i = 1`: Llegamos a 3 y retrocedemos 1. Distancia restante: 4 - 3 + 1 = 2. Llamamos a `_resolver(2)`, el cual a su vez se expandirá en casos base que volverán a llamar a `_resolver(1)`

3. **Resolución y Retorno** Una vez resuelto `_resolver(4)` (con costo mínimo 5), la llamada principal `_resolver(6)` termina de comparar todos los costos calculados:
   - Costo por pasarse: 5
   - Costo por quedarse corto (`i = 0`): 6
   - Costo por quedarse corto (`i = 1`): 2 + 1 + 1 + 1 + 5 = 10

El algoritmo se queda con el valor mínimo, guarda `map[6] = 5` y retorna 5, que representa la secuencia de instrucciones más corta para llegar al `target = 6` (`AAARA`).

### Complejidad

#### Temporal
$O(T\log{T})$ donde `T` es el valor de `target`. Gracias a la memoización, cada estado (es decir, cada valor distinto de `target` que se resuelve) se calcula una única vez. Para resolver un estado, el algoritmo ejecuta un bucle de hasta $\log{T}$ iteraciones, correspondiente a los distintos casos que surgen de quedarse corto y tomar envión. En el peor caso, pueden generarse hasta `T(target)` estados distintos, por lo que la complejidad temporal total es $O(T\log{T})$

#### Espacial
$O(T)$ está dado por la pila de llamadas recursivas y el tamaño del `map` para guardar los pasos. Dado que crece hasta almacenar todos los estados únicos visitados, la complejidad espacial dominante es la del `map`.

### Cuando usar esta técnica

#### Favorable cuando
- Existen múltiples caminos que llevan a la misma distancia restante (solapamiento de subproblemas).
- El valor del `target` es grande. El enfoque top-down sólo calcula las distancias que realmente necesita evaluar (saltando tramos enteros), ahorrando memoria y tiempo.

#### Limitaciones
- Introduce un poco de overhead por el uso de la pila de recursividad y las búsquedas en el [[map]].

---

## Programación dinámica - Bottom-up
En este caso, se procede a rellenar un [[array]] de estados. Las ecuaciones para calcular las posibles posiciones de referencia es la misma, pero se cambia la dirección del flujo de la resolución. Aquí se resuelven los subproblemas de menor a mayor.

### Idea de la solución
La aplicación de la técnica se estructura en las siguientes partes:

- **Definición de la tabla y caso inicial:** Creamos un [[array]] `dp` de tamaño `target + 1`, donde cada casillero `dp[t]` representa el costo mínimo para recorrer la distancia `t`. El caso inicial es `dp[0] = 0` (cero pasos para distancia cero). Además, si al iterar identificamos que la distancia actual `t` es una posición de referencia (`t` = $2^k - 1$), se asigna directamente `dp[t] = k`.
- **Bucle principal:** Mediante un bucle que recorre `t` desde 1 hasta `target`, evaluamos las dos estrategias posibles para cada casillero:
  - Pasarse y retroceder: Aceleramos `k` veces, ponemos reversa y consultamos el [[array]] en la distancia restante: `dp[t] = k + 1 + dp[dist2 - t]`.
  - Quedarse corto y tomar envión: Aceleramos `k-1` veces, ponemos reversa, retrocedemos acumulando `i` aceleraciones y volvemos a poner reversa. El costo se calcula consultando el [[array]] en la distancia restante: `dp[t] = min(dp[t], (k - 1) + 1 + i + 1 + dp[targetMin])`.
- **Como resuelve bottom-up:** El bucle garantiza el orden óptimo para resolver cualquier distancia `t` ya que las distancias restantes consultadas en las estrategias (tanto pasandote como quedandote corto) siempre serán menores que `t`. Como el bucle avanza de menor a mayor, esas posiciones ya habrán sido resueltas y guardadas en el [[array]] `dp`, permitiendo acceder a los valores en tiempo $O(1)$.

### Código

```python
def resolver(target: int) -> int:
    if target <= 0:
        return 0
    dp = [0] * (target + 1)
    for t in range(1, target + 1):
        k = t.bit_length()
        dist2 = (1 << k) - 1

        # posición de referencia encontrada
        if t == dist2:
            dp[t] = k

        else:
            # opcion 1: me paso y retrocedo
            targetMax = dist2 - t
            dp[t] = k + 1 + dp[targetMax]

            # opcion 2: me quedo corto y tomo envión
            dist1 = (1 << (k - 1)) - 1

            for i in range(k - 1):
                a = (1 << i) - 1
                targetMin = (t - dist1) + a
                pasosAct = (k - 1) + 1 + i + 1 + dp[targetMin]
                dp[t] = min(dp[t], pasosAct)

    return dp[target]
```

### Traza de ejemplo

| Índice (`t`) | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Pasos (`dp[t]`) | 0 | 1 | 4 | 2 | 5 | 7 | 5 |

#### Explicación del llenado de la tabla

Comenzamos con un [[array]] `dp` de tamaño 7 (del 0 al 6). El estado inicial contiene únicamente el caso base para distancia cero:

[[array]] inicial: `[ 0, ?, ?, ?, ?, ?, ? ]`

**Paso `t = 1`**
Posición de referencia cercana: $2^1 - 1 = 1$ → `k = 1`.
Como `t = 1` es exactamente la posición de referencia, es un caso directo. Nos toma `k = 1` pasos.
[[array]] actual: `[ 0, 1, ?, ?, ?, ?, ? ]`

**Paso `t = 2`**
Posición de referencia cercana: $2^2 - 1 = 3$ → `k = 2`. No es caso directo.
Estrategias:
- Me paso: Nos pasamos del 2 por una distancia de 1 (3 - 2 = 1). Consultamos la tabla para esa vuelta atrás: `Costo = k + 1 + dp[1] = 2 + 1 + 1 = 4`
- Me quedo corto (`i = 0`): Avanzamos hasta 1 y retrocedemos 0. Nos falta recorrer una distancia de 1. `Costo = (k - 1) + 1 + 0 + 1 + dp[1] = 1 + 1 + 0 + 1 + 1 = 4`

Se debe elegir el mínimo entre 4 y 4 es 4. Guardamos `dp[2] = 4`.
[[array]] actual: `[ 0, 1, 4, ?, ?, ?, ? ]`

**Paso `t = 3`**
Posición de referencia cercana: $2^2 - 1 = 3$ → `k = 2`.
Evaluación: Como `t = 3` coincide perfectamente con la posición de referencia, es un caso directo. Nos toma `k = 2` pasos.
[[array]] actual: `[ 0, 1, 4, 2, ?, ?, ? ]`

**Paso `t = 4`**
Posición de referencia cercana: $2^3 - 1 = 7$ → `k = 3`. No es caso directo.
Estrategias:
- Me paso: Nos pasamos del 4 por una distancia de 3 (7 - 4 = 3). `Costo = k + 1 + dp[3] = 3 + 1 + 2 = 6`
- Me quedo corto (`i = 0`): Avanzamos hasta 3 y retrocedemos 0. Falta una distancia de 1. `Costo = 2 + 1 + 0 + 1 + dp[1] = 4 + 1 = 5`
- Me quedo corto (`i = 1`): Avanzamos hasta 3 y retrocedemos 1 (llegamos al 2). Falta una distancia de 2. `Costo = 2 + 1 + 1 + 1 + dp[2] = 5 + 4 = 9`

El mínimo de las opciones evaluadas es 5. Guardamos `dp[4] = 5`.
[[array]] actual: `[ 0, 1, 4, 2, 5, ?, ? ]`

**Paso `t = 5`**
Posición de referencia cercana: $2^3 - 1 = 7$ → `k = 3`. No es caso directo.
Estrategias evaluadas:
- Me paso: Nos pasamos por 2 (7 - 5 = 2). `Costo = 3 + 1 + dp[2] = 4 + 4 = 8`
- Me quedo corto (`i = 0`): Avanzamos hasta 3 y retrocedemos 0. Falta una distancia de 2. `Costo = 2 + 1 + 0 + 1 + dp[2] = 4 + 4 = 8`
- Me quedo corto (`i = 1`): Avanzamos hasta 3 y retrocedemos 1. Falta una distancia de 3. `Costo = 2 + 1 + 1 + 1 + dp[3] = 5 + 2 = 7`

El mínimo de las opciones evaluadas es 7. Guardamos `dp[5] = 7`.
[[array]] actual: `[ 0, 1, 4, 2, 5, 7, ? ]`

**Paso `t = 6` (target original)**
Posición de referencia cercana: $2^3 - 1 = 7$ → `k = 3`. No es caso directo.
Estrategias:
- Me paso: Nos pasamos por 1 (7 - 6 = 1). `Costo = 3 + 1 + dp[1] = 4 + 1 = 5`
- Me quedo corto (`i = 0`): Avanzamos hasta 3 y retrocedemos 0. Falta una distancia de 3. `Costo = 2 + 1 + 0 + 1 + dp[3] = 4 + 2 = 6`
- Me quedo corto (`i = 1`): Avanzamos hasta 3 y retrocedemos 1. Falta una distancia de 4. `Costo = 2 + 1 + 1 + 1 + dp[4] = 5 + 5 = 10`

El mínimo de las opciones evaluadas es 5. Guardamos `dp[6] = 5`.

Al finalizar todo el bucle, la respuesta para `target = 6` se lee directamente en la última posición del [[array]] que se fue creando:

`dp = [ 0, 1, 4, 2, 5, 7, 5 ]`

Esto quiere decir que se requieren 5 pasos para llegar a `target = 6`

### Complejidad

#### Temporal
$O(T\log{T})$, donde `T` es el valor de `target`. El algoritmo recorre de forma iterativa todos los valores desde 1 hasta `T` para completar el vector. Para cada estado `T`, ejecuta un bucle de hasta $\log{T}$ iteraciones, correspondiente a los distintos casos en los que el auto se queda corto y toma envión. Cómo se procesan `T` estados y cada uno requiere $\log{T}$ operaciones en el peor caso, la complejidad temporal total es $O(T\log{T})$.

#### Espacial
$O(T)$. El algoritmo utiliza un [[array]] `dp` de tamaño `t + 1`, donde almacena la cantidad mínima de instrucciones para llegar a cada posición desde 0 hasta `T`. No utiliza recursividad, por lo que no existe consumo adicional por pila de llamadas. La complejidad espacial está dominada por el tamaño del [[array]], resultando en $O(T)$.

### Cuando usar esta técnica

#### Favorable cuando
- Se desea evitar la recursividad y el riesgo de desbordamiento de la pila de llamadas.
- Es necesario obtener la solución para todos los estados desde 1 hasta `target`, ya que el vector se completa de manera iterativa.
- Se busca una implementación con menor sobrecarga, al utilizar accesos directos a un [[array]] en lugar de llamadas recursivas y un [[map]].

#### Limitaciones
- Calcula todos los estados hasta `target`, incluso aquellos que nunca serían necesarios para obtener la respuesta final, lo que puede realizar trabajo adicional cuando existen muchos estados que podrían evitarse con un enfoque top-down.

---

## Diferencia entre los enfoques de programación dinámica
Aunque ambos enfoques de DP son superiores a BFS en promedio, en el peor caso todos son $O(T log T)$.

## Comparación con Búsqueda en Anchura (BFS)
A diferencia de [[0818_race_car-bfs-fuerza-bruta]] que explora paso a paso el árbol de posibilidades teniendo en cuenta posición y velocidad, la programación dinámica reduce el problema a solo la distancia absoluta. Esto permite que se reemplace la "simulación" con saltos matemáticos directos entre posiciones de referencia. Como resultado, la técnica de programación dinámica es superior en espacio ($O(T)$ frente a $O(T\log{T})$ de BFS) y en promedio mejor en velocidad. Como dificultad, la lógica matemática que plantea el problema es más difícil de deducir que en BFS.

## Referencias
- [Ejemplo LeetCode 494 explicado](https://www.youtube.com/watch?v=g0npyaQtAQM&list=PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO)
