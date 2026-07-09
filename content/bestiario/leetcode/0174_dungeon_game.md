---
title: LeetCode#0174 - Dungeon Game
tags:
  - b/leetcode
---
## Nombre y enunciado

Los demonios han capturado a la princesa y la han encerrado en la esquina inferior derecha de una mazmorra representada por una [[array#Ejemplo de código|matriz]] bidimensional `dungeon[m][n]`.

Un caballero comienza en la celda superior izquierda `(0,0)` y debe rescatarla. Solo puede moverse **hacia la derecha** o **hacia abajo**. Cada celda tiene un valor entero: negativo si le quita vida, cero si no tiene efecto, positivo si le otorga vida. El caballero muere si su vida llega a **0 o menos** en cualquier momento.

**Problema:** Calcular la **mínima vida inicial** necesaria para que el caballero llegue hasta la princesa con vida.

[Problema original](https://leetcode.com/problems/dungeon-game/)

---

## Intuición

El problema no es trivial porque:

- No basta con minimizar el daño recibido ni con maximizar la vida recuperada.
- Es necesario garantizar que el caballero sobreviva **en cada paso del recorrido**.
- Una celda con mucha vida recuperada al final puede no compensar un daño letal al comienzo.

La clave está en analizar el problema **desde el destino hacia el inicio**: en cada celda se pregunta cuánta vida hace falta para llegar al destino desde ahí, en lugar de cuánta vida queda acumulada al llegar.

---

## Definición formal

**Entrada:** Una matriz `dungeon[m][n]` de enteros.

**Salida:** Un entero positivo: la mínima vida inicial necesaria.

**Restricciones:**
- $1 \le m, n \le 200$
- $-1000 \le \text{dungeon[i][j]} \le 1000$

---

## Ejemplo concreto

**Entrada:**

```text
[-2, -3,  3]
[-5,-10,  1]
[10, 30, -5]
```

**Salida:** `7`

**Camino óptimo:** Derecha → Derecha → Abajo → Abajo

Simulación con vida inicial 7:

| Celda  | Valor | Vida resultante |
|--------|-------|-----------------|
| (0, 0) |  −2   | 7 − 2 = 5       |
| (0, 1) |  −3   | 5 − 3 = 2       |
| (0, 2) |  +3   | 2 + 3 = 5       |
| (1, 2) |  +1   | 5 + 1 = 6       |
| (2, 2) |  −5   | 6 − 5 = 1 ✓     |

La vida nunca cae a 0 o menos. Con vida inicial 6, en `(0,1)` quedaría con 1 y en `(2,2)` terminaría en 0 → muerte.

---

## Por dónde empezar

Una primera aproximación es fuerza bruta: explorar todos los caminos posibles de `(0,0)` a `(m-1, n-1)`, calcular la vida mínima necesaria para sobrevivir cada uno y quedarse con el menor. Esto permite verificar resultados pero escala exponencialmente.

La solución más eficiente es Programación Dinámica: cada celda depende del resultado de la celda de abajo y de la celda de la derecha, por lo que conviene resolver primero el destino y propagar los resultados hacia el origen. Cada celda se resuelve una sola vez en tiempo constante. Hay dos formas de implementar esta idea:
- **Top-down**: recursión con memoización, empezando en `(0,0)` y resolviendo cada subproblema la primera vez que se necesita.
- **Bottom-up**: iteración explícita desde el destino hacia el origen, resolviendo cada celda en el orden correcto sin recursión.

---

## Soluciones disponibles

- [[0174_dungeon_game-fuerza-bruta]]
- [[0174_dungeon_game-pd-top-down]]
- [[0174_dungeon_game-pd-bottom-up]]
