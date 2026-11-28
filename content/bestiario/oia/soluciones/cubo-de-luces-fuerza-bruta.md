---
title: 'Cubo de Luces - Fuerza Bruta'
tags:
  - cubo-de-luces
  - solucion
---

## Técnicas utilizadas

Búsqueda por fuerza bruta: para cada fila y cada columna (índices de 0 a n-1) se decide si se pulsa o no su botón, probando todas las combinaciones posibles de pulsaciones.

## Idea de la solución

En el [[cubo-de-luces|Cubo de Luces]], cada luz depende solo de cuántas veces se presionaron su botón de fila y su botón de columna, así que el orden de las pulsaciones no afecta el resultado. Además, presionar dos veces el mismo botón deja todo como estaba. Por lo tanto, cualquier secuencia de pulsaciones equivale a otra en la que cada botón se presiona a lo sumo una vez, y esta usa igual o menos pulsaciones. Alcanza entonces con decidir, para cada botón, si se presiona (1) o no (0).

Llamamos $f[i]$ a la decisión sobre la fila i y $c[j]$ a la decisión sobre la columna j, con $0 \le i, j \le n-1$. Como hay $n$ botones de fila y $n$ de columna, existen $2^{2n}$ combinaciones. Cada combinación es un par de [[array|arreglos]] de $n$ ceros y unos: $f$ para las filas y $c$ para las columnas. Por ejemplo, con $n = 4$, $f = [0, 1, 1, 0]$ significa que se pulsan las filas 1 y 2.

Para cada combinación simulamos las pulsaciones sobre una copia del tablero (matriz_temporal), así el tablero original queda intacto para la combinación siguiente:

1. Copiamos el tablero.
2. Por cada fila con $f[i] = 1$, invertimos todas sus luces.
3. Por cada columna con $c[j] = 1$, invertimos todas sus luces.
4. Revisamos la copia: si alguna luz quedó apagada, descartamos la combinación.

Si todas quedan encendidas, la cantidad de pulsaciones es la cantidad de unos entre $f$ y $c$, y actualizamos el mínimo con ese valor. Si ninguna combinación funciona, devolvemos -1.

## Código

```python
from itertools import product

def minimo_pulsaciones_botones(n, matriz):
    minimo_pulsaciones = float('inf')

    # product([0, 1], repeat=n) genera todas las listas de n ceros y unos (2^n en total)
    for f in product([0, 1], repeat=n):          # decisiones para las filas
        for c in product([0, 1], repeat=n):      # decisiones para las columnas
            # Crear una copia de la matriz para simular las pulsaciones
            matriz_temporal = [fila[:] for fila in matriz]

            # Aplicar las pulsaciones de las filas
            for i in range(n):
                if f[i] == 1:
                    for j in range(n):
                        matriz_temporal[i][j] ^= 1  # Cambiar el estado de la luz

            # Aplicar las pulsaciones de las columnas
            for j in range(n):
                if c[j] == 1:
                    for i in range(n):
                        matriz_temporal[i][j] ^= 1  # Cambiar el estado de la luz

            # Verificar si todas las luces quedan encendidas
            if all(matriz_temporal[i][j] == 1 for i in range(n) for j in range(n)):
                total_pulsaciones = sum(f) + sum(c)
                minimo_pulsaciones = min(minimo_pulsaciones, total_pulsaciones)

    return minimo_pulsaciones if minimo_pulsaciones != float('inf') else -1
```

## Traza de ejemplo

Para la siguiente matriz inicial:

```
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
```

Con $n = 4$ hay $2^8 = 256$ candidatos. Solo dos encienden todas las luces, y ambos usan 4 pulsaciones. En la tabla, cada cadena muestra las decisiones de las posiciones 0 a 3 (por ejemplo, filas 0110 significa que se pulsan las filas 1 y 2):

| Filas pulsadas | Columnas pulsadas | Pulsaciones totales | Resultado |
|---|---|---:|---|
| 0110 | 1001 | 4 | Todas las luces quedan encendidas |
| 1001 | 0110 | 4 | Todas las luces quedan encendidas |

**Primera solución.** Primero se pulsan las filas 1 y 2:

```
0 1 1 0
0 1 1 0
0 1 1 0
0 1 1 0
```

Luego se pulsan las columnas 0 y 3:

```
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
```

Es la primera combinación válida que encuentra el algoritmo, así que el mínimo pasa de $\infty$ a 4.

**Segunda solución.** Primero se pulsan las filas 0 y 3:

```
1 0 0 1
1 0 0 1
1 0 0 1
1 0 0 1
```

Luego se pulsan las columnas 1 y 2:

```
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
```

También usa 4 pulsaciones, así que no mejora el mínimo y este se mantiene.

Ningún otro candidato enciende todas las luces. Después de evaluar los 256, el algoritmo devuelve 4, que coincide con la salida del ejemplo.

## Complejidad

### Temporal
$O(2^{2n} \cdot n^2)$

Hay $2^n$ combinaciones de filas y $2^n$ de columnas, así que se evalúan $2^n \cdot 2^n = 2^{2n}$ candidatos. Para cada candidato:

- Generar $f$ y $c$ cuesta $O(n)$.
- Copiar el tablero cuesta $O(n^2)$.
- Aplicar las pulsaciones cuesta $O(n^2)$: cada fila o columna pulsada invierte $n$ luces, y hay a lo sumo $2n$ pulsaciones.
- Revisar que las $n^2$ luces estén encendidas cuesta $O(n^2)$.
- Contar las pulsaciones cuesta $O(n)$.

El costo por candidato es $O(n^2)$, y en total queda $O(2^{2n} \cdot n^2)$. Descartar un candidato en cuanto aparece una luz apagada puede acelerar el caso promedio, pero no mejora el peor caso: un candidato puede fallar recién en la última luz, y si no hay solución se revisan todos.


### Espacial
$O(n^2)$

- El tablero de entrada ocupa $O(n^2)$.
- La copia matriz_temporal ocupa $O(n^2)$, y se crea una nueva en cada candidato (la anterior se descarta, así que nunca hay más de una a la vez).
- Las tuplas $f$ y $c$ ocupan $O(n)$.
- El mínimo ocupa $O(1)$.

El espacio adicional es $O(n^2)$ por la copia del tablero, y el total también es $O(n^2)$.

## Cuándo usar esta técnica

### Contexto favorable

- **Cuando $n$ es chico.** Por ejemplo, con $n = 4$, como en el ejemplo, hay $256$ combinaciones (ya que es $2^{8}$) y cada una revisa 16 luces, lo que da unas $4.096$ operaciones.
- **Cuando se busca la solución más simple de escribir y de probar.** No hay que decidir un orden de los botones ni diseñar podas. Se generan todas las combinaciones y cada una se simula sobre una copia del tablero, tal como lo haría una persona a mano.
- **Para verificar otra solución.** Como revisa todas las combinaciones, sirve como referencia: se generan tableros aleatorios chicos y se comparan sus respuestas.

### Limitaciones

- **El tiempo crece exponencialmente.** Cada vez que $n$ aumenta en 1, la cantidad de candidatos se multiplica por 4, debido a que $2^{2n}=(2^{2})^{n}=4^{n}$. Con $n = 12$ ya son unos $2.415.919.104$ pasos, y con la cota del enunciado, $n\le 1000$, el problema resulta intratable.
- **No aprovecha información parcial.** Aunque las primeras decisiones ya dejen una luz apagada sin arreglo posible, la fuerza bruta igual completa y revisa todas las combinaciones que empiezan así. En el ejemplo, de 256 candidatos solo 2 son solución.

### Comparación con backtracking

Las dos técnicas recorren el mismo espacio de decisiones: cada botón se presiona o no. La diferencia es cuándo verifican. La fuerza bruta arma la combinación completa y recién después la revisa. El backtracking decide los botones de a uno y verifica sobre la marcha. En cuanto una luz con su fila y su columna ya decididas queda apagada, descarta toda la rama sin completarla.

| | Fuerza bruta | Backtracking |
|---|---|---|
| Cuándo verifica | Al final, con la combinación completa | Durante la construcción, en cada decisión |
| Candidatos explorados | Siempre $2^{2n}$ | A lo sumo 2 ramas completas |
| Tiempo | $O(2^{2n} \cdot n^2)$ | $O(n^2)$ con el orden elegido (primero $f[0]$, después las columnas y por último las filas) |
| Espacio adicional | $O(n^2)$ por la copia del tablero | $O(n)$ para el arreglo de decisiones y la [[stack|pila]] de recursión |
| Dificultad de implementación | Baja | Media: hay que elegir el orden de los botones y la poda |
| Sirve para $n \le 1000$ | No | Sí |

En resumen, la fuerza bruta conviene para $n$ chico o como referencia para verificar. El backtracking, con el orden de decisión elegido, resuelve el problema completo hasta $n = 1000$, porque descarta de inmediato las opciones que dejan una luz apagada. Los detalles están en [[cubo-de-luces-backtracking|la solución por backtracking]].

## Referencias
- [Problema original (OIA)](https://www.oia.unsam.edu.ar/wp-content/uploads/2021/03/cubo.pdf)
