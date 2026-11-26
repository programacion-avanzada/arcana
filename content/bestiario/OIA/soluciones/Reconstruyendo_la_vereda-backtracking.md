# Reconstruyendo la vereda - Backtracking

<- Volver a la [descripción del problema](../Reconstruyendo_la_vereda.md)

## Técnicas utilizadas

**Backtracking:** construir la solución de a una decisión por vez y, apenas una decisión parcial viola una restricción, abandonarla y volver a probar otra, en lugar de completar un candidato entero para recién ahí descartarlo.

## Idea de la solución

Se rellena el hueco de izquierda a derecha. En cada posición se prueba cada color (`B`, `G`, `N`) y se **poda** apenas se cumple alguna de estas condiciones:

- el color es igual a la baldosa anterior (vecino izquierdo o última colocada).
- ya no quedan baldosas de ese color.

Si al llegar al final del hueco la última baldosa coincide con el vecino derecho, ese camino también falla y se vuelve atrás. Si en alguna posición ningún color es posible, se deshace la última decisión y se prueba la siguiente opción.

La diferencia con la [fuerza bruta](Reconstruyendo_la_vereda-fuerza-bruta.md) es que nunca se generan cadenas completas que ya tenían un error en el prefijo.

![Ejemplo](../../attachments/reconstruyendo-vereda-backtracking.svg)

## Código

```python
def vereda(B, G, N, baldosas):
    i = baldosas.find('R')
    j = baldosas.rfind('R') + 1
    izq = baldosas[i - 1] if i > 0 else ''
    der = baldosas[j] if j < len(baldosas) else ''
    resto, relleno = {'B': B, 'G': G, 'N': N}, []

    def colocar(previo):
        if len(relleno) == j - i:
            return previo != der          # chequeo contra el vecino derecho
        for c in "BGN":
            if resto[c] == 0 or c == previo:
                continue                  # poda
            resto[c] -= 1; relleno.append(c)
            if colocar(c):
                return True
            relleno.pop(); resto[c] += 1  # vuelta atrás
        return False

    colocar(izq)
    return baldosas[:i] + ''.join(relleno) + baldosas[j:]
```

## Traza de ejemplo

Entrada: `2 2 2` y `BGRRRRRRBNGB`. Hueco de largo 6, vecino izquierdo `G`, vecino derecho `B`.

| Paso | Relleno parcial | Restantes (B,G,N) | Qué pasa |
|------|-----------------|-------------------|----------|
| 1 | `B` | 1,2,2 | `B` ≠ `G`: se acepta |
| 2 | `BG` | 1,1,2 | `G` ≠ `B`: se acepta |
| 3 | `BGB` | 0,1,2 | se acepta |
| 4 | `BGBG` | 0,0,2 | se acepta |
| 5 | `BGBGN` | 0,0,1 | se acepta |
| 6 | — | 0,0,1 | solo queda `N`, igual al anterior: **sin opciones, se vuelve atrás** |
| 7 | `BGBN` | 0,1,1 | se deshacen `N` y `G`, se prueba `N` en la posición 4 |
| 8 | `BGBNG` | 0,0,1 | se acepta |
| 9 | `BGBNGN` | 0,0,0 | hueco completo; `N` ≠ vecino derecho `B`: **éxito** |

Resultado: `BG` + `BGBNGN` + `BNGB` = `BGBGBNGNBNGB`. Hubo un único callejón sin salida (`BGBGN`). En contraste, la fuerza bruta revisó cientos de cadenas completas.

## Complejidad

- **Tiempo:** `O(2^k)` en el peor caso, ya que en cada posición hay a lo sumo 2 colores distintos del anterior, así que el árbol de búsqueda tiene a lo sumo `2^k` hojas, con trabajo constante por nodo. Es una cota superior, con la poda se suele explorar mucho menos. Sigue siendo exponencial, porque no se garantiza evitar los callejones sin salida.
- **Espacio:** `O(k)` por la profundidad de la recursión y la lista `relleno`. Con `k` grande, además, la recursión de Python excede su límite por defecto (1000), así que no es apta para las entradas más grandes.

## Cuándo usar esta técnica

- **Favorable:** cuando hay restricciones locales que permiten descartar prefijos temprano, y como solución general y segura si no se encuentra una regla greedy. Es fácil de adaptar si cambian las restricciones.
- **Limitaciones:** peor caso exponencial y recursión profunda, no escala a 2.000.000 de baldosas.
- **Comparación:** supera a la [fuerza bruta](Reconstruyendo_la_vereda-fuerza-bruta.md) porque poda prefijos inválidos en vez de enumerar todo (`O(2^k)` frente a `O(k · 3^k)`). Pierde frente al [greedy](Reconstruyendo_la_vereda-greedy.md), que resuelve en `O(n)` sin explorar alternativas, aunque el backtracking aporta una corrección más fácil de justificar.
