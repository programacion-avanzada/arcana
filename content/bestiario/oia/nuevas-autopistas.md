---
title: 'Nuevas Autopistas - OIA 2018'
tags:
  - oia
  - solucion
---

## Enunciado

El gobierno de la nación está planeando renovar el sistema de autopistas. Tenemos $N$ ciudades y $N + 1$ autopistas distintas que podemos construir. Cada una de las autopistas tiene un costo para construirse, y conecta en forma directa dos ciudades diferentes. Es posible llegar desde cualquier ciudad a cualquier otra utilizando solo autopistas de la lista de posibles.

El ministro de transporte eligió tres presupuestos objetivos ($F_1, F_2, F_3$) y desea saber, para cada uno de ellos de manera independiente, si es posible descartar algunas autopistas de la lista original de modo que:
1. Las autopistas restantes sigan manteniendo comunicadas a todas las ciudades entre sí.
2. La suma de los costos de las autopistas que sí se construyen sea exactamente igual al número $F$ elegido.

En caso afirmativo, además de indicar que es posible, se debe informar cuántas y cuáles autopistas **no** se construirán.

## Intuición

A primera vista podría parecer un problema de *Subset Sum* (encontrar un subconjunto de autopistas que sume $F$), el cual es computacionalmente costoso en el caso general, combinado además con una restricción global de conectividad sobre grafos. Sin embargo, el problema se vuelve sumamente rico —y resoluble de forma eficiente— al observar la relación entre la cantidad de ciudades y de autopistas:

* Para mantener conectadas $N$ ciudades se necesitan como mínimo $N - 1$ autopistas (un árbol generador). Como disponemos de $N + 1$ autopistas en total, a lo sumo podemos descartar $0$, $1$ o $2$ autopistas. Cualquier eliminación de $3$ o más autopistas desconectará inevitablemente el país.
* No cualquier autopista es descartable, aquellas autopistas que actúan como *puentes* (único nexo hacia una ciudad o región) no pueden eliminarse nunca.
* Dos autopistas pueden pertenecer a ciclos (y por ende ser eliminables por separado), pero si ambas forman parte exactamente del mismo tramo sin rutas alternativas, quitarlas juntas partirá el grafo en dos componentes desconectados.

## Definición formal

### Entrada
* Una primera línea con un entero $N$: la cantidad de ciudades, numeradas de $1$ a $N$.
* $N + 1$ líneas siguientes, cada una con tres enteros $A, B, C$, que representan una autopista bidireccional entre las ciudades $A$ y $B$ ($A \neq B$) con costo de construcción $C$. Con la totalidad de las $N + 1$ autopistas el grafo es conexo.
* Una última línea con tres enteros $F_1, F_2, F_3$: los tres costos totales deseados por el ministro (consultas independientes sobre el mismo grafo inicial).

### Restricciones
* $3 \le N \le 2.000$
* $1 \le A, B \le N$ (con $A \neq B$)
* $1 \le C \le 100.000$
* $2 \le F_1, F_2, F_3 \le 100.000.000$

### Salida
Para cada valor $F \in \{F_1, F_2, F_3\}$, en orden:
* Imprimir una línea con `SI` si existe un subconjunto de autopistas que mantenga todas las ciudades conectadas y cuyos costos sumen exactamente $F$, o `NO` en caso contrario.
* Si se imprimió `SI`:
  * Imprimir una línea con un entero $K$ ($0 \le K \le 2$) indicando la cantidad de autopistas que **no** serán construidas.
  * Imprimir $K$ líneas (ninguna si $K = 0$), cada una con dos enteros `A B` separados por un espacio, identificando los extremos de cada autopista descartada (es indistinto imprimir `A B` o `B A`). Si existen múltiples combinaciones válidas, cualquiera de ellas es aceptada.
 

## Ejemplo concreto


![[GrafoEjemploAutopistas.svg]]

### Entrada
```text
6
1 2 1
2 3 2
3 4 3
4 2 4
4 5 5
3 6 6
1 5 7
21 22 30
```

### Resolución paso a paso a mano
 Primero calculamos el costo total si construyéramos las $7$ autopistas:
$$S = 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28$$

Analizamos la estructura de la red de $6$ ciudades:
* La autopista `(3, 6)` de costo $6$ es el único acceso a la ciudad $6$ (es un puente), por lo que jamás puede eliminarse.
* Entre las ciudades $2$ y $4$ convergen tres rutas alternativas sin aristas en común:
  * **Ruta 1:** la autopista directa `(4, 2)` (costo $4$).
  * **Ruta 2:** el paso por la ciudad $3$, formado por `(2, 3)` (costo $2$) y `(3, 4)` (costo $3$).
  * **Ruta 3:** el arco exterior por las ciudades $1$ y $5$, formado por `(1, 2)` (costo $1$), `(1, 5)` (costo $7$) y `(4, 5)` (costo $5$).
* Para no desconectar estas ciudades, podemos quitar $1$ autopista de cualquiera de las tres rutas, o bien $2$ autopistas **siempre que pertenezcan a rutas distintas**.

Evaluamos cada presupuesto $F$ buscando descartar autopistas que sumen el excedente $D = S - F = 28 - F$:

1. **Para $F_1 = 21$:** necesitamos recortar $D = 28 - 21 = 7$.
   * La autopista `(1, 5)` cuesta exactamente $7$ y pertenece a la Ruta 3 (no es puente). Al quitarla ($K = 1$), las $6$ autopistas restantes conectan todas las ciudades y suman $21$. *(Nota: también sería válido quitar $K = 2$ autopistas de rutas distintas que sumen $7$, como `(2, 3)` de costo $2$ y `(4, 5)` de costo $5$).*
2. **Para $F_2 = 22$:** necesitamos recortar $D = 28 - 22 = 6$.
   * Con $K = 1$: la única autopista de costo $6$ es `(3, 6)`, pero es puente y aislaría a la ciudad $6$. No sirve.
   * Con $K = 2$: buscamos dos autopistas de rutas distintas que sumen $6$. Elegimos `(2, 3)` (costo $2$, Ruta 2) y `(4, 2)` (costo $4$, Ruta 1). Suman $2 + 4 = 6$ y las $5$ autopistas restantes forman un árbol que conecta las $6$ ciudades con costo $22$.
3. **Para $F_3 = 30$:** necesitamos recortar $D = 28 - 30 = -2$.
   * Como todos los costos son positivos y el máximo alcanzable construyendo todo es $28$, es imposible llegar a $30$.

### Salida correspondiente
```text
SI
1
1 5
SI
2
2 3
4 2
NO
```


## Por dónde empezar
1. **Invertir el problema:** en lugar de elegir $N - 1$, $N$ o $N + 1$ autopistas que sumen $F$, calcular la suma total $S$ de todas las autopistas y buscar eliminar a lo sumo $2$ autopistas que sumen exactamente el excedente $D = S - F$.
2. **Explorar el grafo con DFS para entender sus ciclos:** dado que un grafo conexo con $N$ vértices y $N + 1$ aristas tiene exactamente $2$ aristas de retorno (*back-edges*) sobre cualquier árbol DFS, un recorrido en profundidad permite distinguir qué aristas son puentes (no pertenecen a ningún ciclo) y cuáles pertenecen al primer ciclo, al segundo ciclo, o a la intersección de ambos.
3. **Caracterizar cuándo un par es válido:** verificar cómo esa clasificación en hasta tres grupos de aristas no-puente determina de inmediato si dos autopistas pueden eliminarse juntas sin necesidad de reconstruir ni recorrer el grafo por cada par candidato.
4. **Optimizar la búsqueda de sumas:** una vez separadas las autopistas eliminables por grupo, ordenarlas por costo permite reemplazar la prueba exhaustiva de pares por búsqueda binaria o técnica de dos punteros.


## Soluciones disponibles

- [[nuevas-autopistas-fuerza-bruta]]
- [[nuevas-autopistas-backtracking]]
- [[nuevas-autopistas-recursion]]