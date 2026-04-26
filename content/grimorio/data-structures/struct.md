---
title: 'Record (o Estructura)'
tags: ['data-structures']
alias: ['record', 'struct']
---

## 1. Qué es y cómo funciona

### Intuición

Al desarrollar a veces uno se da cuenta que varias variables sueltas tiene sentido tenerlas agrupadas en una estructura. Un ejemplo puede ser los datos de un estudiante: Nombre, legajo, promedio.  
Usar variables sueltas o arreglos paralelos es propenso a errores y muy difícil de mantener a largo plazo. La información está muy dispersa. La idea central de un Record/Struct es agrupar lógicamente datos relacionados que pueden ser de distintos tipos bajo un único nombre, tratándolos como una sola unidad.
Un Record resuelve la dispersión de datos, permite modelar entidades compuestas del dominio del problema, facilitando su manejo (como por ejemplo al declararlo como parámetro de una función) y dando buenas prácticas al código al acceder a los datos por su nombre en lugar de por índices numéricos.


### Definición / propiedades

Un Record / Struct es un tipo de dato compuesto que agrupa un número fijo de campos.
- Invariantes: La cantidad y nombres de los campos está definido de antemano y representa una entidad cohesiva.
- Propiedades clave: Sus elementos se acceden mediante un identificador (atributos). Fomenta una alta cohesión de datos y, en su definición más pura, carece de metodos, actuando solo como contenedor de información.

### Representación
En Python, los objetos por defecto usan un diccionario interno dinámico para guardar atributos. Para lograr la representación real de un Struct, se utilizan `slots`. Internamente, la estructura se convierte en un arreglo estricto de referencias (punteros) a los valores en memoria, eliminando el sobrecosto del diccionario.

![](/attachments/grimorio/data-structures/structs.svg)

## 2. Operaciones y complejidad

### Operaciones principales
- Lista de operaciones con nombres estandarizados (por ejemplo: push/pop/peek, insert/delete/find, append/concat, union/intersect).
- Para cada operación: breve descripción de lo que hace.

### Complejidad
- Por operación: tiempo (peor/ promedio/ amortizado) y complejidad espacial adicional.
- Notas sobre costos ocultos (reallocs, rehash, recorridos, copias).

### Detalles operativos
- Casos especiales: operaciones en estructura vacía/llena, duplicados, orden, límites de tamaño.
- Comportamiento en concurrencia o fallos (si aplica).

Debe responder a: "¿qué puedo hacer y cuánto cuesta?"

## 3. Implementación

### Idea de implementación
- Descripción de la(s) estrategia(s) típica(s) para implementar la estructura.
- Algoritmos clave y pasos principales.

### Invariantes
- Lista de comprobaciones e invariantes que el código debe garantizar siempre (por ejemplo: punteros no nulos, tamaño consistente, heap property, ordenamiento mantenido).

### Ejemplo de código
- Proporciona 1-2 snippets claros y mínimos (en Python).
- Ejemplo de uso típico con entrada y salida esperada.

Debe responder a: "¿cómo lo programo sin romperlo?"

## 4. Uso y criterio

### Casos de uso
- Situaciones y problemas donde la estructura encaja naturalmente.

### Cuándo NO usarlo
- Escenarios donde su uso es contraproducente o subóptimo.

### Comparaciones
- Alternativas comunes y cuándo elegir cada una (lista comparativa breve).

### Ventajas / desventajas
- Trade-offs prácticos en rendimiento, memoria, simplicidad, y facilidad de implementación.

### Señales de reconocimiento
- Pistas en el enunciado de un problema que indican que esta estructura es adecuada.

Debe responder a: "¿cuándo conviene usarlo?"

## 5. Relaciones y extensiones

### Variantes
- Variantes y mejoras (por ejemplo: versiones balanceadas, persistentes, acotadas, indexadas, con hashing, etc.).

### Relación con otras estructuras
- Dependencias conceptuales y cómo se combina con otras estructuras.

### Notas avanzadas
- Temas avanzados como persistencia, concurrencia, paralelismo, ordenamientos aleatorios, caching, tuning de parámetros.

Debe responder a: "¿cómo encaja en el mapa general de estructuras de datos?"

## 6. Referencias y recursos
- Enlaces y libros de referencia, artículos científicos.
- Visualizaciones y demostraciones.
