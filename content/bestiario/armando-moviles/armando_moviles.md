---
title: "Armando Móviles"
---

## Nombre y enunciado

Un artesano construye móviles infantiles usando tres elementos: **varillas**, **colgantes** e **hilo**. Cada varilla tiene dos enganches en sus extremos y un punto intermedio de cuelgue que la divide en dos semilargos.

Los móviles que fabrica tienen forma de **cadena**: se utilizan las primeras $k$ varillas en el orden dado ($k \ge 1$). La varilla $1$ cuelga desde el techo por su punto intermedio, y cada varilla $i$ ($2 \le i \le k$) cuelga por su punto intermedio desde uno de los extremos de la varilla $i - 1$. Del otro extremo de cada varilla $1, \dots, k - 1$ cuelga exactamente un colgante, mientras que de la última varilla $k$ cuelgan dos colgantes, uno por cada extremo. Además, cada varilla puede orientarse con cualquiera de sus dos extremos hacia la cadena.

Para que un móvil quede bien armado debe cumplir dos requisitos:

- **Equilibrio:** en todas las varillas, el peso que cuelga de cada extremo debe ser inversamente proporcional a la distancia de ese extremo al punto de cuelgue (ley de la palanca).
- **Sin choques:** ninguna varilla puede chocar con el hilo que sostiene a su vecina.

**Problema:** Dados los semilargos de las varillas (en orden) y los pesos de los colgantes disponibles, determinar cuál es el móvil válido con la mayor cantidad posible de colgantes e informar esa cantidad junto con el peso total de los colgantes utilizados (o indicar que no se puede construir ninguno). Si hubiera más de una alternativa con la misma cantidad máxima de colgantes, cualquiera de ellas es válida.

*Certamen Nacional OIA 2011 — Nivel 3, Problema 2 (`moviles`).*

---

## Intuición

A primera vista parece un problema de asignación simple, pero combina restricciones geométricas, físicas y combinatorias que se acoplan entre sí:

- **Dos orientaciones por varilla:** cada varilla $(l1_i, l2_i)$ puede colgarse en dos sentidos distintos, cambiando la relación de brazos entre el colgante y la subcadena inferior.
- **Pesos acoplados de abajo hacia arriba:** el peso que sostiene un extremo de la varilla $i$ no es solo un colgante, sino la suma de todos los colgantes que cuelgan en la subcadena formada por las varillas $i + 1, \dots, k$. Una elección válida en el fondo condiciona todas las ecuaciones de equilibrio superiores.
- **Límite geométrico independiente de los pesos:** como las varillas deben usarse en orden estricto desde la primera, en cuanto una varilla choca con la anterior ninguna varilla posterior puede formar parte de la cadena.
- **Colgantes sin reposición:** los pesos disponibles forman un multiconjunto finito. Usar un peso para equilibrar una varilla inferior puede dejar sin opciones a una varilla superior.

---

## Definición formal

**Entrada (`moviles.in`):**

- Primera línea: dos enteros $V$ ($1 \le V \le 15$), cantidad de varillas, y $C$ ($0 \le C \le 30$), cantidad de colgantes.
- Siguientes $V$ líneas: dos enteros $l1_v, l2_v$ ($1 \le l1_v, l2_v \le 100$) que indican los semilargos de cada varilla (distancia desde cada extremo al punto intermedio de cuelgue).
- Siguientes $C$ líneas: un entero $p_c$ ($0 \le p_c \le 100$) con el peso de cada colgante.

**Salida (`moviles.out`):** una única línea con:

- `"no se puede"` si no existe ningún móvil válido con los elementos disponibles.
- Dos enteros separados por un espacio (la cantidad máxima de colgantes utilizados ($k + 1$) y la suma de sus pesos).

**Condiciones matemáticas explícitas:**

El peso de los hilos y de las varillas es despreciable.

Un móvil válido con las primeras $k$ varillas ($1 \le k \le V$) utiliza exactamente $k + 1$ colgantes distintos y satisface:

1. **Condición de no choque:** para toda varilla $i \in \{2, \dots, k\}$, su semilargo mayor debe ser estrictamente menor que el largo total de la varilla de la que cuelga ($$\max(l1_i, l2_i) < l1_{i-1} + l2_{i-1}$$).

2. **Condición de equilibrio:** para cada varilla $i \in \{1, \dots, k\}$ orientada como $(a_i, b_i) \in \{(l1_i, l2_i), (l2_i, l1_i)\}$, los momentos de ambos extremos deben coincidir:
   - En la última varilla $k$ (con colgantes de pesos $p_{c_a}$ y $p_{c_b}$): $$p_{c_a} \cdot a_k = p_{c_b} \cdot b_k, W_k = p_{c_a} + p_{c_b}$$

   - En cada varilla superior $i \in \{1, \dots, k - 1\}$ (con la subcadena $i + 1$ en el brazo $a_i$ y un colgante $p_{c_i}$ en el brazo $b_i$): $$W_{i+1} \cdot a_i = p_{c_i} \cdot b_i, W_i = W_{i+1} + p_{c_i}$$

El objetivo es maximizar $k + 1$ y reportar $k + 1$ junto con $W_1$.

---

## Ejemplo concreto

Consideremos la siguiente instancia con $V = 4$ varillas y $C = 6$ colgantes:

- **Varillas:** $v_1 = (4, 2)$, $v_2 = (2, 5)$, $v_3 = (3, 2)$, $v_4 = (2, 5)$
- **Colgantes disponibles:** $\{6, 7, 9, 7, 4, 4\}$

**1. Verificación de choques:**

| Varilla | Semilargos $(l1, l2)$ | Largo total | $\max(l1, l2)$ | ¿Puede colgar de la anterior? |
|---|---:|---:|---:|---|
| $v_1$ | $(4, 2)$ | $6$ | $4$ | Sí (cuelga del techo) |
| $v_2$ | $(2, 5)$ | $7$ | $5$ | Sí ($5 < 6$) |
| $v_3$ | $(3, 2)$ | $5$ | $3$ | Sí ($3 < 7$) |
| $v_4$ | $(2, 5)$ | $7$ | $5$ | No ($5 \ge 5$, choca con $v_3$) |

Como $v_4$ choca con $v_3$, a lo sumo pueden usarse las primeras $k = 3$ varillas ($4$ colgantes).

**2. Armado equilibrado de abajo hacia arriba ($k = 3$):**

- **Varilla $v_3 = (3, 2)$:** colocamos el colgante `4` en el brazo de longitud $3$ y el colgante `6` en el brazo de longitud $2$.
  - Equilibrio: $4 \times 3 = 6 \times 2 = 12$.
  - Peso acumulado: $W_3 = 4 + 6 = 10$. Colgantes restantes: $\{4, 7, 7, 9\}$.
- **Varilla $v_2 = (2, 5)$:** colgamos la subcadena $v_3$ (peso $10$) en el brazo de longitud $2$ y el colgante `4` en el brazo de longitud $5$.
  - Equilibrio: $10 \times 2 = 4 \times 5 = 20$.
  - Peso acumulado: $W_2 = 10 + 4 = 14$. Colgantes restantes: $\{7, 7, 9\}$.
- **Varilla $v_1 = (4, 2)$:** colgamos la subcadena $v_2$ (peso $14$) en el brazo de longitud $2$ y el colgante `7` en el brazo de longitud $4$.
  - Equilibrio: $14 \times 2 = 7 \times 4 = 28$.
  - Peso total: $W_1 = 14 + 7 = 21$.

**Salida esperada:**

```text
4 21
```

![Móvil equilibrado con 3 varillas y 4 colgantes](armando-moviles-ejemplo.svg)

---

## Por dónde empezar

Antes de explorar combinaciones de pesos, conviene calcular en tiempo lineal el prefijo máximo $k_{\max}$ de varillas que cumplen la condición de no choque (y además notar que se necesitan al menos $k + 1 \le C$ colgantes).

Una primera aproximación razonable es **fuerza bruta**: para cada cantidad de varillas $k$ válida, probar las posibles asignaciones de colgantes y orientaciones de las varillas hasta verificar si alguna cumple el equilibrio en todos los niveles.

El siguiente paso es aprovechar la estructura en cadena mediante **backtracking** de abajo hacia arriba (desde la varilla $k$ hacia la varilla $1$). Una vez elegido el par de colgantes para la última varilla $k$, el peso acumulado $W_{i+1}$ queda fijado al subir a cada varilla $i$: para cada una de sus dos orientaciones $(a_i, b_i)$, el peso del colgante necesario queda determinado de forma única por:

$$p_{c_i} = \frac{W_{i+1} \cdot a_i}{b_i}$$

Si ese valor no es entero o no está disponible entre los colgantes restantes, se puede podar la rama de inmediato. Además, probando valores de $k$ de mayor a menor ($k_{\max}, k_{\max} - 1, \dots, 1$), la primera solución encontrada garantiza la cantidad máxima de colgantes.

---

## Soluciones disponibles

- [[armando_moviles-backtracking]]
- [[armando_moviles-fuerza-bruta]]
