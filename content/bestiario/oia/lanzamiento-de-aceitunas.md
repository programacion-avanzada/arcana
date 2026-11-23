---
title: Lanzamiento de aceitunas
tags:
  - oia
  - bestia
---

## Nombre y enunciado

En un partido de lanzamiento de aceitunas, dos jugadores tiran desde lados opuestos de una red. La red coincide con el eje $y$ y cada jugador apunta a la mitad de enfrente. Por enunciado, ningún tiro puede caer sobre la red ($x=0$). El club Olivares Intergalácticos Asociados, conocido como el Oli, registró la posición $(x,y)$ donde cayó cada aceituna. Los tiros que cayeron a la derecha de la red ($x>0$) son del Oli y los que cayeron a la izquierda ($x<0$) son de su rival.

Con el partido terminado, podemos elegir qué franja de la cancha se usa para calcular el resultado. La región válida es un **aro** centrado en el origen, delimitado por una circunferencia interior de radio $R_1$ y otra exterior de radio $R_2$. Una aceituna cuenta cuando su distancia al centro queda entre los dos radios. Los tiros que caen exactamente sobre cualquiera de las circunferencias también cuentan.

El objetivo es elegir $R_1$ y $R_2$ para maximizar la diferencia entre los tiros válidos del Oli y los tiros válidos del rival. Esta variante adapta el problema de cancha circular del [enunciado original del Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf).

## Intuición

Ampliar el aro suma tiros de los dos jugadores. Si el rival concentra sus tiros cerca del centro, aumentar el radio interior puede mejorar el resultado al dejarlos afuera. Si el Oli tiene varios tiros lejos, aumentar el exterior permite sumarlos, pero también incorpora los tiros del rival a distancias lejanas.

El aro siempre incluye o excluye juntos los tiros de una misma circunferencia. Por ejemplo, los tiros $(3,4)$ y $(-4,3)$ están a distancia $5$ del centro. Si el aro abarca esa distancia, suma un tiro de cada lado y la diferencia se mantiene. Si hay tres tiros del Oli y uno del rival a la misma distancia, esa circunferencia aporta $3-1=2$ puntos.

Podemos ordenar todas las circunferencias que contienen tiros, de la más cercana a la más lejana. Una vez que fijamos el primer y el último grupo que cuentan, todos los grupos intermedios también quedan dentro del aro. La búsqueda se convierte así en elegir un bloque consecutivo de grupos con la mayor suma de puntos.

## Definición formal

**Entrada**

- Una línea con la cantidad de tiros $N$, con $1 \le N \le 100\,000$.
- $N$ líneas con dos enteros $x_i,y_i$ por línea. Las coordenadas están entre $-2\,000\,000\,000$ y $2\,000\,000\,000$, inclusive, y $x_i \ne 0$.

**Salida**

Una línea con dos enteros, $R_1^2$ y $R_2^2$, separados por un espacio, para algún aro óptimo con $0 \le R_1 \le R_2$. Si hay varios aros con el mismo puntaje máximo, cualquiera sirve. Un tiro cuenta cuando

$$
R_1^2 \le x_i^2+y_i^2 \le R_2^2.
$$

Con $R_1=0$ se incluye el disco hasta el borde exterior. Con $R_1=R_2>0$ cuentan los tiros que cayeron justo en esa circunferencia. `0 0` deja todos los tiros afuera, porque para caer en el origen se necesitaría $x=0$. Por eso el puntaje óptimo siempre es al menos cero.

## Ejemplo concreto

Tomamos los tiros del ejemplo original y calculamos el resultado al elegir ambos bordes del aro.

```text
10
9 3
6 1
9 8
-1 -2
8 -9
-2 10
5 -8
-5 8
-10 9
-1 -10
```

| Distancia al cuadrado | Tiros del Oli | Tiros del rival | Aporte neto | Tiros $(x,y)$         |
| --------------------: | ------------: | --------------: | ----------: | --------------------- |
|                     5 |             0 |               1 |          -1 | `(-1, -2)`            |
|                    37 |             1 |               0 |          +1 | `(6, 1)`              |
|                    89 |             1 |               1 |           0 | `(5, -8)` y `(-5, 8)` |
|                    90 |             1 |               0 |          +1 | `(9, 3)`              |
|                   101 |             0 |               1 |          -1 | `(-1, -10)`           |
|                   104 |             0 |               1 |          -1 | `(-2, 10)`            |
|                   145 |             2 |               0 |          +2 | `(9, 8)` y `(8, -9)`  |
|                   181 |             0 |               1 |          -1 | `(-10, 9)`            |

El aro con cuadrados `6 90` incluye las distancias al cuadrado 37, 89 y 90. Cuenta tres tiros del Oli y uno del rival, con diferencia $3-1=2$. El aro `145 145` también logra 2. Para superar 2 habría que combinar el grupo de 145 con algún aporte positivo de 37 o de 90, y al hacerlo también se incluyen los dos aportes negativos de 101 y 104. La suma máxima es 2.

Este aro produce la siguiente salida.

```text
6 90
```

## Por dónde empezar

### Agrupar por distancia

Para un tiro en $(x,y)$, la distancia al centro es $r=\sqrt{x^2+y^2}$. Podemos imaginar que el tiro gira alrededor del origen hasta llegar a $(r,0)$. Su distancia sigue siendo la misma y su aporte queda determinado por el signo de la $x$ original. Al hacer esto para todos los tiros, los que comparten radio se reúnen en el mismo lugar del semieje horizontal positivo.

Elevar al cuadrado conserva el orden de las distancias no negativas. En particular, la pertenencia al aro se puede calcular con enteros cuando se eligen cuadrados enteros para los bordes.

$$
R_1 \le \sqrt{x^2+y^2} \le R_2
\quad\Longleftrightarrow\quad
R_1^2 \le x^2+y^2 \le R_2^2.
$$

Usamos $s=x^2+y^2$ como clave exacta de un [[map|mapa]]. Cada tiro suma $+1$ a su clave si lo hizo el Oli y $-1$ si lo hizo el rival. Al terminar, el valor de cada clave es la diferencia de tiros en esa circunferencia.

### Ordenar los grupos

Ordenamos las $M$ claves distintas y guardamos dos [[array|vectores]] paralelos. Se pueden leer como dos filas de una tabla, con las claves ordenadas arriba y sus aportes netos abajo. En el índice $i$, `distancias2[i]` guarda el cuadrado del radio y `pesos[i]` guarda el aporte neto del grupo. Conservamos las claves de aporte cero porque señalan distancias donde hay tiros y ayudan a reconstruir los bordes que incluyen exactamente un bloque.

```python
def agrupar_tiros(tiros):
    puntos_por_distancia = {}
    for x, y in tiros:
        distancia2 = x * x + y * y
        aporte = 1 if x > 0 else -1
        puntos_por_distancia[distancia2] = (
            puntos_por_distancia.get(distancia2, 0) + aporte
        )

    distancias2 = sorted(puntos_por_distancia)
    pesos = [puntos_por_distancia[d] for d in distancias2]
    return distancias2, pesos
```

El `dict` de Python implementa el mapa con una [[hash table|tabla hash]]. Agrupar cuesta $O(N)$ esperado, ordenar cuesta $O(M\log M)$ y construir los vectores cuesta $O(M)$. El espacio auxiliar es $O(M)$. El valor de $s$ puede llegar a $8\cdot 10^{18}$. Los enteros de Python lo representan exactamente. En un lenguaje con enteros de tamaño fijo, las multiplicaciones y la suma deben hacerse con al menos 64 bits con signo.

### Elegir y reconstruir el aro

Cualquier aro que cuente algún tiro incluye un intervalo de índices $[i,j]$ en el vector ordenado. Si incluye las distancias de los extremos, también incluye todas las intermedias. Recíprocamente, todo intervalo $[i,j]$ se puede obtener con cuadrados `distancias2[i] distancias2[j]`. Buscar el mejor aro equivale a maximizar la suma de un intervalo, con la opción adicional de dejar todos los tiros afuera.

Para un intervalo $[i,j]$, el menor cuadrado exterior es `distancias2[j]`. El menor cuadrado interior es `0` si $i=0$ y `distancias2[i - 1] + 1` en otro caso. Ese valor supera al grupo anterior, que quedaría incluido en caso de igualdad, y no supera a `distancias2[i]`. Si el mejor puntaje es cero, ambas soluciones devuelven `0 0`.

La salida entera permite elegir el primer valor a la derecha del cuadrado anterior. Por ejemplo, para excluir el grupo de clave 5, el menor cuadrado entero mayor que 5 es 6. Si se permitieran cuadrados reales, para cualquier valor $5+\varepsilon$ con $\varepsilon>0$ podríamos usar $5+\varepsilon/2$ y seguir excluyendo el grupo. En ese caso, 5 sería el ínfimo y el borde interior mínimo no existiría.

### Desempate opcional

Entre los rangos de puntaje máximo positivo, elegimos el que tenga **el menor índice de inicio**. Si hay empate también en el inicio, elegimos el menor final. La consigna admite cualquier respuesta óptima.

Con un óptimo positivo, consideramos el primer final $j$ que alcanza el máximo y, para ese final, el primer inicio $i$ que lo alcanza. Así obtenemos el menor borde exterior. También obtenemos el menor borde interior entre todos los aros óptimos con cuadrados enteros. Si otro intervalo óptimo empezara antes de $i$, su final no podría ser anterior a $j$, y con el mismo final contradiría la elección de $i$. Si terminara después de $j$, contendría a $[i,j]$ y agregaría dos tramos, uno a la izquierda y otro a la derecha. Esos tramos sumarían cero juntos. Ninguno puede tener suma positiva, porque agregarlo por separado mejoraría el óptimo. Por lo tanto, ambos suman cero y el tramo izquierdo también se podría agregar al intervalo que termina en $j$, contradiciendo que $i$ era el primer inicio posible.

Por lo tanto, el mismo intervalo tiene a la vez el menor inicio y el menor final entre los óptimos. Fuerza bruta lo encuentra al recorrer primero los inicios. Kadane lo encuentra al recorrer primero los finales. Esta elección minimiza también $R_1+R_2$ entre las respuestas con cuadrados enteros, porque cada radio es mínimo.

## Soluciones disponibles

- [[lanzamiento-de-aceitunas-fuerza-bruta|Fuerza bruta con suma acumulada]]
- [[lanzamiento-de-aceitunas-greedy|Greedy con el algoritmo de Kadane]]

## Visualizaciones

- <a href="static/aceitunas-aro/#enunciado" target="_blank" rel="noopener" data-no-popover="true">Explorar el aro y calcular su puntaje</a>
- <a href="static/aceitunas-reducciones/#enunciado" target="_blank" rel="noopener" data-no-popover="true">Ver el agrupamiento y simular ambos algoritmos</a>

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018, nivel 3](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
