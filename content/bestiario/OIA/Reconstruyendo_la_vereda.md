## Nombre y enunciado

**Reconstruyendo la vereda (único tramo)**

Una ciudad tiene veredas armadas con baldosas de tres colores: blanco (`B`), gris (`G`) y negro (`N`). Por diseño, **no hay dos baldosas contiguas del mismo color**. Para tender cables se removieron algunas baldosas y se las amontonó por color, sin registrar de dónde salieron. Hay que volver a colocarlas **todas** de modo que la vereda siga cumpliendo la regla.

**Modificación:** Se garantiza que todas las baldosas perdidas son consecutivas, es decir, forman un único tramo de la vereda.
## Intuición

A primera vista parece un problema de acomodar letras como se pueda, pero hay dos fuentes de dificultad:

- Hay que usar **exactamente** la cantidad pedida de cada color, no alcanza con que no haya colores repetidos.
- El tramo vacío tiene vecinos a izquierda y derecha, así que las decisiones tomadas al principio del tramo pueden dejarnos sin opciones al final.

Además, la vereda puede tener hasta 2.000.000 de baldosas, por lo que explorar todas las combinaciones solo es viable para tramos muy chicos. Eso lo vuelve un buen problema para comparar fuerza bruta contra una estrategia más inteligente.

## Definición formal

**Entrada**

- Tres enteros `B`, `G`, `N` ≥ 0: cantidad de baldosas blancas, grises y negras removidas.
- Una cadena `baldosas` de largo `n ≤ 2.000.000` sobre el alfabeto `{B, G, N, R}`, donde `R` marca un hueco.

**Restricciones**

- Las `R` forman un único bloque contiguo y su cantidad es exactamente `B + G + N`.
- Las baldosas que no son `R` no tienen dos contiguas iguales.
- Se asume que existe al menos una solución.

**Salida**

Una cadena de largo `n` que se obtiene reemplazando cada `R` por una letra de `{B, G, N}` tal que:

1. se usan exactamente `B` letras `B`, `G` letras `G` y `N` letras `N`.
2. en la cadena resultante no hay dos letras contiguas iguales.

Puede haber varias salidas válidas, se acepta cualquiera.

## Ejemplo concreto

```
2 2 2
BGRRRRRRBNGB
```

El hueco tiene largo 6 (= 2 + 2 + 2), con vecino izquierdo `G` y vecino derecho `B`. Se buscan cadenas de 6 letras con dos `B`, dos `G` y dos `N` que no repitan letras contiguas, y que además no empiecen con `G` ni terminen con `B`.

Por ejemplo `BGBNGN` sirve:

```
BG BGBNGN BNGB   →   BGBGBNGNBNGB
```

Se puede chequear a mano: ninguna pareja contigua es igual, `G|B` y `N|B` en los bordes son válidos, y se usaron 2 `B`, 2 `G`, 2 `N`. En total existen **14** salidas válidas para esta entrada.

## Por dónde empezar

1. Ubicar el bloque de `R` (primera y última posición) y anotar los vecinos izquierdo y derecho, si existen.
2. Notar que el problema se reduce a **construir una cadena de largo `k = B+G+N`** con conteos fijos, sin repetidos contiguos y con restricciones en ambos extremos.
3. Pensar primero en la solución más directa: generar todas las cadenas posibles y filtrar.
4. Preguntarse luego: ¿qué color conviene colocar en cada paso para no quedar atrapado? ¿Cuándo un color "sobra" tanto que ya no se puede intercalar?

## Soluciones disponibles

- [Solución por fuerza bruta](./soluciones/Reconstruyendo_la_vereda-fuerza-bruta.md)
- [Solución con backtracking](./soluciones/Reconstruyendo_la_vereda-backtracking.md)
- [Solución greedy](./soluciones/Reconstruyendo_la_vereda-greedy.md)
