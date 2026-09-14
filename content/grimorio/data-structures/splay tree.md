---
title: 'Splay Tree'
tags:
  - data-structures
alias: ['Splay Tree', 'Árbol biselado']
---
## 1. Qué es y cómo funciona

### Intuición

Un **Splay Tree** es un árbol binario de búsqueda (BST, por sus siglas en inglés: Binary Search Tree) autoajustable. Cada vez que se accede a un nodo, por ejemplo mediante una búsqueda, inserción o eliminación, ese nodo se mueve hacia la raíz mediante una secuencia de rotaciones denominada **splaying**.

La idea es simple: si un elemento se utiliza con frecuencia, conviene acercarlo a la raíz para que los próximos accesos sean más rápidos. A diferencia de un AVL, el Splay Tree no intenta mantener permanentemente una forma equilibrada, sino que se adapta al patrón de accesos.

Por ejemplo, si se consulta repetidamente el elemento 40, después de su primera búsqueda quedará en la raíz. Los accesos posteriores a ese elemento serán muy económicos.


### Definición / propiedades

Un Splay Tree mantiene las propiedades fundamentales de un BST:
- Cada nodo posee como máximo un hijo izquierdo y uno derecho.
- Todos los valores del subárbol izquierdo de un nodo son menores que él.
- Todos los valores del subárbol derecho son mayores que él.

Luego de un acceso, se realiza el splay correspondiente. Este utiliza tres situaciones principales:

- Zig: El nodo accedido es hijo directo de la raíz.
- Zig-Zig: El nodo y su padre están ambos del mismo lado.
- Zig-Zag: El nodo y su padre están en direcciones opuestas.

Las rotaciones modifican la forma del árbol, pero conservan el orden del BST.

### Representación

Cada nodo puede representarse de forma sencilla:

![](/attachments/grimorio/data-structures/splay-tree-nodos.svg)

A diferencia de árboles auto-balanceados como AVL o Red-Black, el nodo no necesita almacenar un factor de balance ni un color adicional.

Una representación conceptual de un acceso podría ser:

![](/attachments/grimorio/data-structures/splay-tree-acceso.svg)

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
| find | $O(n)$ | $O(log\space n)$ |
| insert | $O(n)$ | $O(log\space n)$ |
| delete | $O(n)$ | $O(log\space n)$ |
| splay | $O(n)$ | $O(log\space n)$ |

La diferencia más importante está entre peor caso individual y costo amortizado.

### Detalles operativos
Una operación aislada puede recorrer un árbol prácticamente lineal y costar $O(n)$. Sin embargo, Sleator y Tarjan demostraron que para una secuencia de operaciones sobre un árbol de n nodos, las operaciones estándar tienen un costo amortizado de $O(log\space n)$ por operación.

Esto significa que no debemos interpretar $O(log\space n)$ como una garantía de que cada búsqueda demora $O(log\space n)$. Es una garantía sobre el comportamiento acumulado de una secuencia de operaciones.

El espacio requerido es $O(n)$ porque se almacena un nodo por elemento. Además, no es necesario guardar información adicional de balance en cada nodo.

## 3. Implementación

### Idea de implementación

Una implementación puede basarse en dos operaciones de rotación: rotación a la derecha o rotación a la izquierda. A partir de estas rotaciones, combinándolas podríamos cubrir los casos estrella de este algoritmo: Zig, Zig-Zig y Zig-Zag (cuyas 3 definiciones se explicaron más arriba).

### Invariantes
- El árbol debe continuar siendo un BST después de cada operación.
- El elemento accedido termine en la raíz.


### Ejemplo de código
```python
# Nodo individual de un Splay Tree.
class Node:
  def __init__(self, key: int):
    self.key = key
    self.left: Node | None = None
    self.right: Node | None = None

  # Rotación a la derecha.
  def rotate_right(x: Node) -> Node:
    y = x.left
    x.left = y.right
    y.right = x
    return y

  # Rotación a la izquierda.
  def rotate_left(x: Node) -> Node:
    y = x.right
    x.right = y.left
    y.left = x
    return y

  # Caso Zig: El nodo a subir es hijo directo de la raíz 'parent'. 
  # Realiza una sola rotación.
  def zig(parent: Node, is_left: bool) -> Node:
   if is_left:
      return rotate_right(parent)
   else:
      return rotate_left(parent)

  # Caso Zig-Zig: El nodo y su padre están alineados en la misma dirección. 
  # Primero se rota el abuelo y luego el padre.
  def zig_zig(grandparent: Node, is_left: bool) -> Node:
   if is_left:
      # Alineados a la izquierda (Izq-Izq)
      grandparent = rotate_right(grandparent)
      return rotate_right(grandparent)
   else:
      # Alineados a la derecha (Der-Der)
      grandparent = rotate_left(grandparent)
      return rotate_left(grandparent)

  # Caso Zig-Zag: El nodo y su padre están en direcciones opuestas. 
  # Se rota el padre y luego el abuelo.
  def zig_zag(grandparent: Node, is_left_right: bool) -> Node:
   if is_left_right:
      # Izquierda-Derecha
       grandparent.left = rotate_left(grandparent.left)
       return rotate_right(grandparent)
   else:
       # Derecha-Izquierda
       grandparent.right = rotate_right(grandparent.right)
       return rotate_left(grandparent)
```

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

- Se necesita una garantía estricta de $O(log\space n)$ en el peor caso de cada operación.
Una búsqueda no debería modificar la estructura.
- Se necesita una estructura sencilla para múltiples accesos concurrentes.

Por ejemplo, en un sistema de tiempo real puede ser más conveniente utilizar un árbol con garantías de peor caso.


### Comparaciones

- Binary Search Tree: Es más simple, pero puede degenerarse y alcanzar $O(n)$.
- AVL Tree: Mantiene un balance más estricto y garantiza $O(log\space n)$ en el peor caso. Es preferible cuando importa la predictibilidad de cada operación.
- Red-Black Tree: También garantiza $O(log\space n)$ en el peor caso y mantiene un balance menos estricto que AVL.
- Splay Tree: No garantiza $O(log\space n)$ por operación, pero obtiene $O(log\space n)$ amortizado y se adapta automáticamente al patrón de accesos.


### Ventajas / desventajas

Ventajas:
- $O(log\space n)$ amortizado para las operaciones principales.
- No necesita almacenar información de balance.
- Se adapta a los patrones de acceso.
- Los elementos usados recientemente quedan cerca de la raíz.

Desventajas:
- Una operación individual puede costar $O(n)$.
- Las búsquedas modifican el árbol.
- No garantiza una altura $O(log\space n)$.
- Su rendimiento por operación es menos predecible que AVL o Red-Black Tree.



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

El Splay Tree deriva directamente del BST, ya que mantiene su propiedad de orden. A diferencia de AVL y Red-Black, que buscan mantener una determinada forma estructural, el Splay Tree se reorganiza según la secuencia real de accesos.

Por otro lado, la técnica de splaying también aparece en estructuras más avanzadas como los Link-Cut Trees, utilizados para representar árboles dinámicos.


### Notas avanzadas
La concurrencia puede ser más compleja porque incluso una búsqueda modifica enlaces internos del árbol. Por lo tanto, una operación conceptualmente de lectura puede necesitar sincronización.

## 6. Referencias y recursos
- Sleator, Daniel D. y Tarjan, Robert E. **Self-Adjusting Binary Search Trees**. Journal of the ACM, Vol. 32, N.º 3, 1985, pp. 652-686. 
- Cormen, Thomas H.; Leiserson, Charles E.; Rivest, Ronald L.; Stein, Clifford. **Introduction to Algorithms**. MIT Press.
- Visualizador de Splay Trees: https://cmps-people.ok.ubc.ca/ylucet/DS/SplayTree.html
