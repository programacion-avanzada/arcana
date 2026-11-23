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

Con el ejemplo cargado, dejá fijo el borde exterior y aumentá el radio interior hasta excluir el tiro más cercano al centro. Observá cómo descartar ese aporte negativo mejora el puntaje. <a id="visualizacion-aro" href="static/aceitunas-aro/#kadane" target="_blank" rel="noopener" data-no-popover="true">Explorar el aro y calcular su puntaje</a>

Recorremos los [[array|vectores]] `distancias2` y `pesos` del enunciado. Antes de sumar el peso de la posición $j$, mantenemos el mejor intervalo que termina en $j-1$, junto con su inicio. Un intervalo que termina en $j$ empieza en $j$ o extiende un intervalo que termina en $j-1$. Entre las extensiones basta con tomar la del mejor, porque a todas se les suma el mismo peso. De ahí sale la recurrencia

$$
B_j = \max(\text{pesos}[j], B_{j-1} + \text{pesos}[j]),\qquad B_0=\text{pesos}[0].
$$

Si la suma anterior es negativa, empezar en $j$ es estrictamente mejor. Si es positiva, conviene extender. Si es cero, ambas opciones dan lo mismo y extender conserva el inicio más temprano, por lo que el corte se hace con `< 0`. Así, en cada fin se conserva el mejor intervalo que termina allí y, en caso de empate, el que empieza antes.

### Sumas de prefijos en una pasada

Si $P[k]$ es la suma de los primeros $k$ aportes, con $P[0]=0$, el intervalo $[i,j]$ suma $P[j+1]-P[i]$. Para un final fijo $j$, el mejor inicio $i$ es el del menor $P[i]$ entre las posiciones $0$ y $j$. Si ese prefijo mínimo se repite, elegimos el primero.

Kadane mantiene esa diferencia sobre la marcha. Justo antes de agregar $\text{pesos}[j]$, la variable `suma` vale $P[j]-P[i]$ para el inicio que venía usando. Si es negativa, $P[j]$ es un nuevo mínimo y conviene arrancar en $j$ con diferencia cero. Si es cero, ambos prefijos valen lo mismo y conservamos el inicio más chico. Luego sumamos el aporte de $j$ para obtener $P[j+1]-P[i]$. Basta guardar la diferencia y su inicio.

El óptimo global es el máximo entre el cero del aro vacío y todas las sumas $B_j$. Nuestro criterio entre óptimos positivos es el **menor inicio** y, si coinciden, el menor final. En este problema ambos mínimos se alcanzan en el mismo intervalo. Por eso, al recorrer los finales de menor a mayor y actualizar solo ante una mejora estricta, Kadane devuelve el mismo rango que fuerza bruta. [[lanzamiento-de-aceitunas#Desempate opcional|Justificación del desempate]]

## Código

El programa lee las coordenadas de la entrada y escribe los dos cuadrados enteros del aro elegido.

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


n = int(input())
puntos_por_distancia = {}
for _ in range(n):
    x, y = map(int, input().split())
    distancia2 = x * x + y * y
    aporte = 1 if x > 0 else -1
    puntos_por_distancia[distancia2] = puntos_por_distancia.get(distancia2, 0) + aporte

distancias2 = sorted(puntos_por_distancia)
pesos = [puntos_por_distancia[d] for d in distancias2]
print(*mejor_aro_kadane(distancias2, pesos))
```

## Traza de ejemplo

Usamos `pesos = [-1, 1, 0, 1, -1, -1, 2, -1]`, con índices desde cero.

Entrá en **Simulación** y usá **Siguiente paso**. Cuando se comprueba si la suma es negativa en el índice 6, la tabla de variables muestra que vale cero. Kadane conserva el inicio 1 antes de agregar el aporte de ese índice. <a id="visualizacion-reducciones" href="static/aceitunas-reducciones/#kadane" target="_blank" rel="noopener" data-no-popover="true">Ver la reducción y la traza de Kadane</a>

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

**Temporal.** Hay $M$ distancias distintas entre los $N$ tiros, con $1\le M\le N$. Sobre los aportes ordenados, la búsqueda cuesta $O(M)$ porque cada posición realiza una cantidad constante de operaciones. El ordenamiento cuesta $O(M\log M)$ y domina la búsqueda lineal. Contando también el agrupamiento, el tiempo total esperado es $O(N+M\log M)$, hasta $O(N\log N)$ en función de $N$.

**Espacial.** Kadane usa $O(1)$ espacio adicional sobre los vectores. El total auxiliar es $O(M)$ para el agrupamiento y los vectores, si los tiros se leen de a uno.

## Cuándo usar esta técnica

Kadane es adecuado cuando hay que maximizar una suma aditiva en un intervalo consecutivo sin restricciones adicionales de ancho, como en este problema. El paso lineal permite trabajar con los $100\,000$ tiros de la consigna incluso cuando todas las distancias difieren. La [[lanzamiento-de-aceitunas-fuerza-bruta|fuerza bruta]] da una comprobación directa en casos chicos y es más fácil de adaptar si se agregan condiciones que invalidan la decisión de descartar un tramo negativo.

## Visualizaciones

- <a href="static/aceitunas-aro/#kadane-visualizaciones" target="_blank" rel="noopener" data-no-popover="true">Explorar el aro y calcular su puntaje</a>
- <a href="static/aceitunas-reducciones/#kadane-visualizaciones" target="_blank" rel="noopener" data-no-popover="true">Ver la reducción y la traza de Kadane</a>
- <a href="static/aceitunas-comparacion/#kadane" target="_blank" rel="noopener" data-no-popover="true">Comparar Kadane y fuerza bruta en simultáneo</a>

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
- Steven Halim, Felix Halim y Suhendry Effendy. _Competitive Programming 4_, libro 1, sección 3.5.2, «Max 1D Range Sum». [Sitio del libro](https://cpbook.net/)
