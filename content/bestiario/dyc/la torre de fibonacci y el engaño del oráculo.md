---
title: La Torre Fibonacci y el Engaño del Oráculo
tags:
  - b/dyc
---
En la Torre de Fibonacci, un oráculo falso convence a los aprendices de que todo puede resolverse con división y conquista. "¡Divide el problema!", grita. Pero el sabio Ermitage sabe que algunos problemas tienen una estructura donde dividir y reconquistar crea más trabajo del que ahorra. El oráculo presenta el cálculo del n-ésimo número de Fibonacci como candidato perfecto para división y conquista recursivo. Ermitage sonríe… y deja que los aprendices descubran el error por sí mismos.
## Enunciado — Fibonacci Recursivo Ingenuo

Considerar esta implementación "división y conquista" de Fibonacci:

```python
def fib_dc(n):
    if n <= 1:
        return n                          # caso base
    return fib_dc(n - 1) + fib_dc(n - 2)  # "divide" en dos subproblemas
```

Responder las siguientes preguntas:

1. **¿Es esto realmente división y conquista?** Describir qué condición fundamental de DyC _no_ se cumple aquí (pensar en la independencia de los subproblemas).
2. **Complejidad:** trazar el árbol de llamadas para `fib(6)`. ¿Cuántas veces se calcula `fib(2)`? Escribir la recurrencia y determina que la complejidad es O(2ⁿ).
3. **Solución correcta:** reescribir `fib(n)` usando otra técnica y demostrar que es O(n).
4. **Reflexión:** ¿en qué se diferencia "división y conquista" de "programación dinámica"? ¿Cuándo se usa cada una?

> **Lección del Sabio Ermitage** División y conquista funciona bien cuando los subproblemas son _independientes_. Cuando se solapan, dividir y reconquistar sin memoria repite trabajo exponencialmente. La herramienta correcta en esos casos es la programación dinámica.