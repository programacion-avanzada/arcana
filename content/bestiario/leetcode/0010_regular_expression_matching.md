---
title: Leetcode0010 - Regular Expression Matching
tags:
  - b/leetcode
---
## Nombre y enunciado

Dado un string **s** y un patrón **p**, implementar coincidencia con expresiones regulares que soporte los caracteres especiales:

- `.` → coincide con cualquier carácter individual
- `*` → coincide con cero o más ocurrencias del elemento anterior

**Problema**: La coincidencia debe cubrir el string completo (no solo una subcadena).

[Problema original](https://leetcode.com/problems/regular-expression-matching/)

## Intuición
A primera vista parece un problema de parsing, pero la dificultad real está en el `*`: al encontrarlo, no sabemos de antemano cuántas veces se repite el carácter previo. Hay que explorar múltiples posibilidades (cero repeticiones, una, dos, …), lo que genera una estructura de subproblemas superpuestos. Eso lo convierte en un candidato natural para la programación dinámica.

El caso `.*` es especialmente traicionero: puede absorber cualquier cantidad de cualquier carácter, incluyendo ninguno.

## Definición formal
**Entrada:** 
- `s` — string de texto, compuesto solo de letras minúsculas (a–z).
- `p` — patrón, compuesto de letras minúsculas, `.` y `*`.
Se garantiza que `*` nunca aparece al inicio y nunca hay dos `*` consecutivos.

**Salida:** `true` si `p` cubre `s` en su totalidad. Caso contrario, `false`.

**Restricciones:** 
- $1 \le |s| \le 20$
- $1 \le |p| \le 20$

## Ejemplo concreto
Tomemos como cadena `s` = "aab" y patrón como `p`= "c\*a\*b".

Resolución paso a paso
| Segmento del patrón | Acción | Cadena restante |
|:-------------:|:-------------:|:-------------:|
| c\* | c repetido 0 veces → se decarta | "aab" |
| a\* | a repetido 2 veces → consume aa | "b" |
| b |coincide con b → consume b | "" |

**Resultado:** `true`.

### Contraejemplo:
`s` = "mississippi"\
`p`= "mis\*is\*p\*."

**Resultado:** `false`.

Para demostrar el resultado haremos uso de índices para guiarnos:
- Índice s: `i_s = 0`
- Índice p: `j_p = 0`

*Se inicializan en 0 para estar al comienzo de la cadena y del patrón.*

| i_s | j_p | s[i_s] | p[j_p] | Acción | Cadena restante |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | m | m | coincide con m → consume m | ississippi |
| 1 | 1 | i | i | coincide con i → consume i | ssissippi |
| 2 | 2 | s | s* | s repetido 2 veces → consume ss | issippi |
| 4 | 4 | i | i | coincide con i → consume i | ssippi |
| 5 | 5 | s | s* | s repetido 2 veces → consume ss | ippi |
| 7 | 7 | i | p* | p repetido 0 veces → se decarta | ippi |
| 7 | 9 | i | . | coincide con i → se consume i | ppi |
| 8 | 10 | p | "" | fin de patrón sin fin de cadena → se retorna falso | ppi |

En este caso el patrón parece cubrir la cadena pero falla debido a que la `i` en la **posición 7** de la cadena provoca que la `p*` de la **posición 7** del patrón se ignore. Por lo tanto, solo queda `.` dentro del patrón y este se consume ahora sí con la `i`. Por último, al llegar al fin del patrón pero no la cadena, se retorna falso debido a que el patrón no abarco por completo la cadena.

## Por dónde empezar
Comencemos con lo más intuitivo, _**¿qué ocurre si se recorren**_ `s` _**y**_ `p` _**en paralelo?**_

El criterio a tomar sería que si coincide, se avanza; caso contrario, falla. Aunque es un criterio válido, es *dummy*, ya que funciona solo si el patrón tiene letras (a - z) y puntos. Si se presentara un `*.` fallaría considerablemente.

El problema es que `*` te obliga a tomar una decisión: _**¿cuántas veces se repite el carácter anterior?**_ No lo sabés en ese momento. Podrían ser cero, una, dos, o veinte repeticiones y la elección correcta depende de lo que viene después en el string.

Si no sabés cuántas veces usar `x*` se prueban todas mientras sean factibles, es decir, que coincida con la letra a repetir. Cero, una, dos, hasta que alguna funcione o se agoten las posibilidades. Esto da pie a pensar en un algoritmo que implemente *backtracking*.

Otro problema que se presenta al usar `*` es que puede aparecer por múltiples caminos distintos. Estos caminos, dado el caso, van a repetirse, ya que se avanza por una rama de la cual se volvió hacia atrás. Por lo tanto, comenzamos a ver un solapamiento entre subproblemas.

| Técnicas de algoritmos  | Criterios |
| :------------- |:-------------|
| División y Conquista | **Descartada**, ya que los subproblemas no son independientes entre sí, contamos con solapamiento entre subproblemas. |
| Greedy | **Descartada** porque no hay una elección localmente óptima que lleve a la solución óptima global |
| Bactracking | **Seleccionada**, ya que necesitamos probar todas las posibles combinaciones factibles, por lo tanto ramificar, y descartar cuando una rama no coincide con el patrón de ninguna manera. |
| Programación Dinámica | **Seleccionada**, ya que contamos con subproblemas solapados entre sí, y detectamos que se repiten casos al derivar el árbol de decisión. |

## Soluciones disponibles
- [[0010_regular_expression_matching-backtracking]]
- [[0010_regular_expression_matching-PD_top_down]]
- [[0010_regular_expression_matching-PD_buttom_up]]