---
title: Primer Presagio
tags:
  - recursividad
  - desafio
---

Los primeros informes describen la forma más débil del Devorador: avanza por una cadena de `n` dimensiones, una por vez. En cada dimensión deja un eco de sí mismo y recién después cruza a la siguiente.

```
function INVOCAR(dimensiones, n):
    if n <= 1:
        dejar_eco(dimensiones[0])
        return
    dejar_eco(dimensiones[0])
    INVOCAR(dimensiones[1:n], n-1)
```

a) Trazar la ejecución de `INVOCAR` para `n = 4`, identificando claramente el caso base, la pila de llamadas (el "camino de cruces") y el orden en que se resuelven al volver.

b) A partir del código, plantear la relación de recurrencia `T(n)` que describe el costo del ritual en función de `n` (no hace falta resolverla).
