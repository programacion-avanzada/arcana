---
title: Leetcode0218 - The Skyline Problem - División y Conquista
tags:
  - b/leetcode
---

## Técnicas utilizadas
División y conquista sobre el arreglo de edificios. El problema se parte recursivamente en mitades hasta llegar a edificios individuales (cuyo skyline es trivial) y luego se **combinan** los contornos de a pares. El paso de combinación es un merge de dos skylines, análogo al merge del merge sort, que recorre ambos contornos en paralelo con dos punteros en tiempo lineal.

## Idea de la solución
La clave es que el skyline es **combinable**: el contorno de dos grupos de edificios juntos es el máximo, punto a punto, de los dos contornos individuales. No hace falta volver a mirar los edificios uno por uno, alcanza con los dos contornos ya armados.

Esto permite aplicar los tres pasos de división y conquista:

1. **Dividir.** Partir el arreglo de `n` edificios en dos mitades de `n/2`. No se hace ningún cálculo, solo se corta la lista.
2. **Resolver.** Llamar recursivamente a cada mitad. Cada llamada devuelve el skyline de esa mitad. La recursión baja hasta el caso base: un solo edificio `(ini, fin, altura)`, cuyo skyline es `[[ini, altura], [fin, 0]]`.
3. **Combinar.** Fusionar los dos skylines en uno solo. Se recorren en paralelo avanzando siempre el punto con menor `x`; se mantiene la altura actual de cada lado (`h_izq`, `h_der`) y en cada posición la altura del contorno es `max(h_izq, h_der)`. Solo se emite un punto nuevo cuando ese máximo cambia respecto al último insertado (esto respeta la NOTA del enunciado de no repetir alturas). Si las dos `x` coinciden, se actualizan ambos lados antes de tomar el máximo.

## Código (Python)

```python
def obtener_skyline(edificios):
    """
    Cada edificio es una tupla (ini, fin, altura)
    Cada punto del skyline es una lista [x, y]
    """

    # CASO BASE: un solo edificio
    if len(edificios) == 1:
        ini, fin, altura = edificios[0]
        return [[ini, altura], [fin, 0]]

    # 1. DIVIDIR
    mitad = len(edificios) // 2
    mitad_izquierda = edificios[:mitad]
    mitad_derecha = edificios[mitad:]

    # 2. RESOLVER
    skyline_izquierdo = obtener_skyline(mitad_izquierda)
    skyline_derecho = obtener_skyline(mitad_derecha)

    # 3. COMBINAR
    return unir_skylines(skyline_izquierdo, skyline_derecho)


def unir_skylines(skyline_izquierdo, skyline_derecho):
    i, j = 0, 0
    h_izq, h_der = 0, 0
    ultimo_h_insertado = -1   # controla la NOTA del enunciado (no repetir alturas)
    skyline_resultado = []

    while i < len(skyline_izquierdo) and j < len(skyline_derecho):
        x_izq, y_izq = skyline_izquierdo[i]
        x_der, y_der = skyline_derecho[j]

        # el borde izquierdo aparece antes en x
        if x_izq < x_der:
            h_izq = y_izq
            x = x_izq
            i += 1
        # el borde derecho aparece antes en x
        elif x_izq > x_der:
            h_der = y_der
            x = x_der
            j += 1
        # empate en x: actualizo ambos lados y avanzo ambos punteros
        else:
            h_izq = y_izq
            h_der = y_der
            x = x_izq
            i += 1
            j += 1

        altura_max = max(h_izq, h_der)
        if altura_max != ultimo_h_insertado:
            skyline_resultado.append([x, altura_max])
            ultimo_h_insertado = altura_max

    # copio lo que quede de cada skyline (el otro ya está en 0)
    while i < len(skyline_izquierdo):
        x, y = skyline_izquierdo[i]
        if y != ultimo_h_insertado:
            skyline_resultado.append([x, y])
            ultimo_h_insertado = y
        i += 1

    while j < len(skyline_derecho):
        x, y = skyline_derecho[j]
        if y != ultimo_h_insertado:
            skyline_resultado.append([x, y])
            ultimo_h_insertado = y
        j += 1

    return skyline_resultado
```

## Traza de ejemplo

Con la entrada `[(2,9,10), (3,7,15), (5,12,12), (15,20,10), (19,24,8)]`, la recursión arma el siguiente árbol (se divide hasta llegar a edificios sueltos y luego se fusiona hacia arriba):

```
                    [5 edificios]
                   /            \
            [B1, B2]            [B3, B4, B5]
             /    \              /        \
          [B1]   [B2]         [B3]      [B4, B5]
                                         /     \
                                      [B4]    [B5]
```

Cada hoja produce su skyline trivial, y en cada nodo interno se fusionan los dos contornos hijos. La fusión final (raíz) combina el contorno del grupo izquierdo `[[2,10],[3,15],[7,10],[9,0]]` con el del derecho `[[5,12],[12,0],[15,10],[20,8],[24,0]]`:

|  pos_x | avanza | h_izq | h_der | max | ¿cambió? | emite |
|----|---------|-------|-------|-----|----------|------------|
|  2 | izq     |    10 |     0 |  10 | sí       | `[2,10]`   |
|  3 | izq     |    15 |     0 |  15 | sí       | `[3,15]`   |
|  5 | der     |    15 |    12 |  15 | no       | —          |
|  7 | izq     |    10 |    12 |  12 | sí       | `[7,12]`   |
|  9 | izq     |     0 |    12 |  12 | no       | —          |
| 12 | der     |     0 |     0 |   0 | sí       | `[12,0]`   |
| 15 | der     |     0 |    10 |  10 | sí       | `[15,10]`  |
| 20 | der     |     0 |     8 |   8 | sí       | `[20,8]`   |
| 24 | der     |     0 |     0 |   0 | sí       | `[24,0]`   |

Resultado final: `[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]`

Los pasos que **no emiten** (x=5 y x=9) son justamente los que aplican la regla de no repetir alturas: aunque por debajo cambien los edificios activos, el máximo del contorno no varía, así que no se agrega punto.

## Complejidad

### Temporal
$O(n \log n)$. La recurrencia es:

$$T(n) = 2 \cdot T(n/2) + O(n)$$

Se divide en 2 subproblemas de tamaño $n/2$, y la combinación (`unir_skylines`) recorre los puntos de ambos contornos en tiempo lineal. Aplicando el **Teorema Maestro**:

$$a = 2, \quad b = 2, \quad c = 1$$
$$\log_b(a) = \log_2(2) = 1 = c \;$$
$$T(n) = O(n^c \cdot \log n) = O(n \log n)$$

### Espacial
$O(n)$ para almacenar los skylines intermedios y el resultado, más $O(\log n)$ de pila por la profundidad de la recursión.

## Cuándo usar esta técnica

### Favorable cuando
- El problema se puede partir en subproblemas independientes del mismo tipo.
- Las soluciones parciales se pueden **combinar** de forma eficiente (acá, en tiempo lineal).
- Se busca una mejora clara sobre la fuerza bruta sin necesidad de estructuras de datos auxiliares complejas (como un heap).

### Limitaciones
- La complejidad del método está concentrada en el paso de combinación; si fusionar las soluciones parciales fuera costoso, la ventaja se pierde.
- A diferencia de un trabajo iterativo, D&C crea y guarda un skyline nuevo en cada nivel de la recursión antes de fusionarlo. Eso implica varias listas intermedias en memoria y bastante copia de datos, así que el factor de espacio termina siendo más alto.

## Comparación con la solución de fuerza bruta
La fuerza bruta decide punto por punto comparando cada edificio contra todos los demás, con un costo $O(n^2)$. División y conquista, en cambio, calcula los contornos de dos mitades y los **fusiona** en tiempo lineal, evitando comparaciones redundantes y bajando el costo total a $O(n \log n)$.

Para entradas chicas o con pocos solapamientos, la fuerza bruta puede ser competitiva, o incluso más rápida en la práctica, gracias a su factor constante bajo y a que no usa recursión ni estructuras intermedias. A medida que crece $n$ y aumentan los solapamientos, la ventaja de división y conquista toma más peso.

En resumen: la fuerza bruta gana en **simplicidad y facilidad de verificación**, mientras que división y conquista gana en **escalabilidad**, a costa de una implementación más delicada (el merge tiene varios casos borde) y un mayor uso de memoria por los contornos intermedios.

## Referencias
- GeeksforGeeks — [Introducción al algoritmo División y Conquista](https://www.geeksforgeeks.org/dsa/introduction-to-divide-and-conquer-algorithm/):
Articulo introductorio al algoritmo de división y conquista.

