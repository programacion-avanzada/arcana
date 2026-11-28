---
title: El Tesoro de Smaug
tags:
  - greedy
  - desafio
  - resuelto
---

### Dificultad: ★☆☆☆☆

Tras siglos dormido sobre su tesoro, Smaug debe abandonar temporalmente su guarida en la Montaña Solitaria: los enanos han comenzado a horadar un nuevo túnel y el dragón, prudente a su manera, prefiere trasladar lo que pueda antes de que lo descubran. El problema es que ni siquiera un dragón puede cargar todo el oro de Erebor de una sola vez: sus garras y su lomo soportan, como mucho, un peso máximo $W$. Ante Smaug hay $n$ sacos de tesoro, cada uno con su propio peso $w_i$ y su propio valor $v_i$ (las esmeraldas pesan poco y valen mucho, el oro en bruto pesa como el oro en bruto). A diferencia de un ladrón cualquiera, Smaug puede desgarrar un saco con sus garras y llevarse solo una fracción de su contenido, si eso le permite aprovechar mejor el espacio que le queda.

### Enunciado

El problema es la variante fraccionaria de la mochila: dada una capacidad $W$ y $n$ sacos, cada uno con peso $w_i$ y valor $v_i$, se puede tomar cualquier fracción $x_i \in [0, 1]$ de cada saco, no solo el saco entero, maximizando $\sum_i x_i v_i$ sujeto a $\sum_i x_i w_i \le W$.

1. Explicar por qué ordenar los sacos por su razón valor/peso $\frac{v_i}{w_i}$, de mayor a menor, y tomarlos en ese orden hasta completar la capacidad $W$, produce siempre una solución óptima en la variante fraccionaria. Justificar con un argumento de intercambio: ¿qué pasaría si Smaug tomara primero una unidad de peso de un saco con menor razón valor/peso, existiendo todavía unidades disponibles de un saco con mayor razón?
2. Diseñar el algoritmo paso a paso, indicando qué ocurre cuando el peso restante de la capacidad es menor que el peso completo del siguiente saco en el orden.
3. Trazar a mano la ejecución con capacidad $W = 50$ y los siguientes sacos:

    |Saco|Peso ($w_i$)|Valor ($v_i$)|
    |---|---|---|
    |Esmeraldas|10|60|
    |Oro amonedado|20|100|
    |Oro en bruto|30|120|
    |Gemas talladas|15|90|

    Mostrar el orden elegido, qué fracción de cada saco toma Smaug y el valor total transportado.
4. Determinar la complejidad temporal del algoritmo en función de $n$, identificando qué paso domina el costo total.

<details>
    <summary>Ver solución</summary>

### 1. Por qué ordenar por razón valor/peso

La razón $r_i = \frac{v_i}{w_i}$ es el **valor por unidad de peso** del saco $i$: cuánto gana Smaug por cada unidad de capacidad que le dedica a ese saco. Como puede tomar fracciones, la capacidad $W$ se puede pensar como $W$ "unidades de peso" que hay que repartir, y cada unidad conviene asignarla al saco que más paga por ella.

**Argumento de intercambio:** supongamos una solución en la que Smaug carga $\varepsilon > 0$ unidades de peso de un saco $j$, mientras todavía quedan $\varepsilon$ unidades sin tomar de un saco $i$ con $r_i > r_j$. Si cambia esas $\varepsilon$ unidades de $j$ por $\varepsilon$ unidades de $i$:

- el peso total no cambia (saca $\varepsilon$ y pone $\varepsilon$), así que la solución sigue siendo válida;
- el valor cambia en $\varepsilon \cdot r_i - \varepsilon \cdot r_j = \varepsilon \,(r_i - r_j) > 0$.

O sea, la solución **mejora estrictamente**. Por lo tanto, ninguna solución óptima puede tener peso de un saco de menor razón mientras quede algo disponible de uno de mayor razón. La única forma de cumplir eso es llenar la capacidad siguiendo el orden de $r_i$ de mayor a menor, que es exactamente lo que hace el algoritmo greedy. (Si hay empates en $r_i$, el intercambio da diferencia $0$: el orden entre sacos empatados no cambia el valor final.)

> **Cuidado:** este argumento funciona **solo porque se puede fraccionar**. En la mochila 0/1 (cada saco se lleva entero o no se lleva) no siempre se pueden intercambiar exactamente $\varepsilon$ unidades, y el greedy por razón falla. Ejemplo con $W = 50$ y sacos $(w, v)$: $(10, 60)$, $(20, 100)$, $(30, 120)$. El voraz toma los dos primeros (razones $6$ y $5$) y ya no le entra el tercero: valor $160$. Pero tomar los dos últimos da $220$. Para la variante 0/1 hace falta programación dinámica.

### 2. Diseño del algoritmo

1. Calcular $r_i = v_i / w_i$ para cada saco.
2. Ordenar los sacos por $r_i$, de mayor a menor.
3. Inicializar `restante = W` y `valor = 0`.
4. Para cada saco $i$ en ese orden, mientras `restante > 0`:
    - Si $w_i \le$ `restante`: tomarlo **entero** ($x_i = 1$), `restante -= w_i`, `valor += v_i`.
    - Si no: tomar **la fracción que entra**, $x_i = \frac{\text{restante}}{w_i}$, sumar `valor += x_i · v_i` y dejar `restante = 0`. La mochila queda llena y el algoritmo termina.
5. Los sacos que no se llegaron a evaluar quedan con $x_i = 0$. Devolver `valor` y las fracciones $x_i$.

Observación: como mucho **un** saco se toma de forma fraccionaria, y es justamente el último que se evalúa.

### 3. Traza a mano

**Paso 1: calcular razones.**

|Saco|Peso ($w_i$)|Valor ($v_i$)|$r_i = v_i / w_i$|
|---|---|---|---|
|Esmeraldas|10|60|6|
|Oro amonedado|20|100|5|
|Oro en bruto|30|120|4|
|Gemas talladas|15|90|6|

**Paso 2: ordenar por razón descendente** (Esmeraldas y Gemas talladas empatan en $6$; como se vio en el punto 1, el orden entre ellas no afecta el resultado):

|Orden|Saco|$w_i$|$v_i$|$r_i$|
|---|---|---|---|---|
|1|Esmeraldas|10|60|6|
|2|Gemas talladas|15|90|6|
|3|Oro amonedado|20|100|5|
|4|Oro en bruto|30|120|4|

**Paso 3: recorrido voraz** (`restante` inicial $= 50$):

|Saco|¿$w_i \le$ restante?|Fracción $x_i$|Valor tomado|`restante` tras el paso|Valor acumulado|
|---|---|---|---|---|---|
|Esmeraldas|$10 \le 50$|$1$|$60$|$40$|$60$|
|Gemas talladas|$15 \le 40$|$1$|$90$|$25$|$150$|
|Oro amonedado|$20 \le 25$|$1$|$100$|$5$|$250$|
|Oro en bruto|$30 \le 5$ → no|$5/30 = 1/6$|$\frac{1}{6} \cdot 120 = 20$|$0$|$270$|

**Resultado:** Smaug lleva enteros los sacos de Esmeraldas, Gemas talladas y Oro amonedado, y desgarra el de Oro en bruto para llevarse $1/6$ (5 unidades de peso). Carga exactamente $W = 50$ y transporta un valor total de **270**.

Verificación rápida: $10 + 15 + 20 + 5 = 50$ de peso, y $60 + 90 + 100 + 20 = 270$ de valor.

### 4. Complejidad

- Calcular las $n$ razones: $O(n)$.
- Ordenar los $n$ sacos por razón: $O(n \log n)$.
- Recorrer la lista ordenada una vez, con trabajo constante por saco: $O(n)$.

Total: $O(n) + O(n \log n) + O(n) = O(n \log n)$, dominado por el **ordenamiento**.

> **Para curiosos:** el ordenamiento completo no es estrictamente necesario. Solo importa encontrar el saco "de corte" (el que se toma fraccionado), y eso se puede hacer con una búsqueda tipo selección de la mediana ponderada en $O(n)$. Pero la versión con ordenamiento es la estándar y la que conviene saber justificar.

</details>
