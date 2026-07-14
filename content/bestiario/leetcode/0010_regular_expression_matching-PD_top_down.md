---
title: Leetcode0010 - Regular Expression Matching - PD Top-Down
tags:
  - b/leetcode
---
## Técnicas utilizadas
En su variante **top-down**, el problema se resuelve de forma recursiva, y cada resultado se guarda en una estructura de memoria (memo) para ser reutilizado si el mismo subproblema aparece nuevamente. Esto transforma una recursión exponencial en una solución polinomial.

## Idea de la solución
El problema consiste en determinar si una cadena `s` es completamente cubierta por un patrón `p` que puede contener dos caracteres especiales:
- `.` → coincide con cualquier carácter.
- `*` → indica cero o más repeticiones del carácter anterior.

La idea central es definir el problema en términos de dos índices: `index_s` (posición actual en `s`) e `index_p` (posición actual en `p`). Con esto se trata de responder *¿puede el sufijo* `s[index_s]` *ser emparejado por el subpatrón* `p[index_p]`*?*

Esto da lugar a los siguientes casos:

- **Caso base:** si `index_p` alcanzó el final del patrón, el resultado es verdadero solo si `index_s` también llegó al final de `s`.
- **Coincidencia simple:** el carácter actual del patrón coincide con el de `s` si `p[index_p] == .` o si ambos caracteres son iguales.
- **Caso con `*`:** si el siguiente carácter del patrón es `*`, hay dos opciones:
    - _**Cero ocurrencias:**_ saltar el par `x*` avanzando `index_p + 2`.
    - _**Una o más ocurrencias:**_ si hay coincidencia actual, avanzar `index_s` y mantener `index_p` para seguir consumiendo el mismo `x*`.
- **Caso sin `*`:** debe haber coincidencia actual y avanzar ambos índices.

Cada par `(index_s, index_p)` es un subproblema único. Se usa un diccionario `memo` para almacenar su resultado y no recalcularlo.

## Código
```python
MIN_LENGTH_STRING = 1
MAX_LENGTH_STRING = 20
MIN_LENGTH_PATRON = 1
MAX_LENGTH_PATRON = 20

def is_match(s: str, p: str) -> bool:
    if not (MIN_LENGTH_STRING <= len(s) <= MAX_LENGTH_STRING):
        raise ValueError("La cadena está fuera de rango")
    if not (MIN_LENGTH_PATRON <= len(p) <= MAX_LENGTH_PATRON):
        raise ValueError("El patrón está fuera de rango")

    memo: dict[tuple[int, int], bool] = {}

    def helper(index_s: int, index_p: int) -> bool:
        key = (index_s, index_p)

        if key in memo:
            return memo[key]

        if index_p == len(p):
            result = index_s == len(s)
            memo[key] = result
            return result

        first_match = (index_s < len(s) and
                       (p[index_p] == '.' or p[index_p] == s[index_s]))

        if index_p + 1 < len(p) and p[index_p + 1] == '*':
            result = (helper(index_s, index_p + 2)
                      or (first_match and helper(index_s + 1, index_p)))
        else:
            result = first_match and helper(index_s + 1, index_p + 1)

        memo[key] = result
        return result

    return helper(0, 0)
```
## Traza de ejemplo
Armemos un caso donde el resultado sea falso con la siguiente cadena (`s`) y patrón (`p`):
- `s`:  aab
- `p`: .\*c

| Llamada | index_s | index_p | p[index_p] | p[index_p + 1] | memo | Acción |
|:-|:-|:-|:-|:-|:-|:-|
| `helper(0,0)` | 0 | 0 | . | * | (0,0) = `helper(0,2)` OR (`first_match = true` AND `helper(1,0)`) | `.` coincide con `a` y el siguiente es `*`→ se consume **a** y memo depende de las siguiente llamadas.|
| `helper(0,2)` | 0 | 2 | c | "" | (0,2) = `first_match = false` | `b` no coincide con `a` y el siguiente no es `*`→ se retorna `memo[key=(0,0)] = false`.|
| `helper(1,0)` | 1 | 0 | . | * | (1,0) = `helper(1,2)` OR (`first_match = true` AND `helper(2,0)`) | `.` coincide con `a` y el siguiente es `*`→ se consume **a** y memo depende de las siguiente llamadas. |
| `helper(1,2)` | 1 | 2 | c | "" | (1,2) = `first_match = false` | `b` no coincide con `a` y el siguiente no es `*`→ se retorna `memo[key=(1,2)] = false`. |
| `helper(2,0)` | 2 | 0 | . | * | (2,0) = `helper(2,2)` OR (`first_match = true` AND `helper(3,0)`) | `.` coincide con `b` y el siguiente es `*`→ se consume **b** y memo depende de las siguiente llamadas. |
| `helper(2,2)` | 2 | 2 | c | "" | (2,2) = `first_match = false` | `b` no coincide con `c` y el siguiente no es `*`→ se retorna `memo[key=(2,2)] = false`. |
| `helper(3,0)` | 3 | 0 | . | * | (3,0) = `helper(3,2)` | `index_s == s.lenght()` y el siguiente es `*` → se setea `first_match = false` porque se consumió por completo `s` y queda `p` por recorrer y memo depende de las siguientes llamadas. |
| `helper(3,2)` | 3 | 2 | c | "" | (3,2) = `first_match = false` | `index_s == s.lenght()` → se consumió por completo `s` y queda `p`. |

### Estado de memo
```python
memo = {
    (0, 2): False,
    (1, 2): False,
    (2, 2): False,
    (3, 2): False,
    (3, 0): False,
    (2, 0): False,
    (1, 0): False,
    (0, 0): False,
}
```

## Complejidad
### Temporal
Obtenemos una complejidad $O(m \times n)$, siendo `m = len(s)` y `n = len(p)`. Los posibles estados del subproblema son todos los pares `(index_s, index_p)`, con $index\_s \in [0, m] \land index\_p \in [0, n]$, lo que da a lo sumo $(m+1) \times (n+1)$ subproblemas.  
Gracias a la memoización, cada uno se calcula exactamente una vez, y el trabajo por subproblema es $O(1)$.

### Espacial
El diccionario `memo` almacena como máximo $(m + 1) \times (n + 1)$ entradas. A esto se suma el espacio de la [pila](../../grimorio/data-structures/stack.md) de recursión, que en el peor caso tiene profundidad $O(m + n)$ cuando no hay `*` y se avanza un índice por llamada. 

Dado $O(m + n) + O(m \times n)$ con $n, m \ge 1$, se cumple que $m + n \le 2mn$, lo que lleva a que $O(m + n) \subseteq O(m \times n)$. Entonces, podemos concluir que la complejidad espacial dominante es $O(m \times n)$.

## Cuándo usar esta técnica
### Favorable cuando
- El problema se construye en base a subestructuras óptimas y subproblemas superpuestos, lo que lleva a que la programación dinámica sea viable y efectiva.
- Cuando la estructura recursiva del problema es natural e intuitiva, y se prefiere no derivar explícitamente el orden de llenado de una tabla. Si primero se resuelve con backtracking, suele salir de forma natural esta implementación.
- Cuando no todos los subproblemas serán necesariamente evaluados. La memoización solo computa los estados alcanzados por la recursión, lo que puede ser una ventaja si el espacio de estados es disperso.

### Limitaciones
- La recursión implica overhead de llamadas a función y uso de [pila](../../grimorio/data-structures/stack.md). En lenguajes sin optimización de tail-call (como Python), instancias muy grandes pueden provocar `RecursionError`.
- El acceso al diccionario `memo` tiene un costo constante pero no despreciable frente a un acceso directo a una tabla (array 2D) como en el enfoque bottom-up.

## Comparaciones
### Solución buttom-up
El enfoque top-down, que es el desarrollado en este trabajo, parte de la pregunta original `helper(0, 0)` y se apoya en la recursión para descomponerla en subproblemas más pequeños, memoizando cada resultado en un diccionario a medida que se resuelve por primera vez. Solo se calculan los estados `(i, j)` que efectivamente se necesitan para responder la pregunta inicial. 

El enfoque bottom-up, en cambio, invierte el orden de razonamiente ya que, en lugar de partir de la pregunta y descender hacia los casos base, parte de los casos base (`dp(m, n) = True`, y en general la fila `i = m`) y construye la tabla iterativamente. Esto exige que el orden de llenado de la tabla respete las dependencias de la recurrencia explícita (por ejemplo, llenar de derecha a izquierda y de abajo hacia arriba, ya que `dp(i,j)` depende de `dp(i+1,j)`, `dp(i,j+2)` y `dp(i+1,j+1)`), algo que en el top-down se resuelve automáticamente gracias a la [pila](../../grimorio/data-structures/stack.md) de llamadas.

En cuanto a la complejidad temporal, ambas soluciones son asintóticamente equivalentes: $O(m \times n)$, donde $m = |s| \land n = |p|$. Esto se debe a que se realiza de todas maneras el cálculo del conjunto de pares `(i, j)` con $0 \le i \le m \land 0 \le j \le n$. Sin embargo, en la práctica el **bottom-up** suele ejecutarse más rápido por un factor constante, ya que evita el overhead de las llamadas a función recursivas y el costo de hashing del diccionario memo.

Para la complejidad espacial, sigue siendo la misma $O(m \times n)$ ya que ambas pueden almacenar en el peor caso $(m + 1) \times (n + 1)$ resultados. En top-down se almacenan menos en el caso promedio, ya que se usa un diccionario. Caso contrario en buttom-up debido a que se crea una matriz de tamaño $(m + 1) \times (n + 1)$

### Solución backtracking
Ambas soluciones comparten exactamente la misma estructura recursiva, descomponiendo el problema según el par `(index_s, index_p)` y ramificando según si hay un `*` después del carácter actual del patrón, pero el backtracking puro no recuerda resultados previos y recalcula desde cero cualquier subproblema al que llegue por una rama distinta, mientras que la versión top-down agrega una tabla `memo` que intercepta cada llamada y devuelve en $O(1)$ el valor ya resuelto. Esta única diferencia tiene un impacto enorme en la complejidad temporal, ya que el backtracking puede volverse exponencial en el peor caso debido a las bifurcaciones que introduce cada `*`, mientras que la memoización garantiza que cada estado se calcule una sola vez, acotando el tiempo a $O(m \times n)$ polinomial, a cambio de un costo adicional en espacio (de $O(m + n)$ a $O(m \times n)$) por tener que almacenar los resultados intermedios en el diccionario. Esto se resume en un trade-off de espacio por tiempo que es precisamente lo que distingue a la programación dinámica del backtracking simple.
