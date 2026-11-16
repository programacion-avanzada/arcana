---
title: Linked List
tags:
  - data-structures
alias:
  - lista enlazada
  - lista simple
  - lista simplemente enlazada
  - singly linked list
---

## 1. Qué es y cómo funciona

### Intuición
Una lista simplemente enlazada funciona como una cadena: cada elemento está ligado al siguiente a través de un puntero. Permite insertar y eliminar elementos sin mover el resto.

### Definición / propiedades
- Estructura dinámica de nodos
- Cada nodo tiene: dato + referencia al siguiente
- Acceso secuencial (no hay acceso directo por índice)
- El último nodo apunta a `null`

### Representación
![Lista enlazada 4, 9, 15 desde head hasta null](lista-enlazada.svg)

La imagen muestra una lista de tres nodos enlazados. Cada nodo está dividido en dos secciones: la parte izquierda contiene un valor o dato, y la parte derecha contiene un puntero que apunta al siguiente nodo. El último nodo tiene su puntero apuntando a null, indicando el final de la lista. Un puntero externo llamado head señala al primer nodo desde la izquierda, marcando la entrada a la estructura.

## 2. Operaciones y complejidad

### Operaciones principales
- `insertarInicio(x)` crea un nodo que apunta a la cabecera anterior de la lista
- `insertarFinal(x)` recorre toda la lista hasta el final y el último nodo apunta al nuevo nodo creado
- `insertarOrdenado(x)` recorre la lista hasta encontrar la posición correcta; el anterior apunta al nuevo nodo y este al siguiente
- `eliminar(x)` busca el primer nodo con ese dato y lo desvincula; el nodo anterior apunta al siguiente del eliminado
- `eliminarInicio()` desvincula el primer nodo y `head` pasa a ser el siguiente
- `eliminarFinal()` recorre hasta el anteúltimo nodo y lo deja apuntando a `null`
- `buscar(x)` recorre la lista buscando el elemento pasado por parámetro
- `recorrer()` recorre la lista hasta el final

### Complejidad
- `insertarInicio`: $O(1)$
- `insertarOrdenado`: $O(n)$
- `insertarFinal`: $O(n)$
- `eliminar`: $O(n)$
- `eliminarInicio`: $O(1)$
- `eliminarFinal`: $O(n)$
- `buscar`: $O(n)$
- `recorrer`: $O(n)$
- Espacio: $O(n)$

> **Nota:** Mantener `tail` además de `head` hace que `insertarFinal` pase de $O(n)$ a $O(1)$. `insertarInicio` sigue en $O(1)$: no se invierte nada, mejora una sola operación.
>
> `eliminarFinal` sigue costando $O(n)$ aun con `tail`, porque hay que dejar al anteúltimo apuntando a `null` y desde `tail` no se puede retroceder: los enlaces van en un solo sentido. Esa asimetría motiva la [[doubly linked list]].
>
> Tener solo `tail`, sin `head`, no sirve en una lista no circular, porque desde el último nodo no se alcanza ningún nodo previo. La excepción es la lista circular: `tail.sig` es la cabeza, así que un solo puntero da acceso a ambos extremos.

| Operación        | Solo `head` | `head` + `tail` | Circular con `tail` |
| ---------------- | ----------- | --------------- | ------------------- |
| `insertarInicio` | $O(1)$      | $O(1)$          | $O(1)$              |
| `insertarFinal`  | $O(n)$      | $O(1)$          | $O(1)$              |
| `eliminarInicio` | $O(1)$      | $O(1)$          | $O(1)$              |
| `eliminarFinal`  | $O(n)$      | $O(n)$          | $O(n)$              |

### Detalles operativos
- Puede haber overflow (solo si se agota la memoria del sistema)
- Puede haber underflow (al intentar borrar o leer en una lista vacía)
- No permite búsqueda eficiente ni acceso directo, ya que es $O(n)$
- La función  `insertarOrdenado(x)` asume que la lista se encuentra ordenada.
- Cuando se borra un elemento de una lista con un único nodo, se borra donde se encuentra el `head`. Se debe modificar el `head` a lo que corresponda (otro nodo o `null`).
- Si la lista mantiene `tail`, toda operación que modifique el final debe actualizarlo: al insertar en una lista vacía, `head` y `tail` apuntan al nodo nuevo; al eliminar el último nodo, `tail` pasa al anterior; si la lista queda vacía, ambos vuelven a `null`. Olvidar este último caso deja a `tail` apuntando a un nodo que ya no está en la lista.
- Si hay varios nodos con el mismo dato, tanto `buscar(x)` como `eliminar(x)` solo actúan sobre la primera aparición. Si se desea eliminar todas las ocurrencias, hay que iterar explícitamente en vez de retornar en la primera coincidencia.

## 3. Implementación

### Idea de implementación
Mantener una colección donde cada elemento se enlaza con el siguiente. Se usa `head` para acceder al primer elemento y, desde ahí, recorrer los demás.

### Invariantes
- `head` apunta al primer nodo o es `null`
- Cada nodo apunta al siguiente
- El último nodo apunta a `null`
- Si se mantiene `tail`: apunta al último nodo o es `null` si la lista está vacía, y `tail.sig` es siempre `null`

### Ejemplo de código

```python
class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.sig = None

class Lista:
    def __init__(self):
        self.head = None

    def insertar_inicio(self, x):
        nuevo = Nodo(x)
        nuevo.sig = self.head
        self.head = nuevo

    def insertar_ordenado(self, x):
        nuevo = Nodo(x)
        if self.head is None or self.head.dato >= x:
            nuevo.sig = self.head
            self.head = nuevo
            return
        actual = self.head
        while actual.sig and actual.sig.dato < x:
            actual = actual.sig
        nuevo.sig = actual.sig
        actual.sig = nuevo

    def insertar_final(self, x):
        nuevo = Nodo(x)
        if self.head is None:
            self.head = nuevo
            return
        actual = self.head
        while actual.sig:
            actual = actual.sig
        actual.sig = nuevo

    def eliminar(self, x):
        actual = self.head
        anterior = None
        while actual:
            if actual.dato == x:
                if anterior is None:
                    self.head = actual.sig
                else:
                    anterior.sig = actual.sig
                return
            anterior = actual
            actual = actual.sig

    def buscar(self, x):
        actual = self.head
        while actual:
            if actual.dato == x:
                return actual
            actual = actual.sig
        return None

    def recorrer(self):
        actual = self.head
        while actual:
            print(actual.dato)
            actual = actual.sig
```

#### Variante con puntero a `tail`

Solo cambian las operaciones que tocan el final; `buscar` y `recorrer` son iguales.

```python
class ListaConTail:
    def __init__(self):
        self.head = None
        self.tail = None

    def insertar_inicio(self, x):
        nuevo = Nodo(x)
        nuevo.sig = self.head
        self.head = nuevo
        if self.tail is None:
            self.tail = nuevo  # El nuevo nodo es también el último.

    def insertar_final(self, x):
        nuevo = Nodo(x)
        if self.tail is None:
            self.head = nuevo
            self.tail = nuevo
            return
        self.tail.sig = nuevo
        self.tail = nuevo  # La inserción es O(1).

    def eliminar(self, x):
        actual = self.head
        anterior = None
        while actual:
            if actual.dato == x:
                if anterior is None:
                    self.head = actual.sig
                else:
                    anterior.sig = actual.sig
                if actual is self.tail:
                    self.tail = anterior  # tail retrocede o queda en None si se vació.
                return
            anterior = actual
            actual = actual.sig
```

#### Ejemplo de uso típico

Recorrer e imprimir todos los elementos
```python
lista = Lista()
for x in [1, 2, 3]:
    lista.insertar_final(x)

lista.recorrer()  # 1, 2, 3
```

Construir $n$ elementos con `insertar_final` en un bucle cuesta $O(n^2)$ sin `tail`, porque cada inserción recorre toda la lista, y $O(n)$ con `ListaConTail`.

## 4. Uso y criterio

### Casos de uso
- Cuando se inserta o se elimina frecuentemente
- Cuando no se necesita acceso directo a los elementos
- Manejo dinámico de memoria (cuando no se conoce el tamaño de antemano)
- Cuando importa el orden pero no un elemento en específico

### Cuándo NO usarlo
- Cuando necesitás acceso directo a una posición específica
- Cuando recorrés constantemente toda la estructura
- Cuando el problema requiere acceso aleatorio frecuente

### Comparaciones
- **vs Array.** el array usa memoria contigua, tiene tamaño fijo y permite acceso directo $O(1)$, pero insertar o eliminar en el medio exige desplazar elementos. La lista simple crece dinámicamente y solo reubica punteros, pero su acceso es secuencial $O(n)$. Usá lista cuando haya constante alta y baja de elementos, sin recorridos frecuentes.
- **vs Lista Doble.** la lista doble permite recorrer en ambas direcciones, pero consume más memoria. La lista simple es más económica en memoria pero restringe el recorrido a un solo sentido. Elegí lista simple si la memoria es crítica y el recorrido es siempre hacia adelante.
- **vs Pila / Cola.** la pila y la cola restringen por diseño dónde podés insertar y eliminar para garantizar su comportamiento. La lista simple no tiene estas restricciones. Usá lista simple cuando necesitás operar o buscar en posiciones intermedias.

### Ventajas / desventajas

Ventajas:

- Crecimiento dinámico
- Inserción y eliminación sin reordenamiento
- Flexibilidad y simplicidad alta

Desventajas:

- Recorrido restringido a un solo sentido (unidireccional)
- No permite acceso directo ni búsqueda eficiente
- Overhead adicional por punteros

### Señales de reconocimiento
- "Tamaño desconocido o impredecible"
- "Funcionalidades de Undo/Redo"
- "Navegación secuencial"
- Problemas con alta frecuencia de inserciones y eliminaciones

## 5. Relaciones y extensiones

### Variantes
- Lista con puntero a tail
- [[doubly linked list]]
- Lista circular
- Lista desordenada vs. lista ordenada

### Relación con otras estructuras
- El [[stack]] y las colas son básicamente listas simples con políticas de inserción y eliminación limitadas (LIFO y FIFO respectivamente).
- Es la base para implementar árboles ya que se trata a los hijos de un nodo como una lista enlazada.
- Funciona como una solución para resolver colisiones en una [[hash table]] utilizando encadenamiento (chaining).
- Cada nodo se modela como un [[struct]] que agrupa el dato y el puntero al siguiente.

### Notas avanzadas

#### Versiones persistentes
Insertar al frente crea un nuevo head que apunta a la lista existente sin copiarla. La versión anterior queda intacta gracias al structural sharing (reutilización).
Implicancias:
- Inserción al frente $O(1)$ compartiendo todos los nodos excepto el nuevo.
- Útil para blockchain, snapshots y programación funcional (**Haskell**)
- Modificaciones en posiciones intermedias no pueden hacer sharing y copian $O(k)$ nodos previos. Siendo k la posicion modificada.

#### Concurrencia y sincronización
Inserciones y eliminaciones simultáneas pueden corromper punteros next y causar acceso a memoria inválida.
Implicancias:
- Con locks: simple de razonar, pero genera contención bajo alta carga.
- Lock-free: más complejo, problemas ABA son muy prevalentes.
- Alternativa práctica: listas thread-local o estructuras persistentes para evitar compartir estado mutable.

## 6. Referencias y recursos
- [[COR2011]] - Chapter 10.2.
