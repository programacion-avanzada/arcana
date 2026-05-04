---
title: 'Estructura (Struct / Record)'
tags: ['data-structures']
alias: ['record', 'struct']
---

## 1. Qué es y cómo funciona
### Intuición
Usar variables sueltas o arreglos paralelos es propenso a errores y muy difícil de mantener a largo plazo. La información está muy dispersa. La idea central de un Record/Struct es agrupar lógicamente datos relacionados que pueden ser de distintos tipos bajo un único nombre, tratándolos como una sola unidad.

Un Struct resuelve la dispersión de datos, permite modelar entidades compuestas del dominio del problema, facilitando su manejo (como por ejemplo al declararlo como parámetro de una función) y dando buenas prácticas al código al acceder a los datos por su nombre en lugar de por índices numéricos.
 
 
### Definición / propiedades
 
Un Struct / Record es un tipo de dato compuesto que agrupa un número fijo de campos.
- Invariantes: La cantidad y nombres de los campos está definido de antemano y representa una entidad cohesiva.
- Propiedades clave: Sus elementos se acceden mediante un identificador (atributos). Fomenta una alta cohesión de datos y, en su definición más pura, carece de metodos, actuando solo como contenedor de información.
### Representación

Esta es la representacion más básica de una estructura:
```
struct Punto3d {
    float x;
    float y;
    float z;
}
```

En Python, los objetos por defecto usan un diccionario interno dinámico para guardar atributos. Para lograr la representación real de un Struct en Python, se utiliza el campo `slots`. Internamente, la estructura se convierte en un arreglo estricto de referencias (punteros) a los valores en memoria, eliminando el diccionario.
 
```
Instancia 'Punto3D' -> [ Header del Objeto ]
                       [ Ref al valor 'x'  ] -> Objeto float
                       [ Ref al valor 'y'  ] -> Objeto float
                       [ Ref al valor 'z'  ] -> Objeto float
```

---
 
## 2. Operaciones y complejidad
 
### Operaciones principales y Complejidad
 
- **Acceso / Lectura (Read Field):** $O(1)$. Se accede directamente al atributo (ej. `punto.x`) mediante una búsqueda optimizada en memoria.
- **Modificación (Write Field):** $O(1)$. Si la estructura es mutable, se reasigna la referencia del campo a un nuevo valor.
- **Instanciación (Create):** $O(K)$, donde $K$ es la cantidad de campos, ya que se debe reservar el espacio y asignar las referencias iniciales de cada atributo.
### Detalles operativos
 
- No hay operaciones de inserción o eliminación de campos en tiempo de ejecución: la estructura tiene un tamaño fijo definido en su declaración.
- Al usar `slots=True`, intentar asignar un atributo no declarado lanza `AttributeError`, garantizando la integridad del esquema.
---
 
## 3. Implementación
 
### Idea de implementación
 
En Python, la forma idiomática y robusta de implementar el patrón Struct es utilizando el decorador `@dataclass`. Para que se comporte estrictamente como un Struct eficiente en memoria (tamaño fijo y sin atributos dinámicos), se debe habilitar el parámetro `slots=True`.
 
Para registros estrictamente inmutables y rápidos, se utiliza `namedtuple`.
 
### Invariantes
 
- **Consistencia de atributos:** El código no debe permitir la creación de atributos que no pertenezcan a la definición original de la estructura. Habilitar `slots` garantiza esto.
- **Tipado estricto:** Aunque Python es dinámico, el uso de *Type Hints* en la estructura documenta y restringe qué tipo de dato debe estar en cada campo.
### Ejemplo de código
 
```python
from dataclasses import dataclass
from collections import namedtuple
 
# 1. Struct Mutable eficiente (requiere Python 3.10+)
@dataclass(slots=True)
class Coordenada:
    x: float
    y: float
 
# 2. Struct Inmutable (Record) clásico
ColorRGB = namedtuple('ColorRGB', ['rojo', 'verde', 'azul'])
 
# Casos de uso
punto = Coordenada(10.5, -5.2)
punto.x = 8.0           # Modificación O(1) permitida
 
color_fondo = ColorRGB(255, 255, 255)
# color_fondo.rojo = 0  # Lanzaría AttributeError (inmutable)
```
 
---
 
## 4. Uso y criterio
 
### Casos de uso
 
- **Data Transfer Objects (DTO):** Para agrupar y transferir información junta de valor para el sistema que lo use.
- **Nodos de estructuras complejas:** Agrupar el "payload" (valor) y los punteros requeridos para armar grafos, árboles o listas enlazadas.
- **Procesamiento de datos tabulares:** Representar cada fila de una base de datos o archivo CSV como un registro tipado.
### Cuándo NO usarlo
 
- Cuando la entidad tiene reglas de validación complejas al momento de modificarse (en cuyo caso es mejor una **clase OOP** completa con métodos *getter/setter*).
- Cuando los campos de los datos son desconocidos y pueden cambiar dinámicamente en tiempo de ejecución (ej. procesar el cuerpo de un JSON arbitrario).
### Comparaciones
 
- vs Arreglo: La estructura viene a "ordenar" (no literalmente) los datos que podemos llegar a tener dentro de un Arreglo, en vez de accederlos por un indice, los tenemos definidos en la estructura con referencias y nombres. Además, el Arreglo necesita que los valores sean homogéneos, y la Estructura permite tener agrupados varios tipos de valores.
- vs Mapa: Se asemejan en el hecho de que ambos trabajan con 'clave: valor', pero un mapa es dinámico y se le pueden agregar mas "clave valor" a como hagan falta, cuando en la estructura se resigna a la mutabilidad en pos de ser más eficiente a la hora de acceder a los datos. Depende el caso de uso puede ser mas útil una u otra. En el caso de un DTO una estructura es mucho mas prolijo que tener muchos mapas para representar cada dato.
 
### Ventajas / Desventajas
 
**Ventajas:**
- Acceso a campos extremadamente eficiente ($O(1)$).
- Menor uso de memoria que un diccionario o una clase estándar (especialmente con `slots`).
- Hace explícito el esquema de datos, facilitando el mantenimiento.

**Desventajas:**
- Esquema rígido: no admite campos nuevos en tiempo de ejecución (desperdiciando la alta mutabilidad de los datos en Python)
- No encapsula lógica de negocio (se combina con clases cuando se necesita comportamiento).

### Señales de reconocimiento
 
Es la estructura adecuada cuando te enfrentás al problema: *"Necesito pasar estas tres/cuatro variables juntas a todos lados, pertenecen al mismo concepto, pero no necesito que tengan métodos o lógica propia"*.
 
---
 
## 5. Relaciones y extensiones
 
### Variantes
 
- **`ctypes.Structure`:** Variante especializada que permite definir structs idénticos a los de C. Ideal para interoperabilidad con bibliotecas compiladas (`.dll` o `.so`) donde los bytes deben estar empaquetados y alineados exactamente a nivel de sistema operativo.
- **`TypedDict`:** Variante conceptual donde la estructura sigue siendo un diccionario estándar en tiempo de ejecución, pero las herramientas de tipado estático (como `mypy`) la analizan como si fuera un Struct cerrado.
- **`@dataclass(frozen=True)`:** Equivalente inmutable al `dataclass` estándar; genera `__hash__` automáticamente y lanza `FrozenInstanceError` ante modificaciones.

### Relación con otras estructuras
 
Los Structs son la base sobre la que se arman casi todas las estructuras dinámicas:
- Una **Lista Enlazada** se conforma interconectando Structs que contienen el dato y la referencia al nodo siguiente.
- Un **Árbol Binario** requiere un Struct que encapsule el valor, el hijo izquierdo y el hijo derecho.
- Un **Grafo** representa cada nodo como un Struct con su valor y la lista de adyacencia.
### Notas avanzadas
 
La serialización de estos objetos para guardarlos en disco o enviarlos por red requiere módulos adicionales en Python (como `pickle` para binario, o la conversión a diccionarios previa a JSON usando `dataclasses.asdict()`), ya que el Struct puro en memoria no es transmisible de forma directa de un proceso a otro.
 
---
 
## 6. Referencias y recursos
 
- Documentación oficial de Python - *dataclasses*: <https://docs.python.org/3/library/dataclasses.html>
- Documentación oficial de Python - *collections.namedtuple*: <https://docs.python.org/3/library/collections.html#collections.namedtuple>
- Record (en inglés) - <https://en.wikipedia.org/wiki/Record_(computer_science)>