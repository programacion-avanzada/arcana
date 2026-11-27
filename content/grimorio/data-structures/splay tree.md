---
title: 'Splay Tree'
tags:
  - data-structures
alias: ['Splay Tree', 'Árbol biselado']
---

## 1. Qué es y cómo funciona

### Intuición

Un **Splay Tree** es un árbol binario de búsqueda ([[binary-search-tree]]) autoajustable. Cada vez que se accede a un nodo, por ejemplo mediante una búsqueda, inserción o eliminación, ese nodo se mueve hacia la raíz mediante una secuencia de rotaciones denominada **splaying**.

La idea es simple: si un elemento se utiliza con frecuencia, conviene acercarlo a la raíz para que los próximos accesos sean más rápidos. A diferencia de un [[avl tree]], el Splay Tree no intenta mantener permanentemente una forma equilibrada, sino que se adapta al patrón de accesos.

Por ejemplo, si se consulta repetidamente el elemento 40, después de su primera búsqueda quedará en la raíz. Los accesos posteriores a ese elemento serán muy económicos.

### Definición / propiedades

Un Splay Tree mantiene las propiedades fundamentales de un [[binary-search-tree]]:

- Cada nodo posee como máximo un hijo izquierdo y uno derecho.
- Todos los valores del subárbol izquierdo de un nodo son menores que él.
- Todos los valores del subárbol derecho son mayores que él.

Luego de un acceso, se realiza el splay correspondiente. Este utiliza tres situaciones principales:

- Zig: El nodo accedido es hijo directo de la raíz.
- Zig-Zig: El nodo y su padre están ambos del mismo lado.
- Zig-Zag: El nodo y su padre están en direcciones opuestas.

Las rotaciones modifican la forma del árbol, pero conservan el orden del [[binary-search-tree]].

### Representación

Cada nodo puede representarse de forma sencilla:

![Estructura de un nodo de splay tree](splay-tree-nodos.svg)

A diferencia de árboles auto-balanceados como [[avl tree]] o [[red black tree]], el nodo no necesita almacenar un factor de balance ni un color adicional.

Una representación conceptual de un acceso podría ser:

![Acceso a 40 en una cadena 10, 20, 30, 40: el 40 sube a la raíz](splay-tree-acceso.svg)

## 2. Operaciones y complejidad

### Operaciones principales

Las operaciones fundamentales son:

- `splay(x)`: A partir del nodo x, se realizan rotaciones hasta llevarlo a la raíz.
- `find(x)`: Busca un nodo y luego le aplica splay. Si no lo encuentra, puede aplicarse sobre el último nodo visitado.
- `insert(x)`: Inserta un nodo y luego le aplica splay.
- `delete(x)`: Lleva el nodo a la raíz mediante splay, lo elimina y une los dos subárboles resultantes.

### Complejidad

| Operación | Peor caso | Complejidad amortizada |
| --------- | --------- | ---------------------- |
| find      | $O(n)$    | $O(\log n)$       |
| insert    | $O(n)$    | $O(\log n)$       |
| delete    | $O(n)$    | $O(\log n)$       |
| splay     | $O(n)$    | $O(\log n)$       |

La diferencia más importante está entre peor caso individual y costo amortizado.

### Detalles operativos

Una operación aislada puede recorrer un árbol prácticamente lineal y costar $O(n)$. Sin embargo, Sleator y Tarjan demostraron que para una secuencia de operaciones sobre un árbol de n nodos, las operaciones estándar tienen un costo amortizado de $O(\log n)$ por operación.

Esto significa que no debemos interpretar $O(\log n)$ como una garantía de que cada búsqueda demora $O(\log n)$. Es una garantía sobre el comportamiento acumulado de una secuencia de operaciones.

El espacio requerido es $O(n)$ porque se almacena un nodo por elemento. Además, no es necesario guardar información adicional de balance en cada nodo.

## 3. Implementación

### Idea de implementación

`Node` solo guarda la clave y sus hijos; `SplayTree` mantiene la raíz y toda la lógica, en tres niveles:

- **Rotaciones** (`_rotate_right`, `_rotate_left`): suben un hijo sin romper el orden del [[binary-search-tree]].
- **Casos del splay** (`_zig`, `_zig_zig`, `_zig_zag`): combinan rotaciones según la posición del nodo, su padre y su abuelo.
- **Operaciones** (`splay`, `find`, `insert`, `delete`): `splay` guarda el camino recorrido, porque los nodos no conocen a su padre, y sube el nodo de a dos niveles. Las demás operaciones lo usan.

### Invariantes

- El árbol debe continuar siendo un [[binary-search-tree]] después de cada operación.
- El elemento accedido termine en la raíz.

### Ejemplo de código

```python
from __future__ import annotations

# Nodo individual: solo guarda la clave y sus dos hijos.
class Node:
  def __init__(self, key: int):
    self.key = key
    self.left: Node | None = None
    self.right: Node | None = None

class SplayTree:
  def __init__(self):
    self.root: Node | None = None

  # ---------- Rotaciones ----------
  # Cada rotación sube un hijo y devuelve la nueva raíz del subárbol.

  # Rotación a la derecha: sube el hijo izquierdo.
  def _rotate_right(self, node: Node) -> Node:
    y = node.left
    node.left = y.right
    y.right = node
    return y

  # Rotación a la izquierda: sube el hijo derecho.
  def _rotate_left(self, node: Node) -> Node:
    y = node.right
    node.right = y.left
    y.left = node
    return y

  # ---------- Casos del splay ----------

  # Caso Zig: el nodo a subir es hijo directo de la raíz 'parent'.
  # Realiza una sola rotación.
  def _zig(self, parent: Node, is_left: bool) -> Node:
    if is_left:
      return self._rotate_right(parent)
    return self._rotate_left(parent)

  # Caso Zig-Zig: el nodo y su padre están alineados en la misma dirección.
  # Primero se rota el abuelo y luego el padre.
  def _zig_zig(self, grandparent: Node, is_left: bool) -> Node:
    if is_left:
      # Alineados a la izquierda (Izq-Izq)
      return self._rotate_right(self._rotate_right(grandparent))
    # Alineados a la derecha (Der-Der)
    return self._rotate_left(self._rotate_left(grandparent))

  # Caso Zig-Zag: el nodo y su padre están en direcciones opuestas.
  # Se rota el padre y luego el abuelo.
  def _zig_zag(self, grandparent: Node, is_left_right: bool) -> Node:
    if is_left_right:
      # Izquierda-Derecha
      grandparent.left = self._rotate_left(grandparent.left)
      return self._rotate_right(grandparent)
    # Derecha-Izquierda
    grandparent.right = self._rotate_right(grandparent.right)
    return self._rotate_left(grandparent)

  # ---------- Operaciones ----------

  # Lleva a la raíz el nodo con 'key' o, si no existe, el último nodo visitado.
  def splay(self, key: int) -> None:
    if self.root is None:
      return

    # 1. Bajar como en un BST guardando el camino (los nodos no conocen a su padre).
    path = [self.root]
    while path[-1].key != key:
      next_node = path[-1].left if key < path[-1].key else path[-1].right
      if next_node is None:
        break
      path.append(next_node)

    # 2. Subir el nodo de a dos niveles hasta la raíz.
    x = path[-1]
    while len(path) > 1:
      if len(path) == 2:
        # Zig: el padre de x es la raíz.
        parent = path[0]
        path = [self._zig(parent, parent.left is x)]
      else:
        grandparent, parent = path[-3], path[-2]
        parent_is_left = grandparent.left is parent
        x_is_left = parent.left is x
        if parent_is_left == x_is_left:
          subtree = self._zig_zig(grandparent, parent_is_left)
        else:
          subtree = self._zig_zag(grandparent, parent_is_left)
        # Enganchar el subárbol rotado donde estaba el abuelo.
        if len(path) > 3:
          if path[-4].left is grandparent:
            path[-4].left = subtree
          else:
            path[-4].right = subtree
        path = path[:-3] + [subtree]

    self.root = path[0]

  def find(self, key: int) -> Node | None:
    self.splay(key)
    if self.root is not None and self.root.key == key:
      return self.root
    return None

  def insert(self, key: int) -> None:
    if self.root is None:
      self.root = Node(key)
      return

    # 1. Insertar como en un BST (si la clave ya existe, no se duplica).
    node = self.root
    while node.key != key:
      if key < node.key:
        if node.left is None:
          node.left = Node(key)
        node = node.left
      else:
        if node.right is None:
          node.right = Node(key)
        node = node.right

    # 2. Subir el nodo a la raíz.
    self.splay(key)

  def delete(self, key: int) -> None:
    self.splay(key)
    if self.root is None or self.root.key != key:
      return

    left, right = self.root.left, self.root.right
    if left is None:
      self.root = right
      return

    # 'key' es mayor que todo el subárbol izquierdo: el splay sube su máximo,
    # que queda sin hijo derecho, y ahí se engancha el subárbol derecho.
    self.root = left
    self.splay(key)
    self.root.right = right
```

Vistas gráficamente (en todos los casos se hace `splay(x)`):

Zig:

![Caso zig: una rotación lleva a x a la raíz](splay-tree-zig.svg)

Zig-Zig:

![Caso zig-zig: se rota primero el abuelo z y después el padre y](splay-tree-zig-zig.svg)

Zig-Zag:

![Caso zig-zag: se rota primero el padre y y después el abuelo z](splay-tree-zig-zag.svg)

### Ejemplo de uso
```python
sp = SplayTree()

for x in [10, 20, 30]:
  sp.insert(x)        # cada nuevo nodo sube a la raíz
print(sp.root.key)    # 30

found = sp.find(10)   # zig-zig
print(found.key)      # 10
print(sp.root.key)    # 10

sp.insert(25)         # zig-zag y luego zig
print(sp.root.key)    # 25

sp.delete(20)         # sube 20, se quita y se unen sus subárboles
print(sp.root.key)    # 10

print(sp.find(28))    # None: 28 no existe...
print(sp.root.key)    # 30 pero el último nodo visitado sube igual
```

**Inserción.** Se inserta como en un [[binary-search-tree]] y luego se hace splay. Insertando 20, alcanza con un zig:

![Inserción de 20 seguida de splay hasta la raíz](splay-tree-insert.svg)

**Búsqueda.** Tras los tres `insert` queda la cadena 30, 20, 10. Buscar 10 aplica un zig-zig:

![Búsqueda de 10 seguida de splay hasta la raíz](splay-tree-find.svg)

**Inserción con zig-zag.** 25 queda como hijo izquierdo de 30, que es hijo derecho de 20: zig-zag y luego zig.

![Inserción de 25: zig-zag y luego zig hasta la raíz](splay-tree-insert-zig-zag.svg)

**Eliminación.** Se hace splay de 20 y se lo quita. Luego se hace splay del máximo del subárbol izquierdo, que queda sin hijo derecho, y ahí se engancha el derecho:

![Eliminación de 20: splay, se quita y se unen los subárboles](splay-tree-delete.svg)

**Búsqueda fallida.** Sube el último nodo visitado: buscando 28, sube el 30.

![Búsqueda fallida de 28: el último nodo visitado, 30, sube a la raíz](splay-tree-find-fallida.svg)


## 4. Uso y criterio

### Casos de uso

El Splay Tree es especialmente adecuado cuando existe **localidad de referencia**, es decir, cuando ciertos elementos tienden a utilizarse repetidamente.

Algunos ejemplos donde se usa, son:

- Sistemas donde algunos registros son consultados mucho más que otros.
- Sistemas que necesitan adaptarse dinámicamente al patrón de uso.
- Problemas donde no conocemos de antemano la frecuencia de acceso.
- Situaciones en las que queremos aprovechar accesos recientes sin mantener explícitamente contadores de frecuencia.

### Cuándo NO usarlo

No es recomendable cuando:

- Se necesita una garantía estricta de $O(\log n)$ en el peor caso de cada operación.
- Una búsqueda no debería modificar la estructura.
- Se necesita una estructura sencilla para múltiples accesos concurrentes.

Por ejemplo, en un sistema de tiempo real puede ser más conveniente utilizar un árbol con garantías de peor caso.

### Comparaciones

- [[binary-search-tree]]: Es más simple, pero puede degenerarse y alcanzar $O(n)$.
- [[avl tree]]: Mantiene un balance más estricto y garantiza $O(\log n)$ en el peor caso. Es preferible cuando importa la predictibilidad de cada operación.
- [[red black tree]]: También garantiza $O(\log n)$ en el peor caso y mantiene un balance menos estricto que AVL.
- Splay Tree: No garantiza $O(\log n)$ por operación, pero obtiene $O(\log n)$ amortizado y se adapta automáticamente al patrón de accesos.

### Ventajas / desventajas

Ventajas:

- $O(\log n)$ amortizado para las operaciones principales.
- No necesita almacenar información de balance.
- Se adapta a los patrones de acceso.
- Los elementos usados recientemente quedan cerca de la raíz.

Desventajas:

- Una operación individual puede costar $O(n)$.
- Las búsquedas modifican el árbol.
- No garantiza una altura $O(\log n)$.
- Su rendimiento por operación es menos predecible que [[avl tree]] o [[red black tree]].

### Señales de reconocimiento

- Los elementos accedidos recientemente suelen volver a utilizarse.
- Algunas claves son consultadas mucho más que otras.
- Se realizan muchas búsquedas, inserciones y eliminaciones.
- Interesa el costo total de muchas operaciones más que el peor caso de una sola.

## 5. Relaciones y extensiones

### Variantes

Existen dos estrategias principales para realizar el splay:

- Bottom-up: Primero se realiza la búsqueda y luego se sube el nodo mediante las operaciones Zig, Zig-Zig y Zig-Zag.
- Top-down: La búsqueda y reorganización se realizan simultáneamente, separando temporalmente los nodos menores y mayores que el elemento buscado.

La variante top-down puede simplificar ciertos aspectos de implementación al evitar referencias explícitas a los padres.

### Relación con otras estructuras

El Splay Tree deriva directamente del [[binary-search-tree]], ya que mantiene su propiedad de orden. A diferencia de [[avl tree]] y [[red black tree]], que buscan mantener una determinada forma estructural, el Splay Tree se reorganiza según la secuencia real de accesos.

Por otro lado, la técnica de splaying también aparece en estructuras más avanzadas como los Link-Cut Trees, utilizados para representar árboles dinámicos.

### Notas avanzadas

La concurrencia puede ser más compleja porque incluso una búsqueda modifica enlaces internos del árbol. Por lo tanto, una operación conceptualmente de lectura puede necesitar sincronización.

## 6. Referencias y recursos

- Sleator, Daniel D. y Tarjan, Robert E. **Self-Adjusting Binary Search Trees**. Journal of the ACM, Vol. 32, N.º 3, 1985, pp. 652-686.
- Cormen, Thomas H.; Leiserson, Charles E.; Rivest, Ronald L.; Stein, Clifford. **Introduction to Algorithms**. MIT Press.
- Visualizador de Splay Trees: https://cmps-people.ok.ubc.ca/ylucet/DS/SplayTree.html
- Franco, Francesco. **Splay Trees**. Medium, 16 de agosto de 2023. https://medium.com/@francescofranco_39234/splay-trees-eabd93e8085a
