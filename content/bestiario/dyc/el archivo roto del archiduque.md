---
title: El Archivo Roto del Archiduque
tags:
  - b/dyc
---
El Archiduque Vorn custodia el Gran Archivo: una lista de n pergaminos ordenados por fecha. Un aprendiz los mezcló y ahora están en desorden. El Archiduque necesita reordenarlos, pero el archivo es enorme y los métodos simples de los escribas son demasiado lentos. Un antiguo grimorio describe un método llamado Merge Sort: *"divide la pila en dos, ordena cada mitad, y luego combínalas"*. El aprendiz copió el código... pero dejó tres partes sin terminar.

## Enunciado
Completá la función `merge_sort` y su auxiliar `merge`. Los fragmentos marcados con `# ???` son los que debes implementar.

```python
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        # ??? Compara left[i] y right[j].
        # Agrega el menor a result y avanza el índice correspondiente.
        # ???

    # ??? Agrega los elementos restantes de ambas mitades.
    # ???
    return result


def merge_sort(arr):
    if len(arr) <= 1:
        return arr               # caso base

    mid = ## ???                 # ??? Calcula el punto de división
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)


# Prueba:
pergaminos = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(pergaminos))
# Esperado: [3, 9, 10, 27, 38, 43, 82]
```

> **Guía del Maestro.** Para merge: cuando termina el while, al menos una lista está vacía. Puedes extender `result` con la cola de cada una. Para `mid`: el punto medio es `len(arr) // 2`.

Una vez que funcione, respondé: ¿cuál es la complejidad temporal y espacial de Merge Sort? ¿Qué aporta el paso de combinar comparado con el de dividir?
