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

Los filtros de Bloom son una estructura de datos probabilística que permite verificar la pertenencia de un elemento a un conjunto de forma eficiente en memoria. No almacena los elementos en sí, sino una representación compacta mediante un [[array|array]] de bits, por lo que puede dar falsos positivos, pero nunca falsos negativos. Tiene las siguientes propiedades: 

- **Tamaño (N)**: Cantidad de posiciones (bits) del array que representa el filtro. Un tamaño mayor reduce la tasa de falsos positivos, a costa de un mayor uso de memoria.
- **Funciones de hash (K)**: Cantidad de funciones hash utilizadas para calcular las posiciones a marcar en el array al agregar un elemento. Cada función se aplica una vez por elemento, y cada resultado marca a "1" la posición correspondiente.
- **Tasa de falsos positivos (Error rate)**: Probabilidad de que una consulta de pertenencia devuelva "el elemento podría existir" cuando en realidad nunca fue agregado. Ocurre porque las posiciones consultadas pueden haber sido marcadas por otros elementos. Nunca hay falsos negativos: si una posición es "0", el elemento definitivamente no fue agregado.
- **Capacidad**: Cantidad de elementos que el filtro puede soportar antes de que la tasa de falsos positivos crezca por encima de lo aceptable. Agregar más elementos de los previstos originalmente degrada la precisión del filtro. Para aumentar la capacidad manteniendo una misma tasa de falsos positivos, es necesario agrandar el tamaño del array (N) y/o ajustar la cantidad de funciones de hash (K), lo que implica un mayor consumo de memoria.


### Representación

Primero debemos inicializar el array para que tenga 0 en todas sus posiciones, luego insertamos un elemento:

![](/attachments/grimorio/data-structures/bloom_filter_insert.svg)

Consultar elemento 

![](/attachments/grimorio/data-structures/bloom_filter_contain.svg)

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
| Inicialización | O(n) | O(n) | O(n) |
| Inserción | O(k) | O(k) | O(k) |
| Búsqueda | O(k) | O(k) | O(k) |

Donde: 
- n = tamaño del arreglo de bits 
- k = cantidad de funciones hash 
- c = cantidad de elementos insertados 

### Detalles operativos

- Inserción duplicada no se detecta: insertar el mismo elemento varias veces no genera error ni aviso, no hay forma de saber si un elemento "ya estaba" antes de insertarlo. El filtro no sirve para contar elementos únicos. 

- Cada inserción degrada la precisión global: insertar un elemento nuevo aumenta ligeramente la probabilidad de falso positivo para todas las búsquedas futuras. 

- La búsqueda nunca da un "sí" definitivo: solo "posiblemente sí" o "seguro no". Se usa como filtro previo, no como fuente de verdad. 

- No hay eliminación en la versión clásica: borrar un bit a mano puede generar falsos negativos. La alternativa es el Counting Bloom Filter, con más espacio y riesgo de overflow. 

- El tamaño no es ajustable: si n resultó insuficiente, la tasa de error crece y no se puede agrandar sin recrear el filtro (lo cual requiere haber guardado los elementos originales en otro lado). 

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
        return [hash((elemento, i)) % self.tamaño for i in range(self.k)]

    def add(self, elemento):
        for pos in self._posiciones(elemento):
            self.bits[pos] = 1

    def __contains__(self, elemento):
        return all(self.bits[pos] == 1 for pos in self._posiciones(elemento))


bf = BloomFilter(capacity=100, error_rate=0.01)

bf.add("manzana")
bf.add("banana")

print("manzana" in bf)  # True (probablemente)
print("pera" in bf)     # False
```

## 4. Uso y criterio

### Casos de uso

- **Filtro previo**: En los casos donde haya muchas consultas concurrentes, se utiliza el Bloom Filter para comprobar que la clave no esté y evitar consultar la caché, la base de datos o una API. Si indica que podría estar, se realiza la consulta real.
- **Detecta nombres de usuario duplicados**: Para determinar si un nombre de usuario es nuevo o si ya existe, valida cuando intente registrarse con un nombre, verifica si el nombre de usuario puede que exista o no. 
- **Detecta fraudes**: Detecta si una tarjeta de crédito está marcada como robada. Se usa un filtro que contenga tarjetas denunciadas como robadas y, cuando se use una tarjeta, verifica si pertenece al conjunto.  
- **Filtra spam y contenido dañino**: Puedes usar filtros de Bloom para analizar el contenido en busca de posibles amenazas, materiales dañinos y spam. Para ello, crea un filtro que contenga URLs maliciosas, direcciones de correo electrónico de spam y números de teléfono de spam.

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

Para guardar un Bloom Filter y recuperarlo después, se deben persistir tanto el arreglo de bits como su configuración: tamaño, número de hashes, algoritmo de hash y versión del formato. 


#### **Hashes**

Deben distribuir los elementos uniformemente para reducir colisiones y falsos positivos. 

 
#### **Concurrencia**

Si varios hilos o procesos insertan elementos a la vez, las actualizaciones de bits deben ser seguras. En una implementación concurrente pueden requerirse operaciones atómicas, bloqueos o una estructura proporcionada por un sistema externo como Redis. 


#### **Saturación**

A medida que se insertan más elementos de los previstos, se activan más bits y crece la tasa de falsos positivos. 

## 6. Referencias y recursos

### Referencias bibliográficas

1. Amazon Web Services (AWS). *Implement fast, space-efficient lookups using Bloom filters in Amazon ElastiCache*. AWS Database Blog. https://aws.amazon.com/es/blogs/database/implement-fast-space-efficient-lookups-using-bloom-filters-in-amazon-elasticache/.

2. Fox, J. *python-bloomfilter: Scalable Bloom Filter implemented in Python*. GitHub. https://github.com/joseph-fox/python-bloomfilter.

3. Baeldung. *Bloom Filter in Java using Guava*. Baeldung. https://www.baeldung.com/guava-bloom-filter

4. AlgoMaster. *Bloom Filters | System Design*. AlgoMaster. https://algomaster.io/learn/system-design/bloom-filters.

5. <a id="bib5"></a> Python Land. *Bloom Filter in Python: Test If An Element is Part of a Large Set*. Python Land Blog. Publicado el 24 de junio de 2024. https://python.land/bloom-filter

6. Llimllib. *Bloom Filters by Example*. https://llimllib.github.io/bloomfilter-tutorial/.

7. Google Cloud. *Acerca de los filtros de Bloom*. Memorystore for Valkey Documentation. https://docs.cloud.google.com/memorystore/docs/valkey/about-bloom-filters?hl=es-419.