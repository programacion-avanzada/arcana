---
title: Leetcode0218 - The Skyline Problem - Fuerza Bruta
tags:
  - b/leetcode
---

## Técnicas utilizadas
Búsqueda por fuerza bruta: se explora exhaustivamente el espacio de edificios sin aplicar poda ni aprovechar subestructura óptima, confiando en revisar todas las combinaciones posibles en lugar de en una estrategia más fina. En esta solución, para cada edificio se lo compara contra todos los demás para decidir si sus dos puntos característicos —la esquina superior izquierda `(ini, alt)` y el punto de su pared derecha `(fin, altura_resultante)`— forman parte del contorno final.

## Idea de la solución
Cada edificio puede llegar a aportar un punto en su esquina superior izquierda `[ini, altura]` o en algún lugar de su pared lateral derecha `[fin, altura_resultante]` dependiendo de los otros edificios; si está aislado, ese segundo punto sería `[fin, 0]`. Para cada edificio se recorre el arreglo de edificios para ver si esos puntos quedan tapados por otro edificio o pueden sumarse a la solución. A fines prácticos vamos a llamar a estos puntos punto1 y punto2.

Se utilizan dos flags para decidir, al final del proceso, si cada punto posible se agrega o no.

**punto1** (la esquina superior izquierda) no es posible cuando otro edificio tapa ese arranque. Eso pasa si:
- otro edificio empieza en el mismo lugar y es más alto.
- el edificio actual está contenido dentro de otro más alto.
- otro edificio termina justo donde empieza el actual y tienen la misma altura.

**punto2** (el punto de la pared derecha) marca dónde y a qué altura cae el contorno cuando el edificio termina. Hay que resolver dos cosas:

- **¿Se pone?** No, si otro edificio más alto sigue activo después de que el actual termina (termina más tarde y es más alto o igual). En ese caso la caída queda oculta detrás de ese edificio, así que no hay punto.
- **¿A qué altura?** Si se pone, la altura no es 0 necesariamente: es la del edificio más alto, entre los más bajos que el actual, que todavía sigue activo después de su fin. Si no queda ninguno, cae a 0.

Al final como hay condiciones donde un mismo punto se agrega a la solución 2 veces (edificios que inician en el mismo punto y con misma altura), se eliminan duplicados.

## Código (Python)

```python
def skyline_fuerza_bruta(edificios):
    """
    edificios: lista de tuplas (ini, fin, alt)
    devuelve: lista de puntos [(x, altura), ...]
    """
    solucion = []

    n = len(edificios)
    for i in range(n):
        ini_i, fin_i, alt_i = edificios[i]
        flag1 = True
        flag2 = True
        alt_ref = 0

        for j in range(n):
            if i == j:
                continue
            ini_j, fin_j, alt_j = edificios[j]

            # Si el inicio de j es mayor que el fin de i puedo terminar la iteración
            if ini_j > fin_i:
                continue

            # Si otro edificio empieza en el mismo lugar y es más alto
            if ini_i == ini_j and alt_i < alt_j:
                flag1 = False

            # Si otro edificio rodea al actual
            if ini_j < ini_i < fin_j and alt_i < alt_j:
                flag1 = False

            # Si otro edificio termina donde empieza el actual y tienen la misma altura
            if ini_i == fin_j and alt_i == alt_j:
                flag1 = False

            # Si otro edificio termina más tarde y es más alto
            if fin_i < fin_j and alt_j >= alt_i:
                flag2 = False

            # Si otro edificio termina más tarde y es más bajo, considerar su altura como referencia
            if fin_i < fin_j and alt_i > alt_j:
                alt_ref = max(alt_ref, alt_j)

        # Agregar punto1 si corresponde
        if flag1:
            solucion.append((ini_i, alt_i))

        # Agregar punto2 si corresponde
        if flag2:
            solucion.append((fin_i, alt_ref))

    solucion = ordenar(solucion)		        #damos por entendida las funciones para reducir excedente de código
    solucion = eliminar_duplicados(solucion) 	#elimina puntos repetidos
                                             
    return solucion
```

## Traza de ejemplo

Vemos las comparaciones del primer edificio `[2,9,10]` contra el resto (`i` es el edificio analizado, `j` el que se compara):


|  ini_i  |  fin_i | alt_i | ini_j | fin_j  | alt_j |flag1  | flag2 | 
|---------|--------|-------|-------|--------|-------|-------|-------|
|2	|9	|10	|3	|7	|15	|True	|True   |
|2	|9	|10	|5	|12	|12	|True	|False  |

Los edificios `[15,20,10]` y `[19,24,8]` no llegan a compararse porque su inicio es mayor al final del edificio analizado.
Al terminar, flag1 quedó en True, así que se agrega a la solución el punto `(ini_i, alt_i)` = `(2, 10)`. flag2 quedó en False (el edificio `[5,12,12]` termina más tarde y es más alto que `[2,9,10]`), por lo que punto2 no se emite.

## Complejidad

### Temporal
$O(N^2)$ donde $N$ es la cantidad de edificios del arreglo. Para cada N se compara hasta con N edificios. La condición de no analizar edificios que comienzan después del inicio del edificio actual puede reducir la complejidad en la práctica, pero en el peor de los casos no.


### Espacial
$O(N)$ debido a los resultados, que en el caso donde todos los edificios esten aislados entre si voy a tener 2N puntos.

## Cuándo usar esta técnica

### Favorable cuando
- Los edificios son angostos, ya que las comparaciones cortan rápido
- Hay pocos solapamientos de edificios
- La cantidad de edificios es pequeña y premia la simplicidad y la facilidad de verificación por sobre la eficiencia.

### Limitaciones
- Ante edificios anchos o con muchos solapamientos, las comparaciones tienden a $n^2$ y el rendimiento se degrada.
- No aprovecha ninguna estructura del problema (orden, subresultados reutilizables), así que repite trabajo que un enfoque más fino evitaría.


## Comparación con la solución división y conquista
La fuerza bruta decide punto por punto comparando cada edificio contra todos los demás, con un costo $O(n^2)$. División y conquista, en cambio, calcula los contornos de dos mitades y los **fusiona** en tiempo lineal, evitando comparaciones redundantes y bajando el costo total a $O(n \log n)$.

Para entradas chicas o con pocos solapamientos, la fuerza bruta puede ser competitiva —o incluso más rápida en la práctica— gracias a su factor constante bajo y a que no usa recursión ni estructuras intermedias. A medida que crece $n$ y aumentan los solapamientos, la ventaja de división y conquista toma más peso.

En resumen: la fuerza bruta gana en **simplicidad y facilidad de verificación**, mientras que división y conquista gana en **escalabilidad**, a costa de una implementación más delicada (el merge tiene varios casos borde) y un mayor uso de memoria por los contornos intermedios.

## Referencias

### Sobre la técnica (fuerza bruta / búsqueda exhaustiva)
- GeeksforGeeks — [Algoritmo de fuerza bruta, ventajas y desventajas](https://www.geeksforgeeks.org/brute-force-approach-and-its-pros-and-cons/):
Articulo cuándo conviene utilizar fuerza bruta.
