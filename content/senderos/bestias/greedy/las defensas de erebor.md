---
title: Las Defensas de Erebor
tags:
  - greedy
  - desafio
  - resuelto
---

### Dificultad: ★★★★★

Los años pasaron y Smaug, ahora del otro lado del problema, necesita defender lo que le queda de tesoro. La Montaña tiene $n$ accesos conocidos (puertas viejas, chimeneas de ventilación, grietas que los enanos abrieron y nunca sellaron del todo) y cada uno es vulnerable solamente durante un intervalo de tiempo determinado: la puerta oeste solo puede forzarse mientras dura cierto relevo, cierta grieta solo es practicable mientras la luna ilumina cierta piedra, y así con cada acceso. Smaug quiere ubicar trampas o centinelas que actúen en un instante puntual (no durante un intervalo, sino en un momento exacto) de forma que cada acceso quede cubierto por al menos una trampa durante su ventana de vulnerabilidad. Colocar cada trampa tiene un costo, así que Smaug quiere usar la menor cantidad posible.

### Enunciado

Dados $n$ accesos, cada uno con un intervalo de vulnerabilidad $[s_i, f_i]$, se busca el menor conjunto de puntos $\{p_1, p_2, \dots\}$ tal que todo intervalo contenga al menos un $p_j$.

Este problema es distinto al de [[el consejo de elrond]]: ahí se buscaba elegir la mayor cantidad de intervalos compatibles entre sí; acá se busca elegir la menor cantidad de puntos que, entre todos, toquen a todos los intervalos dados (un punto ubicado dentro de un intervalo lo cubre).

1. Explicar la estrategia voraz: ordenar los accesos por su instante de finalización $f_i$ de vulnerabilidad, de menor a mayor; colocar una trampa exactamente en el instante de finalización del primer acceso sin cubrir; descartar todos los accesos que esa trampa cubre; y repetir con los accesos restantes. Justificar por qué conviene colocar la trampa en el extremo final del intervalo, y no en cualquier otro punto interior, para maximizar la cantidad de accesos adicionales que esa misma trampa puede llegar a cubrir.
2. Argumentar, aunque sea de forma intuitiva, por qué ninguna estrategia puede cubrir todos los accesos con menos trampas que las que propone el algoritmo voraz (pensar qué pasaría si una solución óptima no incluyera ese primer punto de finalización, ni ningún punto anterior a él, para cubrir al acceso que vence primero).
3. Trazar a mano la ejecución con los siguientes accesos, dados como intervalos de vulnerabilidad (inicio, fin):

    |Acceso|Inicio|Fin|
    |---|---|---|
    |Puerta Oeste|1|4|
    |Chimenea Sur|2|6|
    |Grieta del Cuervo|4|7|
    |Túnel de los Enanos|5|9|
    |Puerta Principal|8|10|
    |Escalinata Oculta|9|12|
    |Ventana de la Guardia|11|13|

    Mostrar en qué orden se procesan los accesos, dónde se coloca cada trampa y qué accesos cubre cada una.
4. Determinar la complejidad del algoritmo en función de $n$, identificando qué paso domina el costo total.

<details>
    <summary>Ver solución</summary>

### 1. Estrategia voraz y por qué la trampa va en el extremo final

**Algoritmo:**

1. Ordenar los accesos por su fin $f_i$, de menor a mayor.
2. Inicializar `ultima_trampa = -∞` y `trampas = []`.
3. Para cada acceso $[s_i, f_i]$ en ese orden:
    - Si $s_i \le$ `ultima_trampa`: el acceso ya está cubierto por la última trampa colocada. No se hace nada.
    - Si no: colocar una trampa en $f_i$ (agregar a `trampas`) y actualizar `ultima_trampa = f_i`.
4. Devolver `trampas`.

¿Por qué alcanza con mirar **solo la última** trampa? Porque las trampas se colocan en extremos finales de accesos ya procesados, y esos fines son $\le f_i$ por el orden. Entonces `ultima_trampa` $\le f_i$ siempre, y el acceso está cubierto exactamente cuando $s_i \le$ `ultima_trampa`. Si la última trampa no lo cubre (está antes de $s_i$), ninguna de las anteriores, que están todavía más a la izquierda, lo va a cubrir.

**Por qué el extremo final:** sea $A_1 = [s_1, f_1]$ el acceso que vence primero. Cualquier trampa que lo cubra tiene que estar en algún punto $x \in [s_1, f_1]$. Veamos que $x = f_1$ es la mejor elección posible: si una trampa en $x$ cubre a otro acceso $A_j = [s_j, f_j]$, entonces:

- $s_j \le x \le f_1$, así que $s_j \le f_1$;
- $f_j \ge f_1$, porque $A_1$ es el que vence primero.

Por lo tanto $f_1 \in [s_j, f_j]$: **una trampa en $f_1$ cubre todo lo que cubriría cualquier otra trampa ubicada dentro de $A_1$**, y quizás más. Moverla más a la izquierda solo puede hacer que deje de cubrir accesos que empiezan tarde. Colocarla en $f_1$ es la forma de "estirar" esa trampa lo más posible hacia el futuro sin dejar de cubrir a $A_1$.

### 2. Por qué ninguna estrategia usa menos trampas

**Argumento de intercambio.** Tomemos cualquier solución óptima $S$. Como $A_1$ tiene que quedar cubierto, $S$ tiene alguna trampa $x \in [s_1, f_1]$. Si $x \ne f_1$, la reemplazamos por $f_1$: por el punto 1, todos los accesos que cubría $x$ siguen cubiertos, y la cantidad de trampas no cambia. Así obtenemos una solución óptima que **sí** incluye a $f_1$, igual que el voraz. Sacando los accesos que cubre $f_1$, queda un problema idéntico pero más chico, y el mismo razonamiento se repite. Por inducción, el voraz usa la misma cantidad de trampas que el óptimo.

(Lo que plantea la pista del enunciado es imposible: una solución que no tenga ninguna trampa en $f_1$ ni antes de él no puede cubrir a $A_1$, porque cualquier trampa posterior a $f_1$ llega tarde.)

**Una forma más directa de verlo (cota inferior):** fijate en los accesos que **provocan** la colocación de una trampa (los que estaban sin cubrir cuando se los evaluó). Si el voraz coloca $k$ trampas, hay $k$ de esos accesos, y son **disjuntos entre sí**: cada uno empieza después de la trampa anterior, que está en el fin del acceso anterior que la provocó. Como ningún punto puede estar dentro de dos intervalos disjuntos, *cualquier* solución necesita al menos $k$ trampas, una para cada uno. El voraz usa exactamente $k$, así que es óptimo.

> **Conexión con [[el consejo de elrond]]:** esos $k$ accesos disjuntos son, justamente, un conjunto de intervalos compatibles como los que buscaba Elrond. Los dos problemas son "duales": la mayor cantidad de intervalos disjuntos que se puede elegir es igual a la menor cantidad de puntos que hacen falta para tocarlos a todos. Y los dos se resuelven con el mismo orden: por fin de intervalo.

### 3. Traza a mano

**Paso 1: ordenar por fin.** En este caso los datos ya vienen ordenados por $f_i$:

|Orden|Acceso|Inicio|Fin|
|---|---|---|---|
|1|Puerta Oeste|1|4|
|2|Chimenea Sur|2|6|
|3|Grieta del Cuervo|4|7|
|4|Túnel de los Enanos|5|9|
|5|Puerta Principal|8|10|
|6|Escalinata Oculta|9|12|
|7|Ventana de la Guardia|11|13|

**Paso 2: recorrido voraz** (`ultima_trampa` inicial $= -\infty$):

|Acceso|Intervalo|¿$s_i \le$ última trampa?|Decisión|`ultima_trampa` tras el paso|
|---|---|---|---|---|
|Puerta Oeste|[1, 4]|$1 \le -\infty$ → no|**Trampa en 4**|4|
|Chimenea Sur|[2, 6]|$2 \le 4$|Cubierto por la trampa en 4|4|
|Grieta del Cuervo|[4, 7]|$4 \le 4$|Cubierto por la trampa en 4|4|
|Túnel de los Enanos|[5, 9]|$5 \le 4$ → no|**Trampa en 9**|9|
|Puerta Principal|[8, 10]|$8 \le 9$|Cubierto por la trampa en 9|9|
|Escalinata Oculta|[9, 12]|$9 \le 9$|Cubierto por la trampa en 9|9|
|Ventana de la Guardia|[11, 13]|$11 \le 9$ → no|**Trampa en 13**|13|

Notar que la Grieta del Cuervo y la Escalinata Oculta quedan cubiertas porque los intervalos son **cerrados**: la trampa cae justo en su instante de inicio ($4 \in [4, 7]$ y $9 \in [9, 12]$).

**Resultado:** Smaug necesita **3 trampas**, en los instantes **4, 9 y 13**:

|Trampa|Accesos que cubre|
|---|---|
|$t = 4$|Puerta Oeste, Chimenea Sur, Grieta del Cuervo|
|$t = 9$|Túnel de los Enanos, Puerta Principal, Escalinata Oculta|
|$t = 13$|Ventana de la Guardia|

**¿Se puede con 2?** No: Puerta Oeste $[1, 4]$, Túnel de los Enanos $[5, 9]$ y Ventana de la Guardia $[11, 13]$ (los tres accesos que provocaron una trampa) son disjuntos de a pares, así que ninguna trampa puede cubrir a dos de ellos. Hacen falta al menos 3, tal como dice el argumento del punto 2.

### 4. Complejidad

- Ordenar los $n$ accesos por fin: $O(n \log n)$.
- Recorrer la lista ordenada una sola vez, comparando cada acceso solo contra la última trampa: $O(n)$.

Total: $O(n \log n) + O(n) = O(n \log n)$, dominado por el **ordenamiento**. Si los accesos ya vinieran ordenados por fin (como en la traza), el algoritmo sería $O(n)$.

</details>
