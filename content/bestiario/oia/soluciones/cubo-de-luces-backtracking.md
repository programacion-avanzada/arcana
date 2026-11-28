---
title: 'Cubo de Luces - Backtracking'
tags:
  - cubo-de-luces
  - solucion
---

## Técnicas utilizadas

Backtracking: se decide de a un botón por vez si se pulsa o no, y cada rama se descarta en cuanto deja una luz apagada que ya no se puede arreglar (poda por factibilidad). No se poda por cota (ver la comparación con branch and bound).

## Idea de la solución

Como en [[cubo-de-luces-fuerza-bruta|la solución por fuerza bruta]] del [[cubo-de-luces|Cubo de Luces]], alcanza con decidir para cada botón si se pulsa (1) o no (0). Llamamos $f[i]$ a la decisión sobre la fila i y $c[j]$ a la decisión sobre la columna j.

La clave es que la luz $(i, j)$ termina encendida si y solo si $matriz[i][j] \oplus f[i] \oplus c[j] = 1$. Entonces, **apenas se deciden $f[i]$ y $c[j]$ ya sabemos cómo queda la luz $(i, j)$**. Si queda apagada, ninguna decisión posterior la arregla y la rama se descarta.

![](/attachments/bestiario/oia/cubo-de-luces-pulsaciones.svg)

### Operaciones del esquema

- **Solución:** los $2n$ botones están decididos.
- **Extender:** el próximo botón, en un orden fijo, se pulsa (1) o no (0).
- **Factible:** las luces que quedan decididas con esa elección terminan encendidas.
- **Registrar:** agregar la decisión al final del [[array|arreglo]] decisiones.
- **Borrar:** sacar la última decisión.

A diferencia del esquema general, al encontrar una solución no se corta la búsqueda. El problema pide la mínima cantidad de pulsaciones, así que se recorren todas las ramas factibles y se guarda la mejor. Si ninguna llega a ser solución, se devuelve -1.

### Orden de decisión

1. **Primero $f[0]$.** No hay ninguna luz decidida, así que las dos opciones son factibles.
2. **Después $c[0], \dots, c[n-1]$.** Al decidir $c[j]$ queda decidida la luz $(0, j)$, así que solo una opción es factible.
3. **Por último $f[1], \dots, f[n-1]$.** Al decidir $f[i]$ queda decidida la fila i entera, y a lo sumo una opción es factible.

Una vez elegido $f[0]$ todo queda forzado: el árbol tiene a lo sumo 2 ramas completas, en lugar de las $2^{2n}$ combinaciones de la fuerza bruta.

Como el orden es fijo, decisiones guarda los botones en ese orden: decisiones[0] es $f[0]$, decisiones[1 + j] es $c[j]$ y decisiones[n + i] es $f[i]$. Su largo indica qué botón toca decidir.

## Código

```python
import sys

def minimo_pulsaciones_botones(n, matriz):
    sys.setrecursionlimit(10_000)         # la recursión llega a 2n niveles (hasta 2000)
    mejor = float('inf')

    def es_factible(decisiones, x):
        paso = len(decisiones)
        if paso == 0:                     # fila 0: todavía no hay luces decididas
            return True
        if paso <= n:                     # columna j: queda decidida la luz (0, j)
            j = paso - 1
            return matriz[0][j] ^ decisiones[0] ^ x == 1
        i = paso - n                      # fila i: queda decidida la fila entera
        return all(matriz[i][j] ^ x ^ decisiones[1 + j] == 1 for j in range(n))

    def backtracking(decisiones):
        nonlocal mejor
        if len(decisiones) == 2 * n:      # es solución: todos los botones decididos
            mejor = min(mejor, sum(decisiones))
            return
        for x in (0, 1):                  # extender: pulsar o no el próximo botón
            if es_factible(decisiones, x):
                decisiones.append(x)      # registrar
                backtracking(decisiones)
                decisiones.pop()          # borrar

    backtracking([])
    return mejor if mejor != float('inf') else -1
```

## Traza de ejemplo

### Caso del ejemplo

Matriz inicial de $4 \times 4$, la del [[cubo-de-luces|ejemplo concreto]]:

```
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
```

**Rama $f[0] = 0$.** No se pulsa la fila 0. Las luces $(0, 0)$ y $(0, 3)$ están apagadas, así que solo son factibles $c[0] = 1$ y $c[3] = 1$. Las luces $(0, 1)$ y $(0, 2)$ están encendidas, así que solo son factibles $c[1] = 0$ y $c[2] = 0$. Se pulsan las columnas 0 y 3:

```
1 1 1 1
0 0 0 0
0 0 0 0
1 1 1 1
```

Las filas 1 y 2 están todas apagadas: solo sirven $f[1] = 1$ y $f[2] = 1$. Se pulsan:

```
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
```

La fila 3 ya está encendida: solo sirve $f[3] = 0$. Es solución con 4 pulsaciones (columnas 0 y 3, filas 1 y 2) y el mínimo pasa de $\infty$ a 4. Se borran las decisiones y se vuelve atrás hasta $f[0]$.

**Rama $f[0] = 1$.** Se pulsa la fila 0:

```
1 0 0 1
1 0 0 1
1 0 0 1
0 1 1 0
```

Ahora la fila 0 fuerza $c = [0, 1, 1, 0]$. Se pulsan las columnas 1 y 2:

```
1 1 1 1
1 1 1 1
1 1 1 1
0 0 0 0
```

Las filas 1 y 2 fuerzan $f[1] = 0$ y $f[2] = 0$, y la fila 3 fuerza $f[3] = 1$. Se pulsa la fila 3:

```
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
```

Es solución con 4 pulsaciones (filas 0 y 3, columnas 1 y 2), que no mejora el mínimo. El algoritmo devuelve 4 tras 17 llamadas, contra los $2^8 = 256$ candidatos de la fuerza bruta.

### Caso sin solución

Matriz inicial de $2 \times 2$:

```
0 1
1 1
```

**Rama $f[0] = 0$.** La fila 0 fuerza $c = [1, 0]$. Se pulsa la columna 0:

```
1 1
0 1
```

La fila 1 queda `0 1`: pulsándola queda `1 0` y sin pulsarla queda `0 1`. Ninguna opción es factible y se vuelve atrás.

**Rama $f[0] = 1$.** Se pulsa la fila 0 y luego la fila 0 fuerza $c = [0, 1]$:

```
1 1
1 0
```

La fila 1 queda `1 0`: otra vez ninguna opción es factible.

Ninguna rama llega a ser solución y el algoritmo devuelve -1. Cada botón invierte 0 o 2 de estas cuatro luces, así que la paridad de las encendidas nunca cambia y no pueden quedar las cuatro encendidas.

## Complejidad

### Temporal
$O(n^2)$

En el peor caso, un backtracking tiene la misma complejidad que la fuerza bruta, $O(2^{2n} \cdot n^2)$, porque si las podas no actúan recorre todas las combinaciones. Acá pasaría con un orden desfavorable, por ejemplo decidir todas las filas antes que cualquier columna.

Con el orden elegido, ese peor caso no ocurre. Después de $f[0]$, cada botón tiene a lo sumo una opción factible, incluso cuando no hay solución. El árbol tiene entonces a lo sumo 2 ramas de $2n$ niveles:

- Cada columna revisa una luz, $O(1)$, y en total suman $O(n)$.
- Cada fila revisa $n$ luces, $O(n)$, y en total suman $O(n^2)$.

El total es $O(n^2)$, que no se puede mejorar porque hay que mirar las $n^2$ luces al menos una vez.

### Espacial
$O(n^2)$

El tablero ocupa $O(n^2)$. El arreglo decisiones y la [[stack|pila]] de recursión, de profundidad $2n$, ocupan $O(n)$. No se copia el tablero.

## Cuándo usar esta técnica

### Contexto favorable

- Cuando las restricciones se pueden verificar con la solución a medio armar.
- Cuando existe un orden de decisión que hace actuar las podas desde el principio.
- Para $n$ grande: resuelve hasta $n = 1000$.

### Limitaciones

- **Depende del orden.** Con otro orden, el mismo algoritmo vuelve a ser exponencial.
- **Es más difícil de verificar.** Un error en las podas puede descartar soluciones válidas sin que se note.
### Comparación con fuerza bruta

| | Fuerza bruta | Backtracking |
|---|---|---|
| Cuándo verifica | Al final, con la combinación completa | En cada decisión |
| Candidatos explorados | Siempre $2^{2n}$ | A lo sumo 2 ramas completas |
| Tiempo | $O(2^{2n} \cdot n^2)$ | $O(n^2)$ con el orden elegido |
| Espacio adicional | $O(n^2)$ por la copia del tablero | $O(n)$ |
| Sirve para $n \le 1000$ | No | Sí |

La fuerza bruta es más simple y sirve como referencia en tableros chicos; el backtracking resuelve el problema completo.

### Comparación con branch and bound

Branch and bound agrega una poda por cota: en cada nodo estima la menor cantidad de pulsaciones que podría alcanzar la rama y la descarta si no puede mejorar el mínimo conocido. En este problema no conviene:

- **Una cota útil es cara.** Estimar cuántas pulsaciones faltan requiere mirar los botones no decididos y sus luces, $O(n)$ o más por nodo. Con unos $4n$ nodos, solo las cotas ya cuestan $O(n^2)$, y con una cota más precisa el total sube a $O(n^3)$.
- **No hay ramas que cortar.** La poda por factibilidad ya deja a lo sumo 2 ramas. La primera no se puede podar porque todavía no hay un mínimo, así que la cota solo podría cortar parte de la segunda, sin cambiar el $O(n^2)$.

Branch and bound conviene cuando hay muchas soluciones válidas y una buena cota descarta la mayoría. Acá la poda por factibilidad ya hace ese trabajo.

## Referencias
- [Problema original (OIA)](https://www.oia.unsam.edu.ar/wp-content/uploads/2021/03/cubo.pdf)
