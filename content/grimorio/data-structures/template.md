---
title: 'Template Estructura de Datos'
tags: ['data-structures', 'template']
alias: ['nombre', 'otro']
---

## 1. Qué es y cómo funciona

### Intuición
- Idea central: ¿Cuál es la idea simple detrás de esta estructura?
- Problema que resuelve: ¿Qué tipo de problema hace sencillo o eficiente?

### Definición / propiedades
- Definición formal: invariantes y reglas que siempre se cumplen.
- Propiedades clave: orden, acotamiento, restricciones sobre elementos, estabilidad, etc.

### Representación
- Descripción de la organización interna (arrays, nodos enlazados, árboles, tablas, etc.).
- Ilustración sugerida: incluye aquí un diagrama ASCII o referencia a una imagen en `attachments/`.

Debe responder a: "¿qué estoy mirando?"

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
