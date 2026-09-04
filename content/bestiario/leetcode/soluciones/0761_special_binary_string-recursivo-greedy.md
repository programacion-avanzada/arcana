---
title: LeetCode0761 - Special Binary String - División y Conquista + Greedy
tags:
  - leetcode
  - solucion
---

← Volver a [[0761_special_binary_string]]

## Técnicas utilizadas

- **División y Conquista (Recursión):** Descomponemos el problema principal en subproblemas independientes de menor tamaño. Cada [[string]] binario especial se puede separar de manera única en subcadenas especiales "elementales" (aquellas que no se pueden dividir más en el mismo nivel). El problema de optimizar cada subcadena elemental se resuelve de forma recursiva sobre su interior.
- **Estrategia Greedy (Ávida):** Dado que tenemos la libertad de intercambiar cualquier par de subcadenas especiales consecutivas, podemos ordenar un conjunto de subcadenas especiales de nivel superior adyacentes de cualquier manera. La estrategia óptima (codiciosa) consiste en ordenarlas lexicográficamente en orden descendente para asegurar que los `'1'` se posicionen lo más a la izquierda posible en el resultado consolidado.

---

## Idea de la solución

Un [[string]] binario especial $S$ se puede ver como una secuencia de paréntesis balanceados. Las subcadenas especiales que tocan el balance cero en el nivel superior representan componentes independientes que están uno al lado del otro.

1. **Caso base:** Si el [[string]] es vacío o tiene longitud 2 (es decir, `"10"`), no se puede descomponer más ni optimizar internamente, por lo que se retorna como está.
2. **Fase de División:** Recorremos el [[string]] de izquierda a derecha y llevamos una cuenta de balance (sumando 1 por cada `'1'`, restando 1 por cada `'0'`). Cada vez que el balance vuelve a 0, hemos identificado una subcadena especial elemental.
3. **Resolución recursiva (Conquista):** Para cada subcadena elemental identificada en el rango $S[i : j+1]$, sabemos que comienza con `'1'` y termina con `'0'`. Su interior, $S[i+1 : j]$, es otro [[string]] especial. Resolvemos recursivamente el interior: `makeLargestSpecial(S[i+1 : j])` e intercambiamos el componente por `'1' + interior_optimizado + '0'`.
4. **Paso Greedy (Combinación):** Almacenamos todos los componentes optimizados de nivel superior en un [[dynamic array]]. Los ordenamos lexicográficamente en orden descendente (por ejemplo, `"1100"` antes que `"10"`).
5. **Reconstrucción:** Concatenamos el [[dynamic array]] ordenado y lo retornamos.

---

## Código

A continuación se presenta la implementación concisa y óptima en Python:

```python
def makeLargestSpecial(s: str) -> str:
    # Caso base: la cadena no se puede subdividir más
    if not s or s == "10":
        return s
    
    balance = 0
    inicio = 0
    componentes = []
    
    # 1. Identificar y resolver recursivamente los componentes
    for fin, char in enumerate(s):
        if char == '1':
            balance += 1
        else:
            balance -= 1
            
        if balance == 0:
            # S[inicio:fin+1] es una subcadena especial elemental
            # S[inicio] es '1' y S[fin] es '0'.
            # Procesamos el interior S[inicio+1:fin] recursivamente
            interior_optimizado = makeLargestSpecial(s[inicio + 1 : fin])
            componentes.append('1' + interior_optimizado + '0')
            inicio = fin + 1
            
    # 2. Ordenar greedy de forma descendente
    componentes.sort(reverse=True)
    
    # 3. Combinar los resultados
    return "".join(componentes)
```

---

## Traza de ejemplo

Evaluemos la función con la entrada del archivo de descripción: $S = \text{"11011000"}$.

### **Llamada inicial:** `makeLargestSpecial("11011000")`
- Recorrido del [[string]]:
  - `fin = 0`, char = `'1'` $\to$ balance = 1
  - `fin = 1`, char = `'1'` $\to$ balance = 2
  - `fin = 2`, char = `'0'` $\to$ balance = 1
  - `fin = 3`, char = `'1'` $\to$ balance = 2
  - `fin = 4`, char = `'1'` $\to$ balance = 3
  - `fin = 5`, char = `'0'` $\to$ balance = 2
  - `fin = 6`, char = `'0'` $\to$ balance = 1
  - `fin = 7`, char = `'0'` $\to$ balance = 0 $\to$ **¡Fin de componente elemental!**
- Se detecta un único componente de nivel superior: `s[0:8]` (todo el [[string]]).
- Se extrae su interior: `s[1:7] = "101100"`.
- Se realiza la llamada recursiva: `makeLargestSpecial("101100")`.

---

#### **Llamada de nivel 2:** `makeLargestSpecial("101100")`
- Recorrido del [[string]]:
  - `fin = 0`, char = `'1'` $\to$ balance = 1
  - `fin = 1`, char = `'0'` $\to$ balance = 0 $\to$ **¡Fin de componente elemental!**
    - Componente en `s[0:2] = "10"`.
    - Llamada recursiva para su interior: `makeLargestSpecial("")` $\to$ Retorna `""`.
    - Se añade al [[dynamic array]] de componentes: `'1' + "" + '0' = "10"`.
    - Siguiente inicio = 2.
  - `fin = 2`, char = `'1'` $\to$ balance = 1
  - `fin = 3`, char = `'1'` $\to$ balance = 2
  - `fin = 4`, char = `'0'` $\to$ balance = 1
  - `fin = 5`, char = `'0'` $\to$ balance = 0 $\to$ **¡Fin de componente elemental!**
    - Componente en `s[2:6] = "1100"`.
    - Llamada recursiva para su interior: `makeLargestSpecial("10")` $\to$ Retorna `"10"` (caso base).
    - Se añade al [[dynamic array]] de componentes: `'1' + "10" + '0' = "1100"`.
- [[dynamic array]] de componentes en este nivel antes de ordenar: `["10", "1100"]`.
- **Paso Greedy (Sort descendente):** `["1100", "10"]`.
- Retorna la unión del [[dynamic array]] ordenado: `"110010"`.

---

### **Retorno a la llamada inicial:**
- Se recibe `"110010"` como el interior optimizado del componente de primer nivel.
- Se envuelve con `'1'` y `'0'`: `"1" + "110010" + "0" = "11100100"`.
- Se agrega al [[dynamic array]] de componentes de la llamada inicial: `["11100100"]`.
- Ordenar el [[dynamic array]] de un solo elemento no altera nada: `["11100100"]`.
- Retorna `"11100100"`.

---

## Complejidad

### Temporal
- **Análisis:** En el peor de los casos ([[string]] completamente anidados como `"111000"` o bloques repetidos), el algoritmo se ejecuta en tiempo cuadrático respecto a la longitud del [[string]] $N$.
- **Justificación:**
  1. En cada nivel de recursión, el recorrido del [[string]] para identificar componentes toma $O(N)$ pasos.
  2. La profundidad máxima del árbol de recursión es $N/2$ (cuando el [[string]] está totalmente anidado).
  3. En cada nivel de la recursión, el ordenamiento de los componentes puede tomar $O(M \log M)$ comparaciones, donde cada comparación entre [[string]] de longitud $L$ toma $O(L)$ tiempo. La suma de longitudes de los [[string]] a ordenar es a lo sumo $N$, por lo que la fase de ordenamiento está acotada por $O(N \log N)$ o $O(N^2)$ en el peor de los casos.
- Por ende, la complejidad temporal total en el peor de los casos es de:
  
  $$O(N^2)$$

### Espacial
- **Análisis:** La memoria adicional consumida por el programa proviene de la [[stack]] de recursión y del almacenamiento de las subcadenas creadas en cada nivel.
- **Justificación:**
  1. La profundidad de la [[stack]] recursiva es como máximo $O(N)$ (específicamente $N/2$).
  2. En cada nivel de la recursión, se construyen nuevas subcadenas que acumulan en total una longitud proporcional a $N$.
- Por lo tanto, la complejidad espacial total está acotada por:
  
  $$O(N)$$

---

## Cuándo usar esta técnica

### Favorable cuando
- El problema exhibe una **subestructura óptima** clara y recursiva (como la jerarquía de los paréntesis balanceados).
- La operación permitida (intercambiar elementos adyacentes) nos otorga libertad total de permutación en cada nivel independiente, permitiendo que una ordenación local resuelva globalmente el problema de forma óptima (propiedad Greedy).
- Las restricciones de longitud del [[string]] ($N$) son moderadas o grandes, ya que una complejidad de $O(N^2)$ escala excelentemente.

### Limitaciones
- Requiere identificar correctamente el isomorfismo con estructuras jerárquicas balanceadas. Si la condición del prefijo ("más unos que ceros") no se cumpliera de forma estricta o las operaciones permitidas fueran menos restrictivas, la estructura en árbol se rompería y no se podría aplicar directamente esta descomposición.

### Comparación con la solución de Backtracking
- Mientras que el Backtracking explora ciegamente todas las combinaciones de intercambios a lo largo de todo el [[string]] (generando un árbol de decisión exponencial en el espacio de estados), esta solución aprovecha la estructura de árbol de anidamiento para resolver localmente en cada nodo de manera determinista y con costo cuadrático.

---

## Referencias

- LeetCode Discussion: *Explain with Parentheses analog*
- *Algoritmos Greedy y su optimalidad en problemas de ordenamiento*. Corvalán, A.
- [Secuencias de Parentesis Balanceados y Caminos de Dyck](https://en.wikipedia.org/wiki/Dyck_path)
- Operaciones elementales: [[string#2. Operaciones y complejidad]]
- Uso del arreglo dinámico en Python: [[dynamic array#2. Operaciones y complejidad]]
- Pila implícita en recursión: [[stack#Pila implícita en recursión]]
