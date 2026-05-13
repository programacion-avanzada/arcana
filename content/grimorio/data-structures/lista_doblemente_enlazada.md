---
title: 'Lista doblemente enlazada'
tags: ['data-structures']
alias: ['lista doble', 'doubly linked list', 'DLL']
---

## 1. Qué es y cómo funciona

### Intuición
Una **lista doblemente enlazada** puede pensarse como un tren de pasajeros: si estamos parados en el vagón C, podemos decidir ir hacia el vagón B o hacia el vagón D.

La idea central es que cada elemento conoce tanto al elemento siguiente como al anterior. Esto resuelve una limitación de la lista simplemente enlazada: en una lista simple no se puede volver hacia atrás directamente; para acceder al nodo anterior habría que recorrer la lista desde el inicio hasta la posición anterior, lo cual es ineficiente.

### Definición / propiedades
Una lista doblemente enlazada está compuesta por **nodos**. Cada nodo contiene tres campos:

- Un **dato**, donde se guarda el valor.
- Un puntero al **nodo anterior**.
- Un puntero al **nodo siguiente**.

Propiedades clave:

- Permite **movimiento bidireccional**.
- Se puede modificar cualquier elemento si se accede previamente a su nodo.
- El acceso es **secuencial**, no directo por índice como en un array.
- El primer nodo tiene su puntero anterior en `null`.
- El último nodo tiene su puntero siguiente en `null`.
- En una variante circular, el primero apunta al último y el último apunta al primero.

### Representación
Internamente, la estructura mantiene una secuencia de nodos enlazados en ambas direcciones. La lista suele guardar una referencia a la **cabeza** (`head`) y otra a la **cola** (`tail`).

En la representación, el primer nodo apunta hacia `null` por su lado anterior. Cada nodo apunta al siguiente y al anterior, hasta llegar al último nodo, cuyo puntero siguiente apunta a `null`.

![Representación de una lista doblemente enlazada](/attachments/grimorio/data-structures/lista-doblemente-enlazada.svg)

Diagrama simplificado:

```text
null <- [prev | dato | next] <-> [prev | dato | next] <-> [prev | dato | next] -> null
          head                                                     tail
```

## 2. Operaciones y complejidad

### Operaciones principales

- **Inserción al principio**: agrega un nodo al inicio de la lista.
- **Inserción al final**: agrega un nodo al final de la lista.
- **Inserción en orden**: recorre la lista hasta encontrar la posición correcta e inserta el nodo.
- **Eliminación del primero**: elimina el nodo ubicado en la cabeza.
- **Eliminación del último**: elimina el nodo ubicado en la cola.
- **Eliminación por valor**: busca un valor y elimina el nodo que lo contiene.
- **Búsqueda**: recorre la lista hasta encontrar un valor.
- **Concat**: une dos listas doblemente enlazadas.
- **Size**: devuelve la cantidad de nodos de la lista.

### Complejidad

| Operación | Peor caso | Mejor caso | Promedio | Espacio adicional | Comentario |
|---|---:|---:|---:|---:|---|
| Insertar al principio | $O(1)$ | $Ω(1)$ | $Θ(1)$ | $O(1)$ | Solo se actualizan referencias entre nodos. |
| Insertar al final | $O(1)$ | $Ω(1)$ | $Θ(1)$ | $O(1)$ | Se usa el puntero `tail`. |
| Insertar en orden | $O(n)$ | $Ω(1)$ | $Θ(n)$ | $O(1)$ | Hay que recorrer la lista para ubicar la posición. |
| Eliminar primero | $O(1)$ | $Ω(1)$ | $Θ(1)$ | $O(1)$ | Se actualiza la cabeza y los punteros correspondientes. |
| Eliminar último | $O(1)$ | $Ω(1)$ | $Θ(1)$ | $O(1)$ | Se actualiza la cola y los punteros correspondientes. |
| Eliminar por valor | $O(n)$ | $Ω(1)$ | $Θ(n)$ | $O(1)$ | Primero hay que buscar el nodo. |
| Buscar | $O(n)$ | $Ω(1)$ | $Θ(n)$ | $O(1)$ | La búsqueda es secuencial desde el primer nodo.<br>Si la lista está ordenada podríamos buscar también de atrás hacia adelante.<br>Aunque la complejidad temporal seguiría siendo $O(n)$. |
| Concatenar | $O(1)$ | $Ω(1)$ | $Θ(1)$ | $O(1)$ | Si ambas listas tienen `head` y `tail`, alcanza con cambiar punteros. |
| Size | $O(1)$ | $Ω(1)$ | $Θ(1)$ | $O(1)$ | Requiere mantener un contador actualizado. |

### Detalles operativos

- En una lista vacía, tanto `head` como `tail` son `None`.
- Al insertar el primer elemento, ese nodo pasa a ser simultáneamente `head` y `tail`.
- Al eliminar el único elemento, la lista vuelve al estado vacío.
- Si ya se tiene una referencia directa al nodo, insertar o eliminar cerca de ese nodo puede hacerse en $O(1)$.
- El costo oculto principal está en los recorridos: acceder a una posición intermedia requiere avanzar nodo por nodo.
- Cada modificación debe actualizar correctamente los punteros `prev` y `next`; si se actualizan mal, pueden quedar nodos desconectados o referencias inconsistentes.

## 3. Implementación

### Idea de implementación
La implementación típica mantiene nodos distribuidos en memoria. Cada nodo se conecta de forma bidireccional con sus vecinos.

La lista conserva dos punteros principales:

- `head`: referencia al primer nodo.
- `tail`: referencia al último nodo.

Además, puede mantener un contador `_size` para devolver el tamaño en tiempo constante.

### Invariantes

- Si la lista está vacía, `head == None`, `tail == None` y `_size == 0`.
- Si la lista no está vacía, `head.prev == None`.
- Si la lista no está vacía, `tail.next == None`.
- Para todo nodo que no sea el último, `nodo.next.prev == nodo`.
- Para todo nodo que no sea el primero, `nodo.prev.next == nodo`.
- El valor de `_size` debe coincidir siempre con la cantidad real de nodos.

### Ejemplo de código

```python
class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.next = None
        self.prev = None


class ListaDoblementeEnlazada:
    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def add(self, elemento):
        nuevo_nodo = Nodo(elemento)

        if self._size == 0:
            self.head = nuevo_nodo
            self.tail = nuevo_nodo
        else:
            self.tail.next = nuevo_nodo
            nuevo_nodo.prev = self.tail
            self.tail = nuevo_nodo

        self._size += 1

    def clear(self):
        self.head = None
        self.tail = None
        self._size = 0

    def contains(self, elemento):
        actual = self.head

        while actual is not None:
            if actual.dato == elemento:
                return True
            actual = actual.next

        return False

    def _obtener_nodo(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("Índice fuera de rango")

        if index < self._size // 2:
            actual = self.head
            for _ in range(index):
                actual = actual.next
        else:
            actual = self.tail
            for _ in range(self._size - 1, index, -1):
                actual = actual.prev

        return actual

    def get(self, index):
        return self._obtener_nodo(index).dato

    def set(self, index, nuevo_elemento):
        nodo = self._obtener_nodo(index)
        valor_anterior = nodo.dato
        nodo.dato = nuevo_elemento
        return valor_anterior

    def size(self):
        return self._size
```

Ejemplo de uso:

```python
lista = ListaDoblementeEnlazada()

for x in [10, 20, 30]:
    lista.add(x)

for i in range(lista.size()):
    print(lista.get(i))
```

Salida esperada:

```text
10
20
30
```

## 4. Uso y criterio

### Casos de uso

- **Historial con navegación bidireccional**: permite avanzar y retroceder, como en un navegador.
- **Reproducción multimedia**: permite pasar a la canción siguiente o volver a la canción anterior.
- **Cachés LRU**: se usa para mover elementos al frente o eliminarlos rápidamente cuando se combinan con una tabla hash.
- **Deques**: permite inserciones y eliminaciones eficientes en ambos extremos.

### Cuándo NO usarlo

No conviene usar una lista doblemente enlazada cuando:

- Solo se necesita recorrer en una dirección.
- Se requiere acceso rápido por índice.
- La memoria es una restricción importante.
- La estructura se modifica poco y se consulta mucho por posición.

En esos casos, una lista simple o un array puede ser más conveniente.

### Comparaciones

- **vs lista simplemente enlazada**: la lista simple usa menos memoria y tiene menos punteros para mantener, pero solo permite avanzar en una dirección. La lista doble permite volver hacia atrás.
- **vs array**: el array es mucho más rápido para acceder por índice, porque permite acceso directo. La lista doble es más conveniente cuando se tienen referencias a nodos y se necesitan inserciones o eliminaciones sin mover todos los elementos.

### Ventajas / desventajas

Ventajas:

- Inserción y eliminación en extremos en $O(1)$.
- Inserción o eliminación en $O(1)$ si ya se tiene la referencia al nodo.
- Permite recorrido bidireccional.
- Crecimiento dinámico sin necesidad de realocar un bloque contiguo de memoria.

Desventajas:

- Usa más memoria por nodo, porque guarda dos referencias adicionales: `prev` y `next`.
- La búsqueda es lenta en comparación con arrays o tablas hash.
- Acceder a una posición intermedia requiere recorrer la lista.
- Es más fácil cometer errores al actualizar punteros, porque una operación puede requerir cambiar varias referencias.

### Señales de reconocimiento

Una lista doblemente enlazada suele ser adecuada cuando el problema menciona:

- Navegar hacia adelante y hacia atrás.
- Insertar o eliminar elementos frecuentemente en ambos extremos.
- Mover elementos dentro de una secuencia sin copiar toda la estructura.
- Mantener un orden de uso, como en políticas de caché.
- Implementar una cola doble o un historial.

## 5. Relaciones y extensiones

### Variantes

- **Lista doblemente enlazada circular**: el último nodo apunta al primero y el primero apunta al último. Se usa cuando se requiere recorrido continuo, como turnos rotativos o listas cíclicas.
- **Lista doblemente enlazada con nodo centinela**: agrega un nodo especial que no almacena datos reales. Sirve para simplificar casos borde como listas vacías o inserciones en extremos.
- **Lista doblemente enlazada ordenada**: mantiene los elementos ordenados según una clave. Facilita recorridos ordenados, pero las inserciones suelen ser $O(n)$.

### Relación con otras estructuras

- **Lista simplemente enlazada**: es su antecesora conceptual. La lista doble agrega navegación hacia atrás.
- **Grafos**: las listas enlazadas se usan frecuentemente para representar listas de adyacencia.
- **Deque**: puede implementarse naturalmente con una lista doblemente enlazada.
- **Tabla hash + lista doble**: combinación típica para implementar una caché LRU eficiente.

### Notas avanzadas

- ### Persistencia

  Las listas doblemente enlazadas son adecuadas para modelar estructuras persistentes porque su organización basada en nodos permite compartir gran parte de la estructura entre distintas versiones, copiando únicamente los nodos que se ven afectados por una modificación.
  Esto resulta más eficiente que estructuras basadas en arreglos, donde una modificación suele requerir la copia de grandes bloques de memoria.
  Además, la existencia de enlaces hacia el nodo anterior y siguiente facilita la reconstrucción de estados previos y el recorrido bidireccional entre versiones, lo cual es especialmente útil en escenarios de backtracking, historiales y sistemas de versiones.

- ### Ordenamientos y reorganización

  Si bien las listas doblemente enlazadas no son la estructura más eficiente para aplicar algoritmos clásicos de ordenamiento, resultan particularmente adecuadas para reorganizar elementos existentes.
  Esto se debe a que el reordenamiento puede realizarse modificando únicamente las referencias entre nodos, sin necesidad de mover o copiar los datos almacenados.
  En comparación con estructuras basadas en arreglos, donde mover un elemento implica desplazar múltiples posiciones de memoria, las listas dobles permiten cambios locales con menor costo conceptual, lo que las vuelve útiles en sistemas donde la reorganización es frecuente pero el orden total no es crítico.

- ### Listas autoajustables

  Las listas doblemente enlazadas son ideales para implementar estrategias autoajustables, como move-to-front, debido a que permiten eliminar y reinsertar nodos en tiempo constante cuando se dispone de una referencia al nodo.
  La presencia de enlaces hacia el nodo anterior elimina la necesidad de recorrer la estructura para localizar el elemento previo, lo que no ocurre en listas simplemente enlazadas.
  Por este motivo, superan a estructuras indexadas cuando se prioriza la adaptación dinámica a patrones de uso, como sucede en cachés simples o listas de acceso frecuente.

- ### Caching y tuning
  En sistemas de caché, gestión de recursos, historiales y buffers, las listas doblemente enlazadas resultan especialmente adecuadas porque permiten insertar y eliminar elementos en ambos extremos de forma eficiente, así como mover elementos internos con bajo costo.
  Estas operaciones son fundamentales en políticas de reemplazo como LRU, donde los elementos más recientemente utilizados deben desplazarse rápidamente dentro de la estructura.
  A diferencia de los arreglos, las listas dobles evitan desplazamientos masivos de elementos, y frente a estructuras más complejas como árboles, ofrecen una solución más simple cuando no se requiere ordenamiento ni búsquedas jerárquicas.


## 6. Referencias y recursos

- Cormen, Leiserson, Rivest y Stein. *Introduction to Algorithms*, capítulo 10, sección 10.2, página 257.
- Goodrich y Tamassia. *Data Structures and Algorithms in Java*, cuarta edición, capítulo 3, sección 3.3, página 170.