---
title: La Convocatoria de las Mil Voces
tags:
  - heaps
  - desafio
  - resuelto
---

**Dificultad:** ★★★☆☆

Un sótano olvidado de la Torre entregó un cofre con cientos de presagios nunca catalogados, todos mezclados sin ningún orden. Un aprendiz impaciente propuso insertarlos uno por uno, tal como se enseña siempre; pero el Archivista Insomne, que ha visto cofres como este durante siglos, sonrió con algo parecido a la lástima. Hay una forma más rápida, y nadie que la aprende vuelve a mirar una inserción repetida de la misma manera.

**Enunciado**

1. **Método ingenuo:** insertar los `n` presagios uno por uno en un montículo inicialmente vacío, como en el Ejercicio 1. ¿Cuál es la complejidad total en el peor caso? Justificar.
2. **Método "desde abajo":** en lugar de insertar de a uno, aplicar `sift-down` empezando por el último nodo interno del arreglo (el último nodo que tiene al menos un hijo) y retrocediendo hasta la raíz. Describir el algoritmo en palabras. ¿Por qué alcanza con arrancar en el último nodo interno, sin procesar las hojas?
3. Trazar a mano el método "desde abajo" sobre el arreglo `[4, 18, 9, 25, 1, 30, 12, 7, 22, 15]`, mostrando el arreglo completo después de aplicar `sift-down` sobre cada nodo interno procesado.
4. Formalizar el argumento de complejidad del método "desde abajo": plantear la suma que acota el costo total, pensando en cuántos nodos hay a cada altura del árbol y cuánto cuesta el `sift-down` de un nodo según su altura. Mostrar que esa suma converge a $O(n)$. (No hace falta una demostración completamente rigurosa, pero sí identificar la serie involucrada y explicar por qué converge a una constante.)

> **Susurro del Archivista Insomne.** Un montículo de `n` elementos tiene aproximadamente `n/2` hojas (altura 0, costo de `sift-down` nulo), `n/4` nodos de altura 1, `n/8` de altura 2, y así sucesivamente. El costo de `sift-down` sobre un nodo depende de **la altura de ese nodo**, no de la altura total del árbol. Sumá, para cada altura, la cantidad de nodos que hay multiplicada por el costo de esa altura.

> **Reflexión Trampa.** Reconciliá tu resultado del punto 4 con este razonamiento, que suena razonable pero no lo es: *"El método 'desde abajo' hace del orden de `n` operaciones de `sift-down`, cada una de costo hasta $O(\log{n})$ en el peor caso... eso debería dar $O(n \log{n})$ en total, igual que insertar uno por uno."* ¿Dónde está el error de esa cuenta? ¿Por qué sobreestima el costo real?


<details>
    <summary>Ver solución</summary>

### 1. Método ingenuo

Insertar el $k$-ésimo elemento en un montículo que ya tiene $k-1$ elementos cuesta, en el peor caso, un `sift-up` que recorre la altura del árbol: $O(\log k)$.

$$
T(n) = \sum_{k=1}^{n} O(\log k) = O(\log(n!)) = O(n\log n)
$$

(por la aproximación de Stirling, o simplemente porque cada una de las $n$ inserciones cuesta a lo sumo $O(\log n)$). **Cota ajustada**, porque las últimas $n/2$ inserciones ocurren efectivamente sobre montículos de tamaño $\Theta(n)$, con altura real $\Theta(\log n)$.

### 2. Método "desde abajo"

**Idea:** en vez de construir el montículo agregando hojas y arreglando hacia arriba, se parte del arreglo tal cual y se "arregla hacia abajo" cada subárbol, de atrás para adelante.

**Algoritmo:**
1. Ubicar el último nodo interno: índice $\lfloor n/2 \rfloor - 1$ (0-indexado).
2. Para $i$ desde ese índice hasta $0$: aplicar `sift-down(i)`.

**Por qué no hace falta procesar las hojas:** un `sift-down` compara un nodo contra sus hijos y hunde el valor si corresponde. Una hoja no tiene hijos, así que `sift-down` sobre una hoja es una operación vacía: cada hoja ya es, trivialmente, un montículo válido de un solo elemento. Además, el invariante clave es que cuando se procesa el nodo $i$, **sus dos subárboles hijos ya son montículos válidos** (porque se procesaron antes, al ir de atrás hacia adelante); eso es justamente lo que garantiza la corrección de `sift-down(i)`.

### 3. Traza

Sobre `[4, 18, 9, 25, 1, 30, 12, 7, 22, 15]`:

$n=10$, índices $0$–$9$. Último nodo interno: $\lfloor 10/2\rfloor -1 = 4$.

| Nodo procesado (índice : valor) | Hijos comparados | Arreglo resultante |
|---|---|---|
| inicial | ∅ | `[4,18,9,25,1,30,12,7,22,15]` |
| $4:1$ | hijo(9)=15 | `[4,18,9,25,15,30,12,7,22,1]` |
| $3:25$ | hijos(7)=7,(8)=22 → no baja | `[4,18,9,25,15,30,12,7,22,1]` |
| $2:9$ | hijos(5)=30,(6)=12 → baja con 30 | `[4,18,30,25,15,9,12,7,22,1]` |
| $1:18$ | hijos(3)=25,(4)=15 → baja con 25; sigue: hijos(7)=7,(8)=22 → baja con 22 | `[4,25,30,22,15,9,12,7,18,1]` |
| $0:4$ | hijos(1)=25,(2)=30 → baja con 30; sigue: hijos(5)=9,(6)=12 → baja con 12 | `[30,25,12,22,15,9,4,7,18,1]` |

Resultado final: **`[30, 25, 12, 22, 15, 9, 4, 7, 18, 1]`** (se verifica la propiedad de montículo en cada nodo).

### 4. Complejidad del método "desde abajo"

El costo de `sift-down` en un nodo depende de la **altura de ese nodo** (distancia hasta su hoja más lejana), no de la altura del árbol completo. Como sugiere el Archivista:

| Altura $h$ | # nodos $\approx n/2^{h+1}$ | costo por nodo | contribución |
|---|---|---|---|
| $0$ | $n/2$ | $O(1)$ (trivial) | $0$ |
| $1$ | $n/4$ | $O(1)$ | $\propto n/4$ |
| $2$ | $n/8$ | $O(2)$ | $\propto 2n/8$ |
| $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ |
| $h$ | $n/2^{h+1}$ | $O(h)$ | $\propto h\,n/2^{h+1}$ |

Sumando sobre todas las alturas ($h=0,\dots,\lfloor\log n\rfloor$):

$$
T(n) = \sum_{h=0}^{\log n} \frac{n}{2^{h+1}}\cdot O(h) = O(n)\sum_{h=0}^{\infty} \frac{h}{2^h}
$$

La serie $\sum_{h=0}^{\infty} h/2^h$ es una serie **aritmético-geométrica**: converge (porque $1/2<1$) a un valor constante:

$$
\sum_{h=0}^{\infty} \frac{h}{2^h} = 2
$$

Por lo tanto $T(n) = O(n)\cdot 2 = O(n)$. La clave es que **la cantidad de nodos decrece exponencialmente a medida que crece su costo**, así que el producto (nodos × costo) decrece también exponencialmente y la suma total queda acotada por una constante multiplicando $n$.

### Respuesta a la reflexión trampa

El error de "$n$ operaciones × $O(\log n)$ cada una = $O(n\log n)$" es **multiplicar por la cota superior *global*** ($O(\log n)$, que solo corresponde al nodo raíz) **en vez de usar el costo real de cada nodo según su altura**.

Casi todos los nodos ($n/2$) son hojas con costo $0$, y la mitad de los internos ($n/4$) tienen altura $1$ con costo $O(1)$. Solo hay **un** nodo (la raíz) con costo genuinamente $O(\log n)$. Usar $O(\log n)$ para los $n$ nodos ignora que la mayoría son mucho más baratos, y por eso sobreestima brutalmente.

Esto contrasta con la inserción uno por uno: ahí sí hay $\Theta(n)$ inserciones que ocurren sobre montículos de tamaño $\Theta(n)$ (las últimas), con costo real $\Theta(\log n)$ cada una. El peor caso *no* está concentrado en un solo nodo, sino distribuido en una fracción constante de las operaciones. Esa asimetría (dónde se concentran los casos caros) es la diferencia real entre $O(n)$ y $O(n\log n)$.

</details>
