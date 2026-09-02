---
title: 'Análisis de Fragmento de Código 2'
tags:
  - complejidad
  - desafio
  - resuelto
---

Mirá este fragmento de código:

```
Leer(a)
n ← a * a
c ← 0

MIENTRAS (a > 1) HACER
    a ← a / 2
    PARA i = 1 HASTA n HACER
        c ← c * 2
```

¿Cuál es la complejidad de este código? ¿Por qué?

<details>
    <summary>Ver solución</summary>

### Aclaración importante antes de empezar

El código usa la variable `n` para un valor calculado (`n ← a * a`), pero en notación Big-O normalmente usamos "$n$" para referirnos al **tamaño de la entrada**. Para no confundirnos, en este análisis vamos a llamar **$a$** al tamaño de la entrada (el dato que se lee con `Leer(a)`), y dejamos que la variable interna del programa siga llamándose $n$, sabiendo que $n = a^2$.

---

### Paso 1: Instrucciones simples (fuera de los bucles)

```
n ← a * a
c ← 0
```

Estas dos líneas se ejecutan **una sola vez**, sin importar el tamaño de $a$. Son operaciones de costo constante:

$$O(1)$$

**Dato clave:** $n$ se calcula **una única vez, antes de entrar al bucle MIENTRAS**, y su valor queda fijo en $a^2$ durante toda la ejecución (no se vuelve a recalcular, aunque $a$ cambie después). Esto es crucial para el análisis que sigue.

---

### Paso 2: Analizar el bucle MIENTRAS (externo)

```
MIENTRAS (a > 1) HACER
    a ← a / 2
    ...
```

En cada iteración, $a$ se divide por 2. Partiendo del valor inicial $a$, la secuencia de valores es:

$$a, \ \frac{a}{2}, \ \frac{a}{4}, \ \frac{a}{8}, \ \dots, \ 1$$

Esto es exactamente la misma lógica que la **búsqueda binaria**: ¿cuántas veces hay que dividir $a$ por 2 hasta llegar a 1? La respuesta es:

$$\log_2(a) \text{ iteraciones}$$

Entonces, el bucle MIENTRAS se ejecuta $O(\log a)$ veces.

---

### Paso 3: Analizar el bucle PARA (interno)

```
PARA i = 1 HASTA n HACER
    c ← c * 2
```

Este bucle se ejecuta desde $i=1$ hasta $n$. Como vimos en el Paso 1, $n = a^2$ y **no cambia** durante toda la ejecución del programa (aunque $a$ sí cambie). Entonces, **cada vez** que entramos al bucle PARA, se ejecuta $O(n) = O(a^2)$ operaciones de costo constante ($c \leftarrow c \times 2$).

---

### Paso 4: Combinar ambos bucles

El bucle PARA está **anidado dentro** del bucle MIENTRAS. Como el bucle interno hace siempre la **misma cantidad de trabajo** en cada pasada (porque $n$ no cambia), simplemente multiplicamos

$$
\underbrace{O(\log a)}_{\text{veces que se repite MIENTRAS}} \times \underbrace{O(a^2)}_{\text{trabajo del PARA en cada pasada}}
$$

---

### Resultado final

$$
T(a) \in O(a^2 \log a)
$$

</details>
