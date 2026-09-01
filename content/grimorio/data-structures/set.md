---
title: Set
tags:
  - data-structures
alias:
  - conjunto
  - hashset
---
## 1. Qué es y cómo funciona

### Intuición

**Idea central:** Un `Set` es una colección de elementos únicos y no ordenados, copia directa de la noción matemática de conjunto: cada elemento o pertenece o no pertenece, sin multiplicidad ni posición.

**Problema que resuelve:** Hace eficientes operaciones que en una lista serían $O(n)$: pruebas de membresía (`x in S`), deduplicación de colecciones y operaciones algebraicas (unión, intersección, diferencia, subconjunto). Donde una lista pregunta _"¿qué hay en la posición i?"_, el `Set` responde _"¿está x?"_.

---

### Definición y propiedades

**Definición formal:** Por el axioma de extensionalidad de Zermelo-Fraenkel, un conjunto está totalmente determinado por su pertenencia:

$$\forall A \; \forall B \;(A = B \;\leftrightarrow\; \forall x \,(x \in A \leftrightarrow x \in B))$$

De esta definición se sacan las siguientes propiedades:

- **Unicidad:** la cardinalidad de cada elemento es ≤ 1.
- **Idempotencia de la inserción:** `add(x)` es un no-op si `x` ya está.
- **Ausencia de orden inherente.**

---

### Representación interna

#### HashSet (tabla hash)

Python implementa su `set` sobre una [[hash table]] de direccionamiento abierto. Internamente es un array de `m` slots indexados por `h(x) = hash(x) % m`. Cuando hay colisiones, Python resuelve mediante *probing perturbado*. El factor de carga se mantiene por debajo de ≈ 0.60; al superarlo, la tabla se redimensiona al doble y todos los elementos se reinsertan (*rehash*).

**Diagrama de una tabla hash con 8 slots:**

![](hashset.svg)

`hash("ab") % 8 = 1` | `hash("xy") % 8 = 3` | `hash("cd") % 8 = 5` | `hash("hi") % 8 = 7`

#### TreeSet (árbol)

Python no incluye un `TreeSet` en su librería estándar; `sortedcontainers.SortedSet` es la alternativa idiomática. Internamente, la garantía de unicidad y orden se logra con un **árbol binario de búsqueda balanceado** con operaciones $O(\log n)$ en el peor caso.

**Diagrama de un árbol binario de búsqueda balanceado:**

![](/attachments/grimorio/data-structures/tree-set.svg)


---

## 2. Operaciones y complejidad

### Operaciones principales

| Operación | Descripción |
|---|---|
| `add(x)` | Inserta `x`. Si ya existe, no hace nada. |
| `remove(x)` | Elimina `x`. Lanza `KeyError` si no existe. |
| `discard(x)` | Elimina `x`. No lanza error si no existe. |
| `x in s` | Prueba de membresía. Devuelve `True`/`False`. |
| `s \| t` / `union` | Unión: elementos en `s` o en `t`. |
| `s & t` / `intersection` | Intersección: elementos en `s` **y** en `t`. |
| `s - t` / `difference` | Diferencia: elementos en `s` que no están en `t`. |
| `s <= t` / `issubset` | Subconjunto: `True` si todo `x ∈ s` también está en `t`. |
| `len(s)` | Cardinalidad del set. |
| `for x in s` | Iteración en orden arbitrario. |
| `s.clear()` | Vacía el set. |

---

### Tabla de complejidad

| Operación | `set` (promedio) | `set` (peor caso) | `SortedSet` |
|---|:---:|:---:|:---:|
| `add`, `remove`, `discard`, `in` | $O(1)$ | $O(n)$* | $O(\log n)$ |
| `len`, `clear` | $O(1)$ | $O(1)$ | $O(1)$ |
| `for x in s` | $O(n)$ | $O(n)$ | $O(n)$ |
| `union` | $O(\|s\|+\|t\|)$ | $O(\|s\| \cdot \|t\|)$ | $O(\|s\|+\|t\|)$* |
| `intersection`, `difference` | $O(\|s\|+\|t\|)$ | $O(\|s\| \cdot \|t\|)$ | $O(\|s\| \log \|t\|)$ |
| `issubset` | $O(\|s\|)$ | $O(\|s\| \cdot \|t\|)$ | $O(\|s\| \log \|t\|)$ |
| `min()`, `max()`, rangos | $O(n)$ | $O(n)$ | $O(\log n)$ |

> **\*Peor caso $O(n)$:** ocurre con colisiones masivas forzadas artificialmente. Es extremadamente improbable.
>
> **\*Unión $O(\|s\|+\|t\|)$ en SortedSet:** se logra aprovechando que ambos conjuntos están ordenados. La intersección y diferencia, en cambio, buscan cada elemento de `s` en `t`, dando $O(\|s\| \log \|t\|)$.

**Complejidad espacial:** Ambas implementaciones requieren $O(n)$. El `set` paga por los slots vacíos de la tabla (capacidad ≈ n / 0.6); el `SortedSet` paga punteros de árbol por nodo.

---

### Detalles operativos

**Costos ocultos del rehashing:** Al superar el factor de carga, Python redimensiona la tabla y reinserta todos los elementos: $O(n)$ en esa operación puntual, pero **$O(1)$ amortizado** gracias al redimensionado geométrico.

**Costos de las operaciones algebraicas:** `s | t`, `s & t`, `s - t` crean un set nuevo, consumiendo $O(|s|+|t|)$ espacio adicional. Las variantes in-place (`|=`, `&=`, `-=`, equivalentes a `update`, `intersection_update`, `difference_update`) mutan `s` y evitan esa copia.

**Duplicados:** Insertar un elemento que ya existe es un no-op silencioso: `s.add(x)` no lanza error ni señal.

**Set vacío:**
- `s | set()` → copia de `s`
- `s & set()` → vacío
- `set().issubset(s)` → siempre `True`

---

## 3. Implementación

### Idea central

Mantener una colección que impida ingresar repetidos. Implementado con un `HashMap` o `LinkedHashMap`, debe asegurarse que los datos no se modifican; en un `TreeMap`, debe haber un criterio definido para ordenar los datos.

### Invariantes

- Nunca debe permitirse ingresar un dato repetido.
- Si se usa una colección con tablas hash, los datos deben ser **inmutables**.
- No puede modificarse un elemento usando un índice de posición.
- Si se utiliza un árbol, no debe modificarse el valor del dato usado para ordenar.
- Las operaciones de Teoría de Conjuntos (intersección, unión, diferencia) **no alteran** los sets originales, sino que generan uno nuevo.

---

### Implementación manual en Python

```python
class MiSet:
    def __init__(self):
        self._datos = {}

    def agregar(self, elemento):
        self._datos[elemento] = True

    def eliminar(self, elemento):
        self._datos.pop(elemento, None)

    def __contains__(self, elemento):
        return elemento in self._datos

    def __str__(self):
        return str(list(self._datos.keys()))

    def union(self, otro_set):
        resultado = MiSet()
        for elem in self._datos:
            resultado.agregar(elem)
        for elem in otro_set._datos:
            resultado.agregar(elem)
        return resultado

    def interseccion(self, otro_set):
        resultado = MiSet()
        for elem in self._datos:
            if elem in otro_set._datos:
                resultado.agregar(elem)
        return resultado
```

### Ejemplo de uso típico

```python
a = MiSet()
a.agregar("hola")
a.agregar("mundo")

b = MiSet()
b.agregar("mundo")
b.agregar("python")

print("A:", a)               # ['hola', 'mundo']
print("B:", b)               # ['mundo', 'python']

print("Unión:", a.union(b))           # ['hola', 'mundo', 'python']
print("Intersección:", a.interseccion(b))  # ['mundo']
```

---

## 4. Uso y criterio

### Cuándo usarlo ✅

- Colección sin elementos duplicados.
- Operaciones matemáticas de conjuntos.
- *Membership testing* (verificar si ya existe un elemento en la colección).
- Seguimiento de elementos visitados.

### Cuándo **no** usarlo ❌

- Cuando el **orden** de los elementos importa (el `HashSet` estándar no lo garantiza; si se necesita orden, usar `LinkedHashSet` o `SortedSet`).
- Cuando se necesita trabajar con duplicados.
- Cuando se necesita acceso por índice.

---

### Comparación con otras estructuras

| Estructura | Duplicados | Orden | Búsqueda | Cuándo elegirla |
|---|:---:|:---:|:---:|---|
| **Set** | ✗ | ✗ | $O(1)$ | Unicidad y velocidad de búsqueda |
| **Lista** | ✓ | ✓ | $O(n)$ | Orden y acceso por índice importan |
| **Diccionario ([[map]])** | ✗ (claves) | ✗ | $O(1)$ | Necesitás asociar datos a cada clave |

> Un `set` es técnicamente un diccionario donde solo importan las claves y no los valores.

---

### Ventajas y desventajas

**Ventajas:**
- Operaciones en tiempo constante (HashSet) o logarítmico (TreeSet).
- Garantiza la ausencia de datos repetidos, eliminando validaciones manuales.

**Desventajas:**
- Mayor uso de memoria por el manejo de tablas hash.
- Requiere elementos inmutables.
- En `HashSet`, los elementos no tienen orden en las iteraciones.
- No admite elementos duplicados ni permite evaluar frecuencias.

---

### Señales de reconocimiento

Considerá usar un `Set` cuando el problema presente alguna de estas características:

- Evitar procesar elementos repetidamente.
- Pregunta _"¿Existe el elemento en la colección?"_.
- Se necesitan intersecciones, uniones o diferencias de conjuntos.
- Se tiene un conjunto grande y el rendimiento de búsqueda está afectado.

---

## 5. Relaciones y extensiones

### Variantes del Set

| Variante | Descripción |
|---|---|
| **HashSet** | Implementación estándar con tabla hash. Sin orden garantizado. |
| **LinkedHashSet** | Mantiene el orden de inserción de los elementos. |
| **TreeSet** | Basado en árbol; *permite modificar los datos* y garantiza orden. |
| **ArraySet** | Para conjuntos de enteros: cada posición del array representa al número. |
| **Bloom Filter** | Array con varias funciones hash. Muy poca memoria, pero puede dar **falsos positivos**. |
| **Multiset** | Variante que permite repetidos; funciona como un diccionario `{elemento: frecuencia}`. |

> **Cuidado:** Modificar el campo por el cual se ordena un elemento que ya está en el árbol **corrompe la estructura silenciosamente**. El árbol no se re-balancea automáticamente, así que las búsquedas posteriores pueden no encontrar elementos que sí existen. La práctica segura es: eliminar el elemento, modificarlo y reinsertarlo.

---

### Relación con otras estructuras

- **[[hash table]]:** la implementación estándar de `Set` (`HashSet`) reutiliza directamente el mecanismo de hashing para lograr membership testing en $O(1)$.
- **[[map]]:** un `Set` es conceptualmente un `Map` donde solo importan las claves, no los valores asociados.
- **Autómatas:** base para definir alfabetos, estados y transiciones.
- **[[linked list]] / [[dynamic array]]:** un `Set` puede implementarse sobre ellos, aunque con menor eficiencia.
- **Ciencia de datos:** operaciones de conjuntos son fundamentales para filtrado, cruce y comparación de datasets.

---

### Notas avanzadas

#### Control de permisos y roles

En sistemas operativos o aplicaciones, los permisos de un usuario suelen representarse como un `Set` de privilegios:

```python
permisos_usuario = {"leer", "escribir", "ejecutar"}
```

Verificar un permiso es $O(1)$: `"escribir" in permisos_usuario`.

#### Caché y deduplicación

Los motores de búsqueda o sistemas de caché usan `Set` para saber rápidamente si un documento/URL ya fue procesado, evitando almacenar o procesar dos veces lo mismo:

```python
urls_visitadas = set()

def visitar(url):
    if url in urls_visitadas:
        return  # ya fue procesada
    urls_visitadas.add(url)
    # procesar...
```

---

## 6. Referencias y recursos

- [El Libro de Python - Sets](https://ellibrodepython.com/sets-python#crear-set-python)
- [CodeGym ES - Conjunto Java](https://codegym.cc/es/groups/posts/es.829.conjunto-java)
- [Wikipedia - Conjunto (programación)](https://es.wikipedia.org/wiki/Conjunto_(programaci%C3%B3n))
- [Frogames - Aplicaciones de conjuntos y lógica](https://cursos.frogamesformacion.com/pages/blog/26-005-aplicaciones-de-conjuntos-y-logica)
