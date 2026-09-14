---
title: Red-Black Tree
tags:
  - data-structures
alias:
  - árbol rojo-negro
  - árbol de búsqueda binaria
  - árbol binario
  - árbol
  - binary seach tree
  - BST
aliases:
---
## 1. Qué es y cómo funciona

### Intuición
Un árbol rojo-negro es un tipo de árbol binario de búsqueda que se impone ciertas reglas a sí mismo para garantizar que crezca de forma balanceada, con el objetivo de que, incluso en el peor caso, las operaciones mantengan una complejidad logarítmica. Para ello, se utilizan los colores rojo y negro, que ayudan a controlar estas reglas.
### Definición / propiedades
#### Árbol binario de búsqueda
Un árbol binario de búsqueda es un tipo particular de árbol binario que organiza elementos de forma ordenada para realizar búsquedas de forma rápida. Posee las siguientes propiedades:
- La estructura de datos se origina a partir de un nodo base llamado raíz.
- Cada nodo tiene como máximo dos hijos: un hijo izquierdo y un hijo derecho.
- Un nodo que no tiene ningún hijo es una hoja.
- El subárbol izquierdo de un nodo sólo contiene valores (o claves) menores que el valor de ese nodo.
- El subárbol derecho de un nodo sólo contiene valores (o claves) mayores que el valor de ese nodo.

Al ser un árbol rojo-negro un tipo de árbol binario de búsqueda, hereda todas las propiedades mencionadas anteriormente. Además, posee las siguientes propiedades únicas:
- Cada nodo es de color rojo o negro.
- La raíz siempre es de color negro.
- Todas las hojas NIL son de color negro.
- Un nodo de color rojo no puede tener un hijo de color rojo.
- Cada camino desde un nodo dado a sus hojas descendientes NIL contiene el mismo número de nodos de color negro.
### Representación
Internamente, está compuesto por nodos que poseen un valor (o clave), un booleano que hace referencia al color que posee, y punteros al hijo izquierdo, hijo derecho y padre del nodo.

![Diagrama de un red-black tree](attachments/grimorio/data-structures/red-black-tree.svg)

---
## 2. Operaciones y complejidad

### Operaciones principales
- `buscar(valor)`: busca un valor y devuelve el nodo encontrado, si es que existe.
- `insertar(valor)`: agrega un nuevo elemento al árbol.
- `eliminar(valor)`: busca y elimina un elemento del árbol, si es que existe.
### Complejidad
| Operaciones       | Notación Big O |
| :---------------- | :------------- |
| `buscar(valor)`   | $O(log n)$     |
| `insertar(valor)` | $O(log n)$     |
| `eliminar(valor)` | $O(log n)$     |
| `Espacio`         | $O(n)$         |
### Detalles operativos
- Si la inserción o borrado de un nodo provoca la violación de las propiedades del árbol rojo-negro, se debe realizar una operación de arreglo de la estructura, que involucra un recoloreo y/o una rotación de los nodos cercanos.
- Los recoloreos y las rotaciones tienen un costo temporal de $O(1)$
- Una implementación clásica utiliza nodos centinela NIL de color negro, a fin de evitar verificaciones especiales de bordes como `if (nodo != NULL)`. Todos los punteros vacíos apuntan a un único objeto `NIL` global, reduciendo líneas de código y condicionales.
- Una implementación alternativa que utilice NULL ahorra más memoria, pero modifica la estructura del código al tener que realizar más verificaciones.
- A diferencia de otros árboles de búsqueda binario, los árboles rojo-negro almacenan un puntero al padre en cada nodo.
- Si los claves almacenadas son strings, y se desea buscar un elemento, la comparación en cada nodo cuesta $O(k)$, por lo que una operación de búsqueda realmente puede costar $O(k log n)$

---
## 3. Implementación

### Idea de implementación
Se implementa un árbol de búsqueda binaria común y se agrega información de color en cada nodo, junto con operaciones de reparación (recoloreos y rotaciones) para mantenerlo balanceado.
### Invariantes
- La raíz existe o el árbol está vacío.
- La raíz es negra.
- La raíz no tiene padre.
- Todo nodo tiene un color válido.
- Las hojas NIL son negras.
- Un nodo rojo nunca tiene un hijo rojo.
- Todos los caminos tienen la misma cantidad de nodos negros.
- Se mantienen las propiedades del árbol de búsqueda binario.
- El camino más largo no supera el doble de la longitud del camino más corto.
### Ejemplo de código
```python
class NodoRB:
    def __init__(self, valor, color='rojo'):
        self.valor = valor
        self.color = color
        self.izquierdo = None
        self.derecho = None
        self.padre = None
        
    def abuelo(self):
        if self.padre is None:
            return None
        return self.padre.padre
  
    def hermano(self):
        if self.padre is None:
            return None
        if self == self.padre.izquierdo:
            return self.padre.derecho
        return self.padre.izquierdo

    def tio(self):
        if self.padre is None:
            return None
        return self.padre.hermano()

class ArbolRojoNegro:
    def __init__(self):
        self.raiz = None

    def reparar_insercion(self, nuevo_nodo):
        while nuevo_nodo.padre and nuevo_nodo.padre.color == 'rojo':
            if nuevo_nodo.padre == nuevo_nodo.abuelo().izquierdo:
                tio = nuevo_nodo.tio()
                if tio and tio.color == 'rojo':
                    nuevo_nodo.padre.color = 'negro'
                    tio.color = 'negro'
                    nuevo_nodo.abuelo().color = 'rojo'
                    nuevo_nodo = nuevo_nodo.abuelo()
                else:
                    if nuevo_nodo == nuevo_nodo.padre.derecho:
                        nuevo_nodo = nuevo_nodo.padre
                        self.rotar_izquierda(nuevo_nodo)
                    nuevo_nodo.padre.color = 'negro'
                    nuevo_nodo.abuelo().color = 'rojo'
                    self.rotar_derecha(nuevo_nodo.abuelo())
            else:
                tio = nuevo_nodo.tio()
                if tio and tio.color == 'rojo':
                    nuevo_nodo.padre.color = 'negro'
                    tio.color = 'negro'
                    nuevo_nodo.abuelo().color = 'rojo'
                    nuevo_nodo = nuevo_nodo.abuelo()
                else:
                    if nuevo_nodo == nuevo_nodo.padre.izquierdo:
                        nuevo_nodo = nuevo_nodo.padre
                        self.rotar_derecha(nuevo_nodo)
                    nuevo_nodo.padre.color = 'negro'
                    nuevo_nodo.abuelo().color = 'rojo'
                    self.rotar_izquierda(nuevo_nodo.abuelo())
        self.raiz.color = 'negro'

    def insertar(self, valor):
        nuevo_nodo = NodoRB(valor)
        if self.raiz is None:
            self.raiz = nuevo_nodo
        else:
            nodo_actual = self.raiz
            while True:
                if valor < nodo_actual.valor:
                    if nodo_actual.izquierdo is None:
                        nodo_actual.izquierdo = nuevo_nodo
                        nuevo_nodo.padre = nodo_actual
                        break
                    else:
                        nodo_actual = nodo_actual.izquierdo
                else:
                    if nodo_actual.derecho is None:
                        nodo_actual.derecho = nuevo_nodo
                        nuevo_nodo.padre = nodo_actual
                        break
                    else:
                        nodo_actual = nodo_actual.derecho
        self.reparar_insercion(nuevo_nodo)
  
    def rotar_izquierda(self, nodo):
        hijo_derecho = nodo.derecho
        nodo.derecho = hijo_derecho.izquierdo

        if hijo_derecho.izquierdo is not None:
            hijo_derecho.izquierdo.padre = nodo

        hijo_derecho.padre = nodo.padre
  
        if nodo.padre is None:
            self.raiz = hijo_derecho
        elif nodo == nodo.padre.izquierdo:
            nodo.padre.izquierdo = hijo_derecho
        else:
            nodo.padre.derecho = hijo_derecho

        hijo_derecho.izquierdo = nodo
        nodo.padre = hijo_derecho

    def rotar_derecha(self, nodo):
        hijo_izquierdo = nodo.izquierdo
        nodo.izquierdo = hijo_izquierdo.derecho
  
        if hijo_izquierdo.derecho is not None:
            hijo_izquierdo.derecho.padre = nodo
        hijo_izquierdo.padre = nodo.padre

        if nodo.padre is None:
            self.raiz = hijo_izquierdo
        elif nodo == nodo.padre.derecho:
            nodo.padre.derecho = hijo_izquierdo
        else:
            nodo.padre.izquierdo = hijo_izquierdo
        hijo_izquierdo.derecho = nodo
        nodo.padre = hijo_izquierdo
  ```

### Ejemplo de uso típico
```python
arbol = ArbolRojoNegro()

for x in [10, 20, 30, 15, 25, 5]:
    arbol.insertar(x)

print(f"Raiz: {arbol.raiz.valor} (Color: {arbol.raiz.color})")
  
def imprimir(nodo):
    if nodo:
        imprimir(nodo.izquierdo)
        print(f"Valor: {nodo.valor} | Color: {nodo.color}")
        imprimir(nodo.derecho)

imprimir(arbol.raiz)

"""
Salida

Raiz: 20 (Color: negro)
Valor: 5 | Color: rojo
Valor: 10 | Color: negro
Valor: 15 | Color: rojo
Valor: 20 | Color: negro
Valor: 25 | Color: rojo
Valor: 30 | Color: negro
"""
```

---
## 4. Uso y criterio
### Casos de uso
- Implementación de contenedores de alto rendimiento como Map y Set en C++ y TreeSet en Java.
- Planificación de procesos en sistemas operativos para administrar tareas.
- Gestión del filtrado de paquetes de alta velocidad y de consultas de enrutamiento en red.
- Indexación en memoria RAM
### Cuándo NO usarlo
- Cuando se requiere acceso aleatorio por índice numérico (conviene usar un array o vector dinámico).
- Cuando se priorizan grandes cargas iniciales sobre datos ya ordenados.
- Cuando los datos son estáticos y solo se leen una vez (conviene usar un array ordenado y búsqueda binaria).
### Comparaciones
- **vs. AVL**: ambos garantizan $O(log n)$ en sus operaciones, pero el AVL es más estricto (la diferencia de altura entre los subárboles izquierdo y derecho de cualquier nodo no puede ser mayor a 1) y realiza la operación de búsqueda un poco más rápido, mientras que el rojo-negro rebalancea menos.
- **vs. Binary Search Tree (BST)**: si se le insertan datos ya ordenados, el árbol se degenera en una [[linked list]] provocando que las búsquedas pasen de un tiempo promedio $O(log n)$ al peor caso $O(n)$.
- **vs. B-tree**: es un árbol ancho de múltiples vías diseñado para almacenamiento en disco (SSD/HDD) y bases de datos, al contrario del árbol rojo-negro que está pensado para la memoria RAM.
- **vs. Skip List**: tiene complejidad esperada equivalente al árbol rojo-negro y código más corto, a cambio de garantías probabilísticas y mayor consumo de memoria por nodo.
### Ventajas / desventajas
#### Ventajas
- **Garantiza $O(log n)$** para búsqueda, inserción y eliminación sin importar si los datos ingresan ordenados o en desorden. 
- **Mantiene todos sus elementos ordenados** internamente en todo momento, siendo su overhead el almacenamiento de un bit extra por nodo.
- **Requiere como máximo 2 rotaciones en una inserción y 3 en una eliminación**, resultando sustancialmente más rápido en escrituras que un árbol AVL.
#### Desventajas
- **Implementación delicada**, sobre todo el borrado, con muchos casos simétricos donde es posible equivocarse.
- **Mala localidad de caché**, además de que presenta constantes peores que una [[hash table]] para la búsqueda de datos.
- Al ser un árbol más alto, una búsqueda en el peor de los casos **puede requerir realizar hasta el doble de comparaciones de nodos que en un árbol AVL** de los mismos datos.
- Si el **volumen de modificaciones concurrentes es alto**, los árboles rojo-negro no son la mejor alternativa.
### Señales de reconocimiento
- Piden *“el menor mayor que x”*, *“el k-ésimo”* o *“todas las claves en [a, b]”*, sobre un conjunto que cambia.
- Pista inversa: si sólo se pregunta *“¿está o no está?”*, se puede utilizar una [[hash table]] en vez de un árbol de búsqueda binario.

---
## 5. Relaciones y extensiones
### Variantes
- **Left-leaning red-black tree (LLRB)**: restringe los enlaces rojos al hijo izquierdo y reduce drásticamente el código.
- **AA tree**: reemplaza el modelo de colores por uno de niveles, simplificando la implementación y eliminando casos especiales.
### Relación con otras estructuras
- Hereda las propiedades del Binary Search Tree (BST)
- Puede verse como una representación binaria de un árbol 2-3-4 (un B-Tree de orden 4), ya que cada nodo negro con sus hijos rojos representa un nodo del 2-3-4.
### Notas avanzadas
- **Concurrencia**: si hay varios hilos intentando modificar el árbol a la vez, no es posible limitar el bloqueo a la rama de la que el nodo forma parte, ya que el rebalanceo puede propagarse hasta la raíz. De esta forma, se deben bloquear porciones grandes del árbol, lo cual puede afectar el paralelismo.
- **Caché**: como los nodos del árbol suelen crearse individualmente con new o malloc, terminan dispersos en ubicaciones totalmente inconexas de la memoria RAM. De esta forma, no se cumple el principio de localidad espacial de la memoria caché.

---
## 6. Referencias y recursos
- [[COR2011]] - Chapter 13. Red-Black Trees
- **Linux Kernel Organization.** _Red-black Trees (rbtree) in Linux_. Linux Kernel Documentation. [https://docs.kernel.org/core-api/rbtree.html](https://docs.kernel.org/core-api/rbtree.html)
- **GeeksforGeeks.** (2023, 10 de agosto). _Red Black Tree in Python_. [https://www.geeksforgeeks.org/red-black-tree-in-python/](https://www.geeksforgeeks.org/red-black-tree-in-python/)
- **ByteQuest.** (2024, 13 de octubre). _Red-Black Trees Visually Explained_ [Video]. YouTube. [Red-Black Trees Visually Explained](https://www.youtube.com/watch?v=TlfQOdeFy0Y)
