---
title: Lanzamiento de aceitunas
tags:
  - oia
  - bestia
---

## Nombre y enunciado

En un partido de lanzamiento de aceitunas, dos jugadores tiran desde lados opuestos de una red. La red coincide con el eje $y$ y cada jugador apunta a la mitad de enfrente. Por enunciado, ningún tiro puede caer sobre la red ($x=0$). El club Olivares Intergalácticos Asociados, conocido como el Oli, registró la posición $(x,y)$ donde cayó cada aceituna. Los tiros que cayeron a la derecha de la red ($x>0$) son del Oli y los que cayeron a la izquierda ($x<0$) son de su rival.

Con el partido terminado, podemos elegir qué franja de la cancha se usa para calcular el resultado. La región válida es un **aro** centrado en el origen, delimitado por una circunferencia interior de radio $R_1$ y otra exterior de radio $R_2$. Una aceituna cuenta si cae dentro del aro delimitado por los dos radios, incluidos ambos bordes.

El objetivo es elegir $R_1$ y $R_2$ para maximizar la diferencia entre los tiros válidos del Oli y los tiros válidos del rival. Esta variante adapta el problema de cancha circular del [enunciado original del Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf).

Para entender mejor cómo se cuentan los tiros, mové los bordes y observá cómo cambia el resultado. <a href="static/aceitunas-aro/#enunciado" data-router-ignore="true" data-no-popover="true">Explorar el aro y calcular su puntaje</a>

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

En este ejemplo hay $N=10$ tiros. Cada fila agrupa los tiros que caen a la misma distancia y los grupos se muestran en el orden en que aparecen por primera vez en la entrada.

| Distancia al cuadrado | Tiros del Oli | Tiros del rival | Aporte neto | Tiros $(x,y)$         |
| --------------------: | ------------: | --------------: | ----------: | --------------------- |
|                    90 |             1 |               0 |          +1 | `(9, 3)`              |
|                    37 |             1 |               0 |          +1 | `(6, 1)`              |
|                   145 |             2 |               0 |          +2 | `(9, 8)` y `(8, -9)`  |
|                     5 |             0 |               1 |          -1 | `(-1, -2)`            |
|                   104 |             0 |               1 |          -1 | `(-2, 10)`            |
|                    89 |             1 |               1 |           0 | `(5, -8)` y `(-5, 8)` |
|                   181 |             0 |               1 |          -1 | `(-10, 9)`            |
|                   101 |             0 |               1 |          -1 | `(-1, -10)`           |

El aro con cuadrados `6 90` incluye las distancias al cuadrado 37, 89 y 90. Cuenta tres tiros del Oli y uno del rival, con diferencia $3-1=2$. El aro `145 145` también logra 2. Para superar 2 habría que combinar el grupo de 145 con algún aporte positivo de 37 o de 90, y al hacerlo también se incluyen los dos aportes negativos de 101 y 104. La suma máxima es 2.

Este aro produce la siguiente salida.

```text
6 90
```

![Plano de los diez tiros del ejemplo. El aro de salida tiene radios √6 y √90, con tres tiros del Oli y uno del rival en la región sombreada.](aceitunas-ejemplo.png)

## Por dónde empezar

### Agrupar por distancia

Como elegimos los dos radios del aro, para decidir si un tiro cuenta solo importa en qué circunferencia centrada en el origen cayó. El radio de esa circunferencia es la distancia del tiro al origen. Para un tiro en $(x,y)$, el teorema de Pitágoras da

$$
r = \sqrt{(x-0)^2+(y-0)^2} = \sqrt{x^2+y^2}.
$$

Para decidir si un tiro cuenta, podemos quedarnos con su radio $r$. La consulta de pertenencia al aro en el plano, que tiene dos dimensiones, se convierte en verificar si un número está dentro de un intervalo en una dimensión. Basta comprobar si $R_1 \le r \le R_2$. El signo de la $x$ original determina el aporte del tiro.

Para pensar el problema, conviene mirar las distancias al origen como radios. La salida pide los radios al cuadrado, y calcular las raíces para obtener los radios puede requerir aproximaciones de punto flotante. Como $x$ e $y$ son enteros, sus cuadrados y la suma $x^2+y^2$ también son enteros. Elevar al cuadrado conserva el orden de las distancias no negativas, así que podemos usar solo enteros para agrupar y comparar.

$$
R_1 \le \sqrt{x^2+y^2} \le R_2
\quad\Longleftrightarrow\quad
R_1^2 \le x^2+y^2 \le R_2^2.
$$

Llamamos `distCuad` a $x^2+y^2$ y lo usamos como clave de un [[map|mapa]] `difs`. El aporte de un tiro es $+1$ si lo hizo el Oli y $-1$ si lo hizo el rival. Sumamos ese aporte al valor de su clave. El valor final de cada clave es el **aporte neto** de su circunferencia. Una distancia al cuadrado puede llegar a $8\cdot 10^{18}$. Python la representa exactamente con enteros y, en un lenguaje con enteros de tamaño fijo, las operaciones requieren al menos 64 bits con signo.

### Del mapa a un vector de aportes

Ordenamos las claves del mapa de menor a mayor en el [[array|vector]] `radiosCuad`. Ese orden importa porque, si el aro incluye dos radios, también incluye todos los que están entre ellos. Una vez ordenados, todos los grupos que entran al aro ocupan un bloque consecutivo.

Hay $M$ claves distintas entre $N$ tiros, con $1 \le M \le N$. El `dict` de Python implementa el mapa con una [[hash table|tabla hash]]. Agrupar cuesta $O(N)$ esperado y ordenar las claves cuesta $O(M\log M)$. Leer los valores en ese orden cuesta $O(M)$, con $O(M)$ de espacio auxiliar para el mapa y los vectores.

Al leer los valores del mapa según `radiosCuad` queda el vector `aportes` de aportes netos. Las claves se usan después para recuperar los bordes del aro. Para elegir el rango, alcanza con mirar `aportes`. ¿Qué bloque consecutivo tiene la mayor suma? Es el problema clásico de la **suma máxima de un subarreglo**, con la posibilidad de elegir el bloque vacío.

### Elegir y reconstruir el aro

Cualquier rango `[ini, fin]` del vector ordenado puede obtenerse eligiendo `radiosCuad[ini]` y `radiosCuad[fin]` como cuadrados de los bordes. Podemos ajustar el borde interior para que el radio sea lo más chico posible e incluya exactamente ese mismo bloque.

Si `ini = 0`, el menor cuadrado interior es `0`. Si `ini > 0`, el grupo de `radiosCuad[ini - 1]` tiene que quedar afuera y el de `radiosCuad[ini]` tiene que entrar. Como el borde cuenta, el cuadrado interior tiene que ser **estrictamente mayor** que la clave anterior. Debe quedar lo más cerca posible a su derecha. El primer entero que lo consigue es `radiosCuad[ini - 1] + 1`. Las claves son enteras y distintas, así que ese valor llega como máximo hasta `radiosCuad[ini]` y todavía incluye el primer grupo elegido.

En el ejemplo, la clave anterior es 5 y la primera del rango es 37. Con $R_1^2=5$ se incluiría el tiro de clave 5. Con $R_1^2=6$ se lo excluye y se incluye el de clave 37. Si la consigna admitiera valores reales, para cualquier cuadrado válido $5+\varepsilon$ se podría elegir $5+\varepsilon/2$ y acercarse más a 5. Un cálculo en punto flotante solo aproximaría la posición del borde. Con la salida entera, el mínimo queda determinado por el `+1`.

El menor cuadrado exterior es `radiosCuad[fin]`, porque el último grupo tiene que quedar incluido. Si el mejor puntaje es cero, ambas soluciones devuelven `0 0`.

### Desempate opcional

Entre los rangos de puntaje máximo positivo, elegimos el que tenga **el menor índice de inicio**. Si hay empate también en el inicio, elegimos el menor final. La consigna admite cualquier respuesta óptima.

## Soluciones disponibles

- [[lanzamiento-de-aceitunas-fuerza-bruta|Fuerza bruta con suma acumulada]]
- [[lanzamiento-de-aceitunas-greedy|Greedy con el algoritmo de Kadane]]

## Visualizaciones

- <a href="static/aceitunas-aro/#enunciado" data-router-ignore="true" data-no-popover="true">Explorar el aro y calcular su puntaje</a>
- <a href="static/aceitunas-reducciones/#enunciado" data-router-ignore="true" data-no-popover="true">Ver el agrupamiento y simular ambos algoritmos</a>
- <a href="static/aceitunas-comparacion/#enunciado" data-router-ignore="true" data-no-popover="true">Comparar Kadane y fuerza bruta en simultáneo</a>

## Probá tu solución en Codeforces

El problema está disponible en el juez Codeforces. Para enviar tu solución, seguí estos pasos.

1. Entrá al [grupo de Codeforces](https://codeforces.com/group/x4ir9VBYqC/contests) y unite al grupo.
2. Buscá el concurso **PruebaLanzamientoAceitunas** y hacé clic en **Enter**.
3. Abrí **Lanzamiento de Aceitunas LP**. Si ya estás en el grupo, podés usar el [enlace directo al problema](https://codeforces.com/group/x4ir9VBYqC/contest/735070/problem/A).
4. Hacé clic en **Submit code**, elegí el lenguaje y subí o pegá tu solución para que el juez la evalúe.

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018, nivel 3](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
