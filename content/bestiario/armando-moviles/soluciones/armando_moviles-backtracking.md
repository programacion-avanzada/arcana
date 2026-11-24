---
title: "Armando Móviles - Backtracking"
---

## Técnicas utilizadas

- **Backtracking** (búsqueda recursiva con retroceso) construido de abajo hacia arriba, desde la última varilla $k$ hacia la varilla $1$.
- **Poda determinística:** en cada nivel superior, la ley de la palanca fija un único peso válido para el colgante; si ese valor no es entero o no está disponible, la rama se descarta en $O(1)$.
- **Preprocesamiento lineal:** se calcula de antemano el prefijo máximo $k_{\max}$ de varillas que cumplen la condición de no choque.
- **Tabla de frecuencias** ([[map]] / `Counter`): representa el multiconjunto de colgantes disponibles para consultar, consumir y restaurar pesos en $O(1)$, evitando explorar ramas repetidas cuando hay colgantes del mismo peso.

## Idea de la solución

El problema pide maximizar la cantidad de colgantes ($k + 1$) usando las primeras $k$ varillas en orden, sin choques y con todas las varillas equilibradas.

1. **Acotar el largo máximo de la cadena ($k_{\max}$):** se recorren las varillas en orden desde $v_1$ mientras se cumpla $\max(l1_i, l2_i) < l1_{i-1} + l2_{i-1}$. Como una cadena de $k$ varillas requiere $k + 1$ colgantes, se toma $k_{\max} = \min(k_{\text{sin choque}}, C - 1)$. Si $k_{\max} < 1$, no se puede construir ningún móvil.
2. **Probar $k$ en orden decreciente:** se intenta armar un móvil para $k = k_{\max}, k_{\max} - 1, \dots, 1$. Como cualquier alternativa válida con la cantidad máxima de colgantes sirve, la primera solución encontrada es óptima y permite terminar de inmediato.
3. **Elegir la base en la varilla $k$:** se prueba cada peso distinto disponible $p_a$ en el brazo $l1_k$. El equilibrio exige $p_a \cdot l1_k = p_b \cdot l2_k$, por lo que el peso del extremo opuesto queda determinado por: $$p_b = \frac{p_a \cdot l1_k}{l2_k}$$. Si $p_b$ es entero y está disponible (teniendo en cuenta que si $p_b = p_a$ se necesitan al menos dos unidades), se consumen ambos colgantes y se inicia la recursión hacia arriba con peso acumulado $W_k = p_a + p_b$. Notar que probar todos los $p_a$ sobre $l1_k$ cubre automáticamente ambas orientaciones de la última varilla.
4. **Subir con backtracking y podas (`subir(i, peso_subcadena)`):** al llegar a una varilla superior $i$ con peso acumulado $W_{i+1}$, se prueban sus hasta dos orientaciones $(a_i, b_i) \in \{(l1_i, l2_i), (l2_i, l1_i)\}$ (una sola si $l1_i = l2_i$). El peso del colgante necesario en el brazo $b_i$ queda fijado de forma única: $$p_{c_i} = \frac{W_{i+1} \cdot a_i}{b_i}$$

- Si $(W_{i+1} \cdot a_i) \bmod b_i \ne 0$ o `freq[p] == 0`, se **poda** la rama sin hacer llamadas recursivas.
- Si está disponible, se descuenta de `freq`, se llama a `subir(i - 1, W_{i+1} + p)` y al regresar se restaura `freq[p]` (retroceso).
- El caso base $i < 0$ indica que todas las varillas quedaron equilibradas y devuelve el peso total $W_1$.

> Los colgantes de peso $0$ ($0 \le p_c \le 100$) quedan contemplados naturalmente por las mismas ecuaciones sin casos especiales.

## Código

```python
from collections import Counter


def armar_movil(varillas, colgantes):
    V = len(varillas)
    C = len(colgantes)
    if V == 0 or C < 2:
        return None

    # 1. Prefijo máximo de varillas que no chocan
    k_max = 1
    for i in range(1, V):
        l1_ant, l2_ant = varillas[i - 1]
        l1_act, l2_act = varillas[i]

        if max(l1_act, l2_act) < l1_ant + l2_ant:
            k_max += 1
        else:
            break

    k_max = min(k_max, C - 1)
    freq = Counter(colgantes)
    pesos_distintos = sorted(freq.keys())

    def subir(i, peso_subcadena):
        if i < 0:
            return peso_subcadena

        l1, l2 = varillas[i]
        orientaciones = [(l1, l2)] if l1 == l2 else [(l1, l2), (l2, l1)]

        for a, b in orientaciones:
            if (peso_subcadena * a) % b != 0:
                continue

            p = (peso_subcadena * a) // b

            if freq[p] > 0:
                freq[p] -= 1
                total = subir(i - 1, peso_subcadena + p)
                freq[p] += 1

                if total is not None:
                    return total

        return None

    # 2. Probar k de mayor a menor para detenernos en la primera solución
    for k in range(k_max, 0, -1):
        l1, l2 = varillas[k - 1]
        for pa in pesos_distintos:
            if freq[pa] == 0 or (pa * l1) % l2 != 0:
                continue

            pb = (pa * l1) // l2
            necesarios = 2 if pb == pa else 1

            if freq[pb] >= necesarios:
                freq[pa] -= 1
                freq[pb] -= 1
                total = subir(k - 2, pa + pb)
                freq[pa] += 1
                freq[pb] += 1

                if total is not None:
                    return (k + 1, total)

    return None
```

## Traza de ejemplo

Sobre la instancia de [[armando_moviles]]:

- **Varillas:** $v_1 = (4, 2)$, $v_2 = (2, 5)$, $v_3 = (3, 2)$, $v_4 = (2, 5)$
- **Colgantes:** $\{6, 7, 9, 7, 4, 4\} \implies \text{freq} = \{4: 2, 6: 1, 7: 2, 9: 1\}$

En el preprocesamiento, $v_4$ choca con $v_3$ ($\max(2, 5) = 5 \ge 3 + 2$), por lo que $k_{\max} = \min(3, 6 - 1) = 3$. Se comienza con $k = 3$:

| Paso | Nivel / Varilla     | Orientación $(a, b)$ | Peso subcadena |             Peso requerido | Acción / Resultado                               |
| ---- | ------------------- | -------------------: | -------------: | -------------------------: | ------------------------------------------------ |
| 1    | Base $v_3 = (3, 2)$ |             $(3, 2)$ |              — | $p_a = 4 \implies p_b = 6$ | ✓ disponibles, $W_3 = 10$, rest $\{4, 7, 7, 9\}$ |
| 2    | `subir(v2, 10)`     |             $(2, 5)$ |           $10$ |  $p = 10 \times 2 / 5 = 4$ | ✓ disponible, $W_2 = 14$, rest $\{7, 7, 9\}$     |
| 3    | `subir(v1, 14)`     |             $(4, 2)$ |           $14$ | $p = 14 \times 4 / 2 = 28$ | ✗ **poda** (`28` no está en `freq`)              |
| 4    | `subir(v1, 14)`     |             $(2, 4)$ |           $14$ |  $p = 14 \times 2 / 4 = 7$ | ✓ disponible, $W_1 = 21$, rest $\{7, 9\}$        |
| 5    | `subir(-1, 21)`     |                    — |           $21$ |                          — | Caso base: retorna `(4, 21)`                     |

![Árbol de llamadas y podas de backtracking para k igual a 3](armando-moviles-backtracking-arbol.svg)

> La rama alternativa $(5, 2)$ en $v_2$ ni siquiera llega a explorarse porque el algoritmo retorna en cuanto encuentra la primera solución válida para $k = 3$.

## Complejidad

### Temporal

$O(V + C + U \cdot 2^{k_{\max}})$, acotado por $O(C \cdot 2^V)$, donde $U \le \min(C, 101)$ es la cantidad de pesos distintos:

- El preprocesamiento de choques y armado de `freq` toma $O(V + C)$.
- Para un $k$ fijo, se prueban a lo sumo $U$ elecciones en la varilla base $k$ (cada $p_a$ determina un único $p_b$) y, al subir por las $k - 1$ varillas restantes, cada nivel ramifica a lo sumo en $2$ orientaciones (ya que $p_{c_i}$ queda unívocamente determinado). Eso da $O(U \cdot 2^{k-1})$ por nivel $k$.
- Sumando desde $k = 1$ hasta $k_{\max}$: $\sum_{k=1}^{k_{\max}} U \cdot 2^{k-1} = O(U \cdot 2^{k_{\max}})$.

Con las restricciones del enunciado ($V \le 15$, $C \le 30$), el peor caso teórico es $30 \times 2^{14} \approx 4{,}9 \times 10^5$ operaciones, y en la práctica las podas por divisibilidad y disponibilidad reducen drásticamente el árbol explorado.

### Espacial

$O(V + U)$ (equivalente a $O(V + C)$): se almacenan las $V$ varillas, la tabla de frecuencias de hasta $U$ pesos distintos y la pila de recursión con profundidad máxima $k_{\max} \le V$.

## Cuándo usar esta técnica

### Favorable cuando

- Las restricciones del problema determinan unívocamente la elección en cada paso (aquí, $p_{c_i}$ se despeja por ecuación de equilibrio), logrando podas inmediatas y un factor de ramificación muy chico ($\le 2$).
- El tamaño de la cadena es pequeño ($V \le 15$).
- Alcanza con encontrar una única solución para el máximo $k$, lo que permite iterar $k$ en orden decreciente y cortar apenas se halla un móvil válido.

### Limitaciones

- La complejidad sigue siendo exponencial en $V$ en el peor caso. Si $V$ fuera mucho mayor (por ejemplo $V \ge 40$), el árbol de $2^V$ orientaciones dejaría de ser manejable sin técnicas adicionales como memorización sobre estados reducidos.
- Si la consigna pidiera desempatar maximizando o minimizando el peso total $W_1$, no se podría aplicar el corte temprano al primer éxito y habría que explorar todas las ramas válidas del $k$ máximo.

### Comparación con fuerza bruta

Una solución por [[armando_moviles-fuerza-bruta]] que prueba asignaciones arbitrarias de colgantes sobre las varillas debe explorar hasta $\frac{C!}{(C - k - 1)!} \cdot 2^{k-1}$ configuraciones, lo cual explota combinatoriamente incluso para $C = 30$ y $V = 15$. Al invertir el sentido de construcción (de abajo hacia arriba) y despejar el colgante necesario con backtracking y tabla de frecuencias, el factor factorial en $C$ se colapsa a un factor lineal $O(U) \le O(C)$.

## Referencias

- N/A
