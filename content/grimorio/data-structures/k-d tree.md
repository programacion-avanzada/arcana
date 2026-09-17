---
title: k-d tree
tags:
  - data-structures
  - tree
alias:
  - nombre
  - otro
---
## 1. Qué es y cómo funciona

### Intuición
- El k-d tree (árbol k-dimensional) divide un espacio multidimensional en regiones más pequeñas mediante cortes rectos (hiperplanos). Su idea central es permitir descartar áreas enteras del espacio con una sola evaluación matemática durante una búsqueda. Es la evolución natural del Árbol Binario de Búsqueda (BST). El k-d tree alterna la comparación a través de múltiples coordenadas (ej. X, luego Y, luego Z).

### Definición / propiedades
- Es un árbol binario donde cada nodo representa un punto en un espacio de k dimensiones. Su regla fundamental es la alternancia cíclica de ejes. Por ejemplo: En un árbol de tres dimensiones, en el nivel 0 divide los datos usando la coordenada X, en el nivel 1 usa la Y, en el nivel 2 la Z, y así sucesivamente repitiendo la alternancia.
- Una propiedad de este tipo de árbol, es que, aunque ordenemos los datos de entrada, no siempre uno de los hijos va a ser menor/igual al padre, ignorando así, el principio fundamental de ordenamiento.

### Representación
  ![[kd-tree.svg|678]]

Estructura resultante después de realizar las divisiones. Los puntos quedan organizados en distintos niveles (Nivel 0, Nivel 1, Nivel 2) según las particiones realizadas, usando K=2.

---

![[plano-kd-tree.svg|700]]
Distribución inicial de los puntos en el plano X-Y . Es decir, muestra dónde están ubicados los datos antes de aplicar las divisiones por niveles.

## 2. Operaciones y complejidad

### Operaciones principales

- `build`: Construye el árbol desde cero, buscando la mediana en cada nivel para asegurar que quede balanceado.
- `insert / find`: Agrega o busca un punto bajando por el árbol, alternando el eje de comparación en cada nivel.
- `nearest`: Encuentra el punto más próximo a una coordenada. Dibuja una esfera virtual para podar (descartar) ramas enteras del árbol que están demasiado lejos.
- `range_search`: Devuelve todos los puntos que caen dentro de un rectángulo o área específica.
- `remove`: Elimina o pone en desuso el nodo buscado
- `clear`: Elimina todos los nodos del árbol

### Complejidad

| Operación     | Tiempo (Promedio) | Tiempo (Peor Caso) | Espacio |
| ------------- | ----------------- | ------------------ | ------- |
| build         | O(n log n)        | O(n log^2 n)       | O(n)    |
| insert / find | O(log n)          | O(n)               | O(1)    |
| nearest       | O(log n)          | O(n)               | O(1)    |
| remove        | O(log n)          | O(n)               | O(1)    |
| clear         | O(n)              | O(n)               | O(1)    |

### Detalles operativos

- Maldición de la dimensionalidad: Si la cantidad de dimensiones (k) es muy alta (generalmente > 20), el volumen espacial crece tanto que la poda de ramas deja de ser eficiente. El árbol se ve forzado a visitar casi todos los nodos, volviéndose más lento que una búsqueda lineal simple.
- Desbalanceo: Si se insertan datos ya ordenados, el árbol degenera en una lista enlazada, empujando todas las operaciones al peor caso (O(n)).
- Eliminaciones complejas: Borrar un nodo interno exige encontrar un reemplazo exacto evaluando el eje de ese nivel específico, lo que suele requerir reorganizar subárboles. Por ello, en la práctica se prefiere usar "borrado perezoso" (marcar el nodo como inactivo).

## 3. Implementación

### Idea de implementación

Deberemos crear un árbol binario de búsqueda con dos particularidades:
1. Debe almacenar arrays inmutables de la misma longitud, los cuales deben almacenar números. Esto sucede ya que los mismos guardan puntos pertenecientes al mismo plano.
2. Cada nivel del árbol compara los elementos según un eje en específico. Usualmente, se lo implementa de la misma forma que un [BTS](https://www.geeksforgeeks.org/dsa/binary-search-tree-data-structure/) regular, utilizando nodos con enlaces (punteros) a sus hijos (siendo las hojas los únicos que no poseen enlace a ningún otro nodo).

### Invariantes

- El eje a comparar se determina mediante el resto de la división entre la profundidad dividida las “k” dimensiones (*depth % k*).    
- Todos los nodos del árbol deben almacenar puntos pertenecientes al mismo plano.
- La construcción del árbol debe realizarse a partir de una colección de puntos para obtener su mediana y estructurar cada nodo de forma que quede balanceado. 

### Ejemplo de código

```Python

from __future__ import annotations

class KdTree:
    def __init__(self, point):
        self.point = point
        self.left_child = None
        self.right_child = None
        
    @classmethod
    def build(cls, points: list, depth : int = 0) -> KdTree | None:
        n = len(points)
        if n == 0:
            return None
        k = len(points[0])
        axis = depth % k
        sorted_points = sorted(points, key=lambda x: x[axis])
        median = n // 2
        tree = KdTree(sorted_points[median])
        
        tree.left_child = KdTree.build(sorted_points[:median], depth + 1)
        tree.right_child = KdTree.build(sorted_points[median + 1:], depth + 1)
        
        return tree
    
    
    def liberar_arbol(self) -> None:
        if self.left_child:
            self.left_child.liberar_arbol()
            self.left_child = None
        if self.right_child:
            self.right_child.liberar_arbol()
            self.right_child = None
    

```

Uso típico: Creacion del arbol, busqueda del "vecino mas cercano" y destruccion del mimso
``` python

kdtree = KdTree.build([(4,7), (7,13), (9,4), (11,10), (14,11), (15,3), (16,10)])
closer = kdtree.nearest_neigbour([14,9]) # Resultado esperado = (14, 11)
kdtree.liberar_arbol()
```
## 4. Uso y criterio

### Casos de uso

Los k-d tree son apropiados cuando los datos representan puntos ubicados en un espacio multidimensional.

Algunos ejemplos son:
- coordenadas GPS;
- videojuegos y simulaciones;
- reconocimiento de imágenes;
- búsqueda de vecinos en conjuntos de datos;
- detección de objetos cercanos.

Un caso típico sería una aplicación que posee miles de coordenadas y necesita responder repetidamente:

	"¿Cuál es el punto más cercano a esta posición?"

En lugar de calcular la distancia con los miles de puntos, un k-d tree puede descartar regiones completas del espacio.

### Cuándo NO usarlo

No es una buena elección cuando los datos **no tienen una naturaleza espacial o multidimensional.**

Por ejemplo, si solamente se necesita almacenar números y buscar rápidamente por una clave, un árbol binario de búsqueda balanceado o una tabla hash pueden ser más apropiados.

Tampoco resulta ideal cuando la cantidad de dimensiones es muy elevada debido a la **maldición de la dimensionalidad**.

Además, si los datos cambian constantemente, mantener un árbol equilibrado puede resultar costoso.

### Comparaciones
El k-d tree puede competir con una búsqueda lineal, una opción simple que resulta adecuada para conjuntos pequeños pero requiere O(n) por consulta. Para aplicaciones espaciales también puede utilizarse un Grid o Spatial Hashing, que divide el espacio en celdas y puede ser muy eficiente cuando los puntos están distribuidos uniformemente. El k-d tree presenta como ventaja una mejor adaptación a distribuciones no uniformes y permite realizar consultas de vecinos y de rango aprovechando la partición jerárquica del espacio.

### Ventajas / desventajas

- Ventajas:
	- Organiza espacialmente los datos.
	- Permite realizar búsquedas de vecinos eficientemente.
	- Las consultas de rango pueden evitar recorrer todo el conjunto.
	- Su estructura básica es relativamente sencilla.
	- Utiliza O(n) espacio.
- Desventajas
	- Puede degenerar en un árbol desequilibrado.
	- Inserciones y eliminaciones pueden deteriorar su rendimiento.
	- El peor caso de muchas operaciones puede ser O(n).
	- Su rendimiento disminuye cuando aumenta mucho la dimensionalidad.
	- Las operaciones de eliminación son más complejas que en un árbol binario convencional.
### Señales de reconocimiento

Un problema probablemente sea candidato a utilizar un k-d tree cuando aparecen expresiones como:

- *"puntos en un espacio de k dimensiones"*
- *"encontrar el punto más cercano"*
- *"buscar los puntos dentro de una región"*
- *"coordenadas"*
- *"distancia entre puntos"*
- *"vecinos más cercanos"*

En particular, si el problema requiere realizar **muchas consultas espaciales sobre un conjunto relativamente estable de puntos**, un k-d tree puede ser una opción especialmente conveniente.

## 5. Relaciones y extensiones

### Variantes

Existen diferentes variantes de k-d tree. Una posibilidad es utilizar técnicas de balanceo o reconstrucción para evitar que el árbol se vuelva demasiado profundo. También existen métodos para construir árboles balanceados a partir de un conjunto de puntos ordenando o seleccionando medianas en cada dimensión.
### Relación con otras estructuras

El k-d tree está directamente relacionado con otras estructuras de búsqueda espacial.

Una de sus relaciones más importantes es con los árboles binarios de búsqueda (BST): ambos utilizan una estructura de árbol binario y toman decisiones de recorrido en cada nodo. La diferencia es que un BST normalmente utiliza una única clave para ordenar los elementos, mientras que un k-d tree alterna entre diferentes dimensiones.

También está relacionado con los R-tree, utilizados para indexar objetos espaciales mediante regiones, y con los range tree, especializados en consultas de rango multidimensional.

### Notas avanzadas

Cuando el árbol se construye a partir de un conjunto estático de datos es posible dedicar tiempo adicional a construir un árbol equilibrado, obteniendo posteriormente consultas más eficientes.

En aplicaciones donde los datos son dinámicos, en cambio, las inserciones y eliminaciones pueden hacer que el árbol pierda su equilibrio. Por este motivo existen implementaciones que realizan reconstrucciones periódicas.

## 6. Referencias y recursos

**Stable Sort. (2020, October 9). [KD-Tree nearest neighbor data structure]([https://www.youtube.com/watch?v=Glp7THUpGow](https://www.youtube.com/watch?v=Glp7THUpGow)

Berg, Mark de; Cheong, Otfried; Kreveld, Marc van; Overmars, Mark (2008). "Orthogonal Range Searching". *Computational Geometry. pp. 95–120*

Bentley, J. L. (1975). *Multidimensional Binary Search Trees Used for Associative Searching*. Communications of the ACM, 18(9), 509–517. 

SciPy Community. (n.d.). [KDTree Computer software manual]([https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html) SciPy v1.18.0 Manual. Retrieved September 16, 2026
 [](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html)

Hristov, Hristo (29 de Marzo, 2023). ["Introduction to k-d trees"](https://translate.google.com/website?sl=en&tl=es&hl=es&client=srp&u=https://www.baeldung.com/cs/k-d-trees). Baeldung.