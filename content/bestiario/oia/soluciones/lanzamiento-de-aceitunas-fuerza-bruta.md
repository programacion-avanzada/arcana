---
title: Lanzamiento de aceitunas - Fuerza bruta
tags:
  - oia
  - solucion
---

[[lanzamiento-de-aceitunas|Volver al enunciado]]

## Técnicas utilizadas

Usamos **fuerza bruta** para evaluar cada intervalo de distancias y **sumas de prefijos** para calcular su puntaje en tiempo constante.

## Idea de la solución

Partimos de los [[array|vectores]] `distancias2` y `pesos` obtenidos con el agrupamiento del enunciado. Construimos otro vector $P$, con $P[0]=0$ y $P[k+1]=P[k]+\text{pesos}[k]$. Al restar dos prefijos se cancelan todos los aportes anteriores al inicio $i$, de modo que el puntaje de $[i,j]$ es $P[j+1]-P[i]$.

La clase `SumaPrefijos` encapsula ese cálculo. `iniciar(vector)` construye los prefijos una vez a partir de los pesos y `consultar(L, R)` devuelve la suma del intervalo inclusivo $[L,R]$, con índices desde cero.

Recorremos cada final $j$ y, para ese final, todos los inicios $i$ entre $0$ y $j$. Todo aro que capture tiros corresponde a uno de esos bloques y cada bloque puede materializarse en un aro, de modo que basta con comparar sus puntajes y el cero de `0 0`. Como ambos bucles avanzan en orden creciente y solo se cambia la respuesta ante una mejora estricta, en un empate positivo queda el primer final y, para ese final, el primer inicio. Con esos índices reconstruimos el par de cuadrados según el criterio del enunciado.

## Código

```python
class SumaPrefijos:
    def iniciar(self, vector):
        self.prefijos = [0]
        for valor in vector:
            self.prefijos.append(self.prefijos[-1] + valor)

    def consultar(self, L, R):
        return self.prefijos[R + 1] - self.prefijos[L]


def mejor_aro_fuerza_bruta(distancias2, pesos):
    sumas = SumaPrefijos()
    sumas.iniciar(pesos)

    mejor_puntaje = 0
    respuesta = (0, 0)
    for fin, exterior2 in enumerate(distancias2):
        for inicio in range(fin + 1):
            puntaje = sumas.consultar(inicio, fin)
            if puntaje > mejor_puntaje:
                mejor_puntaje = puntaje
                interior2 = 0 if inicio == 0 else distancias2[inicio - 1] + 1
                respuesta = (interior2, exterior2)
    return respuesta
```

Con `tiros` leído de la entrada, `print(*mejor_aro_fuerza_bruta(*agrupar_tiros(tiros)))` imprime los dos cuadrados separados por un espacio.

## Traza de ejemplo

Para los ocho grupos del enunciado, `pesos = [-1, 1, 0, 1, -1, -1, 2, -1]` y `prefijos = [0, -1, 0, 0, 1, 0, -1, 1, 0]`. Cada fila muestra todos los puntajes que se consultan para el final dado.

| Final $j$ | Puntajes de $[i,j]$ con $i=0,\ldots,j$ | Mejor puntaje acumulado | Mejor intervalo |
| --------: | -------------------------------------- | ----------------------: | --------------- |
|         0 | `-1`                                   |                       0 | Vacío           |
|         1 | `0, 1`                                 |                       1 | `[1, 1]`        |
|         2 | `0, 1, 0`                              |                       1 | `[1, 1]`        |
|         3 | `1, 2, 1, 1`                           |                       2 | `[1, 3]`        |
|         4 | `0, 1, 0, 0, -1`                       |                       2 | `[1, 3]`        |
|         5 | `-1, 0, -1, -1, -2, -1`                |                       2 | `[1, 3]`        |
|         6 | `1, 2, 1, 1, 0, 1, 2`                  |                       2 | `[1, 3]`        |
|         7 | `0, 1, 0, 0, -1, 0, 1, -1`             |                       2 | `[1, 3]`        |

Por ejemplo, $[1,3]$ se evalúa como $P[4]-P[1]=1-(-1)=2$. Para reconstruirlo usamos `distancias2[0] + 1 = 6` y `distancias2[3] = 90`. La salida es `6 90`.

## Complejidad

**Temporal.** Para $M$ distancias distintas, construir los prefijos cuesta $O(M)$. Se evalúan $M(M+1)/2$ intervalos a costo $O(1)$ cada uno, por lo que la búsqueda cuesta $O(M^2)$. Con el agrupamiento y el ordenamiento, el tiempo total esperado es $O(N+M\log M+M^2)=O(N+M^2)$, que puede ser cuadrático en $N$.

**Espacial.** El agrupamiento y los vectores usan $O(M)$ espacio auxiliar. Los prefijos agregan otros $M+1$ valores, de modo que el total sigue siendo $O(M)$ si los tiros se leen de a uno.

## Cuándo usar esta técnica

La enumeración permite inspeccionar todos los candidatos y sirve para validar otra implementación con instancias chicas. También resulta viable con muchos tiros si caen en pocas circunferencias. Cuando cada tiro tiene una distancia distinta, $100\,000$ grupos generan más de cinco mil millones de intervalos. [[lanzamiento-de-aceitunas-greedy|Kadane]] evita esa enumeración y resuelve la búsqueda con una sola pasada y espacio constante adicional.

## Referencias

- [Lanzamiento de aceitunas, Jurisdiccional OIA 2018](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/olivares2.pdf)
- Steven Halim, Felix Halim y Suhendry Effendy. _Competitive Programming 4_, libro 1, sección 3.5.2, «Max 1D Range Sum». [Sitio del libro](https://cpbook.net/)
