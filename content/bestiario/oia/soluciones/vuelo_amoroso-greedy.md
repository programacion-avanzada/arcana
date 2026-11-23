---
title: 'OIA - Vuelo amoroso - Greedy'
tags:
  - oia
  - solucion
---

Solución Avida(Greedy) para [[vuelo_amoroso]].

## Técnicas utilizadas

**Greedy:** en cada paso se toma la decisión que parece mejor en ese momento (la que deja al pajarito más cerca de la pájara) y nunca se reconsidera. No enumera candidatos ni guarda subproblemas: recorre las mediciones una sola vez. Es muy rápido y usa muy poca memoria, pero no garantiza el óptimo.

## Idea de la solución

En cada medición el pajarito tiene exactamente dos opciones: subir ($+1$) o bajar ($-1$). Contamos con la altura de la pájara y la del pajarito en la medición. Greedy elige el movimiento que minimiza la distancia de esta medición

Para cada medicion:

1. Si la pájara está más alta que el pajarito, el pajarito sube.
2. Si la pájara está más baja, el pajarito baja.
3. Si están a la misma altura, da lo mismo: cualquiera de los dos movimientos deja la distancia en 1, y se elige uno por una regla de desempate.
4. Se suma $|p_t - a_t|$ al total y se pasa a la siguiente medición.

Greedy solo usa lo que ya vio que es la altura actual del pajarito y la medición que acaba de llegar. Por eso **funciona muy bien si los datos llegan de a uno (tiempo real)**, a diferencia de fuerza bruta y programación dinámica no pueden hacer, porque necesitan conocer todo el vuelo.

Las alturas de la pájara se leen de a una, y el recorrido puede escribirse a medida que se genera, sin guardar nada más que la altura actual y la distancia total.

## Código

```text
ALGORITMO VueloGreedy(pajara)
    n ← pajara.longitud
    altura ← 0
    distTotal ← 0
    recorrido ← nuevo arreglo de tamaño n

    PARA t DESDE 0 HASTA n-1 HACER
        SI pajara[t] > altura ENTONCES
            movimiento ← +1             // la pájara está más alta: sube
        SINO SI pajara[t] < altura ENTONCES
            movimiento ← -1             // la pájara está más baja: baja
        SINO
            movimiento ← +1             // empate: regla fija (subir)
        altura ← altura + movimiento
        distTotal ← distTotal + |altura - pajara[t]|
        recorrido[t] ← altura

    RETORNAR distTotal, recorrido
```

El desempate del pseudocódigo es fijo (subir) para que el algoritmo sea determinista, aunque otra opcion es que sea random(1,-1) para estabilizar la distribucion.

## Traza de ejemplo

**Entrada:** `3 3 3 6 9 12 9 9 6 3 3 3 3` ($n = 13$).

Ambos bichitos arrancan en altura 0. En cada fila se ve la decisión de Greedy y cómo crece la distancia acumulada:

![Comparación del recorrido greedy y el óptimo](vuelo-amoroso-greedy-recorrido.svg)

| Medición |  Pájara | Pajarito | Decisión | Pajarito Despues | Distancia | Dist Acumulada |
|----------|---------|----------|----------|------------------|-----------|----------------|
| 1        | 3       | 0        | sube     | 1                | 2         | 2              |
| 2        | 3       | 1        | sube     | 2                | 1         | 3              |
| 3        | 3       | 2        | sube     | 3                | 0         | 3              |
| 4        | 6       | 3        | sube     | 4                | 2         | 5              |
| 5        | 9       | 4        | sube     | 5                | 4         | 9              |
| 6        | 12      | 5        | sube     | 6                | 6         | 15             |
| 7        | 9       | 6        | sube     | 7                | 2         | 17             |
| 8        | 9       | 7        | sube     | 8                | 1         | 18             |
| 9        | 6       | 8        | baja     | 7                | 1         | 19             |
| 10       | 3       | 7        | baja     | 6                | 3         | 22             |
| 11       | 3       | 6        | baja     | 5                | 2         | 24             |
| 12       | 3       | 5        | baja     | 4                | 1         | 25             |
| 13       | 3       | 4        | baja     | 3                | 0         | 25             |

Resumen de la ejecución:

| Concepto               | Cantidad |
|------------------------|----------|
| Mediciones procesadas  | 13       |
| Decisiones tomadas     | 13       |
| Empates a resolver     | 0        |
| Vuelos construidos     | 1        |

**Resultado:** `25`, con el recorrido `1 2 3 4 5 6 7 8 7 6 5 4 3`. El óptimo es `23`, con el recorrido `1 2 3 4 5 6 7 6 5 4 3 4 3`, así que en este ejemplo Greedy queda a 2 del óptimo (~9% más).

## Complejidad

### Temporal

$O(n)$: una sola pasada, con trabajo constante por medición (dos comparaciones, una suma y una escritura). Nunca vuelve atrás ni compara contra otros candidatos.

Para dimensionarlo: al multiplicar $n$ por 10, el tiempo se multiplica exactamente por 10.

### Espacial

$O(1)$: tecnicamente solo se guardan la altura actual y el total. Si además se quiere conservar el recorrido completo, ese arreglo ocupa $O(n)$, pero se puede escribir a medida que se genera, sin guardarlo.

## Cuándo usar esta técnica

### Favorable cuando

- Los datos llegan de a uno y hay que decidir en el momento (sistemas en tiempo real). Es la única de las tres soluciones que sirve en ese caso.
- Se necesita una respuesta muy rápida y con poca memoria, o la entrada es demasiado grande para la programación dinámica.
- Se acepta un margen de error: la solución no es óptima, pero queda a una distancia acotada y predecible.
- Se necesita un punto de comparación simple para medir qué tan lejos del óptimo queda una solución online.

### Limitaciones

- No garantiza el óptimo. La mejor decisión local no es la mejor decisión global, como muestra la traza.
- Decide sin mirar el futuro: no anticipa que la pájara va a cambiar de dirección.
- Corrige en cada medición, así que cambia de rumbo seguido. Si ejecutar una acción es costoso, conviene una variante que decida cada $N$ mediciones o que solo corrija cuando el error pasa de un margen. Esas variantes gastan menos acciones, pero pagan con más error.

## Comparación con fuerza bruta y programación dinámica

La fuerza bruta y la programación dinámica necesitan conocer todo el vuelo de antemano: deciden cada posición mirando las mediciones futuras. Greedy deja de lado el futuro y por eso puede usarse en tiempo real, pero el precio es perder el óptimo. La diferencia entre Greedy y la programación dinámica (en estos datos, ~1,6 veces la distancia) es lo que cuesta no conocer el futuro, no un defecto del algoritmo.

La programación dinámica sirve como vara para medir a Greedy, y Greedy es la respuesta práctica cuando el vuelo se va conociendo sobre la marcha.

## Referencias

- [Enunciado original (OIA, Nivel 3, Problema 2)](https://www.oia.unsam.edu.ar/_media/prob/c3a09n3p2.pdf)
