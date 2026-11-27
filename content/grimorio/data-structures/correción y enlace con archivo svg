---
title: K-D Tree
tags:
  - data-structures
alias:
  - kd tree
  - k-d tree
  - arbol kd
  - arbol k-d
  - k-d-tree
  - kd-tree
---
## 1. Qué es y cómo funciona

### Intuición

El **k-d tree** (árbol k-dimensional) divide un espacio multidimensional en regiones más pequeñas mediante cortes rectos (hiperplanos). Su idea central es permitir descartar áreas enteras del espacio con una sola evaluación matemática durante una búsqueda.
Es la evolución natural del [[binary-search-tree]]

### Definición / propiedades

- Es un árbol binario donde cada nodo representa un punto en un espacio de *k* dimensiones. Su regla fundamental es la alternancia cíclica de ejes. Por ejemplo: En un árbol de dos dimensiones, en el nivel 0 divide los datos usando la coordenada X, en el nivel 1 usa la Y, y así sucesivamente.
- Propiedad: Si los datos de entrada estan ordenados, no siempre uno de los hijos va a ser menor/igual al padre, ignorando así, el principio fundamental de ordenamiento.

### Representación

![Esquema de un k-d tree con K = 2 y el eje de corte de cada nivel](kd-tree.svg)

Estructura resultante después de realizar las divisiones. Los puntos quedan organizados en distintos niveles (Nivel 0, Nivel 1, Nivel 2) según las particiones realizadas, usando K=2.

---
![Puntos de ejemplo en el plano X-Y con sus cortes y el árbol resultante](kd-tree-plano.svg)
Distribución de los puntos en el plano X-Y. Cada punto corta su región por el eje de su nivel: X en los niveles pares, Y en los impares.

## 2. Operaciones y complejidad

### Operaciones principales

- `build`: Construye el árbol desde cero, buscando la mediana en cada nivel para asegurar que quede balanceado.
- `insert / find`: Agrega o busca un punto bajando por el árbol, alternando el eje de comparación en cada nivel.
- `nearest`: Busca el punto del árbol más próximo a una coordenada dada. Baja por el lado donde cae la consulta y, al volver, usa una esfera virtual (centrada en la consulta, con radio igual a la mejor distancia encontrada) para decidir si el otro subárbol puede contener algo más cercano. Si no puede, se poda: no se recorre. Ver [Búsqueda del vecino más cercano](#búsqueda-del-vecino-más-cercano).
- `range_search`: Devuelve todos los puntos que caen dentro de un rectángulo o área específica.
- `remove`: Elimina o pone en desuso el nodo buscado
- `clear`: Elimina todos los nodos del árbol

### Complejidad

| Operación     | Tiempo (Promedio) | Tiempo (Peor Caso) | Espacio |
| ------------- | ----------------- | ------------------ | ------- |
| build[^1]     | $O(n \log^2n)$    | $O(n \log^2n)$     | $O(n)$  |
| insert / find | $O(\log n)$       | $O(n)$             | $O(1)$  |
| nearest       | $O(\log n)$       | $O(n)$             | $O(1)$  |
| remove        | $O(\log n)$       | $O(n)$             | $O(1)$  |
| clear         | $O(n)$            | $O(n)$             | $O(1)$  |

[^1]: build: La tabla dice que `build` es $O(n \log^2 n)$ en promedio, esto es porque el código de la sección 3 hace un `sorted()` completo en cada nivel de la recursión en vez de seleccionar la mediana en $O(n)$, por lo tanto el `build` se puede optimizar de manera que sea en tiempo promedio $O(n \log n)$.
### Detalles operativos

- Maldición de la dimensionalidad: Si la cantidad de dimensiones (k) es muy alta (generalmente > 20), el volumen espacial crece tanto que la poda de ramas deja de ser eficiente. El árbol se ve forzado a visitar casi todos los nodos, volviéndose más lento que una búsqueda lineal simple.
- Desbalanceo: Si se insertan datos ya ordenados, el árbol degenera en una lista enlazada, empujando todas las operaciones al peor caso $O(n)$.
- Eliminaciones complejas: Borrar un nodo interno exige encontrar un reemplazo exacto evaluando el eje de ese nivel específico, lo que suele requerir reorganizar subárboles. Por ello, en la práctica se prefiere usar "*borrado perezoso*" (marcar el nodo como inactivo).

### Búsqueda del vecino más cercano

`nearest` es una búsqueda recursiva. En cada nodo:

1. Compara el punto del nodo con el mejor candidato hasta ahora y se queda con el más cercano.
2. Calcula `diff = consulta[eje] - nodo[eje]`. Su signo indica de qué lado del corte cae la consulta; ese lado se explora primero.
3. Al volver, decide si explorar también el otro lado. Solo vale la pena si el corte está más cerca de la consulta que el mejor candidato actual, es decir, si el círculo de búsqueda lo cruza: `diff² < mejor_distancia²`.

El paso 3 es la **poda**. Es importante entender qué es y qué no:

- **No modifica el árbol**: ningún nodo se elimina. Los subárboles podados solo se saltean *en esa búsqueda*; en otra consulta pueden visitarse.
- **No cambia el resultado**: sin poda se obtiene el mismo punto, pero recorriendo todos los nodos (O(n)). Con poda, en promedio solo se visita una pequeña parte (O(log n)).

![Poda en la búsqueda del vecino más cercano](content/attachments/grimorio/data-structures/kdtree-nearest-poda.svg)

En el caso A el círculo no cruza ningún corte, así que se descartan 4 de los 7 puntos. En el caso B cruza el corte `x = 11`, por lo que hay que mirar el otro lado, y ahí está el vecino más cercano, `(9, 4)`.

Se trabaja con distancias **al cuadrado** para evitar calcular raíces: comparar `d²` da el mismo orden que comparar `d`.

## 3. Implementación

### Idea de implementación

Deberemos crear un árbol binario de búsqueda con dos particularidades:
1. Debe almacenar [[array]] inmutables de la misma longitud, los cuales deben almacenar números. Esto sucede ya que los mismos guardan puntos pertenecientes al mismo plano.
2. Cada nivel del árbol compara los elementos según un eje en específico. Usualmente, se lo implementa de la misma forma que un [[binary-search-tree]] regular, utilizando nodos con enlaces (punteros) a sus hijos (siendo las hojas los únicos que no poseen enlace a ningún otro nodo).

### Invariantes

- El eje a comparar se determina mediante el resto de la división entre la profundidad dividida las *k* dimensiones (*depth % k*).
- Todos los nodos del árbol deben almacenar puntos pertenecientes al mismo espacio de *k* dimensiones.
- La construcción del árbol debe realizarse a partir de una colección de puntos para obtener su mediana y estructurar cada nodo de forma que quede balanceado.

### Ejemplo de código

```python

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

    @staticmethod
    def _dist2(a, b):
        return sum((x - y) ** 2 for x, y in zip(a, b))

    def nearest(self, target, depth: int = 0, best=None):
        axis = depth % len(target)
        d2 = KdTree._dist2(self.point, target)
        if best is None or d2 < best[1]:
            best = (self.point, d2)

        diff = target[axis] - self.point[axis]
        if diff < 0:
            near, far = self.left_child, self.right_child
        else:
            near, far = self.right_child, self.left_child

        if near:
            best = near.nearest(target, depth + 1, best)
        if far and diff ** 2 < best[1]:   # poda: solo se mira el otro lado si puede mejorar
            best = far.nearest(target, depth + 1, best)
        return best 
    
    def liberar_arbol(self) -> None:
        if self.left_child:
            self.left_child.liberar_arbol()
            self.left_child = None
        if self.right_child:
            self.right_child.liberar_arbol()
            self.right_child = None
    

```

Uso típico: Creacion del arbol, busqueda del "vecino mas cercano" y destruccion del mimso
```python

kdtree = KdTree.build([(4,7), (7,13), (9,4), (11,10), (14,11), (15,3), (16,10)])

punto, dist2 = kdtree.nearest((10, 8))
print(punto, dist2)   # (11, 10) 5

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

Un caso típico sería una aplicación que posee miles de coordenadas y necesita responder repetidamente: *¿Cuál es el punto más cercano a esta posición?*

En lugar de calcular la distancia con los miles de puntos, un k-d tree puede descartar regiones completas del espacio.

### Cuándo NO usarlo

No es una buena elección cuando:
- los datos **no tienen una naturaleza espacial o multidimensional.**
- la cantidad de dimensiones es muy elevada, debido a la **maldición de la dimensionalidad**.
- los datos cambian constantemente.

### Comparaciones

El **k-d tree** puede competir con una búsqueda lineal, una opción simple que resulta adecuada para conjuntos pequeños pero requiere $O(n)$ por consulta. Para aplicaciones espaciales también puede utilizarse un Grid o Spatial Hashing.

### Ventajas / desventajas

- Ventajas:
	- Organiza espacialmente los datos.
	- Permite realizar búsquedas de vecinos eficientemente.
	- Las consultas de rango pueden evitar recorrer todo el conjunto.
	- Su estructura básica es relativamente sencilla.
	- Utiliza $O(n)$ espacio.
- Desventajas
	- Puede degenerar en un árbol desequilibrado.
	- Inserciones y eliminaciones pueden deteriorar su rendimiento.
	- El peor caso de muchas operaciones puede ser $O(n)$.
	- Su rendimiento disminuye cuando aumenta mucho la dimensionalidad.
	- Las operaciones de eliminación son más complejas que en un árbol binario convencional.
### Señales de reconocimiento

Un problema probablemente sea candidato a utilizar un **k-d tree** cuando aparecen expresiones como:

- *"puntos en un espacio de k dimensiones"*
- *"encontrar el punto más cercano"*
- *"buscar los puntos dentro de una región"
- *"vecinos más cercanos"*

## 5. Relaciones y extensiones

### Variantes

Existen diferentes variantes de **k-d tree**. Una posibilidad es utilizar técnicas de balanceo o reconstrucción para evitar que el árbol se vuelva demasiado profundo. También existen métodos para construir árboles balanceados a partir de un conjunto de puntos ordenando o seleccionando medianas en cada dimensión.
### Relación con otras estructuras

El **k-d tree** está directamente relacionado con otras estructuras de búsqueda espacial.

Una de sus relaciones más importantes es con los [[binary-search-tree]]: ambos utilizan una estructura de árbol binario y toman decisiones de recorrido en cada nodo. La diferencia es que un [[binary-search-tree]] normalmente utiliza una única clave para ordenar los elementos, mientras que un **k-d tree** alterna entre diferentes dimensiones.

También está relacionado con los R-tree, utilizados para indexar objetos espaciales mediante regiones, y con los range tree, especializados en consultas de rango multidimensional.

### Notas avanzadas

Cuando el árbol se construye a partir de un conjunto estático de datos es posible dedicar tiempo adicional a construir un árbol equilibrado, obteniendo posteriormente consultas más eficientes.

En aplicaciones donde los datos son dinámicos, en cambio, las inserciones y eliminaciones pueden hacer que el árbol pierda su equilibrio. Por este motivo existen implementaciones que realizan reconstrucciones periódicas.

## 6. Referencias y recursos

Stable Sort. (2020, October 9). [KD-Tree nearest neighbor data structure](https://www.youtube.com/watch?v=Glp7THUpGow)

Berg, Mark de; Cheong, Otfried; Kreveld, Marc van; Overmars, Mark (2008). "Orthogonal Range Searching". *Computational Geometry. pp. 95–120*

Bentley, J. L. (1975). *Multidimensional Binary Search Trees Used for Associative Searching*. Communications of the ACM, 18(9), 509–517.

SciPy Community. (n.d.). ["KD Tree Computer software manual"](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html) SciPy v1.18.0 Manual. Retrieved September 16, 2026

Hristov, Hristo (29 de Marzo, 2023). ["Introduction to k-d trees"](https://translate.google.com/website?sl=en&tl=es&hl=es&client=srp&u=https://www.baeldung.com/cs/k-d-trees) Baeldung.
