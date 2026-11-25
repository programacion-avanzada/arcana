---
title: 'OIA2018 - Creando un emporio'
tags:
  - oia
  - bestia
---

## Nombre y enunciado

Un empresario quiere transformar el pueblo de Líteltaun en un emporio comercial. El pueblo tiene **P puntos de interés** y **R rutas** bidireccionales que los conectan, y desde cualquier punto se puede llegar a cualquier otro.

El empresario va a instalar **paseos comerciales** sobre algunas rutas, con una condición: una vez instalados, tiene que poder viajarse entre cualquier par de puntos de interés **usando solamente rutas con paseo**.

Cada ruta *i* tiene:
- $t_i$: personas que la transitan por día,
- $d_i$: dinero promedio que gasta cada persona en un paseo instalado ahí (100 % ganancia),
- $m_i$: costo fijo diario de mantenimiento del paseo.

Una ruta sin paseo no genera ni costo ni ganancia.

**Problema:** elegir el conjunto de rutas donde instalar paseos de modo que el pueblo quede conectado y la ganancia diaria total sea máxima. Hay que devolver la ganancia y las rutas elegidas. La ganancia puede ser negativa si no hay forma de conectar el pueblo sin perder dinero.

[Problema original – Certamen Nacional OIA 2018, Nivel 3, Problema 2 (`emporio`)](https://www.oia.unsam.edu.ar/wp-content/uploads/2020/03/solucionario-2018.pdf) (en el solucionario oficial, pág. 79). Contribución de Agustín Santiago Gutiérrez.

---

## Intuición

Si se reemplaza cada ruta por su **ganancia neta** $g_i = t_i \cdot d_i - m_i$, el pueblo se convierte en un [[grafo]] ponderado y el problema pasa a ser: elegir un subconjunto de aristas que conecte todos los vértices y maximice la suma de pesos.

Se parece mucho al **árbol generador** (mínimo o máximo), pero con una diferencia importante: **no hace falta que el resultado sea un árbol**. Toda ruta con ganancia positiva conviene agregarla aunque forme un ciclo, porque solo suma. Las rutas con ganancia negativa, en cambio, se agregan únicamente si son imprescindibles para conectar el pueblo, y en ese caso conviene elegir las que menos pierden.

Lo interesante es que una pequeña variante del [[algoritmo de Kruskal]] resuelve exactamente esto. Las subtareas del enunciado van guiando hacia esa idea:

| Subtarea | Restricción | Qué queda del problema |
|---|---|---|
| Tipo 1 | $m_i = 0$ | Toda ganancia es $\geq 0$: se toman **todas** las rutas. |
| Tipo 2 | $t_i = 0,\ m_i = 1$ | Toda ruta cuesta 1: cualquier árbol generador sirve, ganancia $-(P-1)$. |
| Tipo 3 | $t_i = 0$ | Solo hay costos: es un **árbol generador mínimo** clásico. |
| Tipo 4 | sin restricción | Árbol generador mínimo + todas las rutas con ganancia positiva. |

Cada tipo se evalúa además con tres tamaños: $R \le 15$, $R \le 1.000$ y $R \le 500.000$. Con $R \le 15$ alcanza con probar todo; los tamaños grandes obligan a encontrar la idea greedy.

---

## Definición formal

**Entrada:**
- $P$: cantidad de puntos de interés (vértices), numerados de $0$ a $P-1$.
- $R$ rutas; la ruta $i$ une $a_i$ con $b_i$ y tiene valores $t_i$, $d_i$, $m_i$.
- Se garantiza que el grafo es conexo.

**Salida:**
- La máxima ganancia $G^* = \max_{S} \sum_{i \in S} (t_i \cdot d_i - m_i)$, donde $S \subseteq \{0, \dots, R-1\}$ es tal que el subgrafo $(\{0,\dots,P-1\}, S)$ es **conexo**.
- Un conjunto $S$ (sin repetidos) que alcance $G^*$.

**Restricciones:**
- $2 \le P \le 100.000$
- $1 \le R \le 500.000$
- $0 \le a_i, b_i < P$, $a_i \ne b_i$
- $0 \le t_i, d_i \le 10^6$
- $0 \le m_i \le 10^9$

Como el grafo es conexo, $R \ge P - 1$ (o sea, $P \le R + 1$).

> Como $t_i \cdot d_i$ puede llegar a $10^{12}$ y hay hasta $5 \cdot 10^5$ rutas, la ganancia total puede rondar $5 \cdot 10^{17}$: hace falta un entero de 64 bits (`long long` / `ENTERO LARGO`).

---

## Ejemplo concreto

Entrada:

```
6 7
0 1 3 4 10
2 0 5 5 22
2 1 3 1 0
3 4 1 1 0
5 4 1 0 1
2 3 2 4 10
3 5 1 5 1
```

Calculamos la ganancia neta $g_i = t_i \cdot d_i - m_i$ de cada ruta:

| Ruta | Une | $t \cdot d$ | $m$ | $g$ |
|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 – 1 | 12 | 10 | **+2** |
| 1 | 2 – 0 | 25 | 22 | **+3** |
| 2 | 2 – 1 | 3 | 0 | **+3** |
| 3 | 3 – 4 | 1 | 0 | **+1** |
| 4 | 5 – 4 | 0 | 1 | **−1** |
| 5 | 2 – 3 | 8 | 10 | **−2** |
| 6 | 3 – 5 | 5 | 1 | **+4** |

El grafo son dos triángulos, $\{0,1,2\}$ y $\{3,4,5\}$, unidos por la ruta 5 (un **puente**).

- Las rutas 0, 1, 2, 3 y 6 tienen ganancia positiva: se toman todas → $2+3+3+1+4 = 13$.
- Con eso, $\{0,1,2\}$ queda conectado y $\{3,4,5\}$ también (3–4 y 3–5).
- La ruta 4 pierde dinero y no hace falta: 4 y 5 ya están conectados a través de 3. Se descarta.
- La ruta 5 pierde dinero, pero es la única que une los dos triángulos: es inevitable. $13 - 2 = 11$.

Salida:

```
11
0 1 2 3 5 6
```

(El orden de las rutas no importa; el enunciado muestra `0 2 1 3 5 6`, que es el mismo conjunto).

---

## Por dónde empezar

Lo más directo es **fuerza bruta**: probar los $2^R$ subconjuntos de rutas, descartar los que no conectan el pueblo y quedarse con el de mayor ganancia. Sirve para las subtareas con $R \le 15$ y como referencia para validar otras soluciones.

El paso clave para mejorar es reducir cada ruta a un único número, su ganancia neta $g_i$, y separar dos decisiones:
1. Las rutas con $g_i > 0$ se toman siempre: nunca empeoran la solución.
2. Para lo que falte conectar, hay que elegir rutas "baratas" sin formar ciclos inútiles, que es justamente lo que hace un árbol generador mínimo.

Ambas decisiones se unen en un solo recorrido **greedy** al estilo Kruskal: ordenar las rutas de mayor a menor ganancia e ir agregándolas mientras unan componentes distintas o mientras su ganancia sea positiva.

---

## Soluciones disponibles

- [[oia2018_emporio-fuerza-bruta]]
- [[oia2018_emporio-greedy]]
