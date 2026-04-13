---
title: 'Cotas'
tags: [b/complejidad]
---

¿Cuáles de estas afirmaciones son verdaderas?
Recordá: la consigna asume que se busca una cota ajustada, no la más grande posible.

$n \in O(1)$
<details>
  <summary>Ver respuesta</summary>

**Falso.** $O(1)$ significa tiempo constante. $n$ crece sin límite, no puede estar acotada por una constante. Para cota ajustada, $n \in O(n)$.
</details>

---

$500 \in O(n)$
<details>
  <summary>Ver respuesta</summary>

**Verdadero** pero no es cota ajustada. $500$ es constante, así que $500 \in O(1)$. Decir $O(n)$ es correcto matemáticamente ($500 \leq c \cdot n$ para todo $n \geq 1$ con $c=500$), pero no es ajustado.
</details>

---

$4n \in O(4^n)$
<details>
  <summary>Ver respuesta</summary>

**Falso** como cota ajustada. $4n$ crece linealmente, no exponencialmente. La cota ajustada es $O(n)$, no $O(4^n)$. $O(4^n)$ sería una cota correcta pero muy holgada.
</details>

---

$n^2 + \frac{1}{5}n^3 \in O(n^3)$
<details>
  <summary>Ver respuesta</summary>

**Verdadero.** El término dominante es $n^3$. $n^2 + \frac{1}{5}n^3 \leq c \cdot n^3$ para $c=1$ y $n \geq 1$. Como el término dominante es exactamente $n^3$, $O(n^3)$ es además la cota ajustada.
</details>

----

$n \cdot (n+2)^{2/3} \in O(n^2)$
<details>
  <summary>Ver respuesta</summary>

**Falso** como cota ajustada. $n \cdot (n+2)^{2/3} \approx n^{1 + 2/3} = n^{5/3}$. La cota ajustada es $O(n^{5/3})$, no $O(n^2)$. $O(n^2)$ sería válida pero no ajustada.
</details>

---

$2 \cdot \log_2{n} \in O(\log_4{n})$
<details>
  <summary>Ver respuesta</summary>

**Verdadero.** $\log_4{n} = \frac{\log_2{n}}{\log_2{4}} = \frac{\log_2{n}}{2}$. Entonces $2 \cdot \log_2{n} = 4 \cdot \log_4{n}$. Son proporcionales: ambos crecen igual de rápido. $O(\log{n})$ es la misma clase sin importar la base.
</details>

---

$3^n \in O(2^n)$
<details>
  <summary>Ver respuesta</summary>

**Falso.** $3^n/2^n = (3/2)^n \to \infty$. Es decir, $3^n$ crece mucho más rápido que $2^n$, no puede estar acotada por ella. $O(3^n) \not\subset O(2^n)$.
</details>