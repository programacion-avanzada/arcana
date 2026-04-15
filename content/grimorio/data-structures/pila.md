---
title: 'Pila (Stack)'
tags: ['data-structures']
alias: ['stack', 'pila']
---

## 1. Qué es y cómo funciona

### Intuición
Una "pila" es como una pila de platos: el último que ponés es el primero que sacás.
Resuelve problemas donde el orden de procesamiento debe invertirse o deshacerse (LIFO). Es una estructura con acceso restringido desde el tope.

### Definición y propiedades
- Estructura LIFO (Last-In, First-Out)
- Solo se puede acceder/modificar el elemento en el tope
- No hay acceso directo a elementos intermedios
- Invariante clave: el tope siempre representa el último elemento insertado

### Representación
![](/attachments/grimorio/data-structures/stack.svg)

Puede implementarse sobre array, lista simplemente enlazada o lista doblemente enlazada. La elección importa según el contexto: el array es más eficiente en caché y simple de implementar, pero requiere redimensionamiento si el tamaño no es fijo; la lista enlazada evita ese problema y hace push/pop en $O(1)$ sin amortizar, a costa de overhead por punteros y peor localidad de memoria. La lista doblemente enlazada no aporta ventaja real para una pila, ya que solo se opera en un extremo.

## 2. Operaciones y complejidad

### Operaciones principales
- `push(x)` inserta un elemento en el tope
- `pop()` elimina y retorna el elemento del tope
- `peek()` / `top()` consulta el tope sin eliminarlo
- `isEmpty()` verifica si está vacía

### Complejidad
- `push`: $O(1)$
- `pop`: $O(1)$
- `peek`: $O(1)$
- Espacio: $O(n)$

Es requerido que la pila respete esas complejidades para sus operaciones elementales.

> **Nota:** La complejidad será de $O(1)$ amortizado si está implementada con arreglo dinámico.

### Detalles operativos
- Puede haber overflow (si hay límite de tamaño)
- Puede haber underflow (hacer pop en pila vacía)
- No permite búsqueda eficiente, ya que es `O(n)`

## 3. Implementación

### Idea de implementación
Mantener una colección donde solo se opera en un extremo.
En arrays, se usa un índice como puntero al tope; en listas, el head actúa como tope.

### Invariantes
- El puntero top siempre referencia el último elemento válido
- Después de un push, el nuevo elemento es el tope
- Después de un pop, el tope se actualiza correctamente
- No acceder a la pila si está vacía

### Ejemplo de código

```python
class Stack:
    def __init__(self):
        self.data = []

    def push(self, x):
        self.data.append(x)

    def pop(self):
        if self.is_empty():
            raise Exception("Stack underflow")
        return self.data.pop()

    def peek(self):
        if self.is_empty():
            raise Exception("Stack is empty")
        return self.data[-1]

    def is_empty(self):
        return len(self.data) == 0
```

#### Ejemplo de uso típico

Invertir una secuencia
```python
s = Stack()
for x in [1, 2, 3]:
    s.push(x)

while not s.is_empty():
    print(s.pop())  # 3, 2, 1
```

## 4. Uso y criterio

### Casos de uso
- Evaluación de expresiones (paréntesis, notación postfija)
- Backtracking (deshacer pasos)
- DFS (Depth-First Search)
- Manejo de llamadas (call stack)

### Cuándo NO usarlo
- Cuando necesitás acceso aleatorio (usar array o lista indexada)
- Cuando necesitás procesar en orden FIFO (usar cola)
- Cuando necesitás buscar frecuentemente elementos internos

### Comparaciones
- **vs Cola.** orden opuesto: la cola procesa en FIFO, mientras la pila procesa en LIFO. Elegí cola cuando el orden de llegada debe preservarse; elegí pila cuando necesitás invertirlo o deshacerlo.
- **vs Lista.** la pila es una lista con acceso restringido al tope. Esa restricción es una ventaja de diseño: garantiza el contrato LIFO e impide operaciones que romperían la semántica. Usá lista cuando necesitás acceso o modificación en posiciones arbitrarias.
- **vs Deque.** el deque es una generalización que incluye a la pila: permite insertar y eliminar en ambos extremos. Usar un deque como pila es válido, pero expone operaciones innecesarias que rompen la restricción LIFO. Preferí la pila cuando querés que la estructura garantice ese contrato por diseño.

#### Ventajas
- Simplicidad extrema
- Operaciones O(1) garantizadas
- Modelo mental claro

#### Desventajas
- Muy limitada en operaciones
- No permite acceso ni búsqueda eficiente
- Puede ser demasiado restrictiva para algunos problemas

### Señales de reconocimiento
- "Procesar lo más reciente primero"
- "Deshacer / rollback"
- "Estructura anidada" (paréntesis, bloques)
- Problemas que naturalmente se resuelven "yendo y volviendo"

## 5. Relaciones y extensiones

### Variantes
- Pila implementada con array
- Pila implementada con lista enlazada
- Pila con capacidad limitada

### Relación con otras estructuras
- Base conceptual de DFS en grafos
- Usada en parsing (compiladores)
- Relacionada con colas (tienen el comportamiento opuesto)
- Puede implementarse sobre listas o arrays dinámicos

### Notas avanzadas

#### Call stack en ejecución de programas
Cada vez que se invoca una función, el runtime empuja un stack frame en la pila de llamadas. Ese frame contiene dirección de retorno, parámetros, variables locales y registros guardados; al terminar la función, el frame se desapila y el control vuelve al caller.

Implicancias:
- Límite de profundidad. Stack overflow si la recursión/anidamiento es grande.
- Costos constantes pequeños. Llamadas/retornos son muy rápidos.
- Herramientas de debugging recorren esta pila (backtrace).

#### Pila implícita en recursión
La recursión usa el call stack sin que el programador la gestione explícitamente. Cada llamada recursiva agrega un frame; conceptualmente es equivalente a usar una pila explícita para guardar "estados pendientes".

Implicancias:
- Toda recursión puede reescribirse como iteración + stack explícito (control más fino de memoria).
- Profundidades grandes pueden romper por límite de stack.
- Tail recursion (cuando aplica) puede optimizarse a iteración y evitar crecimiento de pila (dependiendo del lenguaje/compilador).

Posibilidad de implementar versiones persistentes
Una pila persistente permite conservar versiones anteriores después de cada operación. Se logra con inmutabilidad + sharing estructural: cada push crea un nuevo nodo que apunta a la versión previa; pop devuelve la referencia anterior.

Implicancias:
- push/pop siguen siendo $O(1)$ y comparten memoria entre versiones.
- Útil para backtracking, undo/redo, y algoritmos funcionales.
- Trade-off: más objetos/nodos implica presión en garbage collector o allocator.

#### En concurrencia, requiere sincronización (stack thread-safe)
Si múltiples hilos acceden a la misma pila, hay riesgo de race conditions. Se puede proteger con locks (mutex) o usar implementaciones lock-free (p. ej., con operaciones atómicas tipo compare-and-swap).

Implicancias:
- Con locks: más simple pero posible contención (hilos compiten por el mismo recurso).
- Lock-free: mejor escalabilidad, pero más compleja.
- Alternativa común: pilas thread-local para evitar compartir estado cuando es posible.

## 6. Referencias y recursos
[[COR2011]] - Chapter 10.1 Stacks and queues