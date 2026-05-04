---
title: "Arreglo (Array)"
tags: ["data-structures"]
alias: ["array", "arreglo"]
---

## **1\. Qué es y cómo funciona**

### **Intuición**

Un **array** es una **colección de elementos contiguos de datos del mismo tipo**. Es como una fila de cajas, donde cada caja tiene una dirección, contiene un elemento y está alineada con las demás cajas.

Resuelve el problema de tener que crear muchas variables individuales. Por ejemplo, en lugar de tener `amigo1`, `amigo2`, `amigo3`, podemos tener una sola lista de `amigos` que almacene todos los valores.

### **Definición / propiedades**

- **Estructura de datos lineal**: Los elementos están organizados en una secuencia.
- **Tamaño Fijo**: Una vez que un array es creado, su tamaño no puede ser cambiado. Esto significa que debemos saber el número máximo de elementos que necesitaremos almacenar en el momento de la creación del array.  
- **Homogeneidad de tipos**: Todos los elementos de un array deben ser del mismo tipo de datos, ya sea primitivo (como *int*, *char*, *double*) o referencias de objetos.  
- **Acceso Indexado**: Cada elemento en un array es accesible a través de su índice, comenzando por el índice 0 para el primer elemento. Esta característica permite la rápida recuperación y actualización de elementos dentro del array.  
- **Memoria contigua**: Los elementos se almacenan en posiciones adyacentes. 

Internamente, la posición de cada elemento se determina por su índice y el tamaño del tipo de datos en bytes.

### **Representación**

Un **array** se representa internamente como un **bloque contiguo de memoria**, donde todos los elementos:

- Ocupan el mismo tamaño

- Están almacenados uno a continuación del otro

El acceso a un elemento se realiza calculando su dirección de memoria a partir de una dirección base  y un desplazamiento fijo (stride) multiplicado por el índice. Esta organización es la que permite que el acceso por índice tenga complejidad $O(1)$. 

```text

Índice:      \[0\]          \[1\]          \[2\]          \[3\]

            \+------------+------------+------------+------------+

Dato:       |   0xAF21   |   0xBC10   |   0x0042   |   0x1998   |

            \+------------+------------+------------+------------+

Dirección:   0x1000       0x1004       0x1008       0x100C

Stride:      (Base)      (+4 bytes)   (+4 bytes)   (+4 bytes)

```

Se observa una estructura lineal donde cada elemento es accesible directamente mediante su índice. El cálculo de indexación es $Dirección(A[i]) = base + i × tamaño$.

## **2\. Operaciones y complejidad**

### **Operaciones principales**

* **Acceso (get)**: Obtener elemento por índice.  
* **Actualización (set)**: Modificar el elemento.  
* **Añadir (insert)**:  
  * `append(x)` para agregar un elemento al final.  
  * `insert(i, x)` para insertarlo en una posición específica.  
* **Eliminar (delete)**:  
  * `remove(x)` para borrar la primera aparición de un valor.  
  * `pop(i)` para eliminar y devolver el elemento en un índice (por defecto, el último).  
* **Buscar (find)**:  
  * `index(x)` para obtener el índice de la primera aparición de un valor.

### **Complejidad**

Como referencia, tomaremos las complejidades sobre un array **desordenado**:

* **Acceso y actualización por índice**: $O(1)$ (tiempo constante).

* **Inserción**: $O(n)$ en arrays clásicos (requiere copia o desplazamiento de elementos, según el caso). En arrays dinámicos, append es O(1) amortizado.

* **Eliminación**: $O(n)$ (requiere desplazar elementos para llenar el espacio vacío). En cambio, si se elimina el último elemento, es $O(1)$. 

* **Búsqueda por valor** (`index`, `in`): $O(n)$ en el peor caso (debe recorrer todos los elementos de la lista).

Para el caso de arrays **ordenados**, la inserción asciende a $O(n)$ debido a comparación entre elementos (en el peor de los casos compara contra todos) pero la búsqueda desciende a $O(\log n)$ si se utilizan algoritmos como **búsqueda binaria**. 

### **Detalles operativos**

Como se detalló anteriormente, modificar la estructura interna es costoso debido a la naturaleza contigua de elementos en memoria. Operaciones como insertar o eliminar en el medio requiere **desplazar elementos**. 

En implementaciones estáticas de arrays, hay que cuidar el acceso fuera de rango, porque puede producir errores o dar lugar a vulnerabilidades como suele suceder con los arrays en lenguaje de programación C (out of range).

Por otra parte, si la implementación es dinámica, el cambio es notorio ya que requieren de realloc y copia de elementos cuando el array se llena.  

## **3\. Implementación**

### **Idea de implementación**

- Un bloque de memoria contigua  
- Un índice base  
- Cálculo directo de posiciones

### **Invariantes**

- Contigüidad de memoria (los elementos permanecen contiguos)  
- Homogeneidad de tipo de dato   
- Tamaño consistente  
- Los índices deben mantenerse válidos (0 <= i < n)

### **Ejemplo de código**

Debe responder a: “¿cómo lo programo sin romperlo?“

```python

# Crear un arreglo en Python usando lista

arr = [10, 20, 30]

# Acceso

print(arr[1])  # 20

# Inserción

arr.insert(1, 15)  # [10, 15, 20, 30]

# Eliminación

arr.pop(2)  # [10, 15, 30]

```

```python

# Ejemplo usando el módulo array (colección homogénea y eficiente en memoria)

from array import array

a = array('i', [10, 20, 30])  # 'i' = signed int

print(a[1])  # 20

a.insert(1, 15)  # array('i', [10, 15, 20, 30])

a.append(40)

removed = a.pop(2)  # devuelve 20

print(a, removed)

# Nota: `array` solo admite tipos numéricos (integer) y usa un typecode fijo,

# por lo que es más compacto que una lista para datos homogéneos.

```

```python

# Ejemplo usando numpy (arrays numéricos multidimensionales y operaciones vectorizadas)

import numpy as np

na = np.array([10, 20, 30], dtype=np.int32)

print(na[1])  # 20

# Operaciones vectorizadas (sumar 1 a todos los elementos)

print(na + 1)  # [11 21 31]

# Arrays 2D / matrices

mat = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float64)

print(mat.shape)  # (2, 3)

# Acceso y slicing eficiente

print(mat[:, 1])  # columna 1 -> [2. 5.]

```

Es necesario recordar que para programar de forma segura, los índices deben de cuidarse para evitar accesos fuera de rango y tener en cuenta el costo de inserciones/eliminaciones para grandes conjuntos de datos.

## **4\. Uso y criterio**

### **Casos de uso**

- **Listas de datos fijos:** Ideal para días de la semana, meses del año o configuraciones que no cambian.  
- **Acceso frecuente a elementos por índice**  
- **Procesamiento matemático:** Matrices y vectores (muy comunes en gráficos 2D/3D y Machine Learning).  
- **Implementación de otras estructuras:** Son la base para construir Pilas (Stacks), Colas (Queues) o Tablas Hash.  
- **Buffer de datos:** Para almacenar temporalmente paquetes de datos que llegan a través de una red o lectura de archivos

### **Cuándo NO usarlo**

- **Cuando el tamaño es desconocido:** Si no sabes cuántos elementos tendrás y estos crecen constantemente, un array estático generará problemas.  
- **Inserciones/Eliminaciones frecuentes:** Si necesitas meter o sacar elementos en medio de la lista constantemente, el rendimiento será pobre.  
- **Datos heterogéneos:** Si necesitas mezclar diferentes datos (strings, ints y objetos) en un lenguaje de tipado fuerte, el array no es la mejor opción.

### **Comparaciones**

**Comparación con Listas Enlazadas (Linked Lists)**: Mientras que el arreglo ofrece acceso instantáneo $O(1)$, la lista enlazada requiere recorrer los nodos uno a uno $O(n)$ para encontrar una posición. Sin embargo, la lista enlazada permite insertar elementos en tiempo constante $O(1)$ una vez localizada la posición, sin necesidad de desplazar otros datos. Además, las listas enlazadas usan la memoria de forma dinámica, expandiéndose según sea necesario

### **Ventajas / desventajas**

* Trade-offs prácticos en rendimiento, memoria, simplicidad, y facilidad de implementación.

| Ventajas | Desventajas |
| ----- | ----- |
| **Acceso rápido:** Puedes acceder a cualquier elemento instantáneamente si conoces su índice (Complejidad O(1)). | **Tamaño fijo:** En muchos lenguajes (C, Java), una vez definido el tamaño, no se puede cambiar. Tienes que crear uno nuevo y copiar los datos. |
| **Eficiencia de memoria:** No desperdician espacio en punteros o metadatos adicionales (como las listas enlazadas). | **Costo de inserción/borrado:** Para insertar un elemento al inicio, es inevitable "empujar" todos los demás hacia adelante (Complejidad O(n)). |
| **Simplicidad:** Son fáciles de entender y están disponibles en prácticamente todos los lenguajes de programación. | **Memoria contigua:** Requieren un bloque de memoria ininterrumpido; si la memoria está muy fragmentada, es posible que la creación del array falle. |

### **Señales de reconocimiento**

- Se necesita acceso por índice  
- Los datos tienen tamaño conocido  
- Se realizan muchas lecturas y pocas modificaciones

## **5\. Relaciones y extensiones**

### **Variantes**

- Vectores (Arreglos dinámicos): Clases que encapsulan un array y se redimensionan automáticamente cuando se llenan.  
- Matrices: Arreglos multidimensionales (arreglos de arreglos) para representar datos tabulares o espaciales.

### **Relación con otras estructuras**

El array es base para matrices, listas dinámicas, heaps binarios (representados implícitamente en arrays mediante índices), stacks, queues (implementables sobre arrays) y tablas hash. También aparece como soporte en algoritmos de ordenamiento y búsqueda.

### **Notas avanzadas**

En arquitecturas modernas, el array se beneficia enormemente del caché de la CPU debido a la localidad de los datos; al estar contiguos, el procesador puede precargar bloques enteros, acelerando el procesamiento secuencial. 

## **6\. Referencias y recursos**

* Cormen, T. H., et al. (2022). Introduction to Algorithms (4th ed.). MIT Press.
* Lafore, R. (2002). Data Structures & Algorithms in Java. Sams.

