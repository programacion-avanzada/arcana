---
title: 'LeetCode0420 - Strong Password Checker - Greedy'
tags:
  - leetcode
  - solucion
---

## Técnicas utilizadas
- **Greedy con análisis de casos por longitud:** la técnica consiste en tomar decisiones óptimas locales en cada paso basándose únicamente en el tamaño actual de la [[string]]. En lugar de realizar una búsqueda exhaustiva, el algoritmo aplica un conjunto de reglas fijas y prioridades matemáticas que garantizan alcanzar el estado de "contraseña fuerte" con el menor gasto posible de operaciones básicas.

## Idea de la solución
La solución clasifica la contraseña en tres casos excluyentes según su tamaño ($n$), aplicando la acción local más eficiente para cada escenario:

1. **Contraseñas cortas ($n < 6$):** Se soluciona usando solo inserciones. El resultado es el valor máximo entre los caracteres que faltan para llegar a 6 y los tipos de caracteres obligatorios (mayúscula, minúscula o número) ausentes.
2. **Contraseñas medianas ($6 \le n \le 20$):** Se soluciona usando solo reemplazos. Se calculan las sustituciones necesarias para romper las rachas ($\lfloor L / 3 \rfloor$). El total de pasos es el máximo entre la suma de estos reemplazos y los tipos faltantes.
3. **Contraseñas largas ($n > 20$):** Se calculan los borrados obligatorios para bajar el tamaño de la [[string]] a 20. Para ahorrar pasos futuros, se eliminan caracteres dando prioridad a las rachas según su residuo matemático (primero las de longitud múltiplo de 3, luego resto 1 y al final resto 2). Una vez completados los borrados y optimizadas las rachas, el resultado final es la suma de esos **borrados obligatorios** más el **máximo entre los reemplazos necesarios y los tipos faltantes**.

## Código

```pseudocode
FUNCION strongPasswordCheckerGreedy(password)
    n ← tamaño(password)

    // Contar tipos de caracteres faltantes (0, 1, 2 o 3)
    tiposFaltantes ← obtenerTiposFaltantes(password)

    // Caso 1: Contraseña corta
    SI n < 6 ENTONCES
        RETORNAR max(6 - n, tiposFaltantes)
    FIN SI

    // Contar bloques repetidos y clasificarlos por residuos de división por 3
    pasosReemplazo ← 0
    necesitaUnBorrado ← 0
    necesitaDosBorrados ← 0

    i ← 0
    MIENTRAS i < n HACER
        tamBloque ← 1 // tamaño de bloque de repetidos

        MIENTRAS i+1 < n Y password(i) == password(i+1) HACER
            tamBloque ← tamBloque + 1
            i ← i + 1
        FIN MIENTRAS

        SI tamBloque >= 3 ENTONCES
            pasosReemplazo ← pasosReemplazo + ParteEntera(tamBloque / 3)

            SI tamBloque MOD 3 == 0 ENTONCES
                necesitaUnBorrado ← necesitaUnBorrado + 1
            SINO SI tamBloque MOD 3 == 1 ENTONCES
                necesitaDosBorrados ← necesitaDosBorrados + 1
            FIN SI
        FIN SI
        i ← i + 1
    FIN MIENTRAS

    // Caso 2: Contraseña mediana
    SI n <= 20 ENTONCES
        RETORNAR max(pasosReemplazo, tiposFaltantes)
    FIN SI

    // Caso 3: Contraseña larga (n > 20)
    tamSobrante ← n - 20
    totalBorrados ← tamSobrante // Guardo el costo fijo de los borrados requeridos

    // se aplican borrados a las rachas según su residuo de división por 3, en orden de prioridad
    tamSobrante, pasosReemplazo ← aplicarBorrados(tamSobrante, necesitaUnBorrado, 1, pasosReemplazo)
    tamSobrante, pasosReemplazo ← aplicarBorrados(tamSobrante, necesitaDosBorrados, 2, pasosReemplazo)
    tamSobrante, pasosReemplazo ← aplicarBorrados(tamSobrante, pasosReemplazo, 3, pasosReemplazo)

    RETORNAR totalBorrados + max(pasosReemplazo, tiposFaltantes)
FIN FUNCION

FUNCION aplicarBorrados(tamSobrante, disponibles, costo, pasosReemplazo)
    SI tamSobrante > 0 Y disponibles > 0 ENTONCES
        numBorrados ← min(tamSobrante, disponibles * costo)
        tamSobrante ← tamSobrante - numBorrados
        pasosReemplazo ← pasosReemplazo - ParteEntera(numBorrados / costo)
    FIN SI
    RETORNAR tamSobrante, pasosReemplazo
FIN FUNCION
```

## Traza de ejemplo

Usaremos de ejemplo el caso 2.<br>

**Contraseña analizada:** `"aaaaaabcccc"`

**Longitud:** 11

Primero el programa recorre los caracteres  para chequear los tipos:
- **minúscula:** SI (hay 'a')
- **mayúscula:** NO (no hay letras mayúsculas)
- **dígito:** NO (no hay números)

obtenerTiposFaltantes retorna 2 (faltan mayúscula y dígito).

Como tamaño es 11, NO entra al Caso 1 (tamaño < 6).

**Análisis de las rachas o caracteres repetidos:**

| i | Carácter | ¿Igual al sig.? | Long. racha | Acción |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 'a' | SI | 2 | Avanzo |
| 1 | 'a' | SI | 3 | Avanzo |
| 2 | 'a' | SI | 4 | Avanzo |
| 3 | 'a' | SI | 5 | Avanzo |
| 4 | 'a' | SI | 6 | Avanzo |
| 5 | 'a' | NO | 6 | Fin grupo: `pasosReemplazo` += 2, `necesitaUnBorrado` = 1 |
| 6 | 'b' | NO | 1 | Fin grupo: sin acción |
| 7 | 'c' | SI | 2 | Avanzo |
| 8 | 'c' | SI | 3 | Avanzo |
| 9 | 'c' | SI | 4 | Avanzo |
| 10 | 'c' | NO | 4 | Fin grupo: `pasosReemplazo` += 1, `necesitaDosBorrados` = 1 |

- **Cálculos finales:** `pasosReemplazo` = 3, `tiposFaltantes` = 2.
- **Aplicación Caso 2:** Como el tamaño (11) es $\leq 20$, calculamos $max(pasosReemplazo, tiposFaltantes) \rightarrow max(3, 2) = 3$.
- **Resultado:** 3 operaciones.

## Complejidad

### Temporal:
En el algoritmo destacan dos iteraciones.<br>
1. Se delega a la función auxiliar `obtenerTiposFaltantes(password)`. Por detrás, esta función requiere realizar una pasada lineal sobre el [[string]] de longitud $N$ para verificar la presencia de minúsculas, mayúsculas y dígitos. Esto representa un costo temporal de **$\mathcal{O}(N)$**.
2. Se procesan las rachas utilizando un mecanismo de punteros con dos bucles anidados (un bucle externo $A$ y un bucle interno $B$). Aunque están anidados, el puntero `i` avanza de forma estrictamente incremental y lineal de $0$ a $N-1$:
   - **Si todos los caracteres son diferentes:** El bucle externo $A$ realiza $N$ iteraciones, mientras que el bucle interno $B$ nunca avanza (0 pasos). Esto se simplifica asintóticamente a $\mathcal{O}(N)$.
   - **Si todos los caracteres son iguales:** El bucle interno $B$ realiza $N-1$ pasos en la primera iteración consumiendo toda la [[string]], y el bucle externo $A$ termina inmediatamente en su siguiente control. Esto se simplifica asintóticamente a $\mathcal{O}(N)$.

En cualquier combinación intermedia, la suma de las iteraciones de ambos bucles esta acotada por un factor lineal de $N$. Por eso la complejidad temporal se simplifica directamente a **$\mathcal{O}(N)$**.


### Espacial:
Debido a que el algoritmo no utiliza ninguna estructura de datos para almacenamiento, sino únicamente variables primitivas para asignaciones y como contadores, la complejidad espacial es constante: $\mathcal{O}(1)$.


## Cuándo usar esta técnica

### Favorable cuando
- Se busca una solución directa, determinista y de alto rendimiento que no requiera explorar todas las combinaciones posibles de caracteres en un árbol de decisiones.
- Es ideal cuando las restricciones del problema permiten definir reglas de decisión fijas basadas en el tamaño de la entrada.

### Limitaciones
- La estrategia Greedy funciona exclusivamente porque las operaciones básicas (insertar, borrar, reemplazar) tienen todas el mismo costo unitario ($1$). Si cada acción tuviera una ponderación de costo diferente o condicionada, las reglas fijas de prioridad matemática fallarían y se requeriría obligatoriamente Programación Dinámica.

### Comparación con la solución de Programación Dinámica

La versión Greedy es mucho más eficiente en términos de complejidad temporal y espacial, presentando una implementación más concisa y legible. Sin embargo, la versión de [[0420_strong_password_checker-programacion-dinamica]] es más flexible ante cambios en las reglas o costos del problema.

## Referencias
- **GeeksforGeeks.** [Greedy Algorithms](https://www.geeksforgeeks.org/greedy-algorithms/). Artículo detallado sobre las propiedades matemáticas y la elección óptima en algoritmos greedy.
