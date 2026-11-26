---
title: 'OIA 2011 - Armando Móviles - Fuerza Bruta'
tags:
  - oia
  - solucion
---

## Técnicas utilizadas
Búsqueda por fuerza bruta exhaustiva sobre dos decisiones: el **lado del que cuelga** la varilla de abajo en cada varilla y la **asignación de colgantes** a cada posición (permutaciones). Para cada candidato se verifica el equilibrio de abajo hacia arriba con la ley de la palanca en $O(k)$. Además se calcula una sola vez el prefijo máximo de varillas sin choques, y se prueban las cantidades de varillas de mayor a menor para quedarse con la primera solución hallada.

## Idea de la solución
1. **Prefijo sin choques.** Como las varillas se usan en orden desde la primera, apenas una choca con la anterior ninguna posterior puede formar parte de la cadena. `k_maximo` recorre las varillas una sola vez y devuelve el mayor $k$ tal que, para todo $i \in \{2, \dots, k\}$, $\max(l1_i, l2_i) < l1_{i-1} + l2_{i-1}$.

2. **Probar $k$ de mayor a menor.** Se prueba $k = k_{max}, k_{max} - 1, \dots, 1$ (saltando los $k$ con $k + 1 > C$). La primera solución que aparece usa $k + 1$ colgantes, que es la cantidad máxima.

3. **Enumerar candidatos.** Para cada $k$:
   - `lado_cuelgue`: una tupla de $k - 1$ bits (`itertools.product([0, 1], repeat=k - 1)`) que indica, para cada varilla $i \in \{1, \dots, k - 1\}$, **de qué extremo cuelga la varilla de abajo**: `0` si cuelga del extremo de semilargo $l1_i$, `1` si cuelga del extremo de semilargo $l2_i$. El colgante $p_{c_i}$ va siempre en el extremo opuesto. La última varilla no necesita bit propio, ya que, de ambos extremos cuelgan colgantes, y las permutaciones ya prueban ambos órdenes.
   - `permutacion`: una permutación de $k + 1$ índices de colgantes (`itertools.permutations(range(c), k + 1)`). 

1. **Verificar de abajo hacia arriba.** Con la última varilla $(a, b)$ y colgantes $p_a$, $p_b$ se exige $a \cdot p_a = b \cdot p_b$ y se parte de $W = p_a + p_b$. Luego, para $i = k - 2, \dots, 0$, con la varilla $(l1, l2)$ y el colgante $p$:
   - si `lado_cuelgue[i] == 0` (la subcadena cuelga del extremo $l1$, el colgante del $l2$): $W \cdot l1 = p \cdot l2$
   - si `lado_cuelgue[i] == 1` (la subcadena cuelga del extremo $l2$, el colgante del $l1$): $W \cdot l2 = p \cdot l1$

   Si el equilibrio se cumple, $W = W + p$. Si falla en algún nivel, el candidato se descarta. Si llega hasta arriba, $W$ es el peso total.

## Código

```python
import itertools

def k_maximo(v, varillas):
    k = 1
    while k < v and max(varillas[k]) < sum(varillas[k - 1]):
        k += 1
    return k

def verificar(k, lado_cuelgue, varillas, pesos, permutacion):    
    a, b = varillas[k - 1]
    pa = pesos[permutacion[k - 1]]
    pb = pesos[permutacion[k]]
    if a * pa != b * pb:
        return None
    w = pa + pb

    for i in range(k - 2 , -1, -1): 
        l1, l2 = varillas[i]
        p = pesos[permutacion[i]]
        if lado_cuelgue[i] == 0:
            equilibrio = w * l1 == p * l2
        else:
            equilibrio = p * l1 == w * l2
        if not equilibrio:
            return None
        w += p
    return w

def armar_movil(v, c, varillas, pesos):
    for k in range(k_maximo(v, varillas), 0, -1):
        if k + 1 > c:
            continue

        for lado_cuelgue in itertools.product([0, 1], repeat=k - 1):
            for permutacion in itertools.permutations(range(c), k + 1):
                w = verificar(k, lado_cuelgue, varillas, pesos, permutacion)
                if w is not None:
                    return k + 1, w
    return 0, 0
```

## Traza de ejemplo

Instancia: $V = 4$, $C = 6$, varillas $(4,2), (2,5), (3,2), (2,5)$ y colgantes $\{6, 7, 9, 7, 4, 4\}$.

**Paso 1: prefijo sin choques.**

| $k$ | Varilla evaluada | $\max(l1, l2)$ | Largo de la anterior | ¿Choca? |
|-----|------------------|----------------|----------------------|---------|
| 1   | $(4, 2)$         | -              | -                    | No (cuelga del techo) |
| 2   | $(2, 5)$         | 5              | 6                    | No |
| 3   | $(3, 2)$         | 3              | 7                    | No |
| 4   | $(2, 5)$         | 5              | 5                    | Sí ($5 \ge 5$) |

Resultado: `k_maximo = 3`, así que se prueba primero $k = 3$ (4 colgantes).

**Paso 2: un candidato que sí cumple** para $k = 3$, con `lado_cuelgue = (0, 1)` y colgantes de pesos `(7, 4, 4, 6)` (es decir, `permutacion = (1, 4, 5, 0)`):

| Nivel | Varilla | Colgante $p$ | $W$ antes | Equilibrio | $W$ después |
|-------|---------|--------------|-----------|------------|-------------|
| Última | $(3, 2)$ | $p_a = 4$, $p_b = 6$ | - | $3 \cdot 4 = 2 \cdot 6 = 12$ ✓ | $10$ |
| $i = 2$ (lado 0: la subcadena cuelga del extremo de $2$) | $(2, 5)$ | $4$ | $10$ | $10 \cdot 2 = 4 \cdot 5 = 20$ ✓ | $14$ |
| $i = 1$ (lado 1: la subcadena cuelga del extremo de $2$) | $(4, 2)$ | $7$ | $14$ | $14 \cdot 2 = 7 \cdot 4 = 28$ ✓ | $21$ |

Resultado: `armar_movil` devuelve `(4, 21)`, es decir, 4 colgantes con peso total 21.

## Complejidad

### Temporal
Para un $k$ dado hay $2^{k-1}$ combinaciones de lado de cuelgue y $\frac{C!}{(C-k-1)!}$ permutaciones, y cada verificación cuesta $O(k)$:

$$
T(k) = O\left(2^{k-1} \cdot \frac{C!}{(C-k-1)!} \cdot k\right)
$$

En el peor caso (no existe ningún móvil válido) se prueban todos los $k$ desde $k_{max}$ hasta 1, y el término dominante es el del mayor $k$ probado. Con los límites del problema ($V = 15$, $C = 30$) el término dominante es del orden de $10^{24}$ candidatos, completamente inviable.

El cálculo de `k_maximo` es $O(V)$ y no influye.

### Espacial
$O(C)$ auxiliar. `itertools.product` y `itertools.permutations` son iteradores: generan cada candidato cuando el `for` lo requiere en lugar de almacenarlos todos, así que en memoria solo hay el candidato actual  y el estado interno del generador de permutaciones. El espacio no crece con la cantidad de candidatos; el límite de este algoritmo es el tiempo, no la memoria.

## Cuándo usar esta técnica

### Favorable cuando
- $V$ y $C$ son chicos (por ejemplo $C \le 7$).
- Se necesita un **verificador** simple de entender para comparar contra una solución más eficiente (backtracking) en casos chicos.
- Se quiere validar la modelización del problema antes de optimizar.

### Limitaciones
- No escala: el crecimiento factorial en $C$ y exponencial en $k$ lo hace inutilizable con los límites del enunciado.
- Hace trabajo redundante: `permutations(range(c), ...)` trabaja sobre índices, así que si hay pesos repetidos prueba permutaciones equivalentes una y otra vez.
- No aprovecha que, fijado el peso acumulado $W$ y el lado de cuelgue, el colgante necesario queda determinado por $p = \frac{W \cdot a}{b}$ 

## Comparación con la solución por backtracking
El backtracking([[armando_moviles-backtracking]]) elige solo el par de colgantes de la última varilla y luego sube nivel a nivel: para cada uno de los 2 lados de cuelgue calcula el colgante necesario $p = \frac{W \cdot a}{b}$, y poda si no es entero o no está disponible. Esto reduce el espacio de búsqueda a como mucho unos pocos cientos de pares iniciales por $2^{k-1}$ ramas con poda inmediata. La fuerza bruta es más fácil de escribir y verificar, pero inviable para $V$ y $C$ grandes.

## Referencias
- N/A
