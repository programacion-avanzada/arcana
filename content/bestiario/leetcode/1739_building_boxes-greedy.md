---
title: "Building Boxes - Greedy"
tags: ['b/leetcode']
problema: "LeetCode 1739 - Building Boxes"
tecnica: "Greedy (iterativo y forma cerrada O(1))"
grupo: "delta"
---
## Solución 1: Greedy iterativo

**Técnicas utilizadas.** *Greedy (voraz).* Construir la pirámide perfecta nivel por nivel,
sumando cajas hasta quedarnos sin ellas. Si sobran, agregarlas secuencialmente al piso,
expandiendo la base paso a paso de la forma más barata posible.

**Idea de la solución.** Dividimos el problema en dos fases.

### Fase 1: construir la pirámide perfecta más grande

Armar niveles completos es lo más eficiente, así que la primera decisión voraz es levantar la
pirámide perfecta más alta posible sin pasarnos de $n$.

1. Empezamos con altura $k = 0$.
2. Aumentamos $k$ de a 1.
3. En cada paso calculamos cuántas cajas extra necesita la base ($b_k$) y cuántas suma el total
   ($t_k$).
4. Repetimos **mientras** el total no supere $n$.
5. Apenas nos pasaríamos, frenamos. Nos quedamos con la pirámide perfecta anterior y sabemos
   cuántas cajas hay en el piso y cuántas "sobran" en la mano para la Fase 2.

### Fase 2: acomodar el sobrante

Queda un remanente que no alcanza para un nivel completo. Lo agregamos expandiendo la base lo
mínimo indispensable:

1. Si agregás **1** caja al piso pegada a la pirámide, arriba podés poner 0 (acomodado: 1).
2. Si agregás **1** más (van 2), podés apoyar 1 encima (acomodado: 3).
3. Si agregás **1** más (van 3), podés apoyar 2 encima (acomodado: 6).

Cada caja nueva de piso aumenta la "capacidad" siguiendo la secuencia de números triangulares.

**Código.**

```python
def minimumBoxes(n: int) -> int:
    cajas_piso = 0      # nuestra base (b_k)
    cajas_totales = 0   # total en la pirámide (t_k)
    nivel = 0           # altura (k)

    # FASE 1: construir la pirámide perfecta máxima.
    # Chequeamos si al agregar un nivel más no nos pasamos de n.
    while cajas_totales + cajas_piso + nivel + 1 <= n:
        nivel += 1
        cajas_piso += nivel            # aumentamos la base
        cajas_totales += cajas_piso    # sumamos la nueva base al total

    # Si la pirámide quedó justa, terminamos.
    if cajas_totales == n:
        return cajas_piso

    # FASE 2: acomodar el sobrante.
    cajas_sobrantes = n - cajas_totales
    cajas_extra_piso = 0
    capacidad_extra = 0
    while capacidad_extra < cajas_sobrantes:
        cajas_extra_piso += 1
        capacidad_extra += cajas_extra_piso

    return cajas_piso + cajas_extra_piso
```

**Traza de ejemplo.** Instancia $n = 10$ (la misma de la descripción). La Fase 1 recorre:

| Iteración | Condición `while` (futuro $\le 10$) | nivel | cajas_piso | cajas_totales |
| :-------- | :---------------------------------- | :---: | :--------: | :-----------: |
| Inicial   | -                                   | 0     | 0          | 0             |
| 1         | $0+0+0+1 = 1 \le 10$ (V)            | 1     | 1          | 1             |
| 2         | $1+1+1+1 = 4 \le 10$ (V)            | 2     | 3          | 4             |
| 3         | $4+3+2+1 = 10 \le 10$ (V)           | 3     | 6          | 10            |
| 4         | $10+6+3+1 = 20 \le 10$ (F)          | 3     | 6          | 10            |

Como `cajas_totales == 10 == n`, no hay Fase 2. **Respuesta: 6.**

> Para ver la Fase 2 en acción, con $n = 13$: la Fase 1 corta igual en nivel 3 (piso 6,
> total 10) y sobran 3. La Fase 2 agrega piso hasta que la capacidad ($1, 3, 6, \dots$)
> llegue a 3: con 2 cajas de piso la capacidad es $1+2 = 3$. **Respuesta: $6 + 2 = 8$.**

**Complejidad.**

- **Temporal: $O(\sqrt[3]{n})$.** En la Fase 1 el total crece $\approx \frac{k^3}{6}$, así que el
  número de niveles es proporcional a $\sqrt[3]{n}$. En la Fase 2, el sobrante está acotado por
  la diferencia entre dos tetraédricos consecutivos (un número triangular), y recorrerlo también
  queda en $O(\sqrt[3]{n})$. Sumando ambos bucles secuenciales: $O(\sqrt[3]{n})$. Incluso para
  $n = 10^9$ son apenas unos miles de iteraciones.
- **Espacial: $O(1)$.** Solo un puñado de contadores primitivos, sin estructuras dinámicas ni
  recursión.

**Cuándo usar esta técnica.**

- **Favorable cuando** querés una solución simple, legible y sin riesgo numérico. Trabaja con
  aritmética entera exacta, así que nunca falla por redondeo, y a $O(\sqrt[3]{n})$ es
  muy rápida igual (para $n = 10^9$, ~1000 vueltas).
- **Limitaciones:** no es $O(1)$: recorre los niveles uno por uno. Si $n$ fuera descomunal o la
  función se llamara millones de veces por segundo, la versión en forma cerrada es más conveniente.
- **Comparación con la Solución 2 (forma cerrada).** Las dos usan **la misma estrategia voraz**
  (pirámide máxima + relleno del sobrante); cambia solo la implementación. Esta itera y suma
  nivel a nivel (exacta y robusta, $O(\sqrt[3]{n})$); la otra invierte las fórmulas con raíces
  ($O(1)$, pero con punto flotante que hay que controlar). Regla práctica: **iterativo para
  claridad y robustez; forma cerrada para rendimiento máximo** cuando la fórmula existe y está
  validada.

---

## Solución 2: Greedy en forma cerrada O(1)

**Técnicas utilizadas.** *Greedy (voraz).* Misma estrategia que la Solución 1 (pirámide
completa más grande que entre, y después rellenar con lo que sobra), pero cada paso no se
resuelve iterando sino despejando: se obtiene el valor exacto con una sola
cuenta. Por eso todo el algoritmo corre en $O(1)$.

**Idea de la solución.**

### La forma óptima: una pirámide en la esquina

Para gastar la menor cantidad de cajas en el piso, conviene apilar todo en una esquina formando
una escalera piramidal. Necesitamos, para una pirámide completa, cuántas cajas usa en total y
cuántas apoya en el piso.

### Fórmulas "hacia adelante"

Cada **piso** es una capa triangular. El piso $K$ tiene:

$$
\text{Piso}(K) \;=\; 1 + 2 + \cdots + K \;=\; \sum_{i=1}^{K} i \;=\; \frac{K(K+1)}{2}
$$
![Piso triangular](piso_triangular.svg)

Ese es el $K$-ésimo número triangular, $T(K)=\dfrac{K(K+1)}{2}$. Una **pirámide** completa es la
suma de todos sus pisos:

$$
\text{Pir}(K) \;=\; \sum_{i=1}^{K} \text{Piso}(i) \;=\; \sum_{i=1}^{K} \frac{i(i+1)}{2}
$$
![Piramide Tetraedrica](piramide_tetraedrica.svg)

Desarrollando la suma:

$$
\sum_{i=1}^{K} \frac{i(i+1)}{2}
= \frac{1}{2}\!\left( \sum_{i=1}^{K} i^2 + \sum_{i=1}^{K} i \right)
= \frac{1}{2}\!\left( \frac{K(K+1)(2K+1)}{6} + \frac{K(K+1)}{2} \right)
= \frac{K(K+1)(K+2)}{6}
$$

Ese es el $K$-ésimo número tetraédrico, $\operatorname{Tet}(K)=\dfrac{K(K+1)(K+2)}{6}$. Ambas
fórmulas van de tamaño a cajas: le doy $K$ y me dicen cuántas cajas hay.

### Paso 1: despejar la fórmula de la pirámide (la cúbica)

Tenemos $n$ cajas y queremos el $K$ más grande cuya pirámide entre sin pasarse. En vez de probar
$K=1,2,3,\dots$, planteamos la igualdad al revés:

$$
\frac{K(K+1)(K+2)}{6} = n \;\;\Longrightarrow\;\; K(K+1)(K+2) = 6n
$$

Expandiendo el producto $K(K+1)(K+2) = K^3 + 3K^2 + 2K$, queda una **ecuación cúbica**:

$$
K^3 + 3K^2 + 2K - 6n = 0
$$

Su raíz real positiva me da la "altura ideal" de la pirámide. Como $n$ casi nunca es un
tetraédrico exacto, esa raíz sale con decimales, y me quedo con el entero de abajo:

$$
r = \left\lfloor\, \text{raíz de } \big(K^3 + 3K^2 + 2K - 6n\big) \,\right\rfloor
$$

![Paso 1 Representacion Cubica](paso1_recta_cubica.svg)

> Igual que $\sqrt{\,\cdot\,}$ deshace elevar al cuadrado, la raíz de esta cúbica deshace la
> fórmula de la pirámide: de cajas vuelve al tamaño.

Con $r$ definido, calculamos:

$$
c_{\text{pirámide}} = \frac{r(r+1)(r+2)}{6}, \qquad
c_{\text{suelo}} = \frac{r(r+1)}{2}, \qquad
c_{\text{sobrantes}} = n - c_{\text{pirámide}}
$$

Si $c_{\text{sobrantes}} = 0$, la pirámide quedó justa y la respuesta es directamente
$c_{\text{suelo}}$.

### Paso 2: ubicar las sobrantes (la cuadrática)

Si sobran cajas, las apoyamos en una **diagonal nueva** al lado de la pirámide. La clave es que
las cajas de esa diagonal se apilan: la $p$-ésima caja de piso aguanta una pila de altura $p$.

![Fase2 Diagonal](fase2_diagonal.svg)

Entonces con $p$ cajas de piso alojo

$$
1 + 2 + \cdots + p = \sum_{i=1}^{p} i = \frac{p(p+1)}{2} \quad \text{cajas.}
$$

Tengo las sobrantes $s := c_{\text{sobrantes}}$ y quiero el **menor** $p$ con
$\dfrac{p(p+1)}{2} \ge s$. Lo despejo como igualdad, paso a paso:

$$
\begin{aligned}
\frac{p(p+1)}{2} &= s
&&\text{(fórmula original)}\\[4pt]
p(p+1) &= 2s
&&\text{(multiplico por 2)}\\[4pt]
p^2 + p &= 2s
&&\text{(distribuyo }p(p+1)=p^2+p)\\[4pt]
p^2 + p - 2s &= 0
&&\text{(paso todo a un lado)}
\end{aligned}
$$

Esto es una **ecuación cuadrática** $ap^2 + bp + c = 0$ con $a=1,\; b=1,\; c=-2s$. Se resuelve
con la fórmula resolvente:

$$
p = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

El discriminante se simplifica:

$$
b^2 - 4ac = 1^2 - 4\cdot 1 \cdot(-2s) = 1 + 8s
\qquad\Longrightarrow\qquad
p = \frac{-1 \pm \sqrt{1 + 8s}}{2}
$$

![Paso2 Parabola](paso2_parabola.svg)

**Me quedo con la raíz del $+$.** Como $s \ge 1$, entonces $\sqrt{1+8s} > 1$, y por lo tanto:

$$
\underbrace{\frac{-1 + \sqrt{1+8s}}{2}}_{>\,0}
\qquad\qquad
\underbrace{\frac{-1 - \sqrt{1+8s}}{2}}_{<\,0}
$$

La negativa no tiene sentido (no existe "cantidad negativa de cajas"). Siempre sale una de cada
signo porque el producto de las raíces es $\dfrac{c}{a} = -2s < 0$. Por último **redondeo para
arriba**, porque necesito que alcance:

$$
p = \left\lceil\, \frac{-1 + \sqrt{1 + 8s}}{2} \,\right\rceil
$$

Ejemplo del redondeo: si $s=4$, da $\approx 2{,}37$ → con 2 no alcanza, arranco la 3ª → $p=3$.

**Resultado final:** las de piso que ya tenía de la pirámide más las nuevas para las sobrantes:

$$
\boxed{\;\text{respuesta} = c_{\text{suelo}} + p = \frac{r(r+1)}{2} + \left\lceil \frac{-1+\sqrt{1+8s}}{2} \right\rceil\;}
$$

**Código.**

```python
import math

def tetra(r):
    return r * (r + 1) * (r + 2) // 6

def resolver_cubica(a, b, c, d):
    # raíz real (positiva) de a·x³ + b·x² + c·x + d = 0  - deshace la fórmula de la pirámide
    B, C, D = b/a, c/a, d/a
    p = (3*C - B**2) / 3
    q = (2*B**3 - 9*B*C + 27*D) / 27
    disc = (q/2)**2 + (p/3)**3
    if disc > 0:
        raiz = math.sqrt(disc)
        u = math.copysign(abs(-q/2 + raiz)**(1/3), -q/2 + raiz)
        v = math.copysign(abs(-q/2 - raiz)**(1/3), -q/2 - raiz)
        return (u + v) - B/3
    r_val = math.sqrt(-(p/3)**3)
    phi   = math.acos(-q / (2*r_val))
    f     = 2 * math.sqrt(-p/3)
    return max(f*math.cos((phi + 2*math.pi*k)/3) - B/3 for k in range(3))

def minimumBoxes(n):
    if n <= 3:
        return n

    # Paso 1: mayor r con Tet(r) <= n, despejando la cúbica en O(1)
    r = int(math.floor(resolver_cubica(1, 3, 2, -6*n)))
    if r < 0:
        r = 0
    while tetra(r + 1) <= n:   # corrección por error de punto flotante (1-2 pasos, sigue O(1))
        r += 1
    while tetra(r) > n:
        r -= 1

    c_suelo = r * (r + 1) // 2
    c_sobrantes = n - tetra(r)
    if c_sobrantes == 0:
        return c_suelo

    # Paso 2: menor p con p(p+1)/2 >= sobrantes, despejando la cuadrática
    p = math.ceil((-1 + math.sqrt(1 + 8*c_sobrantes)) / 2)
    return c_suelo + p
```

**Traza de ejemplo.** Instancia $n = 10$ (la misma de la descripción):

| Paso | Cálculo | Resultado |
|------|---------|-----------|
| ¿$n \le 3$? | $10 > 3$ | sigue |
| Doy vuelta la cúbica | raíz de $K^3+3K^2+2K-60=0 = 3$ exacto → $\lfloor\cdot\rfloor$ | $r = 3$ |
| Chequeo | $\operatorname{Tet}(3)=10 \le 10$ ✓ | $r = 3$ |
| Piso de la pirámide | $\dfrac{r(r+1)}{2} = \dfrac{3\cdot 4}{2}$ | $c_{\text{suelo}} = 6$ |
| Sobrantes | $10 - \operatorname{Tet}(3) = 10 - 10$ | $s = 0$ |
| **Resultado** | $c_{\text{sobrantes}} = 0 \Rightarrow$ devuelvo $c_{\text{suelo}}$ | $\mathbf{6}$ |

Coincide con la Solución 1. Para ejercitar el **Paso 2** (la cuadrática), con $n = 13$:
$r=3$, $c_{\text{suelo}}=6$, $s=3$, y $p = \left\lceil \frac{-1+\sqrt{25}}{2} \right\rceil = 2$
(con $p=1$ daría $1<3$; con $p=2$, $3\ge 3$). **Respuesta: $6 + 2 = 8$.**

**Complejidad.**

- **Temporal: $O(1)$.** No hay bucles que dependan de $n$ ni recursión. Todo es aritmética más
  $\sqrt{\,\cdot\,}$, raíz cúbica y $\arccos$, de costo constante. Los dos `while` de corrección
  hacen a lo sumo 1–2 iteraciones (el error de punto flotante desvía la raíz en menos de $1$),
  así que no cambian la cota.
- **Espacial: $O(1)$.** Apenas un puñado de variables escalares.

**Cuándo usar esta técnica.**

- **Favorable cuando** la estructura óptima del greedy tiene una **fórmula cerrada** conocida
  (acá, $T(K)$ y $\operatorname{Tet}(K)$): conviene despejar en vez de iterar. Ideal si $n$ puede
  ser gigante o si la función se llama muchísimas veces.
- **Limitaciones:** depende de **punto flotante** (raíces); para $n$ muy grande hay que reforzar
  con la corrección entera, si no un redondeo puede desviar $r$ en $1$. Además **no generaliza**
  a variantes sin forma cerrada, y es menos evidente de leer (la corrección conceptual vive en
  la geometría, no en el código).
- **Comparación con la Solución 1 (iterativa).** Misma estrategia voraz; esta gana en velocidad
  bruta ($O(1)$ vs $O(\sqrt[3]{n})$) a cambio de fragilidad numérica y menor claridad. La
  iterativa es trivialmente correcta y sin riesgo de redondeo, pero recorre los niveles. En la
  práctica, para $n \le 10^9$ la diferencia de tiempo es imperceptible, así que la elección real
  es **legibilidad y robustez (iterativa) vs elegancia matemática y $O(1)$ (forma cerrada)**.

**Referencias.**

- [Número triangular](https://en.wikipedia.org/wiki/Triangular_number) - $T(K)=\dfrac{K(K+1)}{2}$
- [Número tetraédrico](https://en.wikipedia.org/wiki/Tetrahedral_number) - $\operatorname{Tet}(K)=\dfrac{K(K+1)(K+2)}{6}$
- [Ecuación cuadrática - fórmula resolvente](https://en.wikipedia.org/wiki/Quadratic_formula)
- [Ecuación cúbica - solución trigonométrica (Cardano)](https://en.wikipedia.org/wiki/Cubic_equation#Trigonometric_and_hyperbolic_solutions)

