
## Nombre y enunciado

Un colectivo escolar recoge alumnos de un barrio lejano y viaja todas las mañanas hasta una escuela, eligiendo siempre el recorrido más corto posible. La ciudad se representa como un mapa de esquinas conectadas por calles de una sola mano con una distancia determinada.

Con el objetivo de reducir el tiempo de viaje matutino, el intendente ofrece cambiar el sentido de circulación de **a lo sumo una calle** cualquiera de la ciudad.

**Problema:** Dada la red vial de la ciudad, la esquina de partida del colectivo y la esquina donde se ubica la escuela, determinar:

1. La distancia del recorrido más corto actual (sin modificaciones).
2. La distancia mínima posible tras invertir el sentido de una única calle.
3. El número identificador de la calle que conviene invertir para lograr dicha reducción (o indicar si no existe mejora posible).

[Problema original](https://www.oia.unsam.edu.ar/_media/prob/c3a13n3p3.pdf)

---
## Intuición


### OEIS

---
## Definición formal

---
## Ejemplo concreto
Consideremos una ciudad con $E = 8$ esquinas, partida en $S = 2$, escuela en $T = 7$ y $C = 13$ calles:

```
8 2 7
13
2 4 4
2 1 5
2 3 2
3 1 3
4 1 4
7 5 3
1 5 3
1 6 7
8 4 2
6 8 1
8 7 6
6 7 8
5 3 2
```
![[Cambio_de_mano_base.svg]]
- **Recorrido original más corto (**$2 \to 7$**):** El camino óptimo sin cambios es $2 \xrightarrow{2} 3 \xrightarrow{3} 1 \xrightarrow{7} 6 \xrightarrow{1} 8 \xrightarrow{6} 7$, con una longitud total de:  
![[Cambio_de_mano_de_una calle_original.svg]]
$$2 + 3 + 7 + 1 + 6 = 19 \text{ decámetros}$$
- **Evaluación de cambio de mano:** La calle número **6** va originalmente de la esquina $7$ a la esquina $5$ con distancia $3$ (`7 5 3`). Si se invierte su sentido para que vaya de $5 \to 7$ con costo $3$, se habilita el camino:  
![[Cambio_de_mano_de_una calle_invertida.svg]]
Cuya distancia total es:  
$$2 + 3 + 3 + 3 = 11 \text{ decámetros}$$
- **Resultado:** Se imprime `19`, `11` y `6`.
---
## Por dónde empezar

---

## Soluciones disponibles

- [[Cambio de mano de una calle - Fuerza bruta]]
- [[Cambio de mano de una calle - otro metodo]]
