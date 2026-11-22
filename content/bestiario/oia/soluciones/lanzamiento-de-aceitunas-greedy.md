---
title: Lanzamiento de aceitunas - Greedy con Kadane
tags:
  - oia
  - solucion
---

[[lanzamiento-de-aceitunas|Volver al enunciado]]

## Técnicas utilizadas

Aplicamos el **algoritmo de Kadane**. La decisión ávida consiste en descartar un tramo acumulado cuando su suma es negativa. El algoritmo también se puede expresar como una recurrencia de programación dinámica sobre el mejor intervalo que termina en cada índice.

## Idea de la solución

Recorremos los [[array|vectores]] `distancias2` y `pesos` del enunciado. Antes de sumar el peso de la posición $j$, mantenemos el mejor intervalo que termina en $j-1$, junto con su inicio. Un intervalo que termina en $j$ empieza en $j$ o extiende un intervalo que termina en $j-1$. Entre las extensiones basta con tomar la del mejor, porque a todas se les suma el mismo peso. De ahí sale la recurrencia

$$
B_j = \max(\text{pesos}[j], B_{j-1} + \text{pesos}[j]),\qquad B_0=\text{pesos}[0].
$$

Si la suma anterior es negativa, empezar en $j$ es estrictamente mejor. Si es positiva, conviene extender. Si es cero, ambas opciones dan lo mismo y extender conserva el inicio más temprano, por lo que el corte se hace con `< 0`. Así, en cada fin se conserva el mejor intervalo que termina allí y, en caso de empate, el que empieza antes.

El óptimo global es el máximo entre el cero del aro vacío y todas las sumas $B_j$, porque todo intervalo no vacío termina en alguna posición. Actualizamos la mejor respuesta solo ante una mejora estricta. Al recorrer los finales de menor a mayor, eso conserva el primer final óptimo y da el mismo desempate que en la fuerza bruta.

## Código

```python
def mejor_aro_kadane(distancias2, pesos):
    inicio = 0
    suma = 0
    mejor_puntaje = 0
    respuesta = (0, 0)

    for fin, peso in enumerate(pesos):
        if suma < 0:
            inicio = fin
            suma = 0
        suma += peso
        if suma > mejor_puntaje:
            mejor_puntaje = suma
            interior2 = 0 if inicio == 0 else distancias2[inicio - 1] + 1
            respuesta = (interior2, distancias2[fin])
    return respuesta
```

Con `tiros` leído de la entrada, `print(*mejor_aro_kadane(*agrupar_tiros(tiros)))` imprime los dos cuadrados separados por un espacio.

## Traza de ejemplo

Usamos `pesos = [-1, 1, 0, 1, -1, -1, 2, -1]`, con índices desde cero.

| Final $j$ | Peso | Inicio del intervalo corriente | Suma corriente | Mejor intervalo |
| --------: | ---: | -----------------------------: | -------------: | --------------- |
|         0 |   -1 |                              0 |             -1 | Vacío           |
|         1 |   +1 |                              1 |              1 | `[1, 1]`        |
|         2 |    0 |                              1 |              1 | `[1, 1]`        |
|         3 |   +1 |                              1 |              2 | `[1, 3]`        |
|         4 |   -1 |                              1 |              1 | `[1, 3]`        |
|         5 |   -1 |                              1 |              0 | `[1, 3]`        |
|         6 |   +2 |                              1 |              2 | `[1, 3]`        |
|         7 |   -1 |                              1 |              1 | `[1, 3]`        |

En $j=1$ se descarta el tramo anterior porque suma $-1$. En $j=6$ se conserva el inicio 1 porque el tramo anterior suma cero. El intervalo corriente vuelve a dar 2 y se mantiene la mejor respuesta ya guardada. Reconstruimos `6 90` a partir del intervalo `[1, 3]`.

## Complejidad

**Temporal.** La búsqueda cuesta $O(M)$ para $M$ distancias distintas. Cada posición realiza una cantidad constante de operaciones. Con el agrupamiento y el ordenamiento, el tiempo total esperado es $O(N+M\log M)$, hasta $O(N\log N)$ en función de $N$.

**Espacial.** Kadane usa $O(1)$ espacio adicional sobre los vectores. El total auxiliar es $O(M)$ para el agrupamiento y los vectores, si los tiros se leen de a uno.

## Cuándo usar esta técnica

Kadane es adecuado cuando hay que maximizar una suma aditiva en un intervalo consecutivo sin restricciones adicionales de ancho, como en este problema. El paso lineal permite trabajar con los $100\,000$ tiros de la consigna incluso cuando todas las distancias difieren. La [[lanzamiento-de-aceitunas-fuerza-bruta|fuerza bruta]] da una comprobación directa en casos chicos y es más fácil de adaptar si se agregan condiciones que invalidan la decisión de descartar un tramo negativo.

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
- Steven Halim, Felix Halim y Suhendry Effendy. _Competitive Programming 4_, libro 1, sección 3.5.2, «Max 1D Range Sum». [Sitio del libro](https://cpbook.net/)
