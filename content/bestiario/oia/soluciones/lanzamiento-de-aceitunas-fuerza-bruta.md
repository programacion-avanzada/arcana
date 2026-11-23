---
title: Lanzamiento de aceitunas - Fuerza bruta
tags:
  - oia
  - solucion
---

[[lanzamiento-de-aceitunas|Volver al enunciado]]

## Técnicas utilizadas

Usamos **fuerza bruta** para evaluar cada intervalo de distancias. Para cada inicio, calculamos el puntaje de los rangos que empiezan ahí con una suma acumulada.

## Idea de la solución

Mové un borde del aro y observá cómo entran o salen juntos todos los tiros que comparten un radio. Al ordenar las distancias, los dos bordes delimitan un bloque de grupos consecutivos. <a id="visualizacion-aro" href="static/aceitunas-aro/#fuerza-bruta" target="_blank" rel="noopener" data-no-popover="true">Explorar el aro y calcular su puntaje</a>

Registramos la diferencia entre tiros del Oli y del rival en un [[map|mapa]] cuya clave es el cuadrado de la distancia al centro. En Python usamos un `dict`, implementado con una [[hash table|tabla hash]]. Ordenamos las claves en un [[array|vector]] `radiosCuad` para que cada aro que cuenta tiros corresponda a un intervalo de índices consecutivos.

### Sumas de prefijos al recorrer un inicio

Una **suma de prefijos** es la suma de los primeros elementos de un vector. Si $P[k]$ guarda el aporte de los primeros $k$ grupos, entonces $P[0]=0$ y $P[k+1]=P[k]+\text{pesos}[k]$. El puntaje de $[i,j]$ es $P[j+1]-P[i]$, porque se resta el tramo anterior a $i$.

Acumulamos los prefijos del tramo que empieza en $i$ a medida que los necesitamos. Al fijar $i$, ponemos `suma` en cero. Al avanzar $j$, agregamos el aporte del grupo recién incluido. La variable pasa de $P[j]-P[i]$ a $P[j+1]-P[i]$ en tiempo constante. Al cambiar de inicio, volvemos a cero.

Al recorrer todos los inicios y todos sus finales, probamos cada intervalo válido exactamente una vez. Como criterio de desempate, elegimos el rango de **menor inicio** y, si comparten inicio, el de menor final. Los bucles visitan los rangos en ese orden y guardamos uno nuevo solo si supera el mejor puntaje. Si el mejor puntaje es cero, devolvemos `0 0`. Para un puntaje positivo, reconstruimos los dos cuadrados enteros con los índices guardados. [[lanzamiento-de-aceitunas#Desempate opcional|Justificación del desempate]]

## Código

```python
n = int(input())
difs = {}

for i in range(n):
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
maxSuma = 0
mejorIni, mejorFin = 0, 0

# Fija cada inicio y extiende el final acumulando los aportes.
for ini in range(len(radiosCuad)):
    suma = 0
    for fin in range(ini, len(radiosCuad)):
        suma += difs[radiosCuad[fin]]
        if suma > maxSuma:
            maxSuma = suma
            mejorIni = ini
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

Los aportes de los ocho grupos del enunciado son `[-1, 1, 0, 1, -1, -1, 2, -1]`. Cada fila fija un inicio $i$ y muestra cómo cambia la suma al extender el final $j$.

Entrá en **Simulación** y usá **Siguiente paso** para ejecutar una instrucción por vez. Para $i=1$, observá cómo la suma pasa de 1 a 2 al agregar el aporte de $j=3$ y cómo se actualiza el mejor rango en las instrucciones siguientes. <a id="visualizacion-reducciones" href="static/aceitunas-reducciones/#fuerza-bruta" target="_blank" rel="noopener" data-no-popover="true">Ver la reducción y la traza de fuerza bruta</a>

| Inicio $i$ | Puntajes de $[i,j]$ con $j=i,\ldots,7$ | Mejor puntaje acumulado | Mejor intervalo |
| ---------: | -------------------------------------- | ----------------------: | --------------- |
|          0 | `-1, 0, 0, 1, 0, -1, 1, 0`             |                       1 | `[0, 3]`        |
|          1 | `1, 1, 2, 1, 0, 2, 1`                  |                       2 | `[1, 3]`        |
|          2 | `0, 1, 0, -1, 1, 0`                    |                       2 | `[1, 3]`        |
|          3 | `1, 0, -1, 1, 0`                       |                       2 | `[1, 3]`        |
|          4 | `-1, -2, 0, -1`                        |                       2 | `[1, 3]`        |
|          5 | `-1, 1, 0`                             |                       2 | `[1, 3]`        |
|          6 | `2, 1`                                 |                       2 | `[1, 3]`        |
|          7 | `-1`                                   |                       2 | `[1, 3]`        |

Para $i=1$, arrancamos con cero. El grupo de índice 1 aporta 1, el de índice 2 aporta 0 y el de índice 3 aporta 1. La suma llega a 2 en $[1,3]$. Para reconstruir el aro usamos `radiosCuad[0] + 1 = 6` y `radiosCuad[3] = 90`. La salida es `6 90`.

## Complejidad

**Temporal.** Hay $M$ distancias distintas entre los $N$ tiros, con $1\le M\le N$. Con las claves ordenadas, se evalúan $M(M+1)/2$ intervalos. Cada uno agrega un aporte con una consulta al mapa en $O(1)$ esperado, de modo que buscar el mejor rango cuesta $O(M^2)$ esperado. Ordenar cuesta $O(M\log M)$ y queda dominado por la búsqueda cuadrática. Al sumar también el agrupamiento, el tiempo total esperado es $O(N+M\log M+M^2)=O(N+M^2)$, que puede ser cuadrático en $N$.

**Espacial.** El mapa y el vector de claves ordenadas usan $O(M)$ espacio auxiliar. La búsqueda mantiene una suma, el puntaje máximo y los índices del intervalo elegido, por lo que emplea $O(1)$ espacio adicional.

## Cuándo usar esta técnica

La enumeración permite inspeccionar todos los candidatos y sirve para validar otra implementación con instancias chicas. También resulta viable con muchos tiros si caen en pocas circunferencias. Cuando cada tiro tiene una distancia distinta, $100\,000$ grupos generan más de cinco mil millones de intervalos. [[lanzamiento-de-aceitunas-greedy|Kadane]] evita esa enumeración y resuelve la búsqueda con una sola pasada y espacio constante adicional.

## Visualizaciones

- <a href="static/aceitunas-aro/#fuerza-bruta-visualizaciones" target="_blank" rel="noopener" data-no-popover="true">Explorar el aro y calcular su puntaje</a>
- <a href="static/aceitunas-reducciones/#fuerza-bruta-visualizaciones" target="_blank" rel="noopener" data-no-popover="true">Ver la reducción y la traza de fuerza bruta</a>
- <a href="static/aceitunas-comparacion/#fuerza-bruta" target="_blank" rel="noopener" data-no-popover="true">Comparar Kadane y fuerza bruta en simultáneo</a>

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
- Steven Halim, Felix Halim y Suhendry Effendy. _Competitive Programming 4_, libro 1, sección 3.5.2, «Max 1D Range Sum». [Sitio del libro](https://cpbook.net/)
