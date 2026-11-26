---
title: 'OIA - Vuelo amoroso - Greedy'
tags:
  - oia
  - solucion
---

Solución greedy para [[vuelo_amoroso]].

## Técnicas utilizadas

**Greedy (algoritmo ávido):** en cada paso se toma la decisión que parece mejor en ese momento (la que deja al pajarito más cerca de la pájara) y nunca se reconsidera. No enumera candidatos ni guarda subproblemas: recorre las mediciones una sola vez. Es muy rápido y usa muy poca memoria, pero no garantiza el óptimo.

En este problema greedy es una **heurística**: da un vuelo factible, pero no necesariamente el de menor distancia. Por eso no resuelve el problema tal como lo pide el enunciado y sirve, sobre todo, para comparar contra las soluciones exactas.

## Idea de la solución

En cada medición el pajarito tiene exactamente dos opciones: subir ($+1$) o bajar ($-1$). Contamos con la altura de la pájara y la del pajarito en la medición. Greedy elige el movimiento que minimiza la distancia de esta medición.

Para cada medición:

1. Si la pájara está más alta que el pajarito, el pajarito sube.
2. Si la pájara está más baja, el pajarito baja.
3. Si están a la misma altura, cualquiera de los dos movimientos deja la distancia de esa medición en 1. Se desempata bajando.
4. Se suma $|p_t - a_t|$ al total y se pasa a la siguiente medición.

El desempate no es arbitrario: hay que elegir bajar para que el vuelo sea siempre **factible**. Si se desempatara subiendo, con la pájara y el pajarito a 300 metros el pajarito pasaría a 301, que es no factible. Bajando, en cambio, nunca se sale del rango: si empata con la pájara está a 1 metro o más, y en los otros dos casos se mueve hacia la pájara, que siempre está entre 1 y 300.

Greedy solo usa lo que ya vio: la altura actual del pajarito y la medición que acaba de llegar. Por eso es la única de las tres soluciones que se puede usar **si los datos llegan de a uno (tiempo real)**, algo que la fuerza bruta y la programación dinámica no pueden hacer, porque necesitan conocer todo el vuelo.

## Código

```text
ALGORITMO VueloGreedy(pajara)
    n ← pajara.longitud
    altura ← 0
    dist_total ← 0
    recorrido ← nuevo arreglo de tamaño n

    PARA t DESDE 0 HASTA n-1 HACER
        SI pajara[t] > altura ENTONCES
            altura ← altura + 1         // la pájara está más alta: sube
        SINO
            altura ← altura - 1         // está más baja o a la misma altura: baja
        dist_total ← dist_total + |altura - pajara[t]|
        recorrido[t] ← altura

    RETORNAR dist_total, recorrido
```

Las alturas de la pájara llegan en un [[array]] y el recorrido se guarda en otro array de tamaño $n$. Como el empate se resuelve bajando, los casos "más baja" y "misma altura" quedan juntos en el `SINO`.

## Traza de ejemplo

**Entrada:** `3 3 3 6 9 12 9 9 6 3 3 3 3` ($n = 13$).

Los dos pájaros arrancan en altura 0. En cada fila se ve la decisión de greedy y cómo crece la distancia acumulada:

![Recorrido greedy en el ejemplo, comparado con el óptimo](vuelo-amoroso-greedy-recorrido.svg)

| Medición | Pájara | Pajarito antes | Decisión | Pajarito después | Distancia | Distancia acumulada |
|----------|--------|----------------|----------|------------------|-----------|---------------------|
| 1        | 3      | 0              | sube     | 1                | 2         | 2                   |
| 2        | 3      | 1              | sube     | 2                | 1         | 3                   |
| 3        | 3      | 2              | sube     | 3                | 0         | 3                   |
| 4        | 6      | 3              | sube     | 4                | 2         | 5                   |
| 5        | 9      | 4              | sube     | 5                | 4         | 9                   |
| 6        | 12     | 5              | sube     | 6                | 6         | 15                  |
| 7        | 9      | 6              | sube     | 7                | 2         | 17                  |
| 8        | 9      | 7              | sube     | 8                | 1         | 18                  |
| 9        | 6      | 8              | baja     | 7                | 1         | 19                  |
| 10       | 3      | 7              | baja     | 6                | 3         | 22                  |
| 11       | 3      | 6              | baja     | 5                | 2         | 24                  |
| 12       | 3      | 5              | baja     | 4                | 1         | 25                  |
| 13       | 3      | 4              | baja     | 3                | 0         | 25                  |

En este ejemplo no hay empates: en ninguna medición el pajarito está a la misma altura que la pájara antes de moverse.

La decisión que arruina el resultado es la de la medición 8. Greedy sube a 8 porque la pájara sigue a 9 y paga solo 1, pero queda lejos cuando ella empieza a bajar. El óptimo baja a 6 en ese momento (paga 3) y queda mejor ubicado para la bajada.

| Concepto                   | Greedy | Fuerza bruta |
|----------------------------|--------|--------------|
| Vuelos construidos         | 1      | 8192         |
| Decisiones por medición    | 1      | todas las combinaciones |

**Resultado:** `25`, con el recorrido `1 2 3 4 5 6 7 8 7 6 5 4 3`. El óptimo es `23`, con el recorrido `1 2 3 4 5 6 7 6 5 4 3 4 3`, así que en este ejemplo greedy queda a 2 del óptimo (~9% más).

## Complejidad

### Temporal

$O(n)$: una sola pasada, con trabajo constante por medición (una comparación, una suma y una escritura). Nunca vuelve atrás ni compara contra otros candidatos.

Para dimensionarlo: al multiplicar $n$ por 10, el tiempo se multiplica aproximadamente por 10.

### Espacial

$O(n)$ tal como está escrito el pseudocódigo, por el arreglo `recorrido`. Si en lugar de guardarlo se imprime cada altura a medida que se calcula, alcanza con la altura actual y el total: $O(1)$.

## Cuándo usar esta técnica

### Favorable cuando

- Los datos llegan de a uno y hay que decidir en el momento (sistemas en tiempo real). Es la única de las tres soluciones que sirve en ese caso.
- Se necesita una respuesta rápida y con muy poca memoria, y se acepta que no sea óptima. En este problema la programación dinámica también es lineal en $n$, así que la ventaja real de greedy es la memoria: $O(1)$ contra $O(n \cdot H)$.
- Se necesita un punto de comparación simple para medir cuánto mejora una solución exacta.
- Consultar la posición de la pájara tiene un costo propio (por ejemplo, leer un sensor). En ese caso se puede dejar de mirar mientras la brecha lo permita: si la distancia actual es $d$, como la pájara se mueve hasta 3 metros y el pajarito 1, la decisión no cambia durante $\lceil d/4 \rceil$ mediciones. Así se ahorran consultas sin modificar el vuelo. En el problema del enunciado consultar no cuesta nada, así que esto no aplica.

### Limitaciones

- No garantiza el óptimo. La mejor decisión local no es la mejor decisión global, como muestra la traza.
- Decide sin mirar el futuro: no anticipa que la pájara va a cambiar de dirección.
- Cuánto se aleja del óptimo depende del vuelo. En el ejemplo queda apenas un 9% arriba, pero en pruebas con vuelos aleatorios de 2000 mediciones dio entre 1,5 y 1,8 veces la distancia óptima (1,6 en promedio). Además, la diferencia absoluta crece con $n$.

## Comparación con fuerza bruta y programación dinámica

La fuerza bruta y la programación dinámica encuentran siempre el óptimo; greedy no. En este problema greedy tiene todo el vuelo disponible (viene en el archivo de entrada) y lo ignora: la diferencia con el óptimo es lo que cuesta decidir mirando solo la medición actual. Por eso no cumple lo que pide el enunciado: en el ejemplo devuelve 25 en lugar de 23.

| Característica         | Fuerza bruta      | Programación dinámica | Greedy                     |
|------------------------|-------------------|-----------------------|----------------------------|
| Encuentra el óptimo    | Sí                | Sí                    | No                         |
| Complejidad temporal   | $O(2^n \cdot n)$  | $O(n \cdot H)$        | $O(n)$                     |
| Complejidad espacial   | $O(n)$            | $O(n \cdot H)$        | $O(n)$, u $O(1)$ sin guardar el recorrido |
| Necesita todo el vuelo | Sí                | Sí                    | No                         |

La programación dinámica sirve como vara para medir a greedy, y greedy es la respuesta práctica solo cuando el vuelo se va conociendo sobre la marcha.

## Referencias

- [Enunciado original (OIA, Nivel 3, Problema 2)](https://www.oia.unsam.edu.ar/_media/prob/c3a09n3p2.pdf)
- [[KLE2005]] - Chapter 4.
