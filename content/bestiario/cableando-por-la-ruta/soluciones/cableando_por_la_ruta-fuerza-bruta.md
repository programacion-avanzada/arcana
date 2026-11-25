---
title: Cableando por la ruta - Fuerza bruta
tags:
  - oia
  - solucion
---

## Técnicas utilizadas
La **fuerza bruta** (búsqueda exhaustiva) genera todas las soluciones candidatas dentro del espacio de búsqueda, verifica cuáles son válidas y se queda con la mejor. Garantiza el óptimo porque no deja ningún candidato sin revisar, a cambio de un costo que crece mucho con el tamaño de ese espacio.

  

En este problema, se generan todas las formas de cablear la ruta: cada combinación posible de tramos con cable y sin cable. Se descartan las que dejan más componentes conexos que megacentrales disponibles porque significaría que al menos un componente conexo queda sin internet y, entre las combinaciones válidas, se elige la de menor longitud total.

  

  

## Idea de la solución

  

Primero se ordenan los kilómetros de los pueblitos y se calculan los $N-1$ tramos entre vecinos, guardados en una [[dynamic array|lista]]. Solo esos tramos pueden llevar cable: un cable más largo, que pasa por encima de otro pueblito, puede reemplazarse por dos tramos vecinos que miden lo mismo y además conectan a ese pueblito.

  

Cada tramo tiene dos opciones: **con cable** o **sin cable**. Eso da $2^{N-1}$ combinaciones. Para cada una:

  

1. Se cuentan los componentes conexos que forma: cada tramo sin cable agrega uno más, así que $\text{componentes} = \text{tramos sin cable} + 1$.

2. Si $\text{componentes} \leq C$, la combinación es **válida**: alcanza con poner una central en algún pueblito de cada componente, y si sobraran centrales, se podrían ubicar en cualquier pueblito sin modificar el resultado.

3. Si es válida, se suma la longitud de los tramos con cable y se va actualizando el mínimo.

  

Cablear todos los tramos siempre es válido y es también el peor caso (no podemos tener más cables que esos), así que ese costo sirve como valor inicial del mínimo.

  

## Código

  

```python

from itertools import product

  

def  fuerza_bruta(km, c):

km = sorted(km)

tramos = [km[i + 1] - km[i] for i in  range(len(km) - 1)]

mejor = sum(tramos) # Peor caso

# Generamos todas las combinaciones posibles de cable / sin cable
for poner in product([True, False], repeat=len(tramos)):

componentes = poner.count(False) + 1  # Cada tramo sin cable agrega un componente

if componentes <= c:

# Sumamos las distancias de los que tienen cable
costo = sum(t for t, p in zip(tramos, poner) if p)

mejor = min(mejor, costo)

return mejor

```

  

## Traza de ejemplo

  

Con `km = [5, 15, 2, 22]` y `c = 2`:

  

- Kilómetros ordenados: `[2, 5, 15, 22]`.

- Tramos: `[3, 10, 7]`, que corresponden a 2–5, 5–15 y 15–22.

- Valor inicial de `mejor`: $3 + 10 + 7 = 20$.

  

Se recorren las $2^3 = 8$ combinaciones (✓ = con cable, ✗ = sin cable):

  



| 3 | 10 | 7 | Componentes | ¿Válida? ($\leq 2$) | Costo | `mejor` |
| :---: | :---: | :---: | ---: | :---: | ---: | ---: |
| ✓ | ✓ | ✓ | 1 | SÍ | 20 | 20 |
| ✓ | ✓ | ✗ | 2 | SÍ | 13 | 13 |
| ✓ | ✗ | ✓ | 2 | SÍ | **10** | **10** |
| ✓ | ✗ | ✗ | 3 | NO | — | 10 |
| ✗ | ✓ | ✓ | 2 | SÍ | 17 | 10 |
| ✗ | ✓ | ✗ | 3 | NO | — | 10 |
| ✗ | ✗ | ✓ | 3 | NO | — | 10 |
| ✗ | ✗ | ✗ | 4 | NO | — | 10 |


  

La combinación ganadora deja sin cable el tramo de longitud 10 (5–15). Quedan los componentes $\{2, 5\}$ y $\{15, 22\}$, cada uno con su central.

  

Resultado: **10**

  

## Complejidad

  

### Temporal

  

El ordenamiento inicial es $O(N \log N)$. Luego, hay $2^{N-1}$ combinaciones de tramos, y para cada una se tiene que sumar los $N-1$ tramos con cable, que se resuelve en $O(N)$. Por lo tanto, la complejidad temporal es $O(2^{N-1} \cdot N)$.


En la práctica, cada pueblito extra duplica el tiempo. Con el límite del enunciado ($N = 200.000$) habría que revisar $2^{199.999}$ combinaciones, algo imposible.

  

### Espacial

  

$O(N)$: la lista de kilómetros ordenados, la de tramos y la combinación que se está evaluando. `product` genera las combinaciones de a una, así que nunca se guardan todas juntas.

  

## Cuándo usar esta técnica

  

### Contexto favorable

  

- La entrada es chica (unos 20 pueblitos o menos) y se busca una respuesta segura sin tener que demostrar ninguna propiedad del problema.

- Se necesita una solución de referencia para validar otra más eficiente, ya que esta garantiza encontrar el óptimo.

  

### Limitaciones

  

- El crecimiento exponencial la hace inviable para los tamaños reales del problema.

- Hace mucho trabajo inútil: evalúa todas las combinaciones con demasiados componentes, aunque se sabe de antemano que son inválidas, y también las válidas que no cortan los tramos más largos. Una variante menos «bruta» que solo genera las combinaciones con exactamente $C-1$ tramos sin cable revisa $\binom{N-1}{C-1}$ casos; menos que $2^{N-1}$, pero en el peor caso ($C \approx N/2$) sigue siendo exponencial: $O(\frac {2^{N}}{\sqrt N})$.

  

### Comparación con la solución greedy

  

Frente al [[cableando_por_la_ruta-greedy|algoritmo greedy]], la fuerza bruta no aprovecha ninguna propiedad del problema: prueba todas las formas de cablear. La solución greedy usa una observación clave: como cada tramo sin cable agrega exactamente un componente, siempre conviene que esos tramos sean los más largos. Con eso deja de explorar combinaciones y baja la complejidad de $O(2^{N-1} \cdot N)$ a $O(N \log N)$.

  

La ventaja de la fuerza bruta es que no necesita esa demostración: es evidente que sirve porque prueba absolutamente todo. Es por ello que sirve como red de seguridad para verificar la implementación voraz en instancias chicas.

  

## Referencias

  
- [[cableando_por_la_ruta|Enunciado del problema]]
- Cátedra de Programación Avanzada (2026). [DA: Fuerza Bruta](http://bit.ly/4nDPo9H). Universidad Nacional de La Matanza.