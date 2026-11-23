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

Mové un borde del aro y observá cómo entran o salen juntos todos los tiros que comparten un radio. Al ordenar las distancias, los dos bordes delimitan un bloque de grupos consecutivos. <a id="visualizacion-aro" href="static/aceitunas-aro/#fuerza-bruta" data-router-ignore="true" data-no-popover="true">Explorar el aro y calcular su puntaje</a>

Registramos el aporte neto de cada radio en el [[map|mapa]] `difs`, con `distCuad` como clave. En Python usamos un `dict`, implementado con una [[hash table|tabla hash]]. Ordenamos las claves en el [[array|vector]] `radiosCuad` para que cada aro que cuenta tiros corresponda a un intervalo de índices consecutivos.

### Construir y consultar sumas de prefijos

Para un vector `a`, `sum[fin]` guarda la suma del prefijo `a[0..fin]`, desde el índice cero hasta `fin` inclusive. Empezamos con `sum[0] = a[0]`. Avanzamos de izquierda a derecha y, para cada `fin > 0`, construimos `sum[fin] = sum[fin - 1] + a[fin]`. Con `a = [-1, 1, 0, 1]`, los prefijos se construyen como `-1`, `-1 + 1 = 0`, `0 + 0 = 0` y `0 + 1 = 1`. El vector `sum` queda `[-1, 0, 0, 1]`.

Para consultar `[ini, fin]`, tomamos `sum[fin]` y restamos `sum[ini - 1]`, que contiene los elementos anteriores a `ini`. Si `ini = 0`, el resultado es directamente `sum[fin]`. Por ejemplo, `[1, 3]` suma `sum[3] - sum[0] = 1 - (-1) = 2`. Construir los prefijos toma $O(M)$ para un vector de $M$ elementos y cada consulta toma $O(1)$.

### Aplicar la suma sobre la marcha

En este problema, `a` son los aportes netos del mapa leídos en el orden de `radiosCuad`. Para cada `ini` recorremos los finales en orden, así que podemos acumular en el momento el mismo valor que daría la consulta de prefijos. Empezamos esa fila con `suma = 0`. Al extender el rango hasta `fin`, agregamos `difs[radiosCuad[fin]]`. La nueva `suma` vale lo mismo que `sum[fin] - sum[ini - 1]` si `ini > 0`, o que `sum[fin]` si `ini = 0`. Al pasar a otro `ini`, la suma vuelve a cero. Esto calcula cada candidato en tiempo constante esperado con una consulta al mapa y mantiene solo la suma corriente.

Al recorrer todos los inicios y todos sus finales, probamos cada intervalo válido exactamente una vez. Como criterio de desempate, elegimos el rango de **menor inicio** y, si comparten inicio, el de menor final. Los bucles visitan los rangos en ese orden y guardamos uno nuevo solo si supera el mejor puntaje. Si el mejor puntaje es cero, devolvemos `0 0`. Para un puntaje positivo, reconstruimos los dos cuadrados enteros con los índices guardados. [[lanzamiento-de-aceitunas#Desempate opcional|Justificación del desempate]]

## Código

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

Los aportes de los ocho grupos del enunciado son `[-1, 1, 0, 1, -1, -1, 2, -1]`. Cada fila fija `ini` y muestra cómo cambia la suma al avanzar `fin`.

Entrá en **Simulación** y usá **Siguiente paso** para ejecutar una instrucción por vez. Con `ini = 1`, observá cómo la suma pasa de 1 a 2 al agregar el aporte de `fin = 3` y cómo se guarda el nuevo rango. <a id="visualizacion-reducciones" href="static/aceitunas-reducciones/#fuerza-bruta" data-router-ignore="true" data-no-popover="true">Ver la reducción y la traza de fuerza bruta</a>

| `ini` | Puntajes de `[ini, fin]` desde `fin = ini` hasta `fin = 7` | Mejor puntaje acumulado | Mejor intervalo |
| ----: | ---------------------------------------------------------- | ----------------------: | --------------- |
|     0 | `-1, 0, 0, 1, 0, -1, 1, 0`                                 |                       1 | `[0, 3]`        |
|     1 | `1, 1, 2, 1, 0, 2, 1`                                      |                       2 | `[1, 3]`        |
|     2 | `0, 1, 0, -1, 1, 0`                                        |                       2 | `[1, 3]`        |
|     3 | `1, 0, -1, 1, 0`                                           |                       2 | `[1, 3]`        |
|     4 | `-1, -2, 0, -1`                                            |                       2 | `[1, 3]`        |
|     5 | `-1, 1, 0`                                                 |                       2 | `[1, 3]`        |
|     6 | `2, 1`                                                     |                       2 | `[1, 3]`        |
|     7 | `-1`                                                       |                       2 | `[1, 3]`        |

Con `ini = 1`, arrancamos con cero y sumamos los aportes 1, 0 y 1 para `fin = 1`, `2` y `3`. El rango `[1, 3]` alcanza una suma de 2. Para elegir el menor radio interior, tomamos el primer entero a la derecha del cuadrado anterior, `radiosCuad[0] + 1 = 6`. Ese borde excluye el grupo de clave 5 y conserva el de clave 37. El borde exterior es `radiosCuad[3] = 90`. [[lanzamiento-de-aceitunas#Elegir y reconstruir el aro|Reconstrucción de los radios]]

## Complejidad

**Temporal.** Hay $M$ distancias distintas entre los $N$ tiros, con $1\le M\le N$. Con las claves ordenadas, se evalúan $M(M+1)/2$ intervalos. Cada uno agrega un aporte con una consulta al mapa en $O(1)$ esperado, de modo que buscar el mejor rango cuesta $O(M^2)$ esperado. Ordenar cuesta $O(M\log M)$ y queda dominado por la búsqueda cuadrática. Al sumar también el agrupamiento, el tiempo total esperado es $O(N+M\log M+M^2)=O(N+M^2)$, que puede ser cuadrático en $N$.

**Espacial.** El mapa y el vector de claves ordenadas usan $O(M)$ espacio auxiliar. La búsqueda mantiene una suma, el puntaje máximo y los índices del intervalo elegido, por lo que emplea $O(1)$ espacio adicional.

## Cuándo usar esta técnica

La enumeración permite inspeccionar todos los candidatos y sirve para validar otra implementación con instancias chicas. También resulta viable con muchos tiros si caen en pocas circunferencias. Cuando cada tiro tiene una distancia distinta, $100\,000$ grupos generan más de cinco mil millones de intervalos. [[lanzamiento-de-aceitunas-greedy|Kadane]] evita esa enumeración y resuelve la búsqueda con una sola pasada y espacio constante adicional.

## Visualizaciones

- <a href="static/aceitunas-aro/#fuerza-bruta-visualizaciones" data-router-ignore="true" data-no-popover="true">Explorar el aro y calcular su puntaje</a>
- <a href="static/aceitunas-reducciones/#fuerza-bruta-visualizaciones" data-router-ignore="true" data-no-popover="true">Ver la reducción y la traza de fuerza bruta</a>
- <a href="static/aceitunas-comparacion/#fuerza-bruta" data-router-ignore="true" data-no-popover="true">Comparar Kadane y fuerza bruta en simultáneo</a>

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
- Steven Halim, Felix Halim y Suhendry Effendy. _Competitive Programming 4_, libro 1, sección 3.5.2, «Max 1D Range Sum». [Sitio del libro](https://cpbook.net/)
