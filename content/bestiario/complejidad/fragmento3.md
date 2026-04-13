---
title: 'Análisis de Fragmento de Código 3'
tags: [b/complejidad]
---

Mirá este fragmento de código:

```
PARA i = 2 HASTA n HACER
    k ← i
    PARA k = i HASTA 2 (paso -1) HACER
        SI a(k-1) > a(k) ENTONCES
            Aux ← a(k-1)
            a(k-1) ← a(k)
            a(k) ← Aux
        FIN SI
    FIN PARA
FIN PARA
```

¿Cuál es la complejidad de este código? ¿Por qué?
