---
title: El Contador de Traidores
tags:
  - b/dyc
---
El Senado Imperial lleva un registro de `n` lealtades, cada una un entero. Dos lealtades `(i, j)` forman una **inversión** si `i < j` pero `lealtad[i] > lealtad[j]`: un superior en la lista tiene menos lealtad que un subordinado, señal de corrupción. El Senado necesita contar cuántas inversiones hay para detectar el nivel de traición… pero `n` puede ser enorme.
## Enunciado — Contar Inversiones
Implementar una función `contar_inversiones(arr)` que devuelva el número de pares `(i, j)` con `i < j` y `arr[i] > arr[j]`.

**Restricción:** debe hacerse en $O(n \log{n})$, no en $O(n^2)$.

**Pista clave:** modificar Merge Sort. Durante el paso de _merge_, cuando se toma un elemento de la mitad derecha antes que uno de la izquierda, ¿cuántas inversiones se estan "descubriendo" en ese momento?

```python
def merge_contar(left, right):
    # Combina left y right ordenadamente.
    # Cuenta las inversiones que "cruzan" la división.
    result = []
    inversiones = 0
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            # left[i] > right[j] → inversión
            # ??? ¿cuántas inversiones agrega este paso?
            result.append(right[j]); j += 1
    result += left[i:] + right[j:]
    return result, inversiones

def contar_inversiones(arr):
    if len(arr) <= 1:
        return arr, 0
    mid = len(arr) // 2
    left,  inv_l = contar_inversiones(arr[:mid])
    right, inv_r = contar_inversiones(arr[mid:])
    merged, inv_m = merge_contar(left, right)
    return merged, inv_l + inv_r + inv_m
```

Probar con `[2, 4, 1, 3, 5]`. Las inversiones son (2,1), (4,1), (4,3): el resultado debe ser **3**. Verificar la implementación y explicar por qué el conteo en `merge_contar` es correcto.