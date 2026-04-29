## ¿Qué es y cómo funciona?

### Intuición

Un array dinámico es como una estantería de libros: empezás con un mueble de tamaño fijo, y si se llena, comprás uno nuevo el doble de grande y mudás todos los libros al nuevo espacio → **automáticamente**.

Resuelve el problema de necesitar acceso inmediato por posición cuando la cantidad de elementos es incierta o crece con el tiempo.

### Definición

Estructura que almacena datos de manera contigua y ajusta su capacidad en tiempo de ejecución. Sus propiedades clave:

- **Acceso aleatorio**: cualquier elemento por índice en O(1).
- **Memoria contigua**: posiciones consecutivas garantizan localidad de caché.
- **Capacidad flexible**: al llenarse, se redimensiona asignando un bloque más grande.
- **Invariante**: elementos contiguos desde índice 0 hasta `size-1`, sin huecos; `size` nunca supera `capacidad`.
- **Costo variable en inserción/eliminación**: O(1) amortizado al final, O(n) al principio o en el medio.

### Representación

Dos variantes: **array simple** y **array circular**.

El simple redimensiona al llenarse y es óptimo para agregar al final, pero insertar en el medio requiere desplazar elementos. El circular evita desplazamientos en ambos extremos usando aritmética modular, aunque es más complejo de implementar. Ambos aprovechan la localidad de memoria.

#### Array dinámico

![Array dinámico](Imagenes/array_simple.svg)

#### Array circular dinámico

![Array dinámico](Imagenes/array_circular.svg)

## Operaciones y complejidad

### Operaciones principales

- `append(elem)` agrega al final.
- `prepend(elem)` agrega al principio.
- `insert_at(i, elem)` inserta en posición específica.
- `pop_back()` \ `pop_front()` elimina del final/inicio
- `delete_at(i)` elimina en posición específica.
- `get_at(índice)` / `set_at(índice, elem)` acceso/modificación por índice.
- `find(elem)` búsqueda lineal.
- `isEmpty()`, `size()`, `capacity()` consulta de estado.
- `clear()`, `resize()`, `reserve()` gestión de capacidad.

### Complejidad

| Operacion                       | Array simple                    | Array circular |
| ------------------------------- | ------------------------------- | -------------- |
| `append` / `pop_back`           | O(1) amortizado, O(n) peor caso | O(1)           |
| `prepend` / `pop_front`         | O(n)                            | O(1)           |
| `insert_at` / `delete_at`       | O(n)                            | O(n)           |
| `get_at` / `set_at`             | O(1)                            | O(1)           |
| `find`                          | O(n)                            | O(n)           |
| `size` / `isEmpty` / `capacity` | O(1)                            | O(1)           |
| `clear`                         | O(n) / O(1)\*                   | O(n) / O(1)\*  |
| `resize` / `reserve`            | O(n) / O(1)                     | O(n) / O(1)\*  |

\*depende de si hay destructores o se necesita copiar.

**Espacio:** O(n) en ambos casos.

### Detalles operativos

La redimensión ocurre cuando `size == capacidad` y cuesta O(n) → por eso se duplica la capacidad en vez de crecer de a uno, lo que amortiza el costo a O(1) por inserción. Insertar o eliminar en posición `i` desplaza `n-i` elementos. La memoria reservada pero no usada nunca se libera sola: es responsabilidad del programador reducir la capacidad explícitamente.

El array circular evita desplazamientos en los extremos con aritmética modular: el índice físico de la posición lógica `i` es `(inicio + i) % capacidad`. El precio es un problema de ambigüedad: si `inicio == fin`, ¿el array está vacío o lleno? La solución estándar es sacrificar una celda o mantener un contador separado.

## Implementación

### Idea de implementación

Se mantiene un bloque contiguo en _heap_ con dos variables: `size` (elementos almacenados) y `capacidad` (tamaño máximo reservado). Cuando `size == capacidad`, se aplica redimensionamiento geométrico: la capacidad se multiplica por un factor fijo (típicamente ×2).

### Invariantes

- `0 ≤ size ≤ capacity`
- Los elementos válidos ocupan índices `0` a `size-1`, sin huecos.
- Nunca se accede fuera del rango válido.
- Al eliminar en posición `i`, todos los elementos a la derecha se desplazan para mantener la contigüidad.

### Ejemplos de código

```python title="Array dinámico en python"
class ArrayDinamico:
    def __init__(self):
        self.capacidad = 1
        self.array = [None] * self.capacidad
        self.size = 0

    def append(self, elem):
        if self.size == self.capacidad:
            self._redimensionar(self.capacidad * 2)
        self.array[self.size] = elem
        self.size += 1

    def _redimensionar(self, nueva_cap):
        nuevo = [None] * nueva_cap
        for i in range(self.size):
            nuevo[i] = self.array[i]
        self.array = nuevo
        self.capacidad = nueva_cap

    def insert_at(self, pos, elem):
        if pos < 0 or pos > self.size:
            raise IndexError("Fuera de rango")
        if self.size == self.capacidad:
            self._redimensionar(self.capacidad * 2)
        for i in range(self.size, pos, -1):
            self.array[i] = self.array[i - 1]
        self.array[pos] = elem
        self.size += 1

    def delete_at(self, pos):
        if pos < 0 or pos >= self.size:
            raise IndexError("Fuera de rango")
        for i in range(pos, self.size - 1):
            self.array[i] = self.array[i + 1]
        self.size -= 1
```

> [!note] Nota
> En Python, `list` ya es un array dinámico internamente. Para simular el comportamiento de bajo nivel al estilo C, se puede usar `ctypes`: `array = (ctypes.py_object * capacidad)()`.

#### Ejemplo de uso

```python
arr = ArrayDinamico()

arr.append(10) # [10]
arr.append(20) # [10, 20]
arr.append(30) # [10, 20, 30]
arr.insert_at(1, 15) # [10, 15, 20, 30]
arr.delete_at(2) # [10, 15, 30]

for i in range(arr.tam):
    print(arr.array[i]) # 10, 15, 30
```

## Cuándo Usar un Array Dinámico

### Casos de uso

- **Tamaño variable o impredecible:** cuando la cantidad de elementos crece con el tiempo.
- **Lectura intensiva:** acceso aleatorio frecuente por índice en O(1).
- **Implementación de pilas:** operaciones LIFO solo en el extremo final: `append`/`pop_back` amortizado O(1).

### Cuándo NO usarlo

- Tamaño conocido de antemano → usar array estático (sin costo de redimensión).
- Inserciones/eliminaciones frecuentes en el medio → es preferible es preferible lista enlazada.
- Memoria muy fragmentada → es preferible lista enlazada (no requiere bloque contiguo).

### Comparaciones con Alternativas

|                            | Array dinámico  | array estático | lista enlazada |
| -------------------------- | --------------- | -------------- | -------------- |
| Acceso por índice          | O(1)            | O(1)           | O(n)           |
| Inserción al final         | O(1) amortizado | -              | O(1)           |
| Inserción en medio         | O(n)            | -              | O(1)           |
| Localidad de caché         | ✓ excelente     | ✓ excelente    | ✗ fragmentada  |
| Tamaño flexible            | ✓               | ✗              | ✓              |
| Memoria contigua requerida | ✓               | ✓              | ✗              |

### Ventajas / desventajas

**Ventajas:** acceso O(1) por índice, excelente localidad de caché, `append` amortizado O(1), no requiere conocer el tamaño de antemano.

**Desventajas:** redimensión O(n) al llenarse, inserción/eliminación en el medio O(n), requiere bloque contiguo en memoria, puede desperdiciar espacio (`capacidad > size`), redimensionar invalida iteradores existentes.

### Señales de reconocimiento

- _"La cantidad de datos es impredecible o crece"_
- _"Se necesita acceso aleatorio e inmediato"_
- _"Se agrega continuamente al final"_
- _"Se recorre constantemente"_

## Relaciones y Extensiones

### Variantes

- Factor de crecimiento variable (×1.5 o ×2): balancea uso de memoria vs. frecuencia de copias; con ×2 el total de copias no supera 2n para n inserciones.
- _Shrinking_: reduce capacidad al bajar del 25% de ocupación para evitar fragmentación externa.
- Buffer circular sobre array dinámico: base de implementaciones de _deque_ eficientes.

### Relación con otras estructuras

Es la base de `ArrayList` (Java), `vector` (C++) y `list` (Python). Puede usarse directamente para implementar pilas, colas y deques; compite con la lista enlazada cuando la localidad de caché importa más que la eficiencia en inserciones intermedias.

### Notas avanzadas

**Invalidación de punteros**: un resize mueve el buffer completo a una nueva dirección; en C/C++ cualquier puntero al buffer anterior queda inválido. `reserve()` previene reallocs si el tamaño final es conocido.

**Persistencia**: cada modificación requiere copiar el array completo (O(n)), a diferencia de estructuras persistentes como la pila enlazada.

**Concurrencia**: un resize mientras otro hilo itera produce comportamiento indefinido. La alternativa habitual son estructuras segmentadas (`ConcurrentVector`) que evitan mover toda la memoria.

## Referencias

- **Complejidad computacional de problemas y el análisis y diseño de algoritmos**. Elisa Schaeffer, 2008.
- **Data Structures: Dynamic Arrays**.
- **Visualización**. [visualising data structures and algorithms through animation - VisuAlgo](https://visualgo.net/en) 
- **Documentación sobre operaciones de ArrayList en Java**: [Java ArrayList](https://www.w3schools.com/java/java_arraylist.asp)
- **Wikipedia.**
- **[Geeks for geeks](https://www.geeksforgeeks.org/)**
  - _Difference between Static Arrays and Dynamic Arrays_.
  - _Dynamic Array in C_.
  - \_How do Dynamic arrays work.
  - _Implementation of Dynamic Array in Python_.
- [**Aprenderaprogramar.com.** \_Arrays (arreglos) dinámicos y arrays estáticos.](https://www.aprenderaprogramar.com/index.php?option=com_content&view=article&id=162:arrays-arreglos-dinamicos-y-arrays-estaticos-definicion-declaracion-ejemplos-en-programacion-cu00211a&catid=36&highlight=WyJhcnJheSJd&Itemid=60)
- **LabEx.** _Arrays Dinámicos en C++: Creación y Gestión_.
- **FAUN.dev.** _How Python Lists Work Internally: A Deep Dive Into Dynamic Arrays_.
- **Java Documentation**, ArrayList y comportamiento de resize.
