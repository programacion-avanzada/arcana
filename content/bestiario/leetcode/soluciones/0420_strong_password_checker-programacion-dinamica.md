---
title: 'LeetCode0420 - Strong Password Checker - Programación Dinámica'
tags:
  - leetcode
  - solucion
---

## Técnicas utilizadas
**Programación Dinámica (Top-Down con Memorización):** El problema se presta para ser resuelto mediante programación dinámica, ya que la solución global óptima (minimizar el total de modificaciones) depende directamente de tomar decisiones óptimas locales sobre componentes aislados (las rachas individuales). Para una cantidad dada de borrados disponibles, el mínimo global de reemplazos remanentes se construye combinando la mejor decisión tomada para la racha actual (borrar $0, 1, \dots, b$ caracteres) con la solución óptima ya calculada para las rachas siguientes con los borrados restantes ($borrados - b$).<br>
Ademas, existe un **subproblema superpuesto**: la misma racha puede ser evaluada múltiples veces con diferentes cantidades de borrados disponibles, lo que hace que la memorización sea una estrategia eficiente para evitar cálculos redundantes.



## Idea de la solución

Se simplifica el análisis de la contraseña reduciéndola a un conjunto de componentes aislados: cantidad de tipos faltantes y una lista con las longitudes de las `rachas` de caracteres repetidos ($\ge 3$), abstrayéndose de los caracteres específicos.

**Longitud de la contraseña ($n$) y Operaciones Obligatorias:**
   - Si $n < 6$, existe un déficit de caracteres. Las `inserciones obligatorias` se calculan como $6 - n$.
   - Si $n > 20$, existe un exceso de caracteres. Los `borrados obligatorios` se calculan como $n - 20$.
   - Si $6 \le n \le 20$, las operaciones obligatorias por tamaño son $0$.

**Longitud de una Racha ($L$) y la cantidad de `Reemplazos necesarios`:**
   - Una racha de caracteres idénticos de longitud $L$ requiere inicialmente de $\lfloor L / 3 \rfloor$ reemplazos para ser completamente eliminada. Por ejemplo, `"aaa"` ($L=3$) requiere $3 // 3 = 1$ reemplazo (`"aBa"`), mientras que `"aaaaaaa"` ($L=7$) requiere $7 // 3 = 2$ reemplazos (`"aaBaaCa"`).

**El Impacto de los Borrados sobre las Rachas y Reemplazos:**
   - Borrar caracteres dentro de una racha reduce su longitud, lo que a su vez puede disminuir los reemplazos necesarios. Sin embargo, el impacto no es lineal y depende del residuo matemático de la racha ($L \pmod 3$):
     - Si $L \pmod 3 == 0$ (ej. $L=3$), borrar **1** carácter reduce la racha a tamaño 2, eliminando la necesidad de reemplazos inmediatamente (ahorro de 1 reemplazo por 1 borrado).
     - Si $L \pmod 3 == 1$ (ej. $L=4$), se necesitan borrar **2** caracteres para reducir los reemplazos.
     - Si $L \pmod 3 == 2$ (ej. $L=5$), se necesitan borrar **3** caracteres para reducir los reemplazos.
   - La Programación Dinámica se encarga de probar todas las distribuciones posibles de los `borrados obligatorios` sobre las distintas rachas para encontrar **la combinación que cause la mayor reducción de reemplazos pendientes**.

**La Ecuación Maestra Unificada:**
   - Las operaciones finales se componen de los `borradosObligatorios` más el valor máximo entre: la **cantidad de reemplazos optimizada**, los **tipos de caracteres faltantes** y las **inserciones obligatorias**. Esto se debe a que una **inserción** o un **reemplazo** estratégicos pueden solucionar simultáneamente un problema de racha y aportar un tipo de carácter faltante (por ejemplo, insertar o reemplazar por una mayúscula en medio de `"aaa"` -> `"aaB"`).

$$
 modificaciones\ minimas = borradosObligatorios + \max(reemplazos, tiposFaltantes, insercionesObligatorias)
$$


## Código

```python
def strongPasswordCheckerDP(password: str) -> int:
    n = len(password)

    # Obtiene la cantidad de tipos de caracteres faltantes (mayúscula, minúscula, dígito)
    tiposFaltantes = obtenerTiposFaltantes(password)
    # Obtiene una lista con la longitud de las rachas de caracteres repetidos
    rachas = obtenerLongitudRachas(password, n)

    # Si la contraseña es demasiado larga, necesitamos borrar caracteres.
    borradosObligatorios = max(0, n - 20)

    # Si la contraseña es demasiado corta, necesitamos insertar caracteres.
    insercionesObligatorias = max(0, 6 - n)
    
    # Map para memoización de resultados
    memo = {}

    # Optimiza la cantidad de reemplazos necesarios considerando los borrados disponibles
    reemplazosRestantes = optimizarRachas(0, borradosObligatorios, rachas, memo)
    
    # El resultado final es la suma de los borrados obligatorios, los reemplazos restantes 
    # y los caracteres faltantes o inserciones necesarias.
    return borradosObligatorios + max(reemplazosRestantes, tiposFaltantes, insercionesObligatorias)

def obtenerTiposFaltantes(password: str) -> int:
    mayus, minus, digito = 0, 0, 0
    for c in password:
        if c.isupper():
            mayus = 1
        elif c.islower():
            minus = 1
        elif c.isdigit():
            digito = 1
    return 3 - (mayus + minus + digito)


def obtenerLongitudRachas(password: str, n: int) -> list:
    rachas = []
    i = 0
    while i < n:
        j = i
        while j < n and password[j] == password[i]:
            j += 1
        longitudRacha = j - i
        if longitudRacha >= 3:
            rachas.append(longitudRacha)
        i = j
    return rachas


# La funcion busca optimizar la cantidad de reemplazos necesarios considerando los borrados disponibles
def optimizarRachas(idx: int, borradosDisponibles: int, rachas: list, memo: dict) -> int:
    # Caso base: si pasamos por todas las rachas, no se necesitan más reemplazos
    if idx == len(rachas):
        return 0
        
    key = f"{idx}-{borradosDisponibles}"
    # Si ya calculamos el resultado para esta clave, lo devolvemos desde la memoización
    if key in memo:
        return memo[key]
        
    rachaActual = rachas[idx]
    # Inicializamos el mínimo de reemplazos necesarios como infinito
    minimoReemplazos = float('inf')
    
    # Los últimos 2 caracteres de una racha no hacen falta borrarlos para cortarla, por lo que
    # el máximo de borrados útiles es la longitud de la racha menos 2, si no es mayor que los borrados disponibles.
    maxBorradosUtiles = min(borradosDisponibles, rachaActual - 2)
    
    # Ramificamos: no borramos nada, borramos 1, borramos 2, ..., hasta maxBorradosUtiles
    for b in range(maxBorradosUtiles + 1):

        nuevaLongitud = rachaActual - b

        # Reemplazos necesarios para cortar la racha despues de borrar b caracteres. 
        # Si la nueva longitud es menor que 3, no se necesitan reemplazos.
        reemplazosNecesarios = 0 if nuevaLongitud < 3 else nuevaLongitud // 3

        # Calculamos el costo futuro llamando recursivamente a la función para la siguiente racha
        reemplazosSiguienteRacha = optimizarRachas(idx + 1, borradosDisponibles - b, rachas, memo)

        # Actualizamos el mínimo de reemplazos necesarios considerando la opción actual
        minimoReemplazos = min(minimoReemplazos, reemplazosNecesarios + reemplazosSiguienteRacha)
        
    # Guardamos el resultado en la memoización para evitar cálculos repetidos
    memo[key] = minimoReemplazos
    return minimoReemplazos


```
## Traza de ejemplo

Instancia de prueba: `password = "aaaaaaaaabccccccddd123456789"` ($n = 28$)

`tiposFaltantes = 1` (Tiene minúsculas y dígitos; falta mayúscula).

`rachas = [9, 6, 3]` (Índices de racha 0, 1 y 2 respectivamente, correspondientes a 'a', 'c' y 'd').

`borradosObligatorios` = $= \max(0, 28 - 20) = \mathbf{8}$.

`insercionesObligatorias = 0`.

Llamada inicial: `optimizarRachas(idx=0, borradosDisponibles=8, rachas, memo)`

| Estado (idx-borradosDisponibles) | Acción / Resultado | ¿Calculado o Memorizado? |
|-----------------------------------|--------------------|--------------------------|
| 0-8 | Evalúa racha 0 ("aaaaaaaaa", $L = 9$).<br>`maxBorradosUtiles` = $\min(8, 9-2) = 7$.<br>Prueba $b=0$ (no borra).<br>`reemplazosNecesarios` $= 3$.<br>Llama a (1-8). | Calculando |
| 0-8 → 1-8 | Evalúa racha 1 ("cccccc", $L = 6$).<br>`maxBorradosUtiles` = $\min(8, 6-2) = 4$.<br>Prueba $b=0$ (no borra).<br>`reemplazosNecesarios` $= 2$.<br>Llama a (2-8). | Calculando |
| 0-8 → 1-8 → 2-8 | Última racha ("ddd", $L = 3$).<br>`maxBorradosUtiles` = $\min(8, 3-2) = 1$.<br> $b=0\rightarrow 1$ reemplazo.<br> $b=1\rightarrow 0$ reemplazos.<br>Guarda memo["2-8"] = 0.<br>Retorna 0. | Calculando y guarda en memo |
| 0-8 → 1-8 | Evalúa racha 1 ("cccccc", $L = 6$).<br>`minimoReemplazos` local = $2 \text{ (local)} + 0 \text{ (futuro)} = 2$.<br>Avanza a $b=1$ ("ccc,cc").<br>`reemplazosNecesarios` $= 1$.<br>Llama a (2-7). | Calculando |
| 0-8 → 1-8 → 2-7 | Última racha ("ddd", $L = 3$).<br>`maxBorradosUtiles` = $\min(7, 3-2) = 1$.<br> $b=0\rightarrow 1$ reemplazo.<br> $b=1\rightarrow 0$ reemplazos.<br>Guarda memo["2-7"] = 0.<br>Retorna 0. | Calculando y guarda en memo |
| 0-8 → 1-8 | Evalúa racha 1 ("cccccc", $L = 6$).<br>`minimoReemplazos` local = $1 \text{ (local)} + 0 \text{ (futuro)} = 1$.<br>Avanza a $b=2$ ("ccc,c").<br>`reemplazosNecesarios` $= 1$.<br>Llama a (2-6). | Calculando |
| 0-8 → 1-8 → 2-6 | Última racha ("ddd", $L = 3$).<br>`maxBorradosUtiles` = $\min(6, 3-2) = 1$.<br> $b=0\rightarrow 1$ reemplazo.<br> $b=1\rightarrow 0$ reemplazos.<br>Guarda memo["2-6"] = 0.<br>Retorna 0. | Calculando y guarda en memo |
| 0-8 → 1-8 | Evalúa racha 1 ("cccccc", $L = 6$).<br>Avanza a $b=3$ ("ccc,").<br>`reemplazosNecesarios` $= 1$.<br>Llama a (2-5). | Calculando |
| 0-8 → 1-8 → 2-5 | Última racha ("ddd", $L = 3$).<br>`maxBorradosUtiles` = $\min(5, 3-2) = 1$.<br> $b=0\rightarrow 1$ reemplazo.<br> $b=1\rightarrow 0$ reemplazos.<br>Guarda memo["2-5"] = 0.<br>Retorna 0. | Calculando y guarda en memo |
| 0-8 → 1-8 | Evalúa racha 1 ("cccccc", $L = 6$).<br>Avanza a $b=4$ ("cc").<br>`reemplazosNecesarios` $= 0$.<br>Llama a (2-4). | Calculando |
| 0-8 → 1-8 → 2-4 | Última racha ("ddd", $L = 3$).<br>`maxBorradosUtiles` = $\min(4, 3-2) = 1$.<br> $b=0\rightarrow 1$ reemplazo.<br> $b=1\rightarrow 0$ reemplazos.<br>Guarda memo["2-4"] = 0.<br>Retorna 0. | Calculando y guarda en memo |
| 0-8 → 1-8| Evalúa racha 1 ("cccccc", $L = 6$).<br>`minimoReemplazos` local = $0 \text{ (local)} + 0 \text{ (futuro)} = 0$.<br>Guarda memo["1-8"]<br>Retorna `minimoReemplazos` = 0. | Calculando |
| 0-8 | Evalúa racha 0 ("aaaaaaaaa", $L = 9$).<br>`minimoReemplazos` local = $3 \text{ (local)} + 0 \text{ (futuro)} = 3$.<br>Avanza a $b=1$ ("aaa,aaa,aa").<br>`reemplazosNecesarios` $= 2$.<br>Llama a (1-7). | Calculando |
| 0-8 → 1-7 | Evalúa racha 1 ("cccccc", $L = 6$).<br>`maxBorradosUtiles` = $\min(7, 6-2) = 4$.<br>Prueba $b=0$ (no borra).<br>`reemplazosNecesarios` $= 2$.<br>Llama a (2-7). | Calculando |
| 0-8 → 1-7 → 2-7 | Evita volver a procesar el árbol.<br>Devuelve memo["2-7"] que es 0 en $\mathcal{O}(1)$. | ¡MEMORIZADO! |
| 0-8 → 1-7 | Evalúa racha 1 ("cccccc", $L = 6$).<br>Avanza a $b=1$ ("ccc,cc").<br>`reemplazosNecesarios` $= 1$.<br>Llama a (2-6). | Calculando |
| 0-8 → 1-7 → 2-6 | Evita volver a procesar el árbol.<br>Devuelve memo["2-6"] que es 0 en $\mathcal{O}(1)$. | ¡MEMORIZADO! |
|...|...|...|


Tras evaluar todas las ramificaciones posibles de los bucles, el algoritmo determina que la distribución óptima para consumir los $8$ `borradosObligatorios` consiste en aplicar 7 borrados en la racha 0 (dejándola en tamaño $2 \rightarrow 0$ reemplazos), 0 borrados en la racha 1 (dejándola en tamaño $6 \rightarrow 2$ reemplazos) y 1 borrado en la racha 2 (dejándola en tamaño $2 \rightarrow 0$ reemplazos). Logrando así un total de $2$ `reemplazosRestantes` tras optimizar los borrados.

Resultado final mediante la Ecuación Maestra:

$$
\text{modificaciones mínimas} = \text{borrados obligatorios} + \max(\text{reemplazos restantes}, \text{tipos faltantes}, \text{inserciones obligatorias})
$$

$$
8 + \max(2, 1, 0) = 8 + 2 = \mathbf{10}
$$



Como los $2$ reemplazos que quedaron pendientes tras optimizar los borrados son numéricamente mayores que el único tipo de carácter que nos faltaba ($2 > 1$), esos mismos $2$ reemplazos se eligen estratégicamente. Al momento de modificar los caracteres para romper la racha restante de las 'c', uno de esos cambios se realiza introduciendo la letra mayúscula requerida. De esta manera, se soluciona el problema de contenido y el de estructura en simultáneo, sin necesidad de agregar operaciones extras al total.

## Complejidad
### Temporal
$\mathcal{O}(R \times B \times L)$, donde $R$ es la cantidad de rachas, $B$ son los borrados obligatorios ($n - 20$) y $L$ es la longitud máxima de una racha. El espacio de estados del [[map]] está estrictamente acotado por $R \times B$. Para resolver cada estado de forma única, el bucle for realiza a lo sumo $L$ iteraciones.
### Espacial
$\mathcal{O}(R \times B) + \mathcal{O}(R)$. Requiere memoria para almacenar el [[map]] memo con las combinaciones únicas de estados. Adicionalmente, el stack de llamadas de la recursividad consume espacio proporcional a la cantidad de rachas ($R$).

## Cuándo usar esta técnica
### Favorable cuando
- El espacio de estados de las variables es acotado (idx y borrados tienen límites máximos pequeños debido a las restricciones físicas del problema), lo que evita que la estructura de memorización crezca descontroladamente.
- Se busca un código altamente mantenible y adaptativo, donde cambiar las reglas básicas (como el tamaño máximo de la contraseña o la longitud de las rachas toleradas) no requiera rediseñar la lógica matemática desde cero.
### Limitaciones
- No escala bien si las restricciones del problema cambian a longitudes extremadamente grandes (ej. $n \ge 10^5$), ya que la creación dinámica de texto tipo [[string]] para las keys del [[map]] y el almacenamiento masivo de estados provocarían un consumo de memoria excesivo.
- Esta solución realiza trabajo redundante al explorar y evaluar ramificaciones de borrado ineficientes que el enfoque Greedy descarta de antemano mediante reglas de prioridad fijas.

### Comparación con la solución Greedy
El enfoque [[0420_strong_password_checker-greedy]] resuelve el escenario en $\mathcal{O}(n)$ de tiempo y $\mathcal{O}(1)$ de espacio utilizando una prioridad matemática rígida basada en el módulo de la longitud de las rachas ($L \pmod 3$).

La solución por Programación Dinámica es ligeramente más costosa en memoria, pero tiene la enorme ventaja de ser mucho más intuitiva de diseñar y deducir, ya que no requiere descubrir "el truco matemático oculto" para coordinar las prioridades de los borrados; la DP encuentra la combinación óptima de forma natural explorando inteligentemente el espacio de soluciones.

## Referencias
- **GeeksforGeeks.** [Dynamic Programming](https://www.geeksforgeeks.org/dynamic-programming/). Artículo detallado sobre los principios y aplicaciones de la programación dinámica.
- **Diccionario de memoria (Memoization):** Referencia interna a la estructura [[map]] utilizada para evitar el recálculo del árbol de decisiones.
