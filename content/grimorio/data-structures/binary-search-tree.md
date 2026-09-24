---
title: 'Árbol Binario de Búsqueda'
tags:
  - data-structures
alias: ['BST', 'Binary Search Tree', 'Árbol binario de búsqueda']
---
## 1. Qué es y cómo funciona

### Intuición
Un árbol binario de búsqueda (BST) es una estructura de datos basada en un árbol binario que permite organizar elementos de forma que la búsqueda, inserción y eliminación puedan realizarse de manera eficiente. 

### Definición / propiedades
Es una estructura de datos jerárquica formada por un conjunto de nodos, donde existe un nodo principal llamado raíz, y a su vez, tiene como máximo dos hijos, que a su vez, también son árboles binarios.
- Cada nodo puede tener como máximo dos hijos (izquierdo y derecho).
- Todos los elementos del subárbol izquierdo de un nodo son estrictamente menores que dicho nodo.
- Todos los elementos del subárbol derecho de un nodo son estrictamente mayores que dicho nodo.

### Representación
Internamente, cada nodo contiene un valor y referencias a sus hijos izquierdo y derecho. Cuando un nodo no tiene alguno de sus hijos, esa referencia es nula. 

![[binary-search-tree.svg]]

Representación de un árbol binario.

En los árboles binarios de búsqueda, existe el concepto de balance, decimos que un árbol está balanceado cuando los nodos están distribuidos de manera relativamente uniforme entre sus subárboles izquierdo y derecho. 

Por otro lado, un árbol desbalanceado es aquel en el que los elementos quedan más concentrados en un lado del árbol, lo que hace que la estructura utilizada sea menos eficiente. 


![[binary-search-tree-unbalanced.svg]]

Ejemplo de un arbol completamente desbalanceado.
## 2. Operaciones y complejidad

### Operaciones principales
- Find (Búsqueda): Permite localizar una clave navegando desde la raíz, descendiendo hacia la izquierda (si es menor) o derecha (si es mayor) hasta hallar el valor o un nodo nulo. 

- Insert (Inserción): Sigue la misma ruta que find para localizar la posición vacía correspondiente y enlazar allí un nuevo nodo hoja, manteniendo el invariante de orden. 

- Delete (Eliminación): Es la operación más compleja. Se divide en tres escenarios: eliminar un nodo hoja (se borra directamente), un nodo con un solo hijo (el hijo reemplaza al nodo eliminado), o un nodo con dos hijos (requiere buscar el sucesor in-order para reemplazar el valor y eliminar el nodo original). 

### Complejidad
- Tiempo Promedio: Para las operaciones principales el costo es $O(\log n)$, asumiendo un árbol razonablemente balanceado. 

- Tiempo Peor Caso: El costo se dispara a $O(n)$. Esto sucede si los elementos se insertan ya ordenados, haciendo que el árbol degenere en una lista enlazada unidireccional. 

- Espacio: Su complejidad espacial es $O(n)$ para almacenar los datos. Adicionalmente, el espacio auxiliar es $O(h)$ (donde “h” es la altura del árbol) debido a la memoria requerida por la pila de llamadas en implementaciones recursivas. 

### Detalles operativos
- Casos Especiales: Estructura vacía o llena: Frente a un árbol vacío, las operaciones de búsqueda y eliminación deben manejarse como casos base que retornan un valor nulo, mientras que la primera inserción inicializa el nodo raíz. Por otro lado, al ser una estructura de asignación dinámica, un BST no posee un estado intrínseco de "estructura llena"; su límite de tamaño está condicionado exclusivamente por la memoria disponible en el sistema. 

- Costos Ocultos: El costo oculto más significativo es la fragmentación de la memoria. A diferencia de un arreglo contiguo, cada nodo del BST se aloja por separado y requiere punteros extra hacia sus hijos. Esto genera un sobrecosto espacial (overhead) y una mala "localidad de caché" (cache locality), provocando que las operaciones en memoria sean ligeramente más lentas que en estructuras secuenciales puras. Además, la susceptibilidad al peor caso a menudo obliga a implementar lógicas más pesadas de auto balanceo como AVL o Red-Black. 

- Gestión de duplicados: El modelo clásico del BST asume la unicidad de las claves. Si el problema exige admitir valores duplicados, la estructura requiere adaptaciones. Esto se resuelve implementando una convención estricta de enrutamiento (Como derivar los duplicados hacia el subárbol derecho) 

- Concurrencia: Un Árbol Binario de Búsqueda no es seguro para entornos multihilo. La ejecución simultánea de operaciones como la inserción y eliminación generará condiciones de carrera. Esto inevitablemente corrompe los punteros de la jerarquía, provocando fugas de memoria o ciclos infinitos. Para operar en concurrencia, es obligatorio implementar mecanismos de sincronización externos o recurrir a estructuras diseñadas para este fin, como los árboles concurrentes libres de bloqueos. 

## 3. Implementación

### Idea de implementación
Un Árbol Binario de Búsqueda se implementa mediante nodos. Cada nodo guarda un valor y referencias a un hijo izquierdo y uno derecho. Para insertar o buscar un elemento, se comienza desde la raíz y se compara el valor actual: si el nuevo valor es menor, se continua por la izquierda; si es mayor, por la derecha. El proceso se repite hasta encontrar el valor o una posición vacía. 

### Invariantes
- Todos los valores del subárbol izquierdo deben ser menores que el nodo actual. 

- Todos los valores del subárbol derecho deben ser mayores. 

- La estructura debe conservar esta propiedad después de cada inserción o eliminación. 

- En esta implementación no se admiten valores duplicados. 

### Ejemplo de código
```python 
class Nodo: 
   def __init__(self, valor): 
       self.valor = valor 
       self.izquierdo = None 
       self.derecho = None 
```
```python
class ArbolBST:  

   def __init__ (self):  

       self.raiz = None 

   def insertar(self, valor): 
     self.raiz = self._insertar(self.raiz, valor) 
 
   def _insertar(self, nodo, valor): 
    if nodo is None: 
        nuevo_nodo = Nodo(valor) 
        return nuevo_nodo 
 
    if valor < nodo.valor: 
        nodo.izquierdo = self._insertar(nodo.izquierdo, valor) 
    elif valor > nodo.valor: 
        nodo.derecho = self._insertar(nodo.derecho, valor) 

 
    return nodo
```
```python
arbol = ArbolBST()  

arbol.insertar(8)  
arbol.insertar(3)  
arbol.insertar(10) 
```

## 4. Uso y criterio

### Casos de uso
Aplica naturalmente cuando se necesita mantener datos ordenados mientras se realizan búsquedas, inserciones y eliminaciones dinámicas. Es ideal para efectuar recorridos in-order, consultas por rango y encontrar elementos cercanos (el inmediatamente mayor o menor).

### Cuándo NO usarlo
 Es contraproducente si solo importa buscar claves exactas y el orden es irrelevante; en ese escenario, una tabla hash ($O(1)$) es muy superior. Tampoco es adecuado si los datos tienden a desbalancear el árbol (por ejemplo, si ingresan ya ordenados), degradando el rendimiento de búsqueda a $O(n)$, ni para indexación en disco.

### Comparaciones
- Vs. [[hash table]]: El BST permite obtener rangos y mantener el orden natural; la tabla hash gana en búsquedas exactas al promediar $O(1)$. 

- Vs. [[linked list]]: Un BST busca en $O(\log n)$, mientras que las listas exigen recorrer todos los elementos en $O(n)$. 

- Vs. AVL / B-Tree: El BST simple prioriza una implementación en memoria sin sobrecarga; el AVL se usa para garantizar autoequilibrio (O(log n) siempre) y los B-Tree/B+Tree son la solución correcta para bases de datos.

### Ventajas / desventajas
Ventajas: Mantiene los datos ordenados naturalmente, facilitando las consultas de rango, extracciones de mínimos/máximos y recorridos ascendentes. 

Desventajas: Su rendimiento se desploma a $O(n)$ si se desbalancea. Además, la operación de eliminación es compleja por la reasignación de punteros.

### Señales de reconocimiento
Pistas en un problema: “Mantener elementos ordenados”, “Obtener los valores entre X e Y”, “Encontrar el valor inmediatamente mayor/menor a X”, o “Mostrar de menor a mayor”.

## 5. Relaciones y extensiones

### Variantes
- Árbol AVL: extensión auto-balanceada del BST que utiliza rotaciones para mantener una altura eficiente y garantizar operaciones de búsqueda, inserción y eliminación en $O(\log⁡ n)$. 

- Árbol rojinegro (Red-Black Tree): variante auto-balanceada que incorpora colores y reglas adicionales para controlar la altura del árbol. 

- Árbol biselado (Splay Tree): variante autoajustable del BST que reorganiza sus nodos mediante rotaciones cada vez que se accede a un elemento. Su objetivo es favorecer los accesos posteriores a elementos consultados frecuentemente. Sus operaciones tienen un costo de $O(\log⁡ n)$ amortizado. 

### Relación con otras estructuras
El BST es una estructura jerárquica que organiza elementos mediante comparaciones entre claves. Se relaciona con los árboles balanceados, que conservan la misma idea de búsqueda ordenada, y con los árboles B, que permiten múltiples hijos por nodo y son utilizados en sistemas de almacenamiento e indexación. 

### Notas avanzadas
Los BST pueden implementarse con persistencia, permitiendo conservar versiones anteriores del árbol sin perder los datos históricos. También existen investigaciones sobre concurrencia y paralelismo para permitir que varios hilos accedan o modifiquen estructuras de búsqueda de manera eficiente.  En el mapa general de estructuras de datos, el BST pertenece a los árboles de búsqueda jerárquicos y sirve como base para estructuras más especializadas. Sus variantes balanceadas agregan mecanismos de reorganización para mantener un rendimiento eficiente, mientras que otras estructuras, como los árboles B, adaptan la búsqueda a necesidades de almacenamiento e indexación.

## 6. Referencias y recursos
Libros de Referencia 

- [[COR2011]] Chapter 12 - Introduction to algorithms. 
- [[DRO1995]] Chapter 7 - Binary Search Trees. 

Artículos 
- [balanced binary tree ](https://xlinux.nist.gov/dads/HTML/balancedbitr.html)
- [AVL tree](https://xlinux.nist.gov/dads/HTML/avltree.html) 
- [red-black tree ](https://xlinux.nist.gov/dads/HTML/redblack.html)
- [splay tree](https://xlinux.nist.gov/dads/HTML/splaytree.html?utm_source=chatgpt.com) 

Visualizaciones y Demostraciones 
- VisuAlgo (visualgo.net/en/bst) 
- Data Structure Visualizer (dsa-visualizer-delta.vercel.app/visualizer/binary-tree) 
