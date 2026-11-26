---
title: 'OIA - Vuelo amoroso - Fuerza Bruta'
tags:
  - oia
  - solucion
---

Solución por fuerza bruta para [[vuelo_amoroso]].

## Técnicas utilizadas

**Fuerza bruta:** se enumeran todas las soluciones candidatas, se descartan las no factibles y se evalúan las demás para quedarse con la mejor. No usa ninguna propiedad del problema para evitar candidatos, así que siempre encuentra el óptimo, pero al costo de revisar todo el espacio de búsqueda.

## Idea de la solución

En cada medición el pajarito tiene exactamente dos opciones: subir ($+1$) o bajar ($-1$). Un vuelo completo es entonces una secuencia de $n$ movimientos, y hay $2^n$ secuencias posibles.

Para cada secuencia:

1. Se simula el vuelo desde la altura 0, aplicando los movimientos en orden.
2. Si en algún momento la altura queda fuera del rango permitido (menor a 0 o mayor a 300), el vuelo es **no factible** y se descarta.
3. Si el vuelo es factible, se suma $|p_t - a_t|$ en cada medición y, si el total mejora al mejor conocido, se guardan el total y el recorrido.

Las alturas de la pájara se reciben en un [[array]], y el recorrido de cada candidato se guarda en otro array de tamaño $n$.

Cortar la simulación apenas el vuelo se vuelve no factible **no es una poda**: el ciclo exterior igual recorre las $2^n$ secuencias, y solo se ahorra terminar de simular una que ya se sabe que no sirve. El espacio de búsqueda es el mismo.

## Código

```text
ALGORITMO VueloFuerzaBruta(pajara)
    n ← pajara.longitud
    mejor_total ← ∞
    mejor_recorrido ← vacío
    PARA secuencia DESDE 0 HASTA 2^n - 1 HACER
        altura ← 0
        total ← 0
        recorrido ← nuevo arreglo de tamaño n
        factible ← VERDADERO
        PARA t DESDE 0 HASTA n-1 HACER
            bit ← (secuencia / 2^(n-1-t)) MOD 2   // división entera
            SI bit = 0 ENTONCES
                altura ← altura + 1             // sube
            SINO
                altura ← altura - 1             // baja
            SI altura < 0 O altura > 300 ENTONCES
                factible ← FALSO        // no factible, no tiene sentido seguir
                SALIR DEL CICLO
            total ← total + |altura - pajara[t]|
            recorrido[t] ← altura
        SI factible Y total < mejor_total ENTONCES
            mejor_total ← total
            mejor_recorrido ← recorrido
    RETORNAR mejor_total, mejor_recorrido
```

Las secuencias se generan en orden, probando primero $+1$ y después $-1$ en cada posición, como si se contara en binario. La primera secuencia es "subir siempre" y la última, "bajar siempre".

## Traza de ejemplo

**Entrada:** `3 3 3 6 9 12 9 9 6 3 3 3 3` ($n = 13$).

El árbol de decisiones de las primeras cuatro mediciones muestra cómo se ramifica la búsqueda. Cada nodo indica la altura del pajarito y la distancia acumulada hasta ese momento. Las ramas a la izquierda suben y las de la derecha bajan.

![Árbol de decisiones de la fuerza bruta en las primeras cuatro mediciones](vuelo-amoroso-fuerza-bruta-arbol.svg)

Ya en cuatro niveles aparece el problema central: el estado "medición 4, altura 2" se alcanza por tres caminos distintos, con distancias acumuladas 7, 9 y 11. A partir de ahí, las tres copias tienen exactamente el mismo futuro posible, así que las de 9 y 11 nunca pueden llevar a una solución mejor que la de 7. Aun así, la fuerza bruta las expande a todas hasta el final.

Estos son los candidatos que van mejorando `mejor_total`, en el orden en que se generan:

| Candidato | Recorrido                       | Total  |
|-----------|---------------------------------|--------|
| #1        | `1 2 3 4 5 6 7 8 9 10 11 12 13` | 55     |
| #2        | `1 2 3 4 5 6 7 8 9 10 11 12 11` | 53     |
| #4        | `1 2 3 4 5 6 7 8 9 10 11 10 9`  | 49     |
| #8        | `1 2 3 4 5 6 7 8 9 10 9 8 7`    | 43     |
| #16       | `1 2 3 4 5 6 7 8 9 8 7 6 5`     | 35     |
| #32       | `1 2 3 4 5 6 7 8 7 6 5 4 3`     | 25     |
| #62       | `1 2 3 4 5 6 7 6 5 4 3 4 3`     | **23** |

(Se omiten algunas mejoras intermedias de a 2.) El candidato #32 es justamente el vuelo greedy que se acerca siempre a la pájara. El #62 ya es óptimo, pero el algoritmo no tiene forma de saberlo, así que sigue evaluando los 8130 candidatos restantes sin encontrar nada mejor.

Resumen de la ejecución:

| Concepto                                     | Cantidad |
|----------------------------------------------|----------|
| Secuencias generadas ($2^{13}$)              | 8192     |
| Descartadas por no factibles (altura < 0)    | 6476     |
| Vuelos factibles evaluados por completo      | 1716     |
| Vuelos con distancia total 23                | 2        |

En este ejemplo ningún vuelo supera los 300 metros (con 13 mediciones, la altura máxima es 13), así que todos los descartes son por quedar bajo tierra.

**Resultado:** `23`, con el recorrido `1 2 3 4 5 6 7 6 5 4 3 4 3`. El otro óptimo (`... 3 2 3`) aparece más adelante en el orden de generación y no reemplaza al primero porque no es estrictamente mejor.

## Complejidad

### Temporal

$O(2^n \cdot n)$: hay $2^n$ vuelos posibles y simular cada uno recorre hasta $n$ mediciones.

Es cierto que no todos los vuelos se simulan hasta el final: apenas uno se vuelve no factible, se corta (en el ejemplo, de 8192 secuencias solo 1716 llegan al final). Pero eso solo ahorra parte del trabajo dentro de cada vuelo. El ciclo exterior igual pasa por las $2^n$ secuencias, así que la complejidad se toma igual como $O(2^n \cdot n)$.

Para dimensionarlo: con $n = 30$ ya son más de 1.000 millones de vuelos, y con $n = 40.000$ el número tiene más de 12.000 cifras. En la práctica sirve hasta $n \approx 20$.

### Espacial

$O(n)$: en cada momento se guardan solo la secuencia actual, el recorrido del candidato y el mejor recorrido, todos de longitud $n$. Las secuencias se generan de a una, sin guardarlas todas en memoria.

## Cuándo usar esta técnica

### Favorable cuando

- La instancia es muy chica ($n \lesssim 20$).
- Se necesita un resultado confiable para **verificar** otra solución: es fácil convencerse de que es correcta porque prueba literalmente todo.
- Se quiere entender la estructura del problema antes de diseñar algo mejor. Mirar el árbol de decisiones es lo que revela los estados repetidos.

### Limitaciones

- Crece exponencialmente con $n$: cada medición extra duplica el trabajo, y el límite del problema ($n \le 40.000$) queda totalmente fuera de alcance.
- Repite trabajo: el mismo estado (medición, altura) se expande muchas veces por caminos distintos, aunque desde ahí el futuro sea idéntico.
- No puede detenerse antes aunque ya tenga el óptimo, porque no tiene una cota que le permita saber que no hay nada mejor.

## Comparación con programación dinámica

La fuerza bruta trata cada vuelo como una solución independiente. La [[vuelo_amoroso-programacion-dinamica]] parte de la observación que deja ver el árbol: lo único que importa del pasado es la altura actual, así que de todos los vuelos que llegan al mismo estado alcanza con conservar el de menor distancia acumulada. Eso reduce el trabajo de $O(2^n \cdot n)$ a $O(n \cdot H)$, con $H = 301$ alturas factibles: para el límite del problema, unos 12 millones de pasos contra un número astronómico.

La fuerza bruta solo gana en simplicidad: no requiere identificar estados ni plantear una recurrencia, y por eso es útil como oráculo para probar la versión de programación dinámica en instancias chicas.

## Comparación con greedy

La solución [[vuelo_amoroso-greedy|greedy]] está en el extremo opuesto: construye un único vuelo en $O(n)$ en lugar de revisar los $2^n$. Pero decide mirando solo la medición actual y no garantiza el óptimo. En el ejemplo devuelve 25 (el candidato #32 de la traza), mientras que la fuerza bruta encuentra el 23.

## Referencias

- [Enunciado original (OIA, Nivel 3, Problema 2)](https://www.oia.unsam.edu.ar/_media/prob/c3a09n3p2.pdf)
