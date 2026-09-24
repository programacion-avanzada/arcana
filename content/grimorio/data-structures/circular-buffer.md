---
title: Buffer Circular
tags:
  - data-structures
alias:
  - circular queue
  - cyclic buffer
  - ring buffer
---
## 1. Qué es y cómo funciona

### Intuición

Un **buffer circular** es una estructura especial que utiliza un [[struct]] para almacenar dos punteros (**head** y **tail**), un [[array]] y la cantidad de elementos guardados por el array. Su puntero **tail** se utiliza para leer los datos que almacena, mientras que su puntero **head** se utiliza para escribir los datos a guardar. Aunque se comporte como una [[queue]], al llenarse sobrescribe los elementos más antiguos. Esta estructura es útil para almacenar datos de manera temporal, como en la transmisión de datos en tiempo real en sistemas embebidos, donde se requiere un almacenamiento eficiente y rápido de datos que deben ser procesados en orden.

### Definición / propiedades

- Acceso limitado: solo permite acceder al elemento apuntado por tail.
- Tamaño fijo: el tamaño del buffer se define al momento de su creación y no puede cambiarse.
- Respeta el orden de inserción: los elementos se leen en el mismo orden en el que fueron escritos.
- Similitud con queue: se comporta como una cola FIFO, pero con la particularidad de que cuando se llena, los elementos más antiguos se sobrescriben.

### Representación

![[circular-buffer.svg|Representación del buffer circular|450]]

- `buffer`: array de tamaño fijo que almacena elementos.
- `length`: cantidad de elementos que el buffer tiene almacenados.
- `head`: puntero a la posición donde se insertara un nuevo elemento en el buffer.
- `tail`: puntero a la posición donde se leerá el elemento del buffer.

## 2. Operaciones y complejidad

### Operaciones principales

- `push(x)` inserta un elemento, en caso de estar lleno, pisa el elemento más antiguo.
- `pop()` retornar elemento más antiguo.
- `peek()` / `top()` consultar elemento más antiguo.
- `isEmpty()` verifica si el buffer no contiene elementos.
- `isFull()` verifica si el buffer alcanzo la capacidad máxima de elementos.
- `clear()` / `reset()` vacía el buffer y reinicia los punteros.

### Complejidad

|                       | Mejor caso | Caso promedio | Peor caso | Espacial |
| --------------------- | ---------- | ------------- | --------- | -------- |
| `push(x)`             | $O(1)$     | $O(1)$        | $O(1)$    | $O(1)$   |
| `pop()`               | $O(1)$     | $O(1)$        | $O(1)$    | $O(1)$   |
| `peek()` / `top()`    | $O(1)$     | $O(1)$        | $O(1)$    | $O(1)$   |
| `isEmpty()`           | $O(1)$     | $O(1)$        | $O(1)$    | $O(1)$   |
| `isFull()`            | $O(1)$     | $O(1)$        | $O(1)$    | $O(1)$   |
| `clear()` / `reset()` | $O(1)$     | $O(1)$        | $O(1)$    | $O(1)$   |
| `find()`              | $O(1)$     | $O(n)$        | $O(n)$    | $O(1)$   |

### Detalles operativos

- Puede haber underflow (hacer pop en buffer vacío).
- Posee tamaño fijo, el tamaño del buffer se define al momento de su creación y no puede cambiarse..
- Si el buffer se encuentra lleno, se pisa el elemento más antiguo.

## 3. Implementación

### Idea de implementación

Usa un [[array]] fijo y dos índices (`head` y `tail`). Ambos avanzan con aritmética modular (`% capacity`), reutilizando posiciones sin desplazar elementos.

### Invariantes

- `0 <= head < capacity`
- `0 <= tail < capacity`
- `0 <= length <= capacity`

### Ejemplo de código

```python
class CircularBuffer:
	def __init__(self, capacity):
		if capacity <= 0:
			raise Exception("Capacity debe ser un entero positivo")

		self.capacity = capacity
		self.buffer = [None] * capacity
		self.length = 0
		self.head = 0
		self.tail = 0

	def is_empty(self):
		return self.length == 0

	def is_full(self):
		return self.length == len(self.buffer)

	def push(self, item):
		if self.is_full():
			self.tail = (self.tail + 1) % self.capacity
		else:
			self.length += 1

		self.buffer[self.head] = item
		self.head = (self.head + 1) % self.capacity

	def pop(self):
		if self.is_empty():
			raise Exception("Ring vacío")

		item = self.buffer[self.tail]
		self.tail = (self.tail + 1) % self.capacity
		self.length -= 1

		return item

	def peek(self):
		if self.is_empty():
			raise Exception("Ring vacío")
		return self.buffer[self.tail]
```

### Ejemplo de uso típico

```python
# Retener las últimas 3 lecturas de un sensor
sensor = CircularBuffer(3)
for x in [18.5, 19.0, 20.2, 21.5, 22.0]:
	sensor.push(x)

while not sensor.is_empty():
	print("pop ->", sensor.pop())
# Salida:
# pop -> 20.2
# pop -> 21.5
# pop -> 22.0
```

## 4. Uso y criterio

### Casos de uso

- **Telecomunicaciones y redes:** almacena paquetes de audio para compensar variaciones de llegada y mitigar el jitter en VoIP.
- **Audio y video:** conserva muestras pendientes de reproducción y absorbe ráfagas breves.
- **Sensores:** mantiene las últimas N mediciones, reemplazando las más antiguas.

La capacidad debe cubrir las ráfagas esperadas, si el productor supera al consumidor de manera sostenida, el buffer terminará llenándose.

### Cuándo NO usarlo

- **Datos que no pueden perderse:** la sobrescritura puede eliminar operaciones pendientes. Conviene una cola bloqueante o persistente con confirmaciones.
- **Volumen sin límite conocido:** una cola dinámica puede crecer mientras haya memoria disponible.
- **Búsqueda frecuente por clave:** una [[hash table]] ofrece búsqueda promedio en $O(1)$, mientras que recorrer el buffer cuesta $O(n)$.
- **Acceso por posición:** un [[array]] resulta más directo, aunque existen buffers circulares indexados.
- **Historial completo:** requiere almacenamiento persistente, mientras que una ventana acotada no conserva todos los datos.

Por ejemplo, un banco no debe sobrescribir transferencias pendientes cuando se llenan sus 100 posiciones porque necesita conservarlas hasta confirmar su procesamiento.

### Comparaciones

- **[[linked list]]:** una cola enlazada crece sin una capacidad fija preestablecida, pero necesita asignar nodos y pierde localidad de memoria. El buffer circular reutiliza un bloque contiguo.
- **[[dynamic array]]:** extraer del principio desplaza elementos en $O(n)$, por lo que redimensionar requiere copiar el contenido. El buffer circular fijo inserta y extrae en $O(1)$.
- **[[stack]]:** procesa primero el último elemento (LIFO), mientras el buffer procesa el más antiguo disponible (FIFO). Ambos admiten almacenamiento fijo y operaciones principales en $O(1)$.

### Ventajas / desventajas

El almacenamiento fijo hace predecible el consumo de memoria y evita reasignaciones durante las operaciones. Su disposición contigua favorece la caché y permite reutilizar espacio sin desplazar elementos.

Como contrapartida, la capacidad debe elegirse de antemano y la sobrescritura pierde datos. Además, el acceso concurrente requiere sincronización.

### Señales de reconocimiento

Buscá requisitos como “últimos N elementos”, “memoria limitada” o un productor y un consumidor que trabajan a ritmos distintos. El buffer sirve para absorber diferencias temporales, siempre que la política ante el llenado sea aceptable.

Por ejemplo, mostrar las últimas 20 temperaturas de un sensor requiere una ventana fija, en donde nuevas mediciones reemplazan las más antiguas sin aumentar la memoria.

## 5. Relaciones y extensiones

### Variantes

- **Con sobrescritura**: al llenarse reemplaza el más antiguo. Cajas negras, últimas N mediciones.
- **Con rechazo:** al llenarse descarta el nuevo y devuelve un error, cuando el dato pendiente vale más que el nuevo.
- **Bloqueante:** suspende al productor hasta que se libere lugar. Productor-consumidor entre hilos.
- **De doble extremo ([[deque]]):** inserta y extrae por ambos extremos.
- **Redimensionable:** al llenarse duplica la capacidad y copia los elementos, perdiendo la memoria fija a cambio de no descartar datos.
- **Capacidad potencia de dos:** reemplaza `% capacity` por `& (capacity - 1)`, más barato. Usada en núcleos de sistemas operativos.

### Relación con otras estructuras

En la práctica suele combinarse con otras estructuras, como por ejemplo, con un [[hash table]] formando una caché de tamaño fijo en donde el buffer define qué elemento se descarta y la tabla permite buscar por clave, junto a semáforos constituye el clásico problema del productor-consumidor.
El principio general es que el buffer circular aporte **orden y acotamiento**, y se complemente con otra estructura que aporte la forma de búsqueda que el problema requiera.

### Notas avanzadas

- **Persistencia:** no es una estructura persistente en el sentido funcional, porque modifica la memoria en el lugar y cada sobreescritura destruye información.
- **Caché y localidad:** el array contiguo favorece la precarga del procesador, pero cuando los datos atraviesan el final del arreglo quedan divididos en dos segmentos, lo que obliga a realizar dos copias de memoria en lugar de una.
- **Ajuste de la capacidad:** debe estimarse como la tasa máxima de producción por el tiempo máximo que el consumidor puede permanecer detenido, con un margen adicional.
- **Tiempo real:** al no requerir asignación dinámica de memoria, ofrece un tiempo de ejecución acotado y predecible.

### ¿Cómo encaja en el mapa general de estructuras de datos?

Pertenece a las estructuras **lineales de acceso restringido**, junto con la pila ([[stack]]), la cola ([[queue]]) y la [[deque]].

El buffer circular combina almacenamiento contiguo y capacidad acotada con aritmética modular, reutilizando las posiciones liberadas sin desplazar los elementos pendientes.

## 6. Referencias y recursos

1. [EW Skills - Circular Buffer](https://www.ewskills.com/embedded-c/circular-buffer)
1. [TechVedas .learn - Implementación de un Buffer Circular en C](https://youtu.be/uvD9_Wdtjtw?si=jp2ikM8JuH8_sQtG)
1. [Boost - Circular Buffer](https://www.boost.org/doc/libs/latest/doc/html/circular_buffer.html)
1. [Oracle Java - HashMap](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashMap.html)
1. [FasterCapital - Bufer circular: el enfoque FIFO en el almacenamiento de datos](https://fastercapital.com/es/contenido/Bufer-circular--Explicacion-del-bufer-circular--el-enfoque-FIFO-en-el-almacenamiento-de-datos.html#B-fers-circulares-en-aplicaciones-del-mundo-real)
1. [Baeldung - Circular Buffer](https://www.baeldung.com/cs/circular-buffer)
1. [Generalist Programmer - Circular Buffer / Ring Buffer Complete Guide](https://generalistprogrammer.com/tutorials/circular-buffer-ring-buffer-complete-guide)
