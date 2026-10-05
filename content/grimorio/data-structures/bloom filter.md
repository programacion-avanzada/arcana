---
title: Bloom Filter

tags:
  - data-structures

alias:
  - filtro bloom
  - filtro de bloom
---
## 1. Qué es y cómo funciona

### Intuición

Un **Bloom Filter** sirve para saber rápidamente si un elemento está dentro de un conjunto. Puede equivocarse y decir que un elemento está cuando en realidad no está (falso positivo). Pero nunca pasa al revés: si dice que un elemento no está, podemos estar seguros de que realmente no fue agregado. 

### Definición / propiedades

Los filtros de Bloom son una estructura de datos probabilística que permite verificar la pertenencia de un elemento a un conjunto de forma eficiente en memoria. No almacena los elementos en sí, sino una representación compacta mediante un [[array|array]] de bits, por lo que puede dar falsos positivos, pero nunca falsos negativos.

Sus principales propiedades son:

- **Tamaño (N)**: Cantidad de bits del array. Un tamaño mayor reduce los falsos positivos, pero usa más memoria.
- **Funciones de hash (K)**: Cantidad de funciones utilizadas para calcular qué posiciones del array marcar con "1" al agregar un elemento.
- **Tasa de falsos positivos (Error rate)**: Probabilidad de indicar que un elemento podría existir cuando en realidad no fue agregado. Nunca hay falsos negativos.
- **Capacidad**: Cantidad de elementos que puede soportar antes de que aumenten demasiado los falsos positivos. Si se supera, es necesario aumentar el tamaño del array y/o ajustar las funciones de hash.


### Representación

Primero debemos inicializar el array para que tenga 0 en todas sus posiciones, luego insertamos un elemento:

![[attachments/grimorio/data-structures/bloom_filter_insert.svg|Bloom filter - Insertar elemento|450]]

Consultar elemento 

![[attachments/grimorio/data-structures/bloom_filter_contain.svg|Bloom filter - Consultar elemento|450]]

> Si todos los bits que apunta están en 1 podemos decir que posiblemente está en el conjunto, pero si algún bit está en 0 nos asegura que no está. 


## 2. Operaciones y complejidad

### Operaciones principales


| Método | Descripción |
|---|---|
| `BloomFilter(capacity, error_rate)` | Constructor: crea el filtro con la capacidad esperada y la tasa de error deseada |
| `.add(item)` | Inserta un elemento. Devuelve `True` si ya estaba (posible falso positivo) o `False` si es nuevo |
| `item in filtro` | Consulta pertenencia usando el operador `in` (no hay un método `.check()` separado — Python lo resuelve mediante `__contains__`) |
| `len(filtro)` | Devuelve la cantidad aproximada de elementos insertados |
| `.capacity` | Atributo: capacidad máxima configurada |
| `.error_rate` | Atributo: tasa de falso positivo configurada |
| `.num_bits` | Atributo: tamaño del arreglo de bits |
| `.num_hashes` | Atributo: cantidad de funciones hash (k) usadas |
| `.copy()` | Devuelve una copia del filtro |
| `.union(other)` | Combina dos filtros compatibles (OR a nivel de bits) |
| `.intersection(other)` | Intersección entre dos filtros compatibles |

> Métodos obtenidos de la documentación de python<sup>[5](#bib5)</sup>, ya que puede variar en nombres para otros lenguajes de programación

### Complejidad

Para esta estructura de datos, las operaciones no dependen de c (cantidad de elementos insertados) sino de k (cantidad de funciones hash), que es una constante fija al crear el filtro.

| Operación | Peor caso | Caso promedio | Mejor caso |
|---|---|---|---|
| Inicialización | $O(n)$ | $O(n)$ | $O(n)$ |
| Inserción | $O(k)$ | $O(k)$ | $O(k)$ |
| Búsqueda | $O(k)$ | $O(k)$ | $O(k)$ |

Donde: 
- n = tamaño del arreglo de bits 
- k = cantidad de funciones hash 
- c = cantidad de elementos insertados 

### Detalles operativos

- **Inserción duplicada no se detecta:** Insertar el mismo elemento varias veces no genera error ni permite saber con seguridad si ya estaba. No sirve para contar elementos únicos.

- **Cada inserción reduce la precisión:** Agregar elementos aumenta la probabilidad de falsos positivos.

- **La búsqueda no es definitiva:** Solo indica "posiblemente sí" o "seguro no". Se usa como filtro previo.

- **No hay eliminación clásica:** Borrar bits puede generar falsos negativos. Para eliminar se usa un Counting Bloom Filter, que requiere más espacio.

- **El tamaño no se puede ajustar:** Si n es insuficiente, aumentan la tasa de error y hay que recrear el filtro.

## 3. Implementación

### Idea de implementación

- [[array|Array]] de bits de tamaño N, inicializado en 0
- K funciones hash independientes
- Tasa de falso positivo aceptada, normalmente 1%

### Algoritmos clave

- BloomFilter(capacity, error_rate):  
  - Constructor del array de bits 
  - Primer parametro es el tamaño N de nuestro array 
  - Segundo parametro la probabilidad maxima aceptada de un falso positivo. 

- add(x) 
  - Se calculas las K posiciones y pone en 1 en las posiciones 

- x in filtro 
  - Verifica si este contenido dentro del bloomfilter usando el operador in

### Invariantes

- Cero falsos negativos, si un elemento “x” fue insertado algún momento, debe devolver siempre “puede estar presente”.
- El array de bits no se redimensiona, el tamaño N se fija en el constructor y no cambia durante la vida útil del filtro. 
- Las k funciones hash son independientes y uniformes.
- No se reutiliza la misma funciones hash dentro del filtro.

### Ejemplo de código

```python
import math

class BloomFilter:
    def __init__(self, capacity, error_rate=0.01):
        self.tam = math.ceil(-(capacity * math.log(error_rate)) / (math.log(2) ** 2))
        self.k = max(1, round((self.tam / capacity) * math.log(2)))
        self.bits = [0] * self.tam

    def _posiciones(self, elemento):
        # k "hashes" simples: mismo hash, con distinta semilla
        return [hash((elemento, i)) % self.tam for i in range(self.k)]

    def add(self, elemento):
        posiciones = self._posiciones(elemento)
        ya_estaba = all(self.bits[pos] == 1 for pos in posiciones)
        for pos in posiciones:
            self.bits[pos] = 1
        return ya_estaba

    def __contains__(self, elemento):
        return all(self.bits[pos] == 1 for pos in self._posiciones(elemento))


bf = BloomFilter(capacity=100, error_rate=0.01)

print(bf.add("manzana"))  # False (es nuevo)
print(bf.add("manzana"))  # True (ya estaba, o falso positivo)
print(bf.add("banana"))   # False (es nuevo)

print("manzana" in bf)  # True (probablemente)
print("pera" in bf)     # False
```

## 4. Uso y criterio

### Casos de uso

- **Filtro previo**: Evita consultas innecesarias a la caché, base de datos o API. Si la clave podría existir, se realiza la consulta.
- **Detecta nombres de usuario duplicados**: Verifica si un nombre de usuario podría existir antes de registrarlo.
- **Detecta fraudes**: Comprueba si una tarjeta está dentro de un conjunto de tarjetas denunciadas como robadas.
- **Filtra spam y contenido dañino**: Detecta posibles URLs, correos y números de teléfono asociados a spam o contenido dañino.

### Cuándo NO usarlo
- Cuando se espera un resultado acertado sobre la existencia del elemento. 
- Si se requiere eliminar elementos, ya que el Bloom Filter en su versión estándar no admite esta acción. 
- Cuando el espacio disponible no es una limitación crítica 

### Comparaciones

- vs **[[hash table|Hash Table]]**: permite almacenar y recuperar elementos de manera eficiente, pero usa más memoria.
- vs **[[array|Array]] ordenado + búsqueda binaria**: Requiere tener todos los datos y ordenarlos, esto puede resultar muy costoso.
- vs **Cuckoo FIlter**: Similar BloomFilter clásico, pero soporta borrado y suele tener mejor tasa de falsos positivos.

### Ventajas / desventajas

| Ventajas | Desventajas |
|---|---|
| Bajo consumo de memoria | Puede producir falsos positivos |
| Inserción y consultas rápidas | No podemos redefinir el tamaño del Bloom Filter una vez creado |
| No almacena elementos sino un bit | No soporta borrado individual |
| Uso de memoria fijo y predecible | - |

### Señales de reconocimiento

Hay varias pistas en un problema que sugieren que un Bloom Filter puede ser la estructura adecuada: 
- “Se realizan muchas consultas de existencia sobre un conjunto grande”
- “Queremos saber si mi elemento que busco se encuentra o no “
- “Si hay falsos positivos, no es costoso verificar si realmente esta”
- “La memoria disponible es limitada y almacenar el conjunto completo resulta caro”

## 5. Relaciones y extensiones

### Variantes

- **Filtro bloom con conteo**: Utiliza pequeños contadores en vez de bits individuales permitiendo la eliminación de elementos al costo de más memoria. 
- **Filtro bloom escalable**: Compuesto por varios Filtros de Bloom internos. Se crea un subfiltro cuando el filtro actual se llena o alcanza una tasa de falsos positivos alta. 
- **Filtro de Cuco**: Almacena huellas digitales cortas en vez de bits individuales, utilizada para cuando la eliminación es frecuente. 

### Relación con otras estructuras

- **Funciones hash**: igual que en las [[hash table|tablas hash]], pero en el Bloom Filter solo se usan para marcar posiciones como activas, sin guardar el elemento.  
- **Arreglo de bits (bitset)**: es una secuencia de bits en memoria basada en un [[array]] que permite almacenar el filtro de forma muy compacta. 

### Notas avanzadas

#### **Persistencia**

Se deben guardar el arreglo de bits y su configuración para poder recuperar el filtro después.


#### **Hashes**

Deben distribuir bien los elementos para reducir colisiones y falsos positivos.

 
#### **Concurrencia**

Las actualizaciones de bits deben ser seguras cuando varios hilos o procesos insertan elementos al mismo tiempo.


#### **Saturación**

Al superar la cantidad de elementos prevista, aumentan los bits activos y los falsos positivos.

## 6. Referencias y recursos

### Referencias bibliográficas

1. Amazon Web Services (AWS). *Implement fast, space-efficient lookups using Bloom filters in Amazon ElastiCache*. https://aws.amazon.com/es/blogs/database/implement-fast-space-efficient-lookups-using-bloom-filters-in-amazon-elasticache/.

2. Fox, J. *python-bloomfilter: Scalable Bloom Filter implemented in Python*. https://github.com/joseph-fox/python-bloomfilter.

3. Baeldung. *Bloom Filter in Java using Guava*. https://www.baeldung.com/guava-bloom-filter

4. AlgoMaster. *Bloom Filters | System Design*. https://algomaster.io/learn/system-design/bloom-filters.

5. <a id="bib5"></a> Python Land. *Bloom Filter in Python: Test If An Element is Part of a Large Set*. https://python.land/bloom-filter

6. Llimllib. *Bloom Filters by Example*. https://llimllib.github.io/bloomfilter-tutorial/.

7. Google Cloud. *Acerca de los filtros de Bloom*. https://docs.cloud.google.com/memorystore/docs/valkey/about-bloom-filters?hl=es-419.