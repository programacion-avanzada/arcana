---
title: 'Deque (Double-ended Queue)'
tags: ['data-structures', 'template']
alias: ['Deque', 'Double-ended queue']
---

## 1. Qué es y cómo funciona
### Intuición
Un deque (pronunciado "deck", acrónimo de Double-Ended Queue) es un tipo especial de estructura de datos que permite añadir y eliminar elementos de ambos extremos de forma eficiente. Resuelve problemas donde se necesita la flexibilidad de una pila y una cola simultáneamente.
### Definición y propiedades
- Generalización de Pila y Cola: Puede comportarse como LIFO o FIFO según la necesidad. 
- Acceso en ambos extremos: Permite insertar y eliminar elementos tanto en el frente (front) como en el final (back). 
- Acceso restringido: Al igual que sus variantes, no permite acceso directo eficiente a elementos intermedios.
- Invariante clave: Los extremos siempre referencian los elementos más antiguos y más recientes disponibles para su extracción.
### Representación
Internamente, se organiza como una secuencia de nodos o bloques. A diferencia de una Pila, que tiene un solo "techo", el Deque se visualiza como un tubo abierto en ambos sentidos.

![Representación del deque](/content/attachments/grimorio/data-structures/deque.svg)

## 2. Operaciones y complejidad
### Operaciones principales
- `append(x)`: Añade x al extremo derecho del deque.
- `appendleft(x)`: Añade x al extremo izquierdo del deque.
- `extend(iterable)`: Añade todos los elementos del iterable al extremo derecho.
- `extendleft(iterable)`: Añade todos los elementos al extremo izquierdo, pero los elementos se insertan uno a uno, resultando en un orden invertido.
- `remove(valor)`: Elimina la primera aparición del valor especificado de la deque. Si no se encuentra valor, genera un ErrorValor.
- `pop()`: Elimina y devuelve un elemento del extremo derecho.
- `popleft()`: Elimina y devuelve un elemento del extremo izquierdo.
- `clear()`: Elimina todos los elementos del deque.
- `Indexación`: Accede a los elementos por posición usando índices positivos o negativos.
- `len()`: Devuelve el número de elementos en la deque.
- `count(valor)`: Este método cuenta el número de ocurrencias de un elemento específico en el deque.
- `rotate(n)`: Este método rota el deque en n pasos. N positivo gira hacia la derecha y n negativo gira hacia la izquierda.
- `reverse()`: Este método invierte el orden de los elementos en el deque.

### Complejidad

|  | Notación Big O |
| :--- | :--- |
| `append(x)` / `appendleft(x)` | $O(1)$ |
| `pop()` / `popleft()` | $O(1)$ |
| `clear()` | $O(1)$ / $O(n)$  |
| `extend(iterable)` / `extendleft(iterable)` | $O(k)$ |
| `rotate(n)` | $O(n)$ |
| `remove(x)` | $O(n)$ |
| `count(x)` | $O(n)$ |
| `Indexación` | $O(n)$ |
| `reverse()` | $O(n)$ |
| `Espacio` | $O(n)$ |

La complejidad del metodo `clear()` sera mayor si no esta presente el **Garbage collector**, como en C.

### Detalles operativos
- Flexibilidad: Al permitir push y pop en ambos lados, un deque puede actuar como una pila (usando solo un extremo) o como una cola (insertando en uno y quitando en otro).
- Búsqueda ineficiente: Al igual que la Pila, buscar un elemento interno es `O(n)`.

## 3. Implementación
### Idea de implementación
Se usan dos punteros para los extremos. En una lista doblemente enlazada, son los punteros al primer y último nodo.

### Invariantes
- El puntero front siempre apunta al elemento que se encuentra en el extremo izquierdo de la estructura.
- Si se inserta un nuevo elemento en el frente, el puntero front se actualiza y pasa a apuntar a ese nuevo.
- El puntero back siempre apunta al elemento que se encuentra en el extremo derecho de la estructura.
- Si se inserta un nuevo elemento al final, el puntero back se actualiza y pasa a apuntar a ese nuevo.
- Si la estructura se considera que está vacía cuando el puntero front y back son nulos simultáneamente.
### Ejemplo de código
```python
# El atributo `maxLen` no puede ser cambiado posteriormente.
# Si se le asignó un valor y el objeto alcanzó el límite establecido, se eliminará automáticamente el elemento de la punta contraria; en caso contrario, se insertará normalmente.


class Deque:
    def __init__(self, maxLen=None):
        if self.maxLen < 0:
            raise ValueError("maxLen tiene un valor negativo")
        self.maxLen = maxLen
        self.primero = None
        self.ultimo = None
        self.size = 0
    
    def append(self, item, /):
        nuevoDato = Nodo(item)
        if self.maxLen == None or self.size < self.maxLen:
            if self.size == 0:
                self.primero = nuevoDato
            else:
                self.ultimo.nodoDer = nuevoDato
                nuevoDato.nodoIzq = self.ultimo
            self.ultimo = nuevoDato
            self.size += 1
        else:
            self.primero = self.primero.nodoDer
            self.primero.nodoIzq = None
            self.ultimo.nodoDer = nuevoDato
            nuevoDato.nodoIzq = self.ultimo
            self.ultimo = nuevoDato
    
    def appendleft(self, item, /):
        nuevoDato = Nodo(item)
        if self.maxLen == None or self.size < self.maxLen:
            if self.size == 0:
                self.ultimo = nuevoDato
            else:
                nuevoDato.nodoDer = self.primero
                self.primero.nodoIzq = nuevoDato
            self.primero = nuevoDato
            self.size += 1
        else:
            self.ultimo = self.ultimo.nodoIzq
            self.ultimo.nodoDer = None
            self.primero.nodoIzq = nuevoDato
            nuevoDato.nodoDer = self.primero
            self.primero = nuevoDato

    def pop(self):
        if self.size == 0:
            raise IndexError("Deque vacio")
        retorno = self.ultimo
        self.ultimo = self.ultimo.nodoIzq
        if self.size == 1:
            self.primero = None
        else:
            self.ultimo.nodoDer = None
        self.size -= 1
        return retorno.dato

    def popleft(self):
        if self.size == 0:
            raise IndexError("Deque vacio")
        retorno = self.primero
        self.primero = self.primero.nodoDer
        if self.size == 1:
            self.ultimo = None
        else:
            self.primero.nodoIzq = None
        self.size -= 1
        return retorno.dato
```
### Ejemplo de uso típico: Verificación de palíndromos
Una palabra es un palíndromo si se lee igual de izquierda a derecha que de derecha a izquierda. El deque permite resolver esto de forma eficiente comparando los extremos simultáneamente.

```python
d = deque()
palabra = "neuquen"

for i in palabra:
    d.append(i)

palindromo = True

for i in range(len(d)):
    if len(d) > 1  and d.popleft() != d.pop():
        palindromo = False
        break
    
print("La palabra: "+palabra+" "+ "si es un palindromo"if palindromo else "no es un palindromo")
```
## 4. Uso y criterio

### Casos de uso
- Verificación de palíndromos

- Problemas de Ventana Deslizante (Sliding Window)
    - Ejemplo: Encontrar el subvector de tamaño k con el promedio más alto.
    - Ejemplo: De una lista de reproducción de música, mantener las últimas k canciones reproducidas.
- Sistemas de Planificación y Gestión de tareas (Scheduling).
- Implementación de cola de prioridad con dos tipos de prioridades.

- Procesamiento de datos en tiempo real.

### Cuándo NO usarlo
- Si el problema requiere encontrar elementos en posiciones intermedias, el costo O(n) lo hace ineficiente.
- Si el tamaño de los datos es conocido y no habrá inserciones en los extremos, un array estático consume menos memoria.

### Comparaciones
- **vs Pila**: El deque es una versión más flexible que permite el acceso por ambos extremos, no sólo por el tope.
- **vs Cola**: El deque permite comportarse como una cola pero añade la posibilidad de insertar elementos al frente si es necesario.
- **vs Lista**: El deque es más eficiente para inserciones y extracciones en ambos extremos O(1), mientras que la lista es O(n).

### Ventajas / desventajas
| Ventajas | Desventajas |
| :--- | :--- |
| Comportamiento FIFO, LIFO si el problema lo requiere ambos| No cumple el contrato de pila o cola a estrictamente |
| Tiempo O(1) para añadir o eliminar elementos en extremos |  Falta de acceso aleatorio |

### Señales de reconocimiento
- “Procesar por ambos extremos de un conjunto de datos”.
- “Mantener los k elementos más recientes”.
- “Deshacer/Rehacer”(Historial de navegación).

## 5. Relaciones y extensiones

### Variantes
- Deque restringido de entrada: La entrada está limitada en un extremo, mientras que la eliminación está permitida en ambos extremos. 
- Deque restringido de salida: la salida está limitada en un extremo, pero la inserción está permitida en ambos extremos.
- Deque restringido en cantidad de elementos máximos


### Relación con otras estructuras
- Es una generalización de Pila y Cola.
- Se puede implementar sobre una lista doblemente enlazada.
- Se puede implementar sobre un array circular.


### Notas avanzadas
#### Entorno de concurrencia
- Según Sundell y Tsigas (2004), para conservar la consistencia en entornos de concurrencia, el método más común es la exclusión mutua u otra forma de bloqueo. Pero al hacerlo degradamos el rendimiento general a causa de:

    - **Deadlocks** (Condición en la que un **proceso A** bloquea recursos necesarios para otro, en este caso un **proceso B**, y este viceversa con **A**).

    - **Starvation** (Procesos listos, pero sin acceso al material a causa de procesos de mayor prioridad)

    - **Priority Inversion** (Procesos de baja prioridad, que llegan a retrasar a los de alta prioridad)

- Otra forma es usar implementaciones Lock-free que reducen el degradamiento general y evitan el uso del bloqueo, usando operaciones atómicas "Compare-And-Swap" (CAS)


## 6. Referencias y recursos
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. Introduction to Algorithms (3rd ed.). MIT Press. Capítulo 10.1: Stacks and queues.
- Python Software Foundation. collections — Container datatypes: deque. Recuperado de [Python](https://docs.python.org/3/)
- Python Wiki. Recuperado de [Wiki](https://wiki.python.org/python/FrontPage.html)
- Geek for Geeks. Deque in Python. Recuperado de: [Deque in Python - GeeksforGeeks](https://www.geeksforgeeks.org/python/deque-in-python/)
- Geek for Geeks. Deque Data Structure. Recuperado de: [Deque Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/dsa/deque-set-1-introduction-applications/)
- LeetCode. 10 Sliding Window Patterns For Coding Interviews. Recuperado de: [10 Sliding Windows Patterns - LeetCode](https://leetcode.com/discuss/post/7344963/10-sliding-window-patterns-for-coding-in-pokf/)
- Sundell, H., & Tsigas, P. (2004). Lock-free and practical deques using single-word compare-and-swap. Recuperado de: [arxiv](https://arxiv.org/abs/cs/0408016)