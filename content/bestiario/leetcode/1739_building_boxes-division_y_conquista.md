---
title: "Building Boxes - División y conquista"
tags: ['b/leetcode']
problema: "LeetCode 1739 - Building Boxes"
tecnica: "División y conquista / Búsqueda binaria"
---

## Técnicas utilizadas

**División y conquista.** La estrategia consiste en buscar la respuesta mínima dividiendo el
espacio de soluciones. En vez de construir directamente una distribución de cajas, hacemos una
pregunta de factibilidad:

> Si uso `m` cajas apoyadas en el piso, ¿cuál es la máxima cantidad total de cajas que puedo
> construir?

Si con `m` cajas de piso puedo construir al menos `n` cajas en total, entonces `m` es una
respuesta posible. Si no alcanza, necesito más cajas en el piso. Como esta condición es
monótona, podemos usar **búsqueda binaria**.

## Idea de la solución

### Qué estamos buscando

El problema pide la **mínima cantidad de cajas que deben tocar el piso** para poder acomodar
`n` cajas respetando la regla de soporte: una caja solo puede ir encima de otra si esa caja de abajo
tiene sus cuatro caras verticales adyacentes a otra caja o a una pared.

En lugar de decidir caja por caja dónde ponerlas, vamos a buscar la respuesta `m`:

$$
\text{respuesta} = \min m \quad \text{tal que con } m \text{ cajas de piso puedo guardar al menos } n \text{ cajas.}
$$

### Función de factibilidad

Para aplicar búsqueda binaria necesitamos una función:

```python
puede(m, n)
```

que responda si con `m` cajas en el piso alcanza para construir `n` cajas en total.

La clave es calcular:

$$
\text{maxCajas}(m) = \text{máxima cantidad total de cajas que se puede construir usando } m
\text{ cajas en el piso.}
$$

Si:

$$
\text{maxCajas}(m) \ge n
$$

entonces `m` alcanza.

Si:

$$
\text{maxCajas}(m) < n
$$

entonces `m` no alcanza.

### Cómo calcular `maxCajas(m)`

La mejor forma de usar cajas en el piso es formar capas completas lo más grandes posible.
Cada capa completa de tamaño `k` necesita en el piso un número triangular:

$$
T(k) = 1 + 2 + \cdots + k = \frac{k(k+1)}{2}
$$

Y una pirámide completa de tamaño `k` contiene un número tetraédrico de cajas:

$$
\operatorname{Tet}(k) = 1 + T(2) + \cdots + T(k)
= \frac{k(k+1)(k+2)}{6}
$$

Entonces, para un `m` dado, buscamos la pirámide completa más grande que pueda apoyarse en
el piso usando como máximo `m` cajas de piso.

Es decir, buscamos el mayor `k` tal que:

$$
T(k) \le m
$$

Después de construir esa pirámide, pueden sobrar cajas de piso:

$$
\text{restoPiso} = m - T(k)
$$

Esas cajas extra se pueden colocar en una nueva diagonal. Si sobran `r` cajas de piso, agregan:

$$
1 + 2 + \cdots + r = T(r)
$$

cajas adicionales como máximo.

Por lo tanto:

$$
\text{maxCajas}(m) = \operatorname{Tet}(k) + T(r)
$$

con:

$$
T(k) \le m < T(k+1)
$$

y:

$$
r = m - T(k)
$$

### Por qué sirve búsqueda binaria

La función es monótona:

- Si con `m` cajas de piso alcanza, entonces con `m + 1`, `m + 2`, etc. también alcanza.
- Si con `m` cajas de piso no alcanza, entonces con menos de `m` tampoco alcanza.

Eso nos permite buscar la mínima respuesta dividiendo el rango en mitades:

1. Tomamos un valor medio `mid`.
2. Calculamos si `mid` alcanza.
3. Si alcanza, intentamos buscar una respuesta más chica en la mitad izquierda.
4. Si no alcanza, buscamos en la mitad derecha.

![Division y Conquista](dyc_busqueda_binaria.svg)

## Código

```python
import math

class Solution:
    def minimumBoxes(self, n: int) -> int:
        def triangular(k: int) -> int:
            return k * (k + 1) // 2

        def tetra(k: int) -> int:
            return k * (k + 1) * (k + 2) // 6

        def max_cajas_con_piso(m: int) -> int:
            # Buscamos el mayor k tal que triangular(k) <= m.
            # Esta búsqueda interna también es por división y conquista.
            izquierda = 0
            derecha = m

            while izquierda <= derecha:
                medio = (izquierda + derecha) // 2

                if triangular(medio) <= m:
                    k = medio
                    izquierda = medio + 1
                else:
                    derecha = medio - 1

            cajas_piso_piramide = triangular(k)
            cajas_piso_extra = m - cajas_piso_piramide

            return tetra(k) + triangular(cajas_piso_extra)

        izquierda = 1
        derecha = n
        respuesta = n

        while izquierda <= derecha:
            medio = (izquierda + derecha) // 2

            if max_cajas_con_piso(medio) >= n:
                respuesta = medio
                derecha = medio - 1
            else:
                izquierda = medio + 1

        return respuesta
```

## Traza de ejemplo

Instancia `n = 13`:

| Paso | Cálculo | Resultado |
|------|---------|-----------|
| Rango inicial | `izquierda = 1`, `derecha = 13` | buscamos entre 1 y 13 |
| Medio | `mid = 7` | probamos con 7 cajas de piso |
| Mayor pirámide completa | `T(3)=6 <= 7`, `T(4)=10 > 7` | `k = 3` |
| Cajas de la pirámide | `Tet(3)=10` | 10 cajas |
| Piso extra | `7 - T(3) = 7 - 6` | 1 caja extra de piso |
| Cajas extra | `T(1)=1` | 1 caja |
| Total posible | `10 + 1` | 11 cajas, no alcanza |
| Nuevo rango | como 7 no alcanza | buscamos de 8 a 13 |
| Probamos `mid = 10` | `T(4)=10` | `Tet(4)=20`, alcanza |
| Nuevo rango | como 10 alcanza | buscamos más chico |
| Probamos `mid = 8` | `T(3)=6`, sobran 2 | `Tet(3)+T(2)=10+3=13` |
| Resultado | 8 alcanza y 7 no alcanza | **8** |

Por lo tanto, para `n = 13`, la mínima cantidad de cajas apoyadas en el piso es:

$$
\boxed{8}
$$

## Complejidad

Sea `n` la cantidad total de cajas.

- **Temporal: $O(\log^2 n)$.**
  - La búsqueda binaria principal busca la respuesta entre `1` y `n`, por lo que cuesta
    $O(\log n)$.
  - En cada paso calculamos `max_cajas_con_piso(m)` usando otra búsqueda binaria para encontrar
    el mayor `k` con $T(k) \le m$, lo que también cuesta $O(\log n)$.
  - En total: $O(\log n \cdot \log n) = O(\log^2 n)$.

- **Espacial: $O(1)$.**
  - Solo usamos variables escalares.
  - No se usa memoria adicional proporcional a `n`.

## Cuándo usar esta técnica

**Contexto favorable.** Conviene usar esta solución cuando queremos una alternativa no greedy,
pero todavía eficiente.

**Ventajas.**

- No depende de punto flotante.
- No usa raíces cúbicas ni fórmulas cerradas difíciles de implementar.
- Es más fácil de justificar que una solución puramente matemática.
- Es suficientemente eficiente para valores grandes de `n`.

**Limitaciones.**

- Es menos rápida que la solución greedy en forma cerrada $O(1)$.
- Requiere entender la función de factibilidad `max_cajas_con_piso(m)`.
- Aunque no construye la solución caja por caja, todavía depende de las fórmulas triangular y
  tetraédrica.

## Comparación con las otras soluciones del grupo

El grupo implementó dos variantes greedy: una **iterativa** ($O(\sqrt[3]{n})$) y una en **forma
cerrada** ($O(1)$). Ambas construyen la pirámide completa más grande y rellenan el sobrante; se
diferencian solo en cómo resuelven cada paso. Esta solución, en cambio, usa división y conquista:
no decide de forma voraz cuántas cajas poner, sino que busca la mínima respuesta mediante una
condición de factibilidad monótona.

Comparación con cada variante:

- **vs. greedy iterativa ($O(\sqrt[3]{n})$).** Las dos evitan el punto flotante y son exactas.
  División y conquista es asintóticamente más rápida ($O(\log^2 n)$), aunque para $n \le 10^9$ la
  diferencia es imperceptible. La iterativa es un poco más directa de leer.
- **vs. greedy en forma cerrada ($O(1)$).** La forma cerrada es la más rápida, pero depende de
  raíces en punto flotante y necesita corrección para no desviarse. División y conquista es más
  lenta ($O(\log^2 n)$) pero no tiene riesgo numérico y es más fácil de justificar.

Regla práctica:

- **Greedy / forma cerrada:** mejor rendimiento, a costa de fragilidad numérica.
- **Greedy iterativa:** exacta y simple, sin punto flotante.
- **División y conquista / búsqueda binaria:** mejor alternativa no greedy, robusta y clara.
- **Programación dinámica:** posible como idea, pero no recomendable para las restricciones del
  problema.

## Referencias

- [LeetCode 1739 - Building Boxes](https://leetcode.com/problems/building-boxes/)
- [Número triangular](https://en.wikipedia.org/wiki/Triangular_number) - $T(k)=\dfrac{k(k+1)}{2}$
- [Número tetraédrico](https://en.wikipedia.org/wiki/Tetrahedral_number) - $\operatorname{Tet}(k)=\dfrac{k(k+1)(k+2)}{6}$
- [Búsqueda binaria](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Divide and conquer algorithm](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm)
