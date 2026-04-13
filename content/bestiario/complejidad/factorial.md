---
title: 'Factorial Recursivo e Iterativo'
tags: [b/complejidad]
---

Ambas versiones de este algoritmo calculan $n!$, pero ¿tienen la misma complejidad?

Versión iterativa:

```
PARA i = 1 HASTA n HACER
  result ← result × i
return result
```

Versión recursiva:
```
SI n = 0
  return 1
SI NO
  return factorial(n-1) × n
```

Ambas hacen exactamente $n$ multiplicaciones. Pero la versión recursiva tiene overhead de stack: cada llamada guarda el estado en memoria.

¿Cuál es la complejidad temporal y espacial de cada una?
