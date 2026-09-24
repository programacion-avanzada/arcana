---
title: AVL Tree
tags:
  - data-structures
alias:
  - avl
  - árbol avl
  - árbol binario balanceado
---
## 1. Qué es y cómo funciona

### Intuición
El **Árbol AVL** es un [[binary search tree|Árbol de Búsqueda Binaria]] (BST) que se balancea automáticamente al insertar o eliminar nodos. Así la altura se mantiene acotada, y la búsqueda, la inserción y la eliminación se resuelven de manera eficiente.

![Las claves 1 a 5 insertadas en orden en un BST común y en un AVL](/attachments/grimorio/data-structures/avl-vs-bst.svg)

*Figura 1. Las claves 1 a 5 en orden: el BST degenera en una cadena de altura 5; el AVL rota y queda en altura 3.*

### Definición / propiedades

- Al igual que en un [[binary search tree|BST]], los nodos menores al padre van a la izquierda y los mayores a la derecha.
- **Factor de Balance** (*Balance Factor*) de un nodo $v$: la diferencia entre la altura del subárbol izquierdo y la del derecho.

$$FB(v) = \text{altura}(\text{v.izq}) - \text{altura}(\text{v.der})$$

- $|FB(v)| \le 1$ en todos los nodos.
- **Balanceo automático:** si una operación hace que un nodo termine con $FB(v) = \pm 2$, se realizan las rotaciones necesarias para cumplir con la propiedad anterior.
- **Altura acotada:** $h < 1{,}4405 \cdot \log_2(n+2)$, siendo $n$ la cantidad de nodos.

La cota sale de una recurrencia similar a la sucesión de Fibonacci, $N(h) = 1 + N(h-1) + N(h-2)$, que describe al AVL más alto posible.

### Representación

Cada nodo almacena la **clave**, la **altura** de su subárbol y un **puntero a cada hijo**.

![Estructura interna de un AVL de seis claves](/attachments/grimorio/data-structures/avl-representacion.svg)

*Figura 2. El árbol es un puntero a la raíz; a la derecha, el nodo 40 por dentro.*

## 2. Operaciones y complejidad

### Operaciones principales

- `insert(tree, key, compare)`: inserta un nodo, comparando la clave con el criterio `compare`.
- `delete(tree, key, compare)`: elimina el nodo de la clave buscada, si existe.
- `find(tree, key, compare)`: devuelve el nodo de la clave, si la encuentra.

### Complejidad
Las tres operaciones son $O(\log n)$ en el peor caso, en el promedio y en el amortizado, lo que convierte al AVL en una estructura predecible.

| Operación | Complejidad Temporal | Espacio Adicional | Descripción |
| :--- | :---: | :---: | :--- |
| **Búsqueda** | $O(\log n)$ | $O(1)$ | El peor caso es descender hasta el último nivel del árbol; jamás se recorren todos los nodos linealmente. |
| **Inserción** | $O(\log n)$ | $O(\log n)$ | En el peor caso, se inserta en el nivel más profundo y se realizan hasta dos rotaciones (además del espacio de recursión). |
| **Eliminación** | $O(\log n)$ | $O(\log n)$ | En el peor caso, se elimina en el último nivel y se pueden propagar rotaciones hacia la raíz. |

### Detalles operativos

- **Inserción duplicada:** si la clave ya existe, no se inserta.
- **Eficiencia de las búsquedas:** depende de la altura del árbol; en el peor caso, la cantidad de nodos examinados es igual a esa altura.

## 3. Implementación

### Idea de implementación

Cuando una operación deja un nodo en $FB = \pm 2$, se realizan rotaciones para volver a dejar todos los $FB$ entre -1 y 1. Hay cuatro casos, según de qué lado pesa el nodo y de qué lado está su hijo:

- **LL** (los dos a la izquierda): rotación derecha.
- **RR** (los dos a la derecha): rotación izquierda.
- **LR** (el nodo a la izquierda, el hijo a la derecha): rotación izquierda sobre el hijo y después derecha sobre el nodo.
- **RL**: (el nodo a la derecha, el hijo a la izquierda): rotación derecha sobre el hijo y después izquierda sobre el nodo.

![Rotación derecha sobre un nodo desbalanceado (caso LL)](/attachments/grimorio/data-structures/avl-rotacion.svg)

*Figura 3. Caso LL: el 50 queda en $FB = +2$ y su hijo 30 en $+1$; la rotación derecha sube el 30 y baja el 50, que recibe el subárbol del 40.*

### Algoritmos

- **`insert(tree, key, compare)`:**
  1. Busca la posición de inserción comparando la clave con la almacenada en cada nodo.
  2. Dependiendo de si la clave es mayor o menor, desciende por la derecha o izquierda.
  3. Si la clave es igual a una existente, no la inserta y retorna.
  4. Si llega a una hoja vacía, agrega el nuevo nodo.
  5. Al retornar de la recursión, actualiza la altura y calcula el factor de balance. Si algún nodo queda desbalanceado ($|FB(v)| > 1$), ejecuta las rotaciones correspondientes de acuerdo al caso.

- **`delete(tree, key, compare)`:**
  1. Busca el nodo a eliminar comparando la clave.
  2. Si no lo encuentra, retorna.
  3. Si lo encuentra, lo elimina
  4. Actualiza las alturas y rebalancea mediante rotaciones en el camino de vuelta hacia la raíz.

- **`find(tree, key, compare)`:**
  1. Compara la clave buscada con el nodo actual.
  2. Desciende hacia la izquierda si es menor, o hacia la derecha si es mayor.
  3. Si coincide, devuelve el nodo; si alcanza un puntero nulo (`NULL`), concluye que no existe.

### Invariantes
- Las claves son únicas: las del subárbol izquierdo son menores y las del derecho mayores.
- El recorrido inorden es estrictamente creciente.
- Para todo nodo $N$ se cumple que $FB(N) \in \{-1, 0, 1\}$.
- $\text{altura}(N) = 1 + \max(\text{altura}(\text{izq}), \text{altura}(\text{der}))$.

### Ejemplo de código

```python
class NodoAVL:
    def __init__(self, clave):
        self.clave = clave
        self.izq = self.der = None
        self.altura = 1


class ArbolAVL:
    def altura(self, nodo):
        return nodo.altura if nodo else 0

    def balance(self, nodo):
        return self.altura(nodo.izq) - self.altura(nodo.der) if nodo else 0

    def actualizar(self, nodo):
        nodo.altura = 1 + max(self.altura(nodo.izq), self.altura(nodo.der))

    def rotar_derecha(self, y):
        x = y.izq
        y.izq, x.der = x.der, y
        self.actualizar(y)      # primero el que quedó abajo
        self.actualizar(x)
        return x                # nueva raíz del subárbol

    def rotar_izquierda(self, x):
        y = x.der
        x.der, y.izq = y.izq, x
        self.actualizar(x)
        self.actualizar(y)
        return y

    def insertar(self, raiz, clave, comparacion):
        # 1. Inserción normal de un BST
        if not raiz:
            return NodoAVL(clave)
        if comparacion(clave, raiz.clave) < 0:
            raiz.izq = self.insertar(raiz.izq, clave, comparacion)
        elif comparacion(clave, raiz.clave) > 0:
            raiz.der = self.insertar(raiz.der, clave, comparacion)
        else:
            return raiz         # no se permiten claves duplicadas

        # 2. Actualizar la altura y rebalancear
        self.actualizar(raiz)
        balance = self.balance(raiz)
        if balance > 1:                             # pesa a la izquierda
            if comparacion(clave, raiz.izq.clave) > 0:
                raiz.izq = self.rotar_izquierda(raiz.izq)   # caso LR
            return self.rotar_derecha(raiz)                 # caso LL

        if balance < -1:                            # pesa a la derecha
            if comparacion(clave, raiz.der.clave) < 0:
                raiz.der = self.rotar_derecha(raiz.der)     # caso RL
            return self.rotar_izquierda(raiz)               # caso RR
        return raiz

    def preorden(self, raiz):
        """Imprime el árbol en recorrido preorden: [nodo, izq, der]"""
        if not raiz:
            return
        print(f"{raiz.clave} (h={raiz.altura})", end=" ")
        self.preorden(raiz.izq)
        self.preorden(raiz.der)
```

La eliminación reutiliza el mismo bloque de rebalanceo. Un uso típico:

```python
avl = ArbolAVL()
raiz = None
valores = [10, 20, 30, 40, 50, 25]

for v in valores:
    raiz = avl.insertar(raiz, v)

print("Recorrido Preorden del árbol balanceado:")
avl.preorden(raiz)
```

**Salida esperada:**
```text
30 (h=3) 20 (h=2) 10 (h=1) 25 (h=1) 40 (h=2) 50 (h=1)
```

![Traza del ejemplo: las seis claves insertadas en orden en un AVL](/attachments/grimorio/data-structures/avl-traza.svg)

*Figura 4. La traza del ejemplo: el 30 y el 50 dejan un nodo en $FB = -2$ con su hijo del mismo lado (caso RR, una rotación), y el 25 lo deja en zigzag (caso RL, dos). El árbol final es el que imprime el preorden de arriba.*

## 4. Uso y criterio

Conviene usar un AVL cuando se quiere **optimizar los tiempos de búsqueda** sobre información ordenada y **no se realizan muchas modificaciones**.

### Casos de uso

- [[set|Conjuntos]] y [[map|diccionarios]] ordenados en memoria, con muchas búsquedas y pocas escrituras.
- Cuando además de la clave se necesita el orden: intervalos, sucesor o recorrido ordenado.
- Enrutadores de red con tablas de lookup en memoria.

### Cuándo NO usarlo

- Escenarios con alta frecuencia de inserciones y eliminaciones, ya que las rotaciones continuas degradan el rendimiento general.
- Cuando el orden de los elementos no es relevante.
- Almacenamiento en disco: son preferibles estructuras con mayor cantidad de hijos por nodo.

### Comparaciones

| Estructura                               | Caso ideal                                                | Ventajas respecto a AVL                               | Desventajas respecto a AVL                             |
| :--------------------------------------- | :-------------------------------------------------------- | :---------------------------------------------------- | :----------------------------------------------------- |
| **[[red-black tree\|Árbol Rojo-Negro]]** | [[map\|Mapas]] o [[set\|conjuntos]] con muchas escrituras | Menos rotaciones al insertar y borrar                 | Búsqueda más lenta ya que su altura está menos acotada |
| **[[b-tree\|Árbol B]]**                  | Bases de datos y archivos en disco                        | Menos accesos a disco al tener varias claves por nodo | Más complejo cuando hay pocos elementos                |
| **[[hash table\|Tabla Hash]]**           | Búsqueda por clave exacta sin orden                       | Búsqueda en $O(1)$ promedio                           | Sin recorridos ordenados ni búsquedas por intervalos   |

### Ventajas / desventajas

| Ventajas                                                     | Desventajas                                                                                           |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| $O(\log n)$ garantizado aun en el peor caso.                 | Más difícil de implementar que un [[binary search tree\|BST estándar]], sobre todo en la eliminación. |
| Altura balanceada que permite menos comparaciones al buscar. | Overhead en cada escritura por el balanceo.                                                           |
|                                                              | Gasto adicional de memoria para almacenar la altura en cada nodo.                                     |

### Señales de reconocimiento

Un árbol AVL suele ser adecuado cuando en el problema se menciona:
- *"No se pueden repetir elementos."*
- *"Las modificaciones son poco frecuentes"* / *"Buscar después de una carga inicial."*
- *"Se necesitan búsquedas con tiempo de respuesta acotado."*
- *"Mantener los datos ordenados en todo momento."*
- *"El tamaño del conjunto varía dinámicamente en memoria."*

## 5. Relaciones y extensiones

### Variantes

- **Factor de balance:** almacenarlo usando solo 2 bits en vez de guardar la altura.
- **Estadísticas de orden:** un atributo `tamaño` por subárbol permite obtener el k-ésimo elemento en $O(\log n)$.
- **Puntero al padre:** un puntero al padre en cada nodo simplifica los recorridos ascendentes y los algoritmos iterativos.

### Relación con otras estructuras
- Es una optimización del [[binary search tree|Árbol Binario de Búsqueda]] con un invariante extra y el rebalanceo que lo sostiene.
- El [[red-black tree|Árbol Rojo-Negro]] resuelve el mismo problema con una regla más laxa mientras que el [[b-tree|Árbol B]] generaliza la idea a nodos que pueden tener más de una clave.
- Se suele utilizar dentro de [[hash table|tablas hash]] para evitar degradación en colisiones.
- Combinado con una [[doubly linked list|lista doblemente enlazada]], se puede utilizar como base para estructuras como [[lru cache|caché LRU]] ordenadas.

### Notas avanzadas

- **Persistencia funcional pura:** como las operaciones solo alteran el camino desde la raíz hasta el nodo modificado (*path copying*), se pueden compartir los nodos no afectados sin duplicar todo el árbol.
- **Concurrencia:** la eliminación puede propagar rotaciones en cascada hacia la raíz. Algunas variantes posponen las rotaciones mediante etiquetas de *limpiar después*.
- **Tuning de parámetros:** se puede aumentar el umbral de desbalanceo ($|\text{FB(v)}| > k$) para disminuir la frecuencia de rotaciones, a cambio de una cota de altura mayor.

## 6. Referencias y recursos

- **W3Schools** - *DSA AVL Trees*: [https://www.w3schools.com/dsa/dsa_data_avltrees.php](https://www.w3schools.com/dsa/dsa_data_avltrees.php)
- **EnjoyAlgorithms** - *AVL Tree Data Structure*: [https://www.enjoyalgorithms.com/blog/avl-tree-data-structure](https://www.enjoyalgorithms.com/blog/avl-tree-data-structure)
- **DataCamp** - *AVL Tree*: [https://www.datacamp.com/tutorial/avl-tree](https://www.datacamp.com/tutorial/avl-tree)
- **Larsen, K. S. (2000)** - *AVL Trees with Relaxed Balance*. Journal of Computer and System Sciences, 61(3), 508-522. [https://doi.org/10.1006/jcss.2000.1705](https://doi.org/10.1006/jcss.2000.1705)
