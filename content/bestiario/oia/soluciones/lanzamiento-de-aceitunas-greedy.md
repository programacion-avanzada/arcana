---
title: Lanzamiento de aceitunas - Greedy con Kadane
tags:
  - oia
  - solucion
---

[[lanzamiento-de-aceitunas|Volver al enunciado]]

## Técnicas utilizadas

Aplicamos el **algoritmo de Kadane**. En cada posición elegimos entre empezar un rango con su aporte o extender el mejor rango que terminaba en la posición anterior.

## Idea de la solución

Con el ejemplo cargado, dejá fijo el borde exterior y aumentá el radio interior hasta excluir el tiro más cercano al centro. Observá cómo descartar ese aporte negativo mejora el puntaje. <a id="visualizacion-aro" href="static/aceitunas-aro/#kadane" data-router-ignore="true" data-no-popover="true">Explorar el aro y calcular su puntaje</a>

### Construir y consultar sumas de prefijos

Para un vector `a`, `sum[fin]` es la suma del prefijo `a[0..fin]`. El prefijo de una posición contiene solo `a[0]`, así que `sum[0] = a[0]`. Para extenderlo una posición agregamos el elemento siguiente. Por eso `sum[fin] = sum[fin - 1] + a[fin]` para `fin > 0`. Con `a = [-1, 1, 0, 1]`, empezamos en `-1` y obtenemos `0` al sumar `1`, otro `0` al sumar `0` y `1` al sumar el último aporte. Así se construye `sum = [-1, 0, 0, 1]` en una pasada.

Para obtener la suma de `[inicio, fin]`, usamos `sum[fin] - sum[inicio - 1]`. El segundo término quita la parte anterior al rango. Para `inicio = 0`, usamos directamente `sum[fin]`. Por ejemplo, `[1, 3]` suma `1 - (-1) = 2`. Construir `sum` cuesta $O(M)$ para $M$ elementos y consultar un rango cuesta $O(1)$.

### Elegir el inicio sobre la marcha

Acá `a` es el [[array|vector]] `aportes`, construido a partir de los aportes netos de `difs` en el orden de `radiosCuad`. Para un `fin` fijo, la consulta de prefijos muestra que conviene quitar el menor prefijo posible. El término `sum[fin]` es común a todos los candidatos. Entre los prefijos que podemos quitar está el prefijo vacío, que vale cero y corresponde a empezar en el índice cero.

Kadane conserva `suma` e `inicio` para el mejor rango que terminaba en `fin - 1`. Al leer `aporte = aportes[fin]`, todo rango que ya existía recibe ese mismo aporte al extenderse. La mejor extensión vale `suma + aporte`. La otra posibilidad es empezar en `fin`, con valor `aporte`. Si `aporte > suma + aporte`, guardamos `inicio = fin` y `suma = aporte`. En los demás casos extendemos el rango con `suma += aporte`. Si ambas opciones empatan, extender conserva el inicio más chico.

La comparación equivale a decidir qué prefijo conviene quitar. Empezar en `fin` quita todo lo anterior a esa posición. Extender conserva el prefijo que ya habíamos elegido. Como solo comparamos las dos sumas al leer cada aporte, basta con mantener una suma y un inicio sobre la marcha.

Comparamos el mejor rango de cada `fin` con el mejor guardado, que empieza como el aro vacío de puntaje cero. Nuestro criterio entre óptimos positivos es el **menor inicio** y, si coinciden, el menor final. En este problema ambos mínimos se alcanzan en el mismo intervalo. Por eso, al recorrer los finales de menor a mayor y guardar solo mejoras estrictas, Kadane y fuerza bruta eligen el mismo rango. [[lanzamiento-de-aceitunas#Desempate opcional|Justificación del desempate]]

## Código

El programa lee las coordenadas de la entrada y escribe los dos cuadrados enteros del aro elegido.

```python
n = int(input())
difs = {}

for _ in range(n):
    # Ingreso de las coordenadas de los tiros.
    x, y = map(int, input().split())
    distCuad = x * x + y * y

    if distCuad not in difs:
        difs[distCuad] = 0

    # El tiro del Olivares suma uno y el del rival resta uno.
    if x > 0:
        difs[distCuad] += 1
    elif x < 0:
        difs[distCuad] -= 1

radiosCuad = sorted(difs)
aportes = [difs[distCuad] for distCuad in radiosCuad]
inicio = 0
suma = 0
maxSuma = 0
mejorIni, mejorFin = 0, 0

for fin, aporte in enumerate(aportes):
    if aporte > suma + aporte:
        inicio = fin
        suma = aporte
    else:
        suma += aporte

    if suma > maxSuma:
        maxSuma = suma
        mejorIni = inicio
        mejorFin = fin

if maxSuma == 0:
    print(0, 0)
else:
    # Excluye el grupo inmediatamente anterior al inicio elegido.
    r1Cuadrado = radiosCuad[mejorIni - 1] + 1 if mejorIni > 0 else 0
    r2Cuadrado = radiosCuad[mejorFin]
    print(r1Cuadrado, r2Cuadrado)
```

## Traza de ejemplo

Usamos `aportes = [-1, 1, 0, 1, -1, -1, 2, -1]`, con índices desde cero.

Entrá en **Simulación** y usá **Siguiente paso**. En `fin = 6`, observá que empezar con el aporte 2 y extender la suma anterior de 0 dan el mismo puntaje. La traza conserva el inicio 1. <a id="visualizacion-reducciones" href="static/aceitunas-reducciones/#kadane" data-router-ignore="true" data-no-popover="true">Ver la reducción y la traza de Kadane</a>

| `fin` | Aporte | Inicio del intervalo corriente | Suma corriente | Mejor intervalo |
| ----: | -----: | -----------------------------: | -------------: | --------------- |
|     0 |     -1 |                              0 |             -1 | Vacío           |
|     1 |     +1 |                              1 |              1 | `[1, 1]`        |
|     2 |      0 |                              1 |              1 | `[1, 1]`        |
|     3 |     +1 |                              1 |              2 | `[1, 3]`        |
|     4 |     -1 |                              1 |              1 | `[1, 3]`        |
|     5 |     -1 |                              1 |              0 | `[1, 3]`        |
|     6 |     +2 |                              1 |              2 | `[1, 3]`        |
|     7 |     -1 |                              1 |              1 | `[1, 3]`        |

En `fin = 1`, empezar con el aporte 1 da más que extender el rango anterior, que daría `-1 + 1 = 0`. Ahí empieza el rango en 1. En `fin = 6`, la igualdad `2 = 0 + 2` conserva ese inicio y se mantiene el mejor rango guardado `[1, 3]`. Su borde interior al cuadrado es `radiosCuad[0] + 1 = 6` y el exterior es `radiosCuad[3] = 90`.

## Complejidad

**Temporal.** Hay $M$ distancias distintas entre los $N$ tiros, con $1\le M\le N$. Sobre los aportes ordenados, la búsqueda cuesta $O(M)$ porque cada posición realiza una cantidad constante de operaciones. El ordenamiento cuesta $O(M\log M)$ y domina la búsqueda lineal. Contando también el agrupamiento, el tiempo total esperado es $O(N+M\log M)$, hasta $O(N\log N)$ en función de $N$.

**Espacial.** Kadane usa $O(1)$ espacio adicional sobre los vectores. El total auxiliar es $O(M)$ para el agrupamiento y los vectores, si los tiros se leen de a uno.

## Cuándo usar esta técnica

Kadane es adecuado cuando hay que maximizar una suma aditiva en un intervalo consecutivo sin restricciones adicionales de ancho, como en este problema. El paso lineal permite trabajar con los $100\,000$ tiros de la consigna incluso cuando todas las distancias difieren. La [[lanzamiento-de-aceitunas-fuerza-bruta|fuerza bruta]] da una comprobación directa en casos chicos y es más fácil de adaptar si se agregan condiciones que invalidan la decisión de descartar un tramo negativo.

## Visualizaciones

- <a href="static/aceitunas-aro/#kadane-visualizaciones" data-router-ignore="true" data-no-popover="true">Explorar el aro y calcular su puntaje</a>
- <a href="static/aceitunas-reducciones/#kadane-visualizaciones" data-router-ignore="true" data-no-popover="true">Ver la reducción y la traza de Kadane</a>
- <a href="static/aceitunas-comparacion/#kadane" data-router-ignore="true" data-no-popover="true">Comparar Kadane y fuerza bruta en simultáneo</a>

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
- Steven Halim, Felix Halim y Suhendry Effendy. _Competitive Programming 4_, libro 1, sección 3.5.2, «Max 1D Range Sum». [Sitio del libro](https://cpbook.net/)
