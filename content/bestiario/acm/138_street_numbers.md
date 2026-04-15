---
title: 'ACM138 - Street Numbers'
tags: ['b/acm']
---

Una programadora de computadoras vive en una calle con casas numeradas consecutivamente (desde 1) por un lado de la calle. Cada noche ella sale a pasear a su perro dejando su casa, yendo al azar a la izquierda o a la derecha, camina hasta el final de la calle y vuelve.
Una noche suma los números de las casas que pasan (excluyendo la suya). La siguiente vez que camina, comienza por el otro lado repitiendo la suma y encuentra, para su asombro, que las dos sumas son iguales. Aunque esto se determina en parte por su número de casa y en parte por el número de casas en la calle, ella sin embargo siente que esta es una propiedad deseable para su casa y decide que todas sus casas subsecuentes tendrán esa propiedad.  
Escribir un programa para encontrar los pares de números que satisfagan esta condición. Para comenzar su lista los primeros pares son: (número de casa, último número):

```
6, 8
35, 49
204, 288
1189, 1681
6930, 9800
40391, 57121
235416, 332928
1372105, 1940449
7997214, 11309768
46611179, 65918161
...
```

## Consigna
Desarrollar una clase con tres (o más) métodos, que resuelvan el mismo problema pero utilizando aproximaciones similares. Al menos uno de ellos debe utilizar un algoritmo cuadrático, uno lineal y otro constante.

El prototipo será el siguiente:

```python
# Algoritmo cuadrático
def encontrar_pares_cuadratico(n: int) -> int:
    pass
# Algoritmo lineal
def encontrar_pares_lineal(n: int) -> int:
    pass
# Algoritmo constante
def encontrar_pares_constante(n: int) -> int:
    pass
```

> **Nota:** Siendo `n` el número de la última casa de la calle, los métodos devolverán el número de casa `i`, desde donde ambas sumas resultan iguales, o `-1` si esto no fuera posible.

[Enlace al problema original](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=74)

---

<details>
    <summary>Solución cuadrática</summary>
Para la resolución cuadrática, podemos utilizar un enfoque de fuerza bruta, probando todos los pares posibles de casas y verificando si cumplen con la condición deseada.

```python
def encontrar_pares_cuadratico(n: int) -> int:
    if n < 3:
        return -1

    for i in range(2, n + 1):
        suma_izq = sum(range(1, i))
        suma_der = sum(range(i + 1, n + 1))
        if suma_izq == suma_der:
            return i

    return -1
```
</details>

<details>
    <summary>Solución lineal (1)</summary>
Hay varias formas de abordar la solución lineal, pero una de las más efectivas es calcular las sumas de las casas utilizando la fórmula de la suma de los primeros n números naturales, también llamada fórmula de Gauss.

```python
def encontrar_pares_lineal(n: int) -> int:
    if n < 3:
        return -1

    for i in range(1, n + 1):
        suma_izq = i * (i - 1) // 2
        suma_der = (n * (n + 1) // 2) - (i * (i + 1) // 2)

        if suma_der == suma_izq:
            return i

    return -1
```
</details>

<details>
    <summary>Solución lineal (2)</summary>
    Se puede resolver con two-pointers. #TBD
</details>

<details>
    <summary>Solución lineal (3)</summary>
    Se puede resolver acumulando las sumas de las casas a medida que avanzamos. #TBD
</details>

<details>
    <summary>Solución constante</summary>
Para la solución constante, podemos utilizar la propiedad de los números que cumplen con la condición deseada.
#TBD (demostración)

```python
import math

def encontrar_pares_constante(n: int) -> int:
    if n < 3:
        return -1

    valor = (n**2 + n) // 2
    i = math.isqrt(valor)  # raíz entera exacta

    if i * i == valor:
        return i

    return -1
```
</details>