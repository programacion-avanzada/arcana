---
title: El Torneo de las Casas Gemelas
tags:
  - b/dyc
---
Las Casas Gemelas del Imperio celebran el Gran Torneo cada siglo. Cada casa tiene exactamente `n` guerreros (con `n` potencia de 2). El árbitro necesita organizar un torneo donde cada guerrero de la Casa Norte compita contra exactamente un guerrero de la Casa Sur. Pero los emparejamientos deben hacerse de forma que ningún guerrero compita más de una vez, y la asignación debe hacerse en tiempo $O(n \log{n})$. El árbitro recuerda haber visto este patrón antes... en los pergaminos de multiplicación de polinomios.
## Enunciado — Multiplicación de Polinomios / Introducción a FFT
Dados dos polinomios de grado `n-1` representados como arreglos de coeficientes:
```
A = [a₀, a₁, ..., aₙ₋₁]    B = [b₀, b₁, ..., bₙ₋₁]
```

Su producto `C = A × B` es un polinomio de grado `2n-2`.

1. **Método naïve:** la multiplicación directa toma $O(n^2)$. Descríbela brevemente.
2. **Algoritmo de Karatsuba:** en lugar de 4 multiplicaciones para dividir el polinomio en mitades, Karatsuba usa solo 3. Explica la idea central: si `A = A_hi·x^(n/2) + A_lo` y lo mismo para B, ¿cómo calcular los tres productos necesarios y combinarlos?
3. Escribe la recurrencia de Karatsuba: `T(n) = 3·T(n/2) + O(n)`. Aplica el Teorema Maestro y obtén O(n^log₂3) ≈ O(n^1.585).
4. **(Desafío, no obligatorio):** investigar brevemente cómo la FFT (Fast Fourier Transform) lleva esto aún más lejos hasta $O(n \log{n})$. ¿Qué representa "evaluar el polinomio en raíces de la unidad" en el contexto del Torneo de las Casas?

| Método               | Complejidad  | Paradigma                         |
| -------------------- | ------------ | --------------------------------- |
| Multiplicación naïve | `O(n²)`      | Fuerza bruta                      |
| Karatsuba            | `O(n^1.585)` | División y Conquista              |
| FFT / NTT            | `O(n log n)` | División y Conquista + matemática |

> **Reflexión final** Este ejercicio muestra el poder real de división y conquista: no solo ordena arreglos, sino que puede reducir el número de _operaciones fundamentales_ (multiplicaciones) de 4 a 3, lo cual parece trivial hasta que se eleva a escala logarítmica. Esa es la magia del método.