---
title: 'Mapa / Diccionario (Map)'
tags: ['data-structures']
alias: ['map', 'dictionary', 'mapa', 'diccionario', 'hashmap', 'tabla-de-dispersion']
---
## 1. Qué es y cómo funciona

### Intuición

Si imaginamos una agenda telefónica, cada nombre está asociado a un número.
No buscás por posición ni por índice numérico: buscás por una **clave**
(el nombre del contacto) y obtenés el valor asociado (el número telefónico).

Un Map funciona exactamente así: mantiene asociaciones entre **claves** y **valores**.
Su objetivo es permitir recuperar información **a partir de una clave** de manera clara y eficiente.

### Definición y propiedades

**Definición formal:** Un Map es un tipo de dato abstracto que mantiene
una colección de pares **clave→valor** bajo ciertas reglas fundamentales:

- Cada clave existe como máximo una vez.
- Cada clave está asociada exactamente a un valor.
- Dada una clave válida, debe poder recuperarse su valor asociado.

**Propiedades clave:**

- **Claves únicas:** no pueden coexistir dos entradas con la misma clave.
- **Asociación directa:** cada clave referencia un único valor.
- **Actualización permitida:** si una clave ya existe, su valor puede reemplazarse.
- **Implementación independiente:** puede construirse mediante hashing, árboles, listas u otras estructuras.
- **No necesariamente ordenado:** el orden depende de la implementación concreta.

### Representación

![](/attachments/grimorio/data-structures/map.svg)

Un Map es una abstracción lógica, por lo que puede implementarse de diferentes maneras:

- **HashMap:** Utiliza funciones hash para lograr un acceso promedio de O(1).
- **TreeMap:** Usa árboles balanceados para mantener las claves ordenadas, con operaciones O(log n).
- **Lista o array de pares:** Implementación simple, útil para conjuntos pequeños.

Lógicamente, cada implementación ofrece distintos compromisos entre:

- Velocidad
- Uso de memoria
- Mantenimiento del orden
- Complejidad de implementación

Lo importante es que todas respetan la misma interfaz conceptual:
la de gestionar asociaciones **clave→valor**.

---

## 2. Operaciones y complejidad

### Operaciones principales

- **`insert(key, value)`:** Agrega un nuevo par clave→valor. Si la clave ya existe, reemplaza el valor anterior.
- **`find(key)`:** Retorna el valor asociado a una clave. Si no existe, retorna un valor nulo o centinela según la implementación (no necesariamente lanza una excepción).
- **`delete(key)`:** Elimina un par clave→valor. Si la clave no existe, no tiene efecto.
- **`update(key, value)`:** Reemplaza el valor asociado a una clave existente. En muchas implementaciones es equivalente a `insert`: si la clave no existe, el comportamiento depende del contrato definido (puede insertar, ignorar o lanzar error).

### Complejidad

La complejidad de un Map depende de su implementación concreta.

| Implementación | Inserción                      | Búsqueda                       | Eliminación                    |
| -------------- | ------------------------------ | ------------------------------ | ------------------------------ |
| HashMap        | O(1) promedio / O(n) peor caso | O(1) promedio / O(n) peor caso | O(1) promedio / O(n) peor caso |
| TreeMap        | O(log n)                       | O(log n)                       | O(log n)                       |
| Lista / Array  | O(1) / O(n) según estrategia   | O(n)                           | O(n)                           |

> **Nota sobre Lista/Array:** la inserción es O(1) si siempre se agrega al final sin verificar duplicados; es O(n) si primero se busca la clave para evitarlos. La elección depende del contrato: un Map que garantiza unicidad de claves debe hacer la búsqueda previa.

> No existe una única complejidad para los Maps. El rendimiento depende de cómo se implemente internamente.

---

## 3. Implementación

### Idea de implementación

Independientemente de la implementación elegida, el flujo conceptual de las operaciones es siempre el mismo:

1. Localizar la clave.
2. Verificar si existe.
3. Operar sobre el par clave→valor correspondiente.

**Algoritmos clave:**

- **insert(key, value):**
  1. Buscar si la clave ya existe.
  2. Si existe → reemplazar valor.
  3. Si no existe → agregar nuevo par clave→valor.

- **find(key):**
  1. Buscar la clave.
  2. Si existe → retornar valor asociado.
  3. Si no → retornar valor nulo o centinela (el contrato exacto depende de la implementación).

- **delete(key):**
  1. Buscar la clave.
  2. Si existe → eliminar el par asociado.
  3. Si no → no hacer nada.

- **update(key, value):**
  1. Buscar la clave.
  2. Si existe → reemplazar valor.
  3. Si no → el comportamiento depende del contrato: insertar el par nuevo, ignorar la operación, o señalar el error. En muchas implementaciones `update` e `insert` convergen en una única operación _upsert_.
     
---

### Invariantes

Estas condiciones deben cumplirse siempre:

- Cada clave aparece **como máximo una vez** en toda la estructura.
- Toda clave tiene asociado exactamente un valor.
- Las operaciones preservan la consistencia clave→valor.
- La estructura mantiene accesibles todos los pares almacenados.

---

### Ejemplo de código (Python)

Implementación mínima de un **Map** usando una lista de pares clave→valor:

```python
class Map:
    def __init__(self):
        self.data = []

    def insert(self, key, value):
        for i, (k, v) in enumerate(self.data):
            if k == key:
                self.data[i] = (key, value)
                return
        self.data.append((key, value))


    def find(self, key):
        for k, v in self.data:
            if k == key:
                return v
        raise KeyError("Clave no encontrada")


    def delete(self, key):
        for i, (k, v) in enumerate(self.data):
            if k == key:
                del self.data[i]
                return


    def update(self, key, value):
        for i, (k, v) in enumerate(self.data):
            if k == key:
                self.data[i] = (key, value)
                return
        raise KeyError("Clave no encontrada")
```

---

### Ejemplo de uso típico

```python
m = Map()

m.insert("usuario1", 100)
m.insert("usuario2", 200)

print(m.find("usuario1"))  # 100

m.update("usuario1", 150)

print(m.find("usuario1"))  # 150

m.delete("usuario2")
```

### Salida esperada

```
100
150
```

---

## 4. Uso y criterio

### Casos de uso

Un Map encaja naturalmente cuando el problema consiste en asociar claves con valores y acceder a ellos de manera clara y eficiente.

Ejemplos típicos:

- Conteo de frecuencias: cantidad de apariciones de palabras, letras o números.
- Índices por identificador: buscar usuarios por email, productos por código o alumnos por legajo.
- Cachés y memoización: guardar resultados ya calculados para evitar recomputarlos.
- Agrupamiento: agrupar elementos por categoría, fecha, autor, tipo, etc.
- Verificación de pertenencia: saber rápidamente si una clave ya existe.
- Tablas de configuración: guardar pares clave→valor como parámetros, opciones o variables.

### Cuándo NO usarlo

No conviene usarlo cuando:

- Se necesita mantener los datos ordenados y la implementación elegida no lo garantiza (ej. un Map basado en hash no conserva orden).
- El conjunto de claves es muy pequeño. En tamaños chicos, una lista o array puede ser más simple y suficientemente rápido.
- Se necesita aprovechar memoria al máximo. Algunas implementaciones de Map consumen más memoria que estructuras más simples.
- Las claves cambian constantemente. Modificar una clave implica borrar e insertar nuevamente.
- Se necesita garantizar rendimiento en el peor caso. El rendimiento real depende de la implementación concreta elegida.

### Comparaciones

| Estructura       | Ventaja frente al Map                                       | Desventaja frente al Map                        |
| ---------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| Array            | Menor uso de memoria y acceso por índice real               | Buscar por contenido cuesta O(n)                |
| Lista enlazada   | Inserciones simples y flexibles                             | Búsqueda lineal O(n)                            |
| Árbol balanceado | Mantiene elementos ordenados y permite recorrerlos en orden | Más complejo de implementar como TDA base       |
| Set              | Ideal cuando solo importa saber si una clave existe         | No almacena valores asociados                   |

### Ventajas / Desventajas

| Ventajas                                           | Desventajas                                                          |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| Modela asociaciones naturales clave→valor          | El rendimiento depende fuertemente de la implementación elegida      |
| Muy útil para conteo, agrupamiento e indexación    | Puede consumir más memoria que estructuras más simples               |
| Escala bien para grandes volúmenes de datos        | No necesariamente mantiene orden entre claves                        |
| Interfaz simple y uniforme sin importar la impl.   | Cambiar la implementación interna puede tener impacto no obvio       |
| Ampliamente soportado en lenguajes modernos        | Agregar orden o garantías extra requiere elegir la implementación adecuada |

### Señales de reconocimiento

Hay varias pistas en un problema que sugieren que un Map puede ser la estructura adecuada:

- “Necesitamos encontrar un dato a partir de una clave”.
- “Queremos saber cuántas veces aparece cada elemento”.
- “Hay que detectar duplicados”.
- “Se necesita agrupar elementos por alguna propiedad”.
- “Cada elemento tiene un identificador único”.
- “Queremos modelar una asociación entre dos conjuntos de datos”.

---

## 5. Relaciones y extensiones

### Variantes

- Existen múltiples formas de implementar mapas según las necesidades: los basados en tablas hash priorizan velocidad de acceso promedio constante; los basados en árboles balanceados mantienen un orden en las claves; y otros como los Linked Maps preservan el orden de inserción. Estas variantes representan distintos compromisos entre eficiencia, orden y uso de memoria.

### Relación con otras estructuras

- Respecto a su relación con otras estructuras, los mapas dependen conceptualmente de:
  - Arrays, como base para almacenar datos (especialmente en hashing).
  - Listas enlazadas, usadas en manejo de colisiones.
  - Árboles, para mantener orden y garantizar complejidad logarítmica.

Esto los convierte en una especie de “estructura compuesta”, que reutiliza ideas de otras más básicas.

### Notas avanzadas

- En términos de notas avanzadas, los maps pueden extenderse para soportar:
  - Persistencia, manteniendo versiones inmutables (útil en programación funcional).
  - Concurrencia, permitiendo accesos simultáneos seguros (Concurrent Maps).
  - Aleatoriedad, como en funciones hash diseñadas para distribuir uniformemente las claves.

---

## 6. Referencias y recursos

### Libros

- [[COR2011]] — Cap. 11: Hash Tables _(implementación concreta del Map mediante hashing)_.
- Sedgewick & Wayne — _Algorithms_ (4ª ed.), Cap. 3: Searching _(Maps con hashing y árboles balanceados; independiente del lenguaje)_.

### Visualizaciones

- VisuAlgo — Hash Table: `visualgo.net/en/hashtable` _(implementación basada en hashing)_
- VisuAlgo — BST / AVL: `visualgo.net/en/bst` _(implementación basada en árbol balanceado)_

### Documentación

- Python `dict` (Map basado en hash): `docs.python.org/3/library/stdtypes.html#dict`
- Java `Map` (interfaz abstracta): `docs.oracle.com/en/java/docs/api/java.base/java/util/Map.html`
- Java `TreeMap` (Map basado en árbol): `docs.oracle.com/en/java/docs/api/java.base/java/util/TreeMap.html`
