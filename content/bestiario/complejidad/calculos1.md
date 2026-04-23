---
title: 'Cálculo de Complejidad 1'
tags: [b/complejidad]
---

Si se sabe que el algoritmo de selección tardó 10 segundos en ordenar 10000 elementos:

1. ¿Cuántos elementos podría ordenar en el triple de tiempo?
2. ¿Cuánto tardaría en ordenar el triple de elementos?
3. ¿Cuánto tardaría en ordenar el triple de elementos en una máquina 3 veces más rápida?

<details>
    <summary>Ver solución</summary>

## Solución paso a paso
Este tipo de ejercicios requiere, casi siempre, de un análisis de la situación inicial. No siempre se tienen todos los datos, y es mejor tenerlos a mano antes de comenzar a responder las preguntas.

Marquemos la información disponible:  
se sabe que el ==algoritmo de selección== tardó ==10 segundos== en ordenar ==10000 elementos==

Esa información nos permite llenar varias partes de la ecuación:

$$
T(n)=c \cdot O(f(n))
$$

Sabemos que:
- $T(n)$ es 10 segundos (dato)
- $f(n)$ es $n^2$ (por complejidad de Selección)
- $n$ es $10^4$ (dato. Recomendamos notación científica)

Entonces podemos armar la ecuación en la situación original, y despejar $c_0$:

$$
\begin{align*}
T_0(n) &= c_0 \cdot {n_0}^2 \\
10 &= c_0 \cdot (10^4)^2 \\
10 &= c_0 \cdot 10^8 \\
\frac{10}{10^8} &= c_0 \\
10^{-7} &= c_0
\end{align*}
$$

Con este dato, la constante computacional de la computadora inicial, podemos empezar a responder las preguntas:

### 1. ¿Cuántos elementos podría ordenar en el triple de tiempo?
Esta situación requiere despejar la ecuación, con el nuevo $T_1 = 3 \cdot T_0$

Sabemos que:
- $T_1$ es $3 \cdot T_0$
- $f_1(n)$ es $n^2$ (mismo algoritmo)
- $c_1$ es $10^{-7}$ (misma computadora)
- $n_1$ es la incógnita

A priori podemos deducir que, si el mismo algoritmo se ejecuta por más tiempo, debe procesar una entrada mayor necesariamente. Por ello, $n_1 > n_0$

Despejemos:

$$
\begin{align*}
T_1(n) &= c_1 \cdot {n_1}^2 \\
30 &= 10^{-7} \cdot {n_1}^2 \\
30 \cdot 10^7 &= {n_1}^2 \\
3 \cdot 10^8 &= {n_1}^2 \\
\sqrt{3 \cdot 10^8} &= n_1 \\
\sqrt{3} \cdot 10^4 &= n_1 \\
17320 &= n_1 \\
\end{align*}
$$

Es notable que se debe redondear hacia abajo, ya que no se puede ordenar "una fracción de elemento", y ya que no se pudo ordenar, sería inapropiado redondear hacia arriba.

La parte más importante es preguntarnos... ¿tiene sentido este resultado? En este caso, sí lo tiene: un algoritmo cuadrático, triplicando el tiempo, implica que el tamaño se multiplicó por raiz de tres.

### 2. ¿Cuánto tardaría en ordenar el triple de elementos?
En esta nueva situación, volvemos a referirnos al contexto original, y $n_2=3 \cdot n_0$

Sabemos que:
- $n_2$ es $3 \cdot n_0$ (dato)
- $f_2(n)$ es $n^2$ (mismo algoritmo)
- $c_2$ es $10^{-7}$ (misma computadora)
- $T_2$ es la incógnita

A priori podemos deducir que, si el mismo algoritmo se ejecuta para más elementos, debe tardar más. Habiendo visto los resultados del punto anterior, parecería que debe tardar 9 veces más (3 al cuadrado). Entonces, seguramente $T_2 > T_0$

Resolvamos:

$$
\begin{align*}
T_2(n) &= c_2 \cdot {n_2}^2 \\
T_2(n) &= 10^{-7} \cdot (3 \cdot 10^4)^2 \\
T_2(n) &= 10^{-7} \cdot 9 \cdot 10^8 \\
T_2(n) &= 9 \cdot 10^{-7} \cdot 10^8 \\
T_2(n) &= 9 \cdot 10^1 \\
T_2(n) &= 90 \\
\end{align*}
$$

Volvemos a preguntarnos si tiene sentido el resultado. En este caso, pudimos predecir el valor simplemente realizando un análisis a priori de la situación: efectivamente $T_2 = 3^2 \cdot T_0$.

### 3. ¿Cuánto tardaría en ordenar el triple de elementos en una máquina 3 veces más rápida?
Esta última situación nos plantea un cambio en el valor de $c_0$. La pregunta será... ¿al ser más rápida, el valor debe ser más grande o más pequeño al original? Para no depender de nuestra memoria, analizamos la ecuación original:

$$
T(n)=c \cdot O(f(n))
$$

Y deducimos: la $c$ está en el término de la derecha. Una computadora más rápida debería hacer que el $T(n)$ baje, aún manteniendo inalteradas las otras variables. Es por ello que necesitaríamos que se achique el valor de $c$. En conclusión: una computadora más rápida implica un $c$ más pequeño.

Adicionalmente, podemos pensar que el tiempo debe ser menor que el del punto anterior, que tiene la situación similar a la actual.

Dicho esto, sabemos que:
- $n_3$ es $3 \cdot 10^4$ (triple de elementos)
- $f_3(n)$ es $n^2$ (mismo algoritmo)
- $c_3$ es $\frac{10^{-7}}{3}$ (computadora "tres veces más rápida")
- $T_3$ es la incógnita

Resolvamos:

$$
\begin{align*}
T_3(n) &= c_3 \cdot {n_3}^2 \\
T_3(n) &= \frac{10^{-7}}{3} \cdot (3 \cdot 10^4)^2 \\
T_3(n) &= \frac{10^{-7}}{3} \cdot 3^2 \cdot 10^8 \\
T_3(n) &= \frac{3^2 \cdot 10^{-7} \cdot 10^8}{3} \\
T_3(n) &= \frac{3^2}{3} \cdot 10 \\
T_3(n) &= 30 \\
\end{align*}
$$

Preguntémonos por última vez si tiene sentido el resultado. En este caso, si la computadora es tres veces más rápida, deberíamos confirmar que $T_3 = \frac{T_2}{3}$, y efectivamente es el resultado obtenido.

</details>