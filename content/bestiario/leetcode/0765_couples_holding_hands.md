---
title: Leetcode0765 - Couples Holding Hands
tags:
  - b/leetcode
---
## Nombre y enunciado

En la ceremonia de graduación de estudiantes de la UNLaM, un grupo de amigos decide sacarse una foto para recordar el momento. Como todos tienen pareja, quieren aparecer en la fotografía junto a su par.

Sin embargo, al momento de organizarse para la foto hubo una gran confusión y todos se ubicaron al azar en una única fila. Como consecuencia, muchas parejas quedaron separadas por otros estudiantes.

Antes de tomar la fotografía, el fotógrafo puede pedir que dos personas intercambien sus lugares para reorganizar la fila. Como el acto está por continuar, busca realizar la menor cantidad posible de intercambios para que cada estudiante quede al lado de su pareja.

> Visualización del problema:

![Visualización del problema](765_couples_holding_hands-ejemplo.svg)

[Problema original](https://leetcode.com/problems/couples-holding-hands/description/)

---

## Intuición

Aunque el objetivo parece un simple problema de reordenamiento, encontrar la menor cantidad de intercambios no es tan directo como parece. A medida que aumenta la cantidad de personas, el número de posibles reorganizaciones crece muy rápido, lo que obliga a pensar con cuidado qué información realmente hace falta explorar para resolverlo.

Además, una decisión que parece correcta al principio puede provocar intercambios innecesarios más adelante, lo que nos obliga a plantearnos una pregunta central: ¿hace falta considerar todas las combinaciones posibles, o existe una forma de decidir cada intercambio sin arrepentirse después?

---


## Definición formal

**Entrada:**

- Un array $row$ de longitud $m = 2n$, donde `row[i]` representa la persona sentada en el asiento $i$.
- $n$ representa la cantidad de parejas.
- $m$ representa la cantidad total de personas.
- Las personas están numeradas de $0$ a $m - 1$.
- Cada pareja está formada por las personas $(0,1)$, $(2,3)$, $(4,5)$, ..., $(m-2, m-1)$.

**Salida:** un número entero que representa la mínima cantidad de intercambios necesarios para que todas las parejas queden sentadas en posiciones consecutivas.

**Restricciones:**

- $2 \leq n \leq 30$. Esta restricción proviene del enunciado original del problema. Indica que la   entrada siempre contendrá entre 2 y 30 parejas, es decir, entre 4 y 60 personas. El límite inferior evita el caso trivial de una única pareja, mientras que el límite superior define el tamaño máximo de la entrada.
- $m = 2n$
- $0 \leq row[i] < m$
- $m == row.length$
- Cada persona aparece exactamente una vez en el arreglo.
- En un intercambio pueden permutarse las personas ubicadas en cualquier par de asientos.

---

## Ejemplo concreto

Consideremos una fila de **4 parejas** ($n=4$):

```text
row = [0, 2, 1, 3, 5, 6, 4, 7]
```

Las parejas son: $(0,1)$, $(2,3)$, $(4,5)$ y $(6,7)$.

1. **Estado inicial:**

   Analizamos si cada persona está ubicada junto a su pareja.

   * La persona `0` está junto a `2`, pero su pareja es `1` $\rightarrow$ **No está con su pareja.**
   * La persona `2` está junto a `0`, pero su pareja es `3` $\rightarrow$ **No está con su pareja.**
   * La persona `4` está junto a `7`, pero su pareja es `5` $\rightarrow$ **No está con su pareja.**
   * La persona `6` está junto a `5`, pero su pareja es `7` $\rightarrow$ **No está con su pareja.**

2. **Primer intercambio:**

   Comenzamos por la primera posición de la fila.

   * Encontramos a la persona `0`.
   * Su pareja es `1`.
   * Buscamos al `1`, que se encuentra en la posición `2`.
   * La persona ubicada junto a `0` se encuentra en la posición `1`, por lo que allí debe quedar su pareja.
   * Intercambiamos las personas ubicadas en las posiciones `1` y `2`, logrando que la pareja `(0,1)` quede junta.

   La fila queda:

   ```text
   [0, 1, 2, 3, 5, 6, 4, 7]
   ```

   Ahora la pareja `(0,1)` quedó junta. Además, como consecuencia del intercambio, la pareja `(2,3)` también quedó correctamente ubicada.

3. **Segundo intercambio:**

   Continuamos recorriendo la fila hasta encontrar la siguiente persona que aún no está junto a su pareja.

   * Encontramos a la persona `5`.
   * Su pareja es `4`.
   * Buscamos al `4`, que se encuentra en la posición `6`.
   * La persona ubicada junto a `5` se encuentra en la posición `5`, por lo que allí debe quedar su pareja.
   * Intercambiamos las personas ubicadas en las posiciones `5` y `6`, logrando que la pareja `(4,5)` quede junta.

   La fila queda:

   ```text
   [0, 1, 2, 3, 5, 4, 6, 7]
   ```

   Ahora la pareja `(4,5)` también quedó junta. Además, como consecuencia del intercambio, la pareja `(6,7)` también quedó correctamente ubicada.

4. **Resultado final:**

   Todas las parejas quedaron ubicadas una al lado de la otra.

**Resultado:** Se realizaron **2 intercambios**, la cantidad mínima necesaria para que todas las parejas queden juntas.

---

## Por dónde empezar

Un primer enfoque es la ***fuerza bruta***: probar todas las combinaciones de intercambios posibles y quedarse con la de menor cantidad de swaps. Al evaluar todas las alternativas, garantiza encontrar el óptimo, pero su costo crece exponencialmente, por lo que solo es viable para validar instancias pequeñas.

Una mejora consiste en explorar ese mismo espacio de búsqueda, pero descartando de forma anticipada las ramas que ya no puedan superar la mejor solución encontrada. Esa idea da lugar a una estrategia de ***branch and bound***, que sigue garantizando optimalidad pero reduce parte del trabajo redundante.

El paso final es notar que no hace falta explorar combinaciones: alcanza con recorrer la fila banco por banco y corregir cada pareja mal formada trayendo directamente al compañero correcto. Esa decisión local siempre es segura, lo que habilita una estrategia ***greedy*** que resuelve el problema en una sola pasada.

---

## Soluciones disponibles

- [[0765_couples_holding_hands-fuerza-bruta]]
- [[0765_couples_holding_hands-branch-and-bound]]
- [[0765_couples_holding_hands-greedy]]
