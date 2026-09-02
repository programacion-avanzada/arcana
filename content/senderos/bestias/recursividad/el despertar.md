---
title: El Despertar
tags:
  - recursividad
  - desafio
---

Forma final del Devorador, la más peligrosa. Cada avatar que domina una región de `n` dimensiones se manifiesta en **2 nuevos avatares**, pero cada uno solo logra estabilizarse en **un cuarto** de las dimensiones restantes (`n/4`). El ritual de invocación es más costoso cuanto mayor es la porción que intentan controlar. Antes de dividirse, los avatares deben sincronizar un **sello maestro** que recorre *todas* las dimensiones de la región original (costo lineal en `n`).

a) Plantear la relación de recurrencia `T(n)` que modela este escenario, identificando claramente `a`, `b` y `f(n)`.

b) Resolver la recurrencia usando el **Teorema Maestro**, indicando explícitamente:
   - En qué caso del teorema cae.
   - Por qué se cumplen (o no) las condiciones de ese caso.

c) Comparando con lo que armaste en [[la fisura se abre]], explicá con tus palabras qué representa, en el árbol de recursión, el caso del Teorema Maestro en el que cayó este ejercicio (¿domina el costo de las hojas? ¿el costo de la raíz? ¿están equilibrados?).

d) *(Desafío opcional)* Los arcanistas más viejos del Archivo sospechan que el sello maestro podría no ser lineal, sino un ritual que se "abarata" a medida que hay más dimensiones en juego, por ejemplo, `f(n) = n / log n`. Si así fuera, ¿el Teorema Maestro seguiría aplicando tal cual? ¿A qué herramienta de las vistas en el sendero volverías para resolverlo?
