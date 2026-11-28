---
title: El Libro de Cuentas del Halcón Milenario
tags:
  - programacion-dinamica
  - desafio
  - resuelto
---

### Dificultad: ★★★☆☆

A bordo del Halcón Milenario, C-3PO lleva el libro de cuentas de Han Solo. Cada día anota cuántos créditos cambió la deuda con Jabba el Hutt: un número positivo si un contrabando salió bien, uno negativo si hubo que tirar la carga para escapar de un crucero imperial. Han tiene que presentarse en el palacio de Tatooine y quiere mostrarle a Jabba **una racha de días consecutivos** cuyo balance total sea el mayor posible: no puede elegir días sueltos, porque Jabba exige que la racha sea continua.

C-3PO propone sumar todas las rachas posibles, una por una, y anuncia que las probabilidades de terminar a tiempo son de 3.720 a 1. La Princesa Leia lo interrumpe: *"Lo que ya se calculó, se anota; lo que está anotado, no se vuelve a calcular."*

### Enunciado

Dado un arreglo `balance[0..n-1]` de enteros (positivos, negativos o cero), se busca la **suma máxima de un subarreglo contiguo no vacío**.

1. Describir el enfoque de fuerza bruta y su complejidad. ¿Qué cálculos se repiten entre una racha y la siguiente?
2. Definir el subproblema: sea $f(i)$ el mejor balance de una racha que **termina exactamente** en el día $i$. Plantear la recurrencia de $f(i)$ en función de $f(i-1)$ y justificar por qué alcanza con mirar solo el día anterior (subestructura óptima).
3. Trazar a mano la estrategia sobre estos dos registros, mostrando $f(i)$, la decisión tomada (extender o reiniciar) y el mejor valor global en cada paso:
   - Registro de la ruta de Kessel: `[3, -4, 5, -2, -1, 6, -7, 4]`
   - Registro del bloqueo de Hoth: `[-3, -1, -4]`
4. **El borrado de R2-D2.** Leia descubre que R2-D2 puede conectarse a la computadora del libro de cuentas y borrar **a lo sumo un día** de la racha elegida (la racha tiene que seguir teniendo al menos un día). Extender el planteo con un segundo estado $g(i)$: el mejor balance de una racha que termina en $i$ y en la que **ya se borró un día**. Plantear la recurrencia de $g(i)$ y trazarla sobre el registro de la ruta de Kessel.
5. Determinar la complejidad temporal y espacial de ambas versiones.

> **Susurro del Maestro Yoda.** Dos caminos, una racha que termina hoy tiene: empezar hoy mismo, o continuar la mejor racha que ayer terminaba. Si negativo lo que de ayer traés es, ¿cargarlo te conviene? Mmm.

> **Reflexión trampa.** En el registro del bloqueo de Hoth, C-3PO inicializa `mejor = 0` "porque una suma vacía vale cero". ¿Qué responde su algoritmo y por qué está mal según el enunciado?

<details>
    <summary>Ver solución</summary>

### 1. Fuerza bruta

Probar cada par $(i, j)$ con $i \le j$ y sumar `balance[i..j]`. Sumando desde cero cada vez cuesta $O(n^3)$; reutilizando la suma de $(i, j-1)$ baja a $O(n^2)$. En cualquiera de los dos casos se repite trabajo: la racha $[i..j]$ y la racha $[i+1..j]$ comparten casi todos sus días, y se suman por separado.

### 2. Subproblema y recurrencia

$$
f(0) = a_0 \qquad f(i) = \max\big(a_i,\; f(i-1) + a_i\big)
$$

**Por qué alcanza con $f(i-1)$:** una racha óptima que termina en $i$ o es solo $[i]$, o es $[k..i]$ con $k < i$. En el segundo caso, $[k..i-1]$ tiene que ser la mejor racha que termina en $i-1$: si hubiera una mejor, se la podría reemplazar y obtener una racha mejor que termina en $i$, lo cual es una contradicción. Esa es la **subestructura óptima**.

La respuesta es $\max_i f(i)$: la mejor racha termina en *algún* día.

### 3. Trazas

**Registro de la ruta de Kessel:** `[3, -4, 5, -2, -1, 6, -7, 4]`

| $i$ | $a_i$ | $f(i-1) + a_i$ | $f(i)$ | Decisión | Mejor global |
|---|---|---|---|---|---|
| 0 | 3 | — | 3 | inicio | 3 |
| 1 | −4 | −1 | −1 | extender | 3 |
| 2 | 5 | 4 | **5** | **reiniciar** (lo de ayer es negativo) | 5 |
| 3 | −2 | 3 | 3 | extender | 5 |
| 4 | −1 | 2 | 2 | extender | 5 |
| 5 | 6 | 8 | 8 | extender | **8** |
| 6 | −7 | 1 | 1 | extender | 8 |
| 7 | 4 | 5 | 5 | extender | 8 |

Resultado: **8**, con la racha `[5, -2, -1, 6]` (días 2 a 5). Para recuperar la racha, se lleva el inicio de la racha actual (se actualiza en cada reinicio) y, **cada vez que se mejora el mejor global**, se guardan junto con él ese inicio y el día $i$ actual. No alcanza con recordar el último reinicio: en `[5, -10, 1]` el mejor global se alcanza en el día 0, pero el último reinicio ocurre en el día 2, y se obtendría el intervalo sin sentido $[2..0]$.

**Registro del bloqueo de Hoth:** `[-3, -1, -4]`

| $i$ | $a_i$ | $f(i-1) + a_i$ | $f(i)$ | Decisión | Mejor global |
|---|---|---|---|---|---|
| 0 | −3 | — | −3 | inicio | −3 |
| 1 | −1 | −4 | −1 | **reiniciar** (−1 > −4) | **−1** |
| 2 | −4 | −5 | −4 | **reiniciar** (−4 > −5) | −1 |

Resultado: **−1**. Con todos los valores negativos, $f(i-1) < 0$ en cada paso, así que cargar lo de ayer siempre empeora: Kadane reinicia en todos los días, y la respuesta termina siendo el mayor elemento del arreglo. Respuesta a la trampa: inicializar `mejor = 0` devuelve $0$, que corresponde a la racha **vacía**, prohibida por el enunciado. Hay que inicializar con $a_0$ (o con $-\infty$).

### 4. El borrado de R2-D2

$g(i)$: mejor racha que termina en $i$ con exactamente un día borrado. Hay dos formas de llegar:

- **Borrar el día $i$:** queda la mejor racha intacta que terminaba en $i-1$, es decir $f(i-1)$.
- **El borrado ya ocurrió antes:** se extiende $g(i-1)$ con $a_i$.

$$
g(0) = -\infty \qquad g(i) = \max\big(f(i-1),\; g(i-1) + a_i\big)
$$

($g(0) = -\infty$ porque borrar el único día dejaría la racha vacía.) La respuesta es $\max_i \max\big(f(i), g(i)\big)$.

| $i$ | $a_i$ | $f(i)$ | $g(i)$ | Mejor global |
|---|---|---|---|---|
| 0 | 3 | 3 | $-\infty$ | 3 |
| 1 | −4 | −1 | $\max(3, -\infty) = 3$ | 3 |
| 2 | 5 | 5 | $\max(-1, 3+5) = 8$ | 8 |
| 3 | −2 | 3 | $\max(5, 8-2) = 6$ | 8 |
| 4 | −1 | 2 | $\max(3, 6-1) = 5$ | 8 |
| 5 | 6 | 8 | $\max(2, 5+6) = 11$ | 11 |
| 6 | −7 | 1 | $\max(8, 11-7) = 8$ | 11 |
| 7 | 4 | 5 | $\max(1, 8+4) = 12$ | **12** |

Resultado: **12**, con R2-D2 borrando el día 6: `[5, -2, -1, 6, ~~-7~~, 4]`. Notar que la mejor racha con borrado (días 2 a 7) **contiene** a la racha de 8 (días 2 a 5), pero no sale de borrar algo dentro de ella: borrar su peor día (el −2) da solo $10$. El $12$ sale de **extenderla** más allá del −7, un día que sin borrado no convenía cruzar. Por eso hacía falta un segundo estado, y no alcanzaba con "borrar el peor día de la racha de 8".

Incluso puede pasar que las dos rachas no tengan ningún día en común. En `[9, -50, -50, 5, -20, 5]`, sin borrado la mejor racha es `[9]`, y con borrado es `[5, ~~-20~~, 5]` $= 10$, totalmente separada de ella.

### 5. Complejidad

Ambas versiones recorren el arreglo una sola vez con trabajo constante por día: **$O(n)$ en tiempo**. Como $f(i)$ y $g(i)$ solo dependen de $f(i-1)$ y $g(i-1)$, no hace falta guardar la tabla entera: **$O(1)$ de espacio adicional**.

> **Para conectar.** En [[la profecía de los mercaderes]] se planteó este mismo problema con división y conquista, a $O(n \log n)$. La programación dinámica lo baja a $O(n)$ porque nunca vuelve a sumar lo que ya sumó. Y la profecía original (comprar el día $i$, vender el día $j$) se reduce a este problema: aplicado a las diferencias $d_k = p_k - p_{k-1}$, el subarreglo de suma máxima de $d$ es exactamente la máxima ganancia.

</details>
