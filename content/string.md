---
title: 'String (Cadena)'
tags: ['data-structures']
alias: ['string', 'cadena', 'cadena de caracteres']
---

# String (Cadena)

## 1. Qué es y cómo funciona

### Intuición

Un String (cadena de caracteres) es, en esencia, una secuencia ordenada de caracteres (letras, números, símbolos) que se tratan como una única unidad.
Permite **representar y manipular texto** de forma eficiente, preservando el orden de los caracteres.

Los strings facilitan:

- Almacenamiento de texto (nombres, mensajes, archivos)
- Búsqueda de patrones (ej: encontrar una palabra dentro de otra)
- Transformaciones (concatenar, reemplazar, cortar partes)
- Procesamiento de datos (parsing, validación, formateo)

### Definición / propiedades

#### Definición formal

Un string es una **secuencia finita de caracteres** pertenecientes a un alfabeto Σ (por ejemplo, ASCII o Unicode):

S = c₀ c₁ c₂ ... cₙ₋₁

donde cada cᵢ ∈ Σ.

#### Invariantes (lo que siempre se cumple)

- Existe un **orden definido** entre los caracteres
- Cada carácter tiene una **posición (índice)**, generalmente comenzando en 0
- La longitud del string es **finita y conocida**
- En muchos lenguajes (como Java, Python, C#), los strings son **inmutables**:
  - No se pueden modificar directamente
  - Cualquier operación genera un nuevo string

#### Propiedades clave

- **Ordenado:** el orden de los caracteres importa
  `"abc" ≠ "cba"`

- **Indexado:** acceso directo a cualquier posición
  Ej: S[0] = 'h'

- **Longitud definida:**
  len("hola") = 4

- **Puede ser inmutable o mutable:**
  - Inmutable (más común): más seguro, pero puede implicar copias
  - Mutable: más eficiente para modificaciones frecuentes

- **Permite duplicados:**
  `"aaa"` es válido

- **Generalmente acotado en memoria:** depende del lenguaje y sistema

### Representación

La forma más común de representar un string es como un **arreglo (array) contiguo de caracteres** en memoria.

Ejemplo: `"hola"`

![Representación en memoria de "hola"](/attachments/grimorio/data-structures/string-hola-array.svg)

Esto permite:

- Acceso en O(1) por índice
- Recorrido secuencial eficiente

En lenguajes como C, además, se utiliza un carácter especial de terminación (`'\0'`):

![Representación en memoria de "hola" con terminador nulo](/attachments/grimorio/data-structures/string-hola-null.svg)

#### Ilustración

String: `"chat"`

![Ilustración del string "chat" con índices y contenido](/attachments/grimorio/data-structures/string-chat.svg)

#### Variantes de representación

Aunque lo más común es un array, también existen otras implementaciones:

- **Strings como arrays dinámicos** → permiten crecimiento automático
- **Strings como listas enlazadas** → menos comunes, útiles en casos específicos
- **Ropes (árboles de strings)** → optimizan concatenaciones grandes

---

## 2. Operaciones y complejidad

### Operaciones principales

1. **Access / Indexing (Acceso)**
   **Función**: Obtiene el carácter en la posición i mediante acceso directo por índice.

2. **Insert / Delete (Inserción y Borrado)**
   **Función**: Agrega o elimina un carácter en cualquier posición, requiriendo desplazar elementos.

3. **Concatenation (Concatenación)**
   **Función**: Une dos strings, generando un nuevo bloque de memoria con ambos contenidos.

4. **Find / Search (Búsqueda)**
   **Función**: Localiza una subcadena dentro de un texto; puede optimizarse con algoritmos como KMP.

5. **Length / Size (Tamaño)**
   **Función:** Devuelve la cantidad de caracteres almacenados.

6. **Comparison (Comparación)**
   **Función:** Compara dos strings carácter a carácter.

7. **Transformation (ToUpper / ToLower)**
   **Función**: Convierte los caracteres recorriendo la cadena.

8. **Append (Añadir al final)**
   **Función:** Agrega contenido al final; en strings inmutables implica copia, en buffers evita este costo.

9. **Slice (Subcadena)**
   **Función:** Extrae una porción del string dado un rango de índices, generando una nueva cadena.

### Complejidad

| Operación       | Tiempo (peor caso)                       | Complejidad Espacial |
| --------------- | ---------------------------------------- | -------------------- |
| Access          | O(1)                                     | O(1)                 |
| Insert / Delete | O(n)                                     | O(n)                 |
| Append          | O(n) inmutable / O(1) amortizado mutable | O(n)                 |
| Concat          | O(n + m)                                 | O(n + m)             |
| Find            | O(n*m) naive / O(n+m) KMP                | O(1)                 |
| Compare         | O(n)                                     | O(1)                 |
| Length          | O(1) ASCII / O(n) UTF-8 sin índice       | O(1)                 |
| Slice           | O(k)                                     | O(k)                 |

### Detalles operativos

- **Encoding (UTF-8 vs ASCII):** En ASCII el acceso es siempre O(1). En UTF-8, debido a que los caracteres tienen ancho variable (1 a 4 bytes), el acceso y el cálculo de longitud pueden degradarse a O(n) si el lenguaje no utiliza índices adicionales.

- **Data Locality (Localidad de datos):** Gracias a la contigüidad, los strings aprovechan la memoria caché de la CPU. Esto hace que, en la práctica, un recorrido O(n) sea extremadamente más veloz que en estructuras no contiguas como las listas enlazadas.

- **Inmutabilidad y memoria:** Cualquier modificación implica una copia O(n); concatenar en un bucle acumula ese costo hasta O(n²). Los buffers dinámicos lo evitan, aunque al reasignar pueden duplicar temporalmente el uso de memoria.

---

## 3. Implementación

### Idea de implementación

Un string se implementa típicamente como un **array contiguo de caracteres** junto con su longitud.

Estructura básica:

- char[] (datos)
- length (tamaño)
- opcional: capacity o terminador \0

**Estrategias:**

- **Inmutable:** cada modificación crea un nuevo array y copia los datos → simple pero costoso (O(n))
- **Mutable (buffer):** usa capacidad extra y redimensiona cuando es necesario → permite append O(1) amortizado

**Algoritmos clave:**

- acceso por índice → O(1)
- concatenación → copia de arrays → O(n+m)
- redimensionamiento → O(n) ocasional
- búsqueda → recorrido secuencial

### Invariantes

Invariantes según el caso:

- En strings inmutables: no modificar el contenido
- En buffers: tamaño ≤ capacidad
- En C: debe terminar con \0

### Ejemplo de código

**Concatenación: antipatrón vs solución**

```python
# O(n²): cada += crea un nuevo string
resultado = ""
for palabra in ["hola", " ", "mundo"]:
    resultado += palabra

# O(n): join construye el string una sola vez
resultado = " ".join(["hola", "mundo"])
```

En strings inmutables, cada `+=` genera una copia completa. `join` evita ese costo construyendo el resultado en un único paso.

**Construcción eficiente (buffer)**

```python
from io import StringIO

buffer = StringIO()
for _ in range(5):
    buffer.write("a")

print(buffer.getvalue())
```

Se usa un buffer para acumular caracteres sin crear nuevos strings en cada paso, reduciendo el costo a O(n)

---

## 4. Uso y criterio

### Casos de uso

Casos típicos:

- **Procesamiento de texto**: edición, formateo, validación
- **Entrada y salida de datos**: archivos, logs, inputs de usuario
- **Búsqueda de patrones**: detección de palabras clave, parsing
- **Comunicación entre sistemas**: protocolos (JSON, XML, HTTP)
- **Identificadores y etiquetas**: nombres de usuario, IDs

### Cuándo NO usarlo

- **Concatenaciones repetidas (ej: en bucles)**
  Generan múltiples copias → costo O(n²)

- **Inserciones o eliminaciones frecuentes**
  Requieren desplazar caracteres → O(n) por operación

- **Texto muy grande con cambios constantes**
  Alto costo en memoria y tiempo por copias

- **Escenarios con alta presión de memoria**
  Muchas instancias intermedias (garbage collector)

Alternativas: buffers mutables (StringBuilder), arrays de caracteres o estructuras como rope.

### Comparaciones

**Array de caracteres:** estructura de bajo nivel que almacena caracteres de forma contigua. Permite modificación directa y control de memoria, pero requiere manejo manual y es más propensa a errores.

**StringBuilder / buffer mutable:** estructura basada en un array dinámico, diseñada para construir texto de forma eficiente. Permite append O(1) amortizado y evita copias innecesarias, aunque pierde la inmutabilidad del string estándar.

**Lista enlazada de caracteres:** representa el texto como nodos enlazados. Facilita inserciones y eliminaciones si se tiene la referencia al nodo, pero el acceso es O(n) y tiene peor localidad de memoria.

**Rope (árbol de strings):** estructura en árbol que almacena fragmentos de texto. Optimiza concatenaciones e inserciones en textos grandes, pero tiene mayor complejidad de implementación y overhead.

### Ventajas / desventajas

**Ventajas / desventajas:** El string estándar es la opción más simple y segura: acceso O(1), thread-safe por inmutabilidad y compatible universalmente. Su principal costo es que cualquier modificación implica una copia O(n), lo que lo hace inferior a StringBuilder para escritura intensiva, a los arrays de caracteres para control de bajo nivel, y a los Ropes para textos muy grandes.

### Señales de reconocimiento

- El enunciado menciona búsqueda de subcadenas, validación de formatos o extracción de partes del texto.
- El problema requiere comunicación vía JSON, XML o HTTP.
- El volumen de lecturas supera ampliamente al de modificaciones.
- Los datos no deben cambiar (nombres, IDs, claves).

---

## 5. Relaciones y extensiones

### Variantes

- **StringBuilder / buffer mutable:** construcción eficiente de strings, evita copias innecesarias.
- **Rope:** optimiza concatenaciones e inserciones en textos grandes.
- **Trie:** estructura de prefijos, facilita autocompletado y búsqueda de patrones.

### Relación con otras estructuras

El string se apoya conceptualmente en el array: es un array especializado de caracteres.

Su inmutabilidad los convierte en claves ideales para hash tables: el hash se calcula una sola vez y se cachea.

### Notas avanzadas

- **Persistencia y Concurrencia:** la inmutabilidad del string estándar lo hace inherentemente seguro para hilos (thread-safe), permitiendo que múltiples procesos accedan a la misma instancia sin riesgo de modificación o corrupción de datos.

- **Deduplicación de memoria (String Interning):** entornos como la JVM o .NET mantienen un pool de strings, donde valores iguales pueden compartir la misma referencia en memoria, optimizando el uso de recursos.

---

## 6. Referencias y recursos

- [FreeCodeCamp - Strings](https://www.freecodecamp.org)
- [Harper College - Data Structures](http://www.harpercollege.edu/bus-ss/cis/166/mmckenzi/contents.htm)
- [Better String Library](http://bstring.sourceforge.net)
- [Princeton CS217 - String Assignment](http://www.cs.princeton.edu/courses/archive/spring02/cs217/asgts/ish/ish.html)
