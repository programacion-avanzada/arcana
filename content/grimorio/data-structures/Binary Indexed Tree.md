---
title: Binary Indexed Tree
tags:
  - data-structures
alias:
  - Fenwick Tree
  - Binary Indexed Tree
---

## 1. Qué es y cómo funciona

### Intuición
- **Idea central:** Un Binary Indexed Tree (Árbol Indexado, Fenwick Tree o BIT) es una estructura basada en un arreglo que resuelve eficientemente sumas prefijas mientras admite actualizaciones puntuales. En lugar de guardar solo los valores originales, almacena sumas parciales de intervalos definidos por la representación binaria de los índices, de modo que una consulta se resuelve combinando pocos bloques.
- **Problema que resuelve:** Consultar repetidamente la suma `A[1] + ... + A[i]`. Con un arreglo común la consulta cuesta `O(n)`, y un arreglo de sumas prefijas la hace `O(1)` pero vuelve costosa cada modificación. El Fenwick Tree equilibra ambos casos: actualización y consulta en `O(log n)`.

### Definición / propiedades
- **Definición formal:** Usa un arreglo de tamaño `n + 1` con índices desde `1`. Cada posición `i` almacena la suma de los `Lowbit(i)` elementos que terminan en `i`. El árbol es **implícito**: no hay nodos ni punteros, solo relaciones calculadas sobre los índices.
- **Propiedades clave:** El intervalo de cada posición se determina con el bit menos significativo encendido:

```text
Lowbit(i) = i & (-i)
```

Por ejemplo, `6 = 110₂`, `Lowbit(6) = 2`, así que `BIT[6] = A[5] + A[6]`. La navegación entre posiciones usa `Parent(i) = i - Lowbit(i)` (consulta) e `i + Lowbit(i)` (actualización).

|  i  |             Binario              | lowbit(i) | Intervalo |
| :-: | :------------------------------: | :-------: | :-------: |
|  1  | $\text{00}\color{red}{\text{1}}$ |     1     |  `[1,1]`  |
|  2  | $\text{0}\color{red}{\text{10}}$ |     2     |  `[1,2]`  |
|  3  | $\text{01}\color{red}{\text{1}}$ |     1     |  `[3,3]`  |
|  4  |    $\color{red}{\text{100}}$     |     4     |  `[1,4]`  |
|  5  | $\text{10}\color{red}{\text{1}}$ |     1     |  `[5,5]`  |
|  6  | $\text{1}\color{red}{\text{10}}$ |     2     |  `[5,6]`  |
|  7  | $\text{11}\color{red}{\text{1}}$ |     1     |  `[7,7]`  |
|  8  |    $\color{red}{\text{1000}}$    |     8     |  `[1,8]`  |

### Representación

Para `A = [5, 4, 1, -1, 0, 8]` (índices desde 1), el BIT almacena:

```text
                   FENWICK TREE

A:        [ 5 ] [ 4 ] [ 1 ] [ -1 ] [ 0 ] [ 8 ]
            │     │     │     │      │     │
            ▼     ▼     ▼     ▼      ▼     ▼
BIT:      [ 5 ] [ 9 ] [ 1 ] [  9 ] [ 0 ] [ 8 ]
            │     │     │     │      │     │
            ▼     ▼     ▼     ▼      ▼     ▼
Intervalo: [1]  [1──2] [3] [1────4] [5]  [5──6]


El tamaño de cada intervalo se obtiene a partir del índice:

Índice     Binario     lowbit(i)     Intervalo
──────     ───────     ─────────     ─────────
  1         001           1           [1]
  2         010           2           [1──2]
  3         011           1           [3]
  4         100           4           [1────4]
  5         101           1           [5]
  6         110           2           [5──6]


Ejemplo:

        6 = 110₂
              ↑
        1 menos significativo
              │
              ▼
        lowbit(6) = 010₂ = 2
                         │
                         ▼
                 intervalo de 2 elementos
                         │
                         ▼
                       [5──6]
```

Cada posición cubre un intervalo de distinto tamaño según `Lowbit(i)`, lo que permite reconstruir cualquier suma prefija combinando bloques que no se solapan.

**Debe responder a:** "¿qué estoy mirando?"

## 2. Operaciones y complejidad

### Operaciones principales
- **`add(i, valor)`:** incrementa la posición `i`; actualiza cada posición del BIT cuyo intervalo contiene a `i`, avanzando con `i += Lowbit(i)`.
- **`prefixSum(i)`:** suma de `1` a `i`, combinando bloques y retrocediendo con `i -= Lowbit(i)` hasta `0`.
- **`rangeSum(l, r)`:** se obtiene como `prefixSum(r) - prefixSum(l - 1)`.
- **`get(i)`:** valor individual como `prefixSum(i) - prefixSum(i - 1)`.

### Complejidad

| Operación | Tiempo | Espacio |
| :--- | :---: | :---: |
| `add` / `prefixSum` / `rangeSum` / `get` | `O(log n)` | `O(1)` |
| Construcción con `add` | `O(n log n)` | `O(n)` |
| Construcción optimizada | `O(n)` | `O(n)` |
| Estructura | — | `O(n)` |

`add` y `prefixSum` son `O(log n)` porque en cada paso el índice cambia según `Lowbit(i)`, recorriendo tantas posiciones como bits tiene `i`. `rangeSum` hace dos `prefixSum`, por lo que sigue siendo `O(log n)`.

### Detalles operativos
La posición `0` no representa un elemento: actúa como corte de los recorridos (`prefixSum` termina cuando `i` llega a `0`; `add`, cuando supera `n`). Estos costos suponen que la operación es una **suma** con actualizaciones **puntuales**; otras operaciones o actualizaciones de rango requieren variantes.

**Debe responder a:** "¿qué puedo hacer y cuánto cuesta?"

## 3. Implementación

### Idea de implementación
Se usa un arreglo `tree` de tamaño `n + 1`. La operación base es `i & -i`. Para actualizar se sube con `i += i & -i` hasta pasar `n`; para consultar se baja con `i -= i & -i` hasta `0`. Ambas recorren `O(log n)` posiciones.

### Invariantes
- La posición `0` es solo condición de corte, no un elemento.
- `BIT[i]` contiene la suma de los `Lowbit(i)` elementos que terminan en `i`.
- Cada actualización toca todas las posiciones cuyo intervalo contiene al elemento.
- Las consultas combinan bloques que no se solapan, de modo que cada elemento se cuenta una vez.

### Ejemplo de código

```python
class FenwickTree:
    def __init__(self, n):
        self.tree = [0] * (n + 1)

    def add(self, i, delta):
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & (-i)

    def prefix_sum(self, i):
        result = 0
        while i > 0:
            result += self.tree[i]
            i -= i & (-i)
        return result

    def range_sum(self, left, right):
        return self.prefix_sum(right) - self.prefix_sum(left - 1)

```

Uso típico:

```python

bit = FenwickTree(6) 
values = [5, 4, 1, -1, 0, 8] 
for i in range(len(values)): 
	bit.add(i + 1, values[i]) 

bit.prefix_sum(4) # 9 = 5 + 4 + 1 - 1 
bit.range_sum(2, 5) # 4 = 4 + 1 - 1 + 0 
bit.add(3, 2) # actualiza solo las posiciones necesarias
```

**Debe responder a:** "¿cómo lo programo sin romperlo?"

## 4. Uso y criterio

### Casos de uso
Arreglos que cambian con frecuencia y sobre los que se consultan sumas acumuladas o de rango: sumas prefijas dinámicas, sumas de rango, actualizaciones puntuales que mantienen las consultas vigentes, y problemas con muchas operaciones mixtas sobre el mismo arreglo.

### Cuándo NO usarlo
- Si el arreglo casi no cambia: un arreglo de sumas prefijas consulta en `O(1)`.
- Si se necesitan mínimos/máximos de rango u operaciones sin inversa.
- Si hay actualizaciones de rango complejas: suele convenir un Segment Tree.
- Si solo hace falta acceso directo al valor: alcanza el arreglo original.

### Comparaciones

| Estructura     | Consulta rango | Actualización | Memoria | Rasgo              |
| -------------- | :------------: | :-----------: | :-----: | ------------------ |
| Arreglo común  |     `O(n)`     |    `O(1)`     | `O(n)`  | Acceso directo     |
| Sumas prefijas |     `O(1)`     |    `O(n)`     | `O(n)`  | Ideal si no cambia |
| Árbol Indexado |   `O(log n)`   |  `O(log n)`   | `O(n)`  | Equilibrio         |
| Segment Tree   |   `O(log n)`   |  `O(log n)`   |  `~4n`  | Más flexible       |

### Ventajas / desventajas

| Ventajas | Desventajas |
| :--- | :--- |
| `O(log n)` para consultas y actualizaciones puntuales. | Menos flexible que un Segment Tree. |
| Implementación pequeña y sencilla. | La indexación por bits es poco intuitiva al inicio. |
| Utiliza `O(n)` de espacio. | Orientado principalmente a operaciones acumulativas. |
| No necesita nodos, punteros ni referencias. | Las actualizaciones de rango requieren variantes. |
| Buena localidad de memoria al usar un arreglo. | Poco conveniente si hay que recorrer o buscar elementos individualmente. |

### Señales de reconocimiento
> "Tengo un arreglo, los valores cambian y necesito consultar repetidamente sumas de posiciones o rangos."

**Debe responder a:** "¿cuándo conviene usarlo?"

## 5. Relaciones y extensiones

### Variantes
Actualización de rango mediante diferencias; combinación de **dos Fenwick Trees** para actualizar y consultar rangos en `O(log n)`; y el **Fenwick Tree 2D**, que aplica la misma idea sobre una matriz con índices de fila y columna.

### Relación con otras estructuras
Se apoya en el **[[array]]** y su acceso directo, pero cada posición resume un intervalo. Es una alternativa dinámica a las **sumas prefijas** (equilibra consulta y actualización) frente al **Segment Tree**, que representa los intervalos de forma explícita y jerárquica, el Fenwick Tree usa una representación implícita basada en los bits del índice.
Además, BIT, se relaciona con el **[[dynamic array]]**: este permite modificar dinámicamente el tamaño de la colección, mientras que el Fenwick Tree depende de índices estables para mantener correctamente las sumas parciales.

### Notas avanzadas
La idea sirve para cualquier operación que combine correctamente sus valores, pero reconstruir `consulta(l, r) = prefijo(r) - prefijo(l-1)` exige una operación **inversa**, por lo que la suma es el caso natural. Con **compresión de coordenadas** puede trabajar sobre valores muy grandes usando un arreglo reducido.

**Debe responder a:** "¿cómo encaja en el mapa general de estructuras de datos?"

## 6. Referencias y recursos

- Peter M. Fenwick. *"A New Data Structure for Cumulative Frequency Tables"*. Software: Practice and Experience, 1994. Trabajo original.
- [CP-Algorithms — Fenwick Tree](https://cp-algorithms.com/data_structures/fenwick.html). Operaciones y variantes.
- [VisuAlgo — Fenwick Tree](https://visualgo.net/en/fenwicktree). Visualización interactiva.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*. MIT Press.
- Mark Allen Weiss. *Data Structures and Algorithm Analysis*. Pearson.
