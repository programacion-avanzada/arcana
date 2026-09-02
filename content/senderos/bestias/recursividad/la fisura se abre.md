---
title: La Fisura se Abre
tags:
  - recursividad
  - desafio
---

El Devorador mutó. En esta nueva forma, cada avatar que domina una región de `n` dimensiones:

1. Traza primero un **sello de contención** sobre toda la región (costo lineal en `n`), para evitar que el Archivo detecte la fisura antes de tiempo.
2. Se divide en **dos avatares**, y cada uno toma el control de **la mitad** de las dimensiones restantes.

a) Plantear la relación de recurrencia `T(n)` que modela el costo total del ritual.

b) Resolver la recurrencia por **telescopía**, mostrando el desarrollo paso a paso.

c) Verificar el resultado construyendo el **árbol de recursión** correspondiente (niveles, costo por nivel, cantidad de niveles y costo total).

d) ¿Los dos métodos te dieron el mismo orden de crecimiento? Justificá brevemente por qué tiene sentido que así sea.
