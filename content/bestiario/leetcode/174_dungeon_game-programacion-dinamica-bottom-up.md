---
title: "LeetCode#174 - Dungeon Game - Programación Dinámica - Bottom-up"
tags: ["b/leetcode"]
---

# LeetCode #174 - Dungeon Game - Programación Dinámica (Bottom-Up)

## Solución optimizada mediante Programación Dinámica Bottom-Up (iterativa) para [[174_dungeon_game]].

Esta solución resuelve el problema **LeetCode #174 - Dungeon Game** utilizando **Programación Dinámica con enfoque Bottom-Up**, evitando la recursión y optimizando el uso de memoria.

---

# ¿Por qué el enfoque Bottom-Up es superior?

- **No hay riesgo de stack overflow:**  
  Al no usar recursividad, no consumimos el stack con m\*n llamadas recursivas, mientras más grande es la matriz, mayor riesgo existe de que ocurra este error en el enfoque recursivo, en este enfoque iterativo, no existe dicha posibilidad.

- **Eficiencia Espacial:**  
  Reducimos la complejidad espacial de **O(m × n)** a **O(n)** utilizando únicamente una fila auxiliar (memo).

- **Localidad de Datos:**  
  Al recorrer la matriz de forma iterativa, no hace falta pasar el mapa cache entre llamadas como haria la forma recursiva, cosa que en algunos lenguajes generaría muchas copias.

- **Otros aspectos:**  
  Es mucho más facil de debugear, cosa que se aprecia en entornos laborales.

---

# Idea de la solución

En lugar de intentar calcular la vida mínima desde la celda inicial, llegar al final y comenzar el camino inverso usando la memoización, hacemos exactamente lo contrario:

Comenzamos desde la **celda destino** efectivamente y recorremos la matriz hacia el origen.

La razón es que la vida mínima necesaria en una posición depende de la vida requerida en las posiciones a las que podremos movernos (derecha o abajo), es decir, del "futuro", y ahí es cuando entra la memoización, donde mantendremos un vector de tamaño n, que almacenará la vida minima requerida para avanzar por la derecha o hacia abajo, se ejemplificará mejor más adelante en este documento.

---

# Recurrencia

Sea `dp[i][j]` la cantidad mínima de vida necesaria para entrar a la celda `(i,j)`.

La relación de recurrencia es:

$$
dp[i][j]=\max\left(1,\min(dp[i+1][j],dp[i][j+1])-dungeon[i][j]\right)
$$

donde:

- `min(...)` elige el camino que requiere menos vida futura.
- `max(1, ...)` garantiza que la vida nunca sea menor que **1**.

---

# Implementación (Python)

```python
def calculateMinimumHP(dungeon):
    if not dungeon or not dungeon[0]:
        return 1

    m = len(dungeon)
    n = len(dungeon[0])

    # dp[j] almacenará la salud mínima necesaria para la fila actual
    dp = [0] * n

    # Caso base: destino (m-1, n-1)
    dp[n - 1] = max(1, 1 - dungeon[m - 1][n - 1])

    # Completar la última fila (solo podemos movernos hacia la derecha)
    for j in range(n - 2, -1, -1):
        dp[j] = max(1, dp[j + 1] - dungeon[m - 1][j])

    # Procesar el resto de la matriz desde abajo hacia arriba
    for i in range(m - 2, -1, -1):

        # Última columna
        dp[n - 1] = max(1, dp[n - 1] - dungeon[i][n - 1])

        # Resto de columnas
        for j in range(n - 2, -1, -1):
            # Elijo el camino con menor vida requerida
            min_next = min(dp[j], dp[j + 1])
            dp[j] = max(1, min_next - dungeon[i][j])

    return dp[0]
```

---

# Ejemplo paso por paso

**Entrada:**

```text
[-2, -3,  3]
[-5,-10,  1]
[10, 30, -5]
```

# 1. Inicialización del destino

Comenzamos calculando la celda destino `(2,2)`.

```text
dp[2] = max(1, 1 - (-5)) = 6
```

Estado del vector:

```text
[0, 0, 6]
```

---

# 2. Llenado de la última fila (Fila 2)

Recorremos la última fila de **derecha a izquierda**.

### Celda (2,1)

```text
max(1, dp[2] - 30)
= max(1, 6 - 30)
= 1
```

### Celda (2,0)

```text
max(1, dp[1] - 10)
= max(1, 1 - 10)
= 1
```

Estado del vector:

```text
[1, 1, 6]
```

En este momento, `dp` representa la salud mínima necesaria para toda la **fila 2**.

---

# 3. Procesamiento de la fila 1

Ahora utilizamos la fila inferior ya calculada para actualizar la fila 1.

### Celda (1,2)

Solo puedo ir hacia abajo

```text
max(1, dp[2] - 1)
= max(1, 6 - 1)
= 5
```

Estado:

```text
[1, 1, 5]
```

---

### Celda (1,1)

Acá en el vector tenemos que dp[1] es el valor de vida requerida si me voy hacia abajo, dp[2] si me voy a la derecha, por eso hacemos el mínimo

```text
min(dp[1], dp[2]) - (-10)
= min(1, 5) + 10
= 11
```

Estado:

```text
[1, 11, 5]
```

---

### Celda (1,0)

```text
min(dp[0], dp[1]) - (-5)
= min(1, 11) + 5
= 6
```

Estado final de la fila:

```text
[6, 11, 5]
```

Ahora `dp` representa completamente la **fila 1**.

---

# 4. Procesamiento de la fila 0

Finalmente calculamos la fila inicial.

### Celda (0,2)

```text
max(1, dp[2] - 3)
= max(1, 5 - 3)
= 2
```

Estado:

```text
[6, 11, 2]
```

---

### Celda (0,1)

```text
min(dp[1], dp[2]) - (-3)
= min(11, 2) + 3
= 5
```

Estado:

```text
[6, 5, 2]
```

---

### Celda (0,0)

```text
min(dp[0], dp[1]) - (-2)
= min(6, 5) + 2
= 7
```

Estado final:

```text
[7, 5, 2]
```

---

# Evolución del vector `dp`

| Paso             | Fila procesada  | Estado del vector `dp` |
| ---------------- | --------------- | ---------------------- |
| Inicialización   | Destino         | `[0, 0, 6]`            |
| Fin de la Fila 2 | Fila inferior   | `[1, 1, 6]`            |
| Fin de la Fila 1 | Fila intermedia | `[6, 11, 5]`           |
| Fin de la Fila 0 | Fila superior   | `[7, 5, 2]`            |

---

# Resultado

Al finalizar el algoritmo obtenemos:

```text
dp[0] = 7
```

Por lo tanto, el caballero necesita comenzar con **7 puntos de vida** para garantizar que nunca su salud caiga por debajo de **1** y pueda rescatar a la princesa.

---

# Complejidad

- **Tiempo:** `O(m × n)`, crece linealmente con el tamaño de la entrada.
- **Espacio:** `O(n)`

---

# ¿Cómo funciona la optimización de memoria?

Una implementación clásica utiliza una matriz `dp[m][n]`.

Sin embargo, al recorrer la matriz desde la esquina inferior derecha hacia la superior izquierda, cada celda únicamente necesita conocer:

- el valor inmediatamente debajo;
- el valor inmediatamente a la derecha.

No es necesario conservar todas las filas calculadas.

Por ello podemos reutilizar un único arreglo de longitud `n`, actualizándolo fila por fila.

Esto reduce la complejidad espacial de:

$$
O(m \times n)
$$

a

$$
O(n)
$$

sin modificar la complejidad temporal.

---

# Comparación entre Top-Down y Bottom-Up

| Característica            | Top-Down (Recursivo) | Bottom-Up (Iterativo) |
| ------------------------- | -------------------- | --------------------- |
| Stack Overflow            | Riesgo alto          | Nulo                  |
| Complejidad temporal      | O(m × n)             | O(m × n)              |
| Complejidad espacial      | O(m × n) + Stack     | O(n)                  |
| Facilidad para depuración | Media                | Alta                  |

---

# Aspectos negativos

Si necesitaramos saber el camino exacto que debe hacer el caballero para llegar al destino no podriamos, porque el memo tendria solo la primer fila... para lograr eso podemos sacrificar un poco de memoria y dejar el memo completo para la matriz.

---

# Conclusión

El enfoque **Bottom-Up** representa la solución más eficiente para este problema.

Además de mantener la misma complejidad temporal que la versión recursiva con memoización, elimina completamente el riesgo de **Stack Overflow**, reduce significativamente el consumo de memoria y mejora el rendimiento gracias a un acceso más eficiente a la memoria caché.

Por estas razones, es el enfoque más adecuado.
