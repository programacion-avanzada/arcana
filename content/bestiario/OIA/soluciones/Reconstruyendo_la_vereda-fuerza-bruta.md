# Reconstruyendo la vereda - Fuerza bruta

<- Volver a la [descripción del problema](Reconstruyendo_la_vereda.md)

## Técnicas utilizadas

**Fuerza bruta:** enumerar todos los candidatos posibles a solución y quedarse con el primero que cumpla todas las condiciones. No usa ninguna propiedad del problema: solo generar y verificar.

## Idea de la solución

Si el hueco tiene largo `k`, cada candidato es una cadena de `k` letras sobre `{B, G, N}`. Se recorren todas (`3^k`) y para cada una se verifica:

1. que tenga exactamente `B`, `G` y `N` letras de cada color.
2. que, al pegarla en el hueco, no queden dos letras contiguas iguales (incluyendo los vecinos de los bordes).

La primera que pase ambos chequeos es la respuesta.

## Código

```python
from itertools import product

def sin_repetidos(s):
    return all(a != b for a, b in zip(s, s[1:]))

def vereda(B, G, N, baldosas):
    i = baldosas.find('R')
    j = baldosas.rfind('R') + 1
    k = j - i
    for cand in product("BGN", repeat=k):
        if (cand.count('B'), cand.count('G'), cand.count('N')) != (B, G, N):
            continue
        res = baldosas[:i] + ''.join(cand) + baldosas[j:]
        if sin_repetidos(res):
            return res
```

## Traza de ejemplo

Entrada: `2 2 2` y `BGRRRRRRBNGB`. Hueco: posiciones 2 a 7, `k = 6`, `i = 2`, `j = 8`.

- Se generan las `3^6 = 729` cadenas en orden lexicográfico (`B < G < N`).
- Solo `6!/(2!·2!·2!) = 90` tienen los conteos correctos; las demás se descartan en el primer `if`.
- Entre esas 90, `BBGGNN` (y todas las que empiezan con `BB`) falla por `BB`; `BGBGNN` falla por `NN`.
- `BGBNGN` es la primera que pasa: queda `BGBGBNGNBNGB`, sin repetidos contiguos. Se devuelve.

(De las 90 candidatas, 14 son válidas, que coincide con las 14 salidas válidas del enunciado.)

## Complejidad

- **Tiempo:** `O(k · 3^k)`. Hay `3^k` candidatos y verificar cada uno cuesta `O(k)`. Con `k` hasta 2.000.000 es inviable. En la práctica sirve para `k` de hasta unos 15.
- **Espacio:** `O(k)` adicional, porque `product` genera los candidatos de a uno y solo se guarda el actual (más el resultado final, de largo `n`).

## Cuándo usar esta técnica

- **Favorable:** tramos muy chicos, o como **verificador** para comprobar otra solución sobre muchas entradas pequeñas. Es difícil que tenga errores, así que sirve de referencia.
- **Limitaciones:** el crecimiento exponencial la descarta para las entradas grandes.
- **Comparación:** el [backtracking](Reconstruyendo_la_vereda-backtracking.md) poda prefijos inválidos y baja a `O(2^k)` en el peor caso. La [solución greedy](Reconstruyendo_la_vereda-greedy.md) resuelve el mismo problema en `O(k)`. Fuerza bruta solo gana en simplicidad y en que su corrección es evidente.

## Referencias

- Documentación de [`itertools.product`](https://docs.python.org/3/library/itertools.html#itertools.product).
