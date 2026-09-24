---
title: Treap
tags:
  - data-structures
alias:
  - árbol de búsqueda binaria aleatorio
  - árbol de búsqueda aleatorizado
  - tree heap
  - randomized binary search tree
---
## 1. Qué es y cómo funciona

### Intuición
Un Treap puede pensarse como un archivador de fichas de alumnos. Cada ficha tiene un **legajo** y un número de **suerte** asignado al azar. El legajo indica dónde guardarla, dejando los menores a la izquierda y los mayores, a la derecha. El número de suerte decide qué ficha queda más arriba en el archivador.

De la misma forma, el Treap conserva los datos ordenados por su **clave** (los legajos), pero usa las **prioridades aleatorias** (suerte) para evitar que el archivador se convierta en una fila larga cuando los legajos llegan ordenados. Esto evita que el orden de llegada determine directamente la forma del árbol.

### Definición / propiedades

Un **Treap** es un árbol binario donde cada nodo guarda una **clave**, un valor asociado y una **prioridad** aleatoria. Debe cumplir dos invariantes:

- **Propiedad de BST (árbol binario de búsqueda):** las claves menores quedan en el subárbol izquierdo y las mayores, en el derecho.
- **Propiedad de heap máximo:** la prioridad de cada nodo es mayor o igual que la de sus hijos.

### Representación

Cada nodo contiene una clave, una prioridad y dos referencias: hijo izquierdo e hijo derecho. La raíz tiene la prioridad más alta; hacia abajo, las prioridades disminuyen. Al mismo tiempo, las claves menores quedan a la izquierda y las mayores, a la derecha.

![Representación de un Treap](/attachments/grimorio/data-structures/treap.svg)

## 2. Operaciones y complejidad

### Operaciones principales
Todo se apoya en dos primitivas; el resto se expresa en términos de ellas.

- `split(T, x)` parte el treap en dos: uno con las claves $\le x$ y otro con las mayores
- `merge(T1, T2)` une dos treaps, bajo la precondición de que toda clave de `T1` sea menor que toda clave de `T2`
- `find(x)` busca una clave descendiendo por comparación, igual que en un [[binary search tree]]
- `insert(x)` genera una prioridad aleatoria, hace `split` por `x` y dos `merge` con el nodo nuevo
- `erase(x)` ubica el nodo y lo reemplaza por el `merge` de sus dos hijos
- `union(T1, T2)` combina dos treaps cualesquiera, sin la precondición de `merge`

### Complejidad
- `split`, `merge`, `find`, `insert`, `erase`: $O(\log n)$ esperado
- `union` sobre treaps de tamaños $m \le n$: $O(m \log(n/m))$ esperado
- `build` a partir de una lista ya ordenada: $O(n)$
- Espacio: $O(n)$, más $O(\log n)$ esperado de pila por la recursión

> **Nota:** las cotas son **esperadas**, no amortizadas ni de peor caso. El azar está en las prioridades, no en los datos: no existe una secuencia de entrada que degrade el treap, pero una tirada desafortunada puede producir un árbol de altura $O(n)$. La probabilidad es despreciable y se renueva en cada inserción.

### Detalles operativos
- Las claves son únicas: insertar una repetida no crea un nodo nuevo. La prioridad no desempata claves.
- `merge` con la precondición violada rompe el orden de claves de forma silenciosa.
- Prioridades repetidas no invalidan la estructura, pero degradan la cota si el generador tiene poco rango.
- Costo oculto: cada nodo guarda dos punteros y dos enteros, y los nodos están dispersos en memoria.

## 3. Implementación

### Idea de implementación
La implementación mantiene una raíz y nodos enlazados con sus hijos. `split` recorre por clave y devuelve dos raíces; `merge` elige como raíz al nodo con mayor prioridad y conserva recursivamente el resto. Con esas operaciones, `insert` separa alrededor de la clave y coloca el nodo nuevo entre ambos árboles, mientras `erase` une los hijos del nodo eliminado.

Las operaciones son recursivas porque cada llamada resuelve el mismo problema en un subárbol más pequeño. La prioridad se genera al crear el nodo; por eso el orden de inserción no determina por sí solo la forma final del árbol.

### Invariantes
- Para cada nodo, todas las claves del hijo izquierdo son menores y todas las del hijo derecho son mayores.
- La prioridad de un nodo es mayor o igual que la prioridad de cualquiera de sus hijos.
- Un nodo tiene como máximo un hijo izquierdo y un hijo derecho; un subárbol vacío se representa con `None`.
- Las operaciones públicas actualizan la raíz con el resultado de la operación recursiva.
- Las claves son únicas: insertar una clave existente no modifica el árbol.

### Ejemplo de código

```python
from random import randrange

class Nodo:
  def __init__(self, clave):
    self.clave = clave
    self.prioridad = randrange(1_000_000)
    self.izq = self.der = None


class Treap:
  def __init__(self):
    self.raiz = None

  def split(self, nodo, clave):
    if nodo is None:
      return None, None
    if nodo.clave <= clave:
      nodo.der, mayor = self.split(nodo.der, clave)
      return nodo, mayor
    menor, nodo.izq = self.split(nodo.izq, clave)
    return menor, nodo

  def merge(self, menor, mayor):
    if menor is None:
      return mayor
    if mayor is None:
      return menor
    if menor.prioridad >= mayor.prioridad:
      menor.der = self.merge(menor.der, mayor)
      return menor
    mayor.izq = self.merge(menor, mayor.izq)
    return mayor

  def find(self, clave):
    nodo = self.raiz
    while nodo is not None and nodo.clave != clave:
      nodo = nodo.izq if clave < nodo.clave else nodo.der
    return nodo is not None

  def insert(self, clave):
    if self.find(clave):
      return
    nuevo = Nodo(clave)
    menor, mayor = self.split(self.raiz, clave)
    self.raiz = self.merge(self.merge(menor, nuevo), mayor)

  def _erase(self, nodo, clave):
    if nodo is None:
      return
    if nodo.clave == clave:
      reemplazo = self.merge(nodo.izq, nodo.der)
      return reemplazo
    if clave < nodo.clave:
      nodo.izq = self._erase(nodo.izq, clave)
    else:
      nodo.der = self._erase(nodo.der, clave)
    return nodo

  def erase(self, clave):
    self.raiz = self._erase(self.raiz, clave)

  def inorder(self, nodo=None):
    if nodo is None:
      nodo = self.raiz
    yield from self._inorder(nodo)

  def _inorder(self, nodo):
    if nodo is not None:
      yield from self._inorder(nodo.izq)
      yield nodo.clave
      yield from self._inorder(nodo.der)
```

Uso típico con entrada y salida esperada:

```python
t = Treap()
for clave in [8, 3, 10, 1, 6]:
  t.insert(clave)
t.erase(3)

print(t.find(6))          # True
print(list(t.inorder())) # [1, 6, 8, 10]
```

## 4. Uso y criterio

### Casos de uso

- **Conjuntos dinámicos ordenados**: inserciones, búsquedas y eliminaciones eficientes manteniendo el orden, con costo esperado $O(\log n)$.
- **Consultas por rango**: localizar y recorrer los elementos comprendidos entre dos claves.
- **Partir/combinar conjuntos ordenados**: `split` y `merge` permiten operar sobre subconjuntos completos sin procesar elemento por elemento.

### Cuándo NO usarlo
- No importa el orden de los datos y nunca hay borrados: un array ordenado alcanza y es más simple.
- Los datos casi no cambian: el overhead de mantener prioridades y punteros no se justifica.
- Se necesita garantizar $O(\log n)$ en el **peor caso**, no en esperanza (por ejemplo, en sistemas de tiempo real).

### Comparaciones
- **vs [[hash table]]**: ofrece $O(1)$ promedio pero sin orden. Usá Treap cuando necesitás conservar el orden o hacer consultas por rango.
- **vs [[binary search tree]] simple**: un BST puede degradar a $O(n)$ según el orden de inserción; el Treap evita esa degradación gracias a las prioridades aleatorias, aunque sin garantizarlo en el peor caso.

### Ventajas / desventajas
**Ventajas:** mantiene el orden con operaciones eficientes, `split`/`merge` naturales para partir y unir conjuntos, implementación más simple que [[avl tree]] o [[red-black tree]], no depende del orden de inserción.

**Desventajas:** sin garantía de peor caso, algo más de memoria que un BST simple por guardar la prioridad, depende de un generador de números aleatorios de buena calidad.

### Señales de reconocimiento
- "Necesito insertar y eliminar manteniendo todo ordenado."
- "Los datos pueden llegar en cualquier orden, incluso ya ordenados."
- "Necesito consultar rangos, o dividir y unir conjuntos completos."

## 5. Relaciones y extensiones

### Variantes
- **Treap balanceado por tamaño (*weight-balanced*)**: en vez de usar prioridades puramente aleatorias, se pueden derivar de una función que priorice según el tamaño del subárbol, útil cuando se necesita un balance más predecible que el probabilístico puro.
- **Treap acotado / con capacidad fija**: variantes que limitan la profundidad o el tamaño máximo, usadas cuando se requieren garantías de memoria constante (por ejemplo, en sistemas embebidos o caches).
- **Treap indexado (*order-statistics treap*):** se agrega a cada nodo el tamaño de su subárbol, lo que permite responder en $O(\log n)$ preguntas como "¿cuál es el k-ésimo elemento?" o "¿cuántos elementos son menores que x?".
- **Treap con hashing determinístico (*zip trees*)**: en lugar de generar la prioridad con un generador aleatorio explícito, se deriva mediante una función hash de la clave obteniendo una variante moderna que simplifica aún más el Treap clásico.

### Relación con otras estructuras
- **BST (Árbol Binario de Búsqueda)** y **Heap**: el Treap es, en esencia, un BST al que se le agrega una segunda restricción (la del heap) para resolver su problema estructural más grave: el desbalance en el peor caso.
- **Árboles balanceados deterministas ([[avl tree]], [[red-black tree]])**: resuelven el mismo problema que el Treap (evitar degeneración a $O(n)$) pero mediante reglas de rebalanceo estrictas y deterministas, en lugar de aleatoriedad. El Treap logra una complejidad esperada equivalente con una implementación considerablemente más simple, a costa de perder la garantía de peor caso estricta.


### Notas avanzadas

#### Caching y localidad
Al no tener rotaciones deterministas rígidas como el [[avl tree]], el patrón de acceso a memoria de un Treap puede ser menos predecible; en aplicaciones sensibles al rendimiento de caché de CPU, esto es una consideración a tener en cuenta frente a estructuras más compactas como [[b tree]].

#### Concurrencia
Las operaciones de `split` y `merge` son especialmente amigables para el paralelismo, ya que dividen el problema en subárboles independientes. Existen versiones de Treaps concurrentes que aprovechan esta propiedad para permitir accesos simultáneos con baja contención, algo mucho más difícil de lograr en [[avl tree]] o [[red-black tree]] debido a sus reglas de rebalanceo rígidas.

## 6. Referencias y recursos
- [Treap (árbol cartesiano)](https://cp-algorithms.com/data_structures/treap.html)
- [Treaps](https://aprende.olimpiada-informatica.org/algoritmia-treaps)
