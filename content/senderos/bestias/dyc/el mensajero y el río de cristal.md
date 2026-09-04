---
title: 'El Mensajero y el Río de Cristal'
tags:
  - dyc
  - desafio
  - resuelto
---
El mensajero Aldric debe cruzar el Río de Cristal, dividido en $n$ secciones. Cada sección tiene una altura de corriente. Aldric necesita encontrar la sección con la corriente más alta para evitarla. No tiene tiempo de recorrer todo el río: debe hacerlo en el menor tiempo posible.

## Enunciado
Dado un arreglo de $n$ enteros que representa las alturas de corriente de cada sección del río, plantea un algoritmo de división y conquista para encontrar el valor máximo.

1. Describir el caso base y el paso recursivo en palabras.
2. Escribir la recurrencia de tiempo $T(n)$.
3. Usar el Teorema Maestro para resolverla y obtener la complejidad final.
4. ¿Es esta una mejora respecto a una búsqueda lineal? Justificar.

> **Pista del Sabio Ermitage:** La recurrencia que encontrarás es $T(n) = 2 \cdot T(n/2) + O(1)$. El trabajo de combinar dos soluciones (comparar dos máximos) es constante. Aplica el Caso 1 del Teorema Maestro.

> *Reflexión Trampa.* Antes de responder el punto 4, pensalo bien: ¿obtener el máximo con división y conquista es asintóticamente mejor que un simple recorrido lineal? ¿Por qué alguien lo usaría (o no)?

<details>
    <summary>Ver solución</summary>

## 1. Caso base y paso recursivo

- **Caso base:** una sección de un solo elemento; ese elemento es el máximo.
- **Paso recursivo:** dividir el [[array]] en dos mitades, calcular el máximo de cada una por separado, y combinar quedándose con el mayor de los dos.

Esto funciona porque el máximo global siempre coincide con el máximo de alguna de las dos mitades.

## 2. Algoritmo

```python
def encontrar_maximo(alturas, izq, der):
    if izq == der:                 # caso base
        return alturas[izq]

    medio = (izq + der) // 2
    max_izq = encontrar_maximo(alturas, izq, medio)
    max_der = encontrar_maximo(alturas, medio + 1, der)

    return max(max_izq, max_der)   # combinar: O(1)
```

> Nota: se pasan índices (`izq`, `der`) en vez de hacer slicing (`arr[:medio]`). Si se hiciera slicing, cada división copiaría el [[array]] y costaría $O(n)$, cambiando la recurrencia.

## 3. Recurrencia y Teorema Maestro

Dividir es $O(1)$, hay 2 subproblemas de tamaño $n/2$, y combinar (una comparación) es $O(1)$:

$$ T(n) = 2 \cdot T(n/2) + O(1) $$

Con $a = 2, b = 2, f(n) = O(1)$: el exponente crítico es $n^{log_2 2} = n$. Como $f(n) = O(1)$ es polinomialmente menor que $n$, aplica el **Caso 1** del Teorema Maestro:

$$ T(n) = \Theta(n) $$

## 4. ¿Es una mejora respecto a la búsqueda lineal?

**No.** Un recorrido lineal simple también es $Θ(n)$: dividir y combinar acá no elimina trabajo, solo lo reorganiza. La ventaja de D&C no es automática, sino que solo mejora la complejidad cuando el paso de dividir/combinar ahorra algo real (como en Merge Sort). Acá no hay ahorro, por eso ambos enfoques quedan en la misma clase asintótica.

¿Entonces para qué serviría igual? Porque las dos mitades son independientes entre sí, se podrían calcular en paralelo (algo que un recorrido lineal secuencial no ofrece naturalmente). En la práctica, sin paralelismo, el recorrido lineal suele ser incluso más rápido (menos overhead de llamadas recursivas).

</details>