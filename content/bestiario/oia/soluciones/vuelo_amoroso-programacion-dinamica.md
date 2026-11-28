---
title: 'OIA - Vuelo amoroso - Programación Dinámica'
tags:
  - oia
  - solucion
---

Solución por programación dinámica (bottom-up) para [[vuelo_amoroso]].

## Técnicas utilizadas

**Programación dinámica (PD) bottom-up:** el problema se descompone en subproblemas que se **superponen** (el mismo subproblema aparece por muchos caminos), se resuelve cada uno **una sola vez** y su resultado se guarda en una tabla para reutilizarlo. Es aplicable porque el problema tiene **subestructura óptima**: el mejor vuelo que termina en cierto estado se arma extendiendo el mejor vuelo que llega a un estado anterior. En la variante bottom-up la tabla se llena de forma iterativa, desde los casos base hacia el resultado, sin recursión.

## Idea de la solución

El árbol de la [[vuelo_amoroso-fuerza-bruta|fuerza bruta]] muestra que muchos vuelos distintos llegan a la misma altura en la misma medición. A partir de ahí todos tienen exactamente las mismas opciones futuras, así que solo importa el que llegó con **menor distancia acumulada**. El estado del problema queda definido por dos datos:

- $t$: cuántas mediciones ya pasaron.
- $h$: a qué altura está el pajarito en ese momento.

Los valores se guardan en una tabla `dist`, un [[array]] bidimensional de $(n+1) \times 301$ celdas: una fila por medición y una columna por cada altura factible, de 0 a 300. Las alturas fuera de ese rango son no factibles y directamente no tienen celda.

Al terminar, la respuesta es la mejor celda de la última medición. Para obtener también el **recorrido**, se vuelve hacia atrás desde esa celda: en cada medición se busca cuál de los dos vecinos anteriores produjo el valor guardado.

### Planteo paso a paso

| Paso               | Pregunta                                                 | Vuelo amoroso |
|--------------------|----------------------------------------------------------|---------------|
| 1. Subproblema     | ¿Qué calcula f(...)? ¿Qué parámetros?                     | `dist[t][h]` = menor distancia total en las primeras t mediciones, terminando a altura h |
| 2. Decisión        | ¿Qué opciones hay en el **último** paso? → recurrencia (máx/mín) | en la medición t el pajarito llegó subiendo (desde h-1) o bajando (desde h+1): se toma el mínimo de los dos y se suma la distancia de la medición t |
| 3. Caso base       | ¿Qué se responde sin recursión?                           | `dist[0][0] = 0` (los dos salen del piso); el resto de la medición 0 vale ∞; los vecinos no factibles (h < 0 o h > 300) valen ∞ |
| 4. Orden           | ¿De qué depende cada valor? → memo o tabla                | cada medición depende solo de la anterior: se llena la tabla medición por medición, de t = 1 a t = n |
| 5. Respuesta       | ¿Qué celda resuelve el original? (+ reconstruir)          | el mínimo de `dist[n][h]` entre todas las alturas, y el recorrido hacia atrás desde esa celda |
| 6. Complejidad     | (# subproblemas) × (costo de decidir)                     | (n+1) × 301 × O(1) = **O(n · H)**, con H = 301 alturas |

### Recurrencia

$$
dist[0][h] =
\begin{cases}
0 & \text{si } h = 0 \\
\infty & \text{si } h > 0
\end{cases}
$$

$$
dist[t][h] = |h - a_t| + \min\left(dist[t-1][h-1],\ dist[t-1][h+1]\right) \qquad 1 \le t \le n,\ 0 \le h \le 300
$$

donde un vecino no factible ($h-1 < 0$ o $h+1 > 300$) vale $\infty$.

$$
D = \min_{0 \le h \le 300} dist[n][h]
$$

- El $\min$ elige el mejor vuelo previo entre los dos estados desde los que se puede llegar.
- El término $|h - a_t|$ es lo que se paga en la medición actual y no depende de cómo se llegó.
- Usar $dist[t-1][\cdot]$ hace que el pajarito esté obligado a moverse: no existe la transición desde $dist[t-1][h]$.
- Los estados que no se pueden alcanzar (por ejemplo, altura 3 en la medición 4, por la paridad) quedan en $\infty$ y nunca se eligen.

## Código

```text
CONSTANTE ALTURA_MAX ← 300

ALGORITMO VueloPD(pajara)
    n ← pajara.longitud
    dist ← nueva matriz de (n+1) × (ALTURA_MAX+1), con todas las celdas en ∞
    dist[0][0] ← 0                      // los dos salen del piso
    PARA t DESDE 1 HASTA n HACER
        PARA h DESDE 0 HASTA ALTURA_MAX HACER
            desde_abajo ← ∞
            desde_arriba ← ∞
            SI h > 0 ENTONCES
                desde_abajo ← dist[t-1][h-1]
            SI h < ALTURA_MAX ENTONCES
                desde_arriba ← dist[t-1][h+1]
            dist[t][h] ← min(desde_abajo, desde_arriba) + |h - pajara[t-1]|
    // buscamos la mejor altura para terminar el vuelo
    h_final ← 0
    PARA h DESDE 1 HASTA ALTURA_MAX HACER
        SI dist[n][h] < dist[n][h_final] ENTONCES
            h_final ← h
    recorrido ← Reconstruir(dist, pajara, h_final)
    RETORNAR dist[n][h_final], recorrido

ALGORITMO Reconstruir(dist, pajara, h)
    n ← pajara.longitud
    recorrido ← nuevo arreglo de tamaño n
    recorrido[n-1] ← h
    PARA t DESDE n BAJANDO HASTA 2 HACER
        anterior ← dist[t][h] - |h - pajara[t-1]|   // lo que valía el paso previo
        SI h < ALTURA_MAX Y dist[t-1][h+1] = anterior ENTONCES
            h ← h + 1                   // venía de arriba
        SINO
            h ← h - 1                   // venía de abajo
        recorrido[t-2] ← h
    RETORNAR recorrido
```

## Traza de ejemplo

**Entrada:** `3 3 3 6 9 12 9 9 6 3 3 3 3` ($n = 13$).

### Llenado de la tabla

La tabla se llena medición por medición. Las primeras:

```text
t = 0           dist[0][0] = 0                                (resto ∞)

t = 1 (a = 3)   dist[1][1] = |1-3| + min(dist[0][0], dist[0][2]) = 2 + min(0, ∞) = 2

t = 2 (a = 3)   dist[2][0] = |0-3| + dist[1][1]                  = 3 + 2       = 5
                dist[2][2] = |2-3| + min(dist[1][1], dist[1][3]) = 1 + min(2, ∞) = 3

t = 3 (a = 3)   dist[3][1] = |1-3| + min(dist[2][0], dist[2][2]) = 2 + min(5, 3) = 5
                dist[3][3] = |3-3| + min(dist[2][2], dist[2][4]) = 0 + min(3, ∞) = 3

t = 4 (a = 6)   dist[4][0] = |0-6| + dist[3][1]                  = 6 + 5       = 11
                dist[4][2] = |2-6| + min(dist[3][1], dist[3][3]) = 4 + min(5, 3) = 7
                dist[4][4] = |4-6| + min(dist[3][3], dist[3][5]) = 2 + min(3, ∞) = 5
```

Comparado con el [[vuelo_amoroso-fuerza-bruta#Traza de ejemplo|árbol de la fuerza bruta]]: el estado (3, 1) aparecía dos veces, con 5 y 7, y la tabla guarda solo el 5. El estado (4, 2) aparecía tres veces, con 7, 9 y 11, y la tabla guarda solo el 7. Cada estado se calcula una única vez.

La tabla completa, con el recorrido óptimo resaltado (se muestran solo las alturas 0 a 13: con 13 mediciones el pajarito no puede subir más, así que el resto de las filas queda en ∞):

![Tabla dist del ejemplo con el recorrido óptimo resaltado](vuelo-amoroso-tabla-pd.svg)

La mitad de las celdas queda vacía por la paridad: en la medición $t$ el pajarito solo puede estar en alturas con la misma paridad que $t$. La última medición tiene su mínimo en $dist[13][3] = 23$, que es la respuesta.

### Reconstrucción del recorrido

Se parte de $h = 3$ en $t = 13$. En cada paso se calcula `anterior` (el valor que tenía que tener el estado previo) y se busca qué vecino lo tiene, probando primero el de arriba:

| $t$ | $h$ | $dist[t][h]$ | `anterior`  | $dist[t-1][h+1]$ | $dist[t-1][h-1]$ | altura previa |
|-----|-----|--------------|-------------|------------------|------------------|---------------|
| 13  | 3   | 23           | 23 - 0 = 23 | **23**           | 23               | 4             |
| 12  | 4   | 23           | 23 - 1 = 22 | 24               | **22**           | 3             |
| 11  | 3   | 22           | 22 - 0 = 22 | **22**           | 28               | 4             |
| 10  | 4   | 22           | 22 - 1 = 21 | **21**           | 27               | 5             |
| 9   | 5   | 21           | 21 - 1 = 20 | **20**           | 24               | 6             |
| 8   | 6   | 20           | 20 - 3 = 17 | **17**           | 19               | 7             |
| 7   | 7   | 17           | 17 - 2 = 15 | ∞                | **15**           | 6             |
| 6   | 6   | 15           | 15 - 6 = 9  | ∞                | **9**            | 5             |
| 5   | 5   | 9            | 9 - 4 = 5   | ∞                | **5**            | 4             |
| 4   | 4   | 5            | 5 - 2 = 3   | ∞                | **3**            | 3             |
| 3   | 3   | 3            | 3 - 0 = 3   | ∞                | **3**            | 2             |
| 2   | 2   | 3            | 3 - 1 = 2   | ∞                | **2**            | 1             |

En $t = 13$ hay empate: los dos vecinos valen 23, y por eso existen dos recorridos óptimos. Como se prueba primero el de arriba, se obtiene el mismo recorrido que el ejemplo del enunciado.

**Resultado:** `23`, con el recorrido `1 2 3 4 5 6 7 6 5 4 3 4 3`.

## Complejidad

### Temporal

$O(n \cdot H)$, con $H = 301$ alturas factibles: la tabla tiene $(n+1) \cdot H$ celdas y cada una se calcula en $O(1)$ (un mínimo entre dos valores y una suma). Buscar la mejor altura final agrega $O(H)$ y la reconstrucción, $O(n)$. Como $H$ es una constante fija del problema, en la práctica el algoritmo es lineal en $n$.

Para el peor caso del problema ($n = 40.000$) son unos 12.040.000 pasos.

### Espacial

$O(n \cdot H)$ para la tabla completa, que hace falta para reconstruir el recorrido. En el peor caso son unas 12.040.000 celdas, que con enteros de 4 bytes ocupan alrededor de 48 MB.

## Cuándo usar esta técnica

### Favorable cuando

- Las decisiones se toman en etapas (aquí, una por medición) y el futuro depende solo de un estado chico (aquí, la altura actual), no de todo el camino recorrido.
- La cantidad de estados distintos es polinómica aunque la cantidad de caminos sea exponencial: $(n+1) \times 301$ estados contra $2^n$ vuelos.
- Además del valor óptimo se necesita la solución concreta: guardar la tabla permite reconstruirla en $O(n)$.

### Limitaciones

- El costo depende de $H$, el rango de alturas factibles. Si las alturas pudieran ser enormes, la tabla dejaría de ser viable y habría que reformular el estado (por ejemplo, guardando solo las alturas alcanzables).
- Reconstruir el recorrido obliga a guardar la tabla completa: $O(n \cdot H)$ de memoria, contra $O(n)$ de la fuerza bruta.

## Comparación con fuerza bruta

| Característica         | Fuerza bruta                          | Programación dinámica                     |
|------------------------|---------------------------------------|-------------------------------------------|
| Unidad de trabajo      | Vuelo completo (secuencia de $\pm 1$) | Estado (medición, altura)                 |
| Cantidad de unidades   | $2^n$                                 | $(n+1) \cdot 301$                         |
| Complejidad temporal   | $O(2^n \cdot n)$                      | $O(n \cdot H)$                            |
| Complejidad espacial   | $O(n)$                                | $O(n \cdot H)$                            |
| No factibles           | Se generan y después se descartan     | No tienen celda en la tabla               |
| Estados repetidos      | Se expanden una vez por cada camino   | Se resuelven una sola vez                 |
| Tamaño práctico        | $n \lesssim 20$                       | $n = 40.000$ sin problemas                |
| Simplicidad            | Alta: probar todo                     | Requiere plantear estado y recurrencia    |

La fuerza bruta solo gana en memoria cuando se pide el recorrido: $O(n)$ contra $O(n \cdot H)$. Pero esa ventaja no sirve de nada, porque su tiempo exponencial la deja fuera de juego mucho antes de que la memoria de la PD sea un problema. La PD gana en cualquier instancia que no sea trivial, porque convierte un problema exponencial en uno lineal en $n$. La fuerza bruta queda como herramienta de verificación: en instancias chicas, ambas soluciones tienen que dar la misma distancia.

## Comparación con [[vuelo_amoroso-greedy|greedy]]

La solución greedy también es lineal en $n$ y usa menos memoria ($O(1)$ si no guarda el recorrido), pero decide mirando solo la medición actual y no garantiza el óptimo: en el ejemplo da 25 en lugar de 23. La programación dinámica, en cambio, considera para cada estado las dos formas de llegar y se queda con la mejor, sin decidir antes de tiempo. Como en este problema todo el vuelo de la pájara se conoce de antemano y la PD entra holgada en tiempo, es la técnica adecuada. Greedy solo tendría sentido si las mediciones llegaran de a una.

## Referencias

- [Enunciado original (OIA, Nivel 3, Problema 2)](https://www.oia.unsam.edu.ar/_media/prob/c3a09n3p2.pdf)
- [CP-Algorithms - Introduction to Dynamic Programming](https://cp-algorithms.com/dynamic_programming/intro-to-dp.html)
- [[COR2011]] - Chapter 15.
- [[KLE2005]] - Chapter 6.
