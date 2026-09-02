---
title: 'Nociones de Complejidad'
tags:
  - complejidad
  - desafio
  - resuelto
---
Si tenés 1 segundo para correr tu algoritmo y una PC1 que hace $10^6$ ops/seg, ¿cuántos elementos podés procesar con cada complejidad? ¿Y en una computadora PC2 que es 1000 veces más rápida que PC1?

Confeccionemos esta tabla:

| Complejidad   | Elementos (PC1)  | Elementos (PC2)  |
|---------------|------------------|------------------|
| $O(1)$        |                  |                  |
| $O(\log n)$   |                  |                  |
| $O(n)$        |                  |                  |
| $O(n \log n)$ |                  |                  |
| $O(n^2)$      |                  |                  |
| $O(2^n)$      |                  |                  |

<details>
  <summary>Ver ayuda</summary>

| Complejidad     | Ecuación (PC1, $10^6$ ops)                          | Ecuación (PC2, $10^9$ ops)                          |
|-----------------|------------------------------------------------------|------------------------------------------------------|
| $O(1)$          | no depende de $n$                                     | no depende de $n$                                     |
| $O(\log n)$     | $\log_2 n = 10^6 \Rightarrow n = 2^{10^6}$            | $\log_2 n = 10^9 \Rightarrow n = 2^{10^9}$            |
| $O(n)$          | $n = 10^6$                                             | $n = 10^9$                                             |
| $O(n \log n)$   | $n \log_2 n = 10^6$                                    | $n \log_2 n = 10^9$                                    |
| $O(n^2)$        | $n^2 = 10^6 \Rightarrow n = \sqrt{10^6}$               | $n^2 = 10^9 \Rightarrow n = \sqrt{10^9}$               |
| $O(2^n)$        | $2^n = 10^6 \Rightarrow n = \log_2(10^6)$              | $2^n = 10^9 \Rightarrow n = \log_2(10^9)$              |

</details>

<details>
  <summary>Ver respuesta</summary>

| Complejidad     | Elementos (PC1)                          | Elementos (PC2)                             |
|-----------------|-------------------------------------------|----------------------------------------------|
| $O(1)$          | ilimitado                                  | ilimitado                                     |
| $O(\log n)$     | $2^{1.000.000}$ (número inmenso)           | $2^{1.000.000.000}$ (aún más inmenso)         |
| $O(n)$          | $1.000.000$                                | $1.000.000.000$                               |
| $O(n \log n)$   | $\approx 62.700$                           | $\approx 39.600.000$                          |
| $O(n^2)$        | $1.000$                                    | $\approx 31.623$                              |
| $O(2^n)$        | $19$                                       | $29$                                          |

</details>
