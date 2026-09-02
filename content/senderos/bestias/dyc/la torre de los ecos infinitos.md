---
title: La Torre de los Ecos Infinitos y el Engaño del Oráculo
tags:
  - dyc
---
En la Torre de los Ecos Infinitos, también conocida como Torre de Fibonacci, un oráculo falso convence a los aprendices de que todo puede resolverse con división y conquista. "¡Divide el problema!", grita. Pero el sabio Ermitage sabe que algunos problemas tienen una estructura donde dividir y reconquistar crea más trabajo del que ahorra. El oráculo presenta el cálculo del n-ésimo número de Fibonacci como candidato perfecto para división y conquista recursivo. Ermitage sonríe… y deja que los aprendices descubran el error por sí mismos.
## Enunciado: Fibonacci Recursivo Ingenuo

Considerar esta implementación "división y conquista" de Fibonacci:

```python
def fib_dc(n):
    if n <= 1:
        return n                          # caso base
    return fib_dc(n - 1) + fib_dc(n - 2)  # "divide" en dos subproblemas
```

Responder las siguientes preguntas:

1. **¿Es esto realmente división y conquista?** Describir qué condición fundamental de DyC _no_ se cumple aquí (pensar en la independencia de los subproblemas).
2. **Complejidad:** trazar el árbol de llamadas para `fib(6)`. ¿Cuántas veces se calcula `fib(2)`? Escribir la recurrencia y determina que la complejidad es $O(2^n)$.
3. **Solución correcta:** reescribir `fib(n)` usando otra técnica y demostrar que es $O(n)$.
4. **Reflexión:** ¿en qué se diferencia "división y conquista" de "programación dinámica"? ¿Cuándo se usa cada una?

> **Lección del Sabio Ermitage:** División y conquista funciona bien cuando los subproblemas son _independientes_. Cuando se solapan, dividir y reconquistar sin memoria repite trabajo exponencialmente. La herramienta correcta en esos casos es la programación dinámica.

<details>
    <summary>Ver solución</summary>
    
## 1. ¿Es esto realmente división y conquista?

**No, no en el sentido que importa.** Tiene la forma superficial de D&C (caso base + dos llamadas recursivas + combinar sumando), pero le falta la condición fundamental: **que los subproblemas sean independientes**.

`fib_dc(n-1)` internamente vuelve a calcular `fib_dc(n-2)`, `fib_dc(n-3)`, etc. que son los mismos subproblemas que ya se están calculando por otro lado, en la rama de `fib_dc(n-2)`. No son subproblemas disjuntos que se resuelven una única vez: se **solapan** y se recalculan una y otra vez. Ese solapamiento es lo que rompe la premisa de D&C.

## 2. Complejidad

Árbol de llamadas para `fib(6)` (abreviado; los subárboles idénticos se repiten):

```
fib(6)
├── fib(5)
│   ├── fib(4)
│   │   ├── fib(3)
│   │   │   ├── fib(2) → fib(1), fib(0)
│   │   │   └── fib(1)
│   │   └── fib(2) → fib(1), fib(0)
│   └── fib(3)
│       ├── fib(2) → fib(1), fib(0)
│       └── fib(1)
└── fib(4)
    ├── fib(3)
    │   ├── fib(2) → fib(1), fib(0)
    │   └── fib(1)
    └── fib(2) → fib(1), fib(0)
```

`fib(2)` aparece **5 veces**, calculado desde cero cada vez. Eso es el solapamiento del punto 1, hecho concreto.

**Recurrencia:**

$$ T(n) = T(n-1) + T(n-2) + O(1) $$

**Por qué es $O(2^n)$:** como $T(n-2) \leq T(n-1)$, se puede acotar $T(n) \leq 2 \cdot T(n-1) + O(1)$. Desenrollando esa cota (o por inducción: si $T(k) \leq c \cdot 2^k$ vale para todo $k < n$, entonces $T(n) \leq c \cdot 2^{n-1} + c \cdot 2^{n-2} + O(1) \leq c \cdot 2^n$), se obtiene $T(n) = O(2^n)$.

> **Dato extra para quien quiera precisión:** la cota ajustada es en realidad $\Theta(\varphi^n)$, con $\varphi \approx 1.618$ el número áureo, más lento que lineal, pero algo menor que $2^n$. $O(2^n)$ sigue siendo una cota superior válida y mucho más simple de demostrar.

## 3. Solución correcta: $O(n)$

Con programación dinámica (versión iterativa, sin recalcular nada):

```python
def fib_dp(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

El `for` corre $n - 1$ veces, cada iteración es $O(1)$ → $T(n) = O(n)$, y $O(1)$ de memoria extra.

_(Alternativa equivalente en espíritu: memoización top-down, guardando cada `fib(k)` calculado en un diccionario para no repetirlo. También $O(n)$, porque cada subproblema se resuelve una sola vez.)_

## 4. División y conquista vs. programación dinámica

- **D&C:** los subproblemas son **independientes**: no se solapan entre sí. Se resuelven una vez cada uno y se combinan. Ejemplos: Merge Sort, búsqueda binaria, Karatsuba.
- **Programación dinámica:** los subproblemas **se solapan** (el mismo subproblema aparece en múltiples ramas de la recursión). La clave es **guardar** cada resultado la primera vez que se calcula, para no repetir trabajo. Ejemplos: Fibonacci, camino mínimo, mochila.

**Regla práctica:** si al dibujar el árbol de recursión aparecen nodos repetidos → programación dinámica. Si todos los subproblemas son distintos → división y conquista.

</details>