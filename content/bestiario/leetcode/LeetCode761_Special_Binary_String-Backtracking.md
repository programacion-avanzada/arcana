---
title: LeetCode0761 - Special Binary String - Fuerza Bruta (Backtracking)
tags:
  - b/leetcode
---

← Volver a la [[LeetCode761_Special_Binary_String|descripción del problema]]

## Técnicas utilizadas

- **Fuerza Bruta / Backtracking:** Modelamos el problema como la búsqueda de un camino en un grafo de estados. Cada estado es una [[string|cadena]] binaria especial válida. Desde cada estado, generamos todas las posibles transiciones válidas (intercambios de subcadenas especiales consecutivas) y exploramos recursivamente cada una de ellas empleando una búsqueda en profundidad (DFS).
- **Control de Ciclos (Visitados):** Dado que la operación de intercambio es simétrica (si podemos pasar de la [[string|cadena]] $X$ a la [[string|cadena]] $Y$, también podemos regresar de $Y$ a $X$), la estructura del espacio de búsqueda es un grafo no dirigido con ciclos. Para evitar bucles infinitos de recursión, utilizamos un [[set|conjunto]] de estados visitados.

---

## Idea de la solución

El enfoque de fuerza bruta consiste en simular directamente las reglas del enunciado paso a paso sin asumir ninguna propiedad jerárquica u optimalidad local:

1. **Definir el objetivo:** Encontrar la [[string|cadena]] binaria especial lexicográficamente más grande reachable desde la [[string|cadena]] original.
2. **Generar transiciones válidas:** Para una [[string|cadena]] dada $S$:
   - Buscamos todas las posibles posiciones de inicio $i$.
   - Encontramos cualquier subcadena especial $A = S[i : j+1]$.
   - Si $A$ es especial, buscamos inmediatamente después (en $j+1$) otra subcadena especial $B = S[j+1 : k+1]$.
   - Si encontramos un par de subcadenas especiales consecutivas $A$ y $B$, formamos una nueva [[string|cadena]] intercambiándolas: $S_{nueva} = S[:i] + B + A + S[k+1:]$.
3. **Exploración:** Llamamos recursivamente al algoritmo con $S_{nueva}$.
4. **Evitar ciclos y optimizar:** Llevamos un registro global del string máximo visto hasta ahora y un [[set|conjunto]] `visited` para no procesar el mismo estado más de una vez.

---

## Código

A continuación se muestra la implementación corregida y completa del enfoque por Backtracking en Python:

```python
def makeLargestSpecialBacktracking(s: str) -> str:
    visited = set()
    max_string = s

    # Función auxiliar para determinar si una subcadena es especial
    def es_especial(sub: str) -> bool:
        if not sub:
            return False
        balance = 0
        for char in sub:
            if char == '1':
                balance += 1
            else:
                balance -= 1
            if balance < 0:
                # El número de '0's supera al de '1's en un prefijo
                return False
        return balance == 0

    def backtrack(estado_actual: str):
        nonlocal max_string
        
        # Evitar procesar estados ya explorados
        if estado_actual in visited:
            return
        visited.add(estado_actual)
        
        # Actualizar el máximo global si encontramos un estado mayor
        if estado_actual > max_string:
            max_string = estado_actual
            
        n = len(estado_actual)
        
        # Buscar todas las parejas de subcadenas especiales consecutivas
        for i in range(n):
            # j se incrementa de 2 en 2 porque las cadenas especiales tienen longitud par
            for j in range(i + 1, n, 2):
                sub_A = estado_actual[i : j + 1]
                if es_especial(sub_A):
                    # Buscar subcadena B inmediatamente consecutiva (longitud par)
                    for k in range(j + 2, n, 2):
                        sub_B = estado_actual[j + 1 : k + 1]
                        if es_especial(sub_B):
                            # Generar nuevo estado realizando el swap (A, B) -> (B, A)
                            nuevo_estado = (
                                estado_actual[:i] + 
                                sub_B + 
                                sub_A + 
                                estado_actual[k + 1:]
                            )
                            backtrack(nuevo_estado)

    backtrack(s)
    return max_string
```

## Traza de ejemplo

Evaluemos la función con la entrada del archivo de descripción: $S = \text{"11011000"}$.

### **Paso 1: Estado inicial $S_0 = \text{"11011000"}$**
- `max_string` se inicializa como `"11011000"`.
- `visited = {"11011000"}`.
- Se buscan subcadenas especiales consecutivas en $S_0$:
  - A partir de la posición $i=0$:
    - Se encuentra la subcadena especial en `s[0:8]` (toda la [[string|cadena]]), pero no queda espacio para una subcadena consecutiva $B$.
  - A partir de la posición $i=1$:
    - Se evalúa `s[1:3] = "10"`. Es especial $\to$ **$sub_A = \text{"10"}$**.
    - Buscamos $sub_B$ inmediatamente después (inicio en index 3, `k` empezando en `j + 2 = 4`):
      - `k = 4` $\to$ `s[3:5] = "11"` $\to$ No es especial.
      - `k = 6` $\to$ `s[3:7] = "1100"`. Es especial $\to$ **$sub_B = \text{"1100"}$**.
    - Intercambiamos $sub_A$ y $sub_B$:
      - `nuevo_estado = s[:1] + sub_B + sub_A + s[7:] = "1" + "1100" + "10" + "0" = "11100100"`.
    - Llamada recursiva a `backtrack("11100100")`.

---

### **Paso 2: Llamada recursiva con $S_1 = \text{"11100100"}$**
- `"11100100"` no está en `visited`. Se añade: `visited = {"11011000", "11100100"}`.
- Como `"11100100" > "11011000"`, se actualiza `max_string = "11100100"`.
- Se buscan subcadenas especiales consecutivas en $S_1$:
  - A partir de la posición $i=1$:
    - Se evalúa `s[1:5] = "1100"`. Es especial $\to$ **$sub_A = \text{"1100"}$**.
    - Buscamos $sub_B$ inmediatamente después (inicio en index 5, `k` empezando en `j + 2 = 6`):
      - `k = 6` $\to$ `s[5:7] = "10"`. Es especial $\to$ **$sub_B = \text{"10"}$**.
    - Intercambiamos $sub_A$ y $sub_B$:
      - `nuevo_estado = s[:1] + "10" + "1100" + s[7:] = "11011000"`.
    - Llamada recursiva a `backtrack("11011000")`.
      - Dado que `"11011000"` ya está en `visited`, la llamada retorna inmediatamente sin hacer nada.
  - No hay otros pares de subcadenas especiales consecutivas que produzcan estados sin visitar.
- Termina la ejecución de la rama.

---

### **Retorno de la llamada inicial:**
- No hay más combinaciones de subcadenas consecutivas en $S_0$.
- La función finaliza y retorna `max_string = "11100100"`.

---

## Complejidad

### Temporal
- **Análisis:** En el peor de los casos, el algoritmo explora todo el espacio de estados de cadenas especiales válidas de longitud $N$.
- **Justificación:** 
  1. El número de cadenas binarias especiales de longitud $N$ es equivalente al número de secuencias de paréntesis balanceados de longitud $N$, el cual está determinado por el **número de Catalan** $C_{N/2}$.
  2. Los números de Catalan crecen de manera extremadamente rápida. Por ejemplo, para $N = 20$, $C_{10} = 16,796$ estados. Para las restricciones del problema ($N = 50$), $C_{25} \approx 4.86 \times 10^{12}$ estados.
  3. En cada estado visitado, el algoritmo realiza bucles anidados $O(N^3)$ para buscar subcadenas consecutivas; al incluir el costo $O(N)$ de evaluar `es_especial()` y construir el nuevo estado, el procesamiento total por estado es $O(N^4)$.
- Por ende, en el peor de los casos, la complejidad temporal es exponencial:
  
  $$O(C_{N/2} \cdot N^4) \approx O\left(\frac{4^{N/2}}{(N/2)^{3/2}} \cdot N^4\right) = O(2^N \cdot N^{2.5})$$

### Espacial
- **Análisis:** La memoria consumida depende principalmente de la [[stack|pila de recursión]] y del [[set|conjunto]] `visited` que almacena las cadenas exploradas.
- **Justificación:**
  1. En el peor caso, el [[set|conjunto]] de estados `visited` puede almacenar hasta $O(C_{N/2})$ cadenas.
  2. Cada [[string|cadena]] ocupa $O(N)$ memoria.
- Por lo tanto, la complejidad espacial es exponencial en el peor de los casos:
  
  $$O(C_{N/2} \cdot N)$$

---

## Cuándo usar esta técnica

### Favorable cuando
- El tamaño de la entrada $N$ es muy pequeño ($N \le 12$), donde el número de Catalan correspondiente es manejable (ej. para $N=12$, $C_6 = 132$).
- No se conoce una propiedad matemática o de optimalidad local (como la descomposición recursiva jerárquica) y se necesita verificar exhaustivamente todas las posibilidades para garantizar la corrección.
- Queremos obtener todas las cadenas binarias especiales válidas alcanzables (es decir, el grafo completo de transiciones), no únicamente el elemento máximo.

### Limitaciones
- **Inviable para cadenas medianas o largas:** Para $N = 50$, el programa excederá el límite de tiempo y memoria debido al tamaño colosal del espacio de estados.
- No utiliza la información estructural de que los intercambios consecutivos respetan una estructura de anidamiento jerárquica de árbol.

### Comparación con la solución de División y Conquista + Greedy
- La solución por División y Conquista + Greedy explota la estructura recursiva del problema para resolverlo en $O(N^2)$ tiempo y $O(N)$ espacio de forma determinista y sin explorar estados no óptimos. El Backtracking explora el grafo completo de estados de forma ciega y sufre de explosión combinatoria.

---

## Referencias

- *Introduction to Algorithms* (Cormen et al.) - Sección de Backtracking y Búsqueda en Espacios de Estados.
- *Números de Catalan y sus aplicaciones combinatorias*.
- [[set#Definición y propiedades|Definición y propiedades del Conjunto (Set)]]
- [[string#2. Operaciones y complejidad|Operaciones elementales sobre Cadenas (Strings)]]
- [[stack#Pila implícita en recursión|Uso de la Pila (Stack) en procesos recursivos]]
