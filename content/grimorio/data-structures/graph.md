---
title: Graph
tags:
  - data-structures
alias:
  - grafo
  - grafos
  - red
---
## 1. Qué es y cómo funciona

### Intuición

Muchos problemas no son lineales ni jerárquicos: son relaciones arbitrarias entre entidades. Pensá en una red social (personas que se siguen entre sí), un mapa de rutas (ciudades conectadas por caminos) o las materias de una carrera (algunas son correlativas de otras). Una [[linked list]] solo modela "uno sigue a otro" y un árbol solo modela "un padre, varios hijos", pero ninguna de las dos alcanza para representar relaciones de muchos a muchos.

Un Grafo resuelve esto modelando el problema como un conjunto de **entidades** (nodos o vértices) y un conjunto de **relaciones** entre pares de esas entidades (aristas o edges). Es la estructura más general para representar conexiones: tanto la lista como el árbol son, en el fondo, casos particulares de grafo con restricciones adicionales.

### Definición / propiedades

Un Grafo se define formalmente como un par $G = (V, E)$, donde:

- $V$ es el conjunto de **vértices** (nodos).
- $E$ es el conjunto de **aristas** (pares de vértices), con $E \subseteq V \times V$.

**Propiedades clave:**

- **Dirigido vs. no dirigido:** en un grafo dirigido, la arista $(u, v)$ tiene sentido de $u$ a $v$ y no implica $(v, u)$. En uno no dirigido, la conexión es simétrica.
- **Ponderado vs. no ponderado:** las aristas pueden tener un peso o costo asociado (ej. distancia, tiempo) o simplemente indicar presencia/ausencia de relación.
- **Grado de un vértice:** cantidad de aristas incidentes a él. En dirigidos se distingue grado de entrada (in-degree) y de salida (out-degree).
- **Camino:** secuencia de vértices conectados por aristas. Un **ciclo** es un camino que vuelve al vértice de origen.
- **Conectividad:** un grafo es conexo si existe un camino entre cualquier par de vértices. Un DAG (*Directed Acyclic Graph*) es un grafo dirigido sin ciclos.
- **Densidad:** un grafo es *disperso* (sparse) si $|E|$ es cercano a $|V|$, y *denso* si se acerca a $|V|^2$.

![Comparación entre un grafo disperso y uno denso, ambos con 6 vértices](/attachments/grimorio/data-structures/denso-disperso.svg)

*El grafo disperso tiene 6 aristas (una cantidad cercana a $|V|$); el denso tiene las 15 aristas posibles entre esos mismos 6 vértices (cercana a $|V|^2$).*

### Representación

Hay dos formas principales de representar un grafo en memoria:

**Lista de adyacencia:** cada vértice guarda una lista con sus vecinos.

![Diagrama de un grafo dirigido junto a su representación como lista de adyacencia](/attachments/grimorio/data-structures/lista-adyacencia.svg)

*Grafo dirigido con vértices A, B, C, D: cada vértice guarda únicamente la lista de sus vecinos de salida (A → [B, C], B → [A, C], C → [D], D → [C]).*

**Matriz de adyacencia:** una matriz $|V| \times |V|$ donde la celda $(i, j)$ indica si existe (o el peso de) la arista entre $i$ y $j$.

![Matriz de adyacencia 4x4 para los vértices A, B, C, D](/attachments/grimorio/data-structures/matriz-adyacencia.svg)

*Matriz $|V| \times |V|$ para los vértices A, B, C, D: la celda $(i, j)$ vale 1 si existe la arista de $i$ a $j$, y 0 si no, reservando espacio para todos los pares posibles exista o no la arista.*

La diferencia está en **qué guardan**. La lista almacena solo las aristas que existen: su memoria crece con $|E|$ y pedir los vecinos de un vértice cuesta lo que ese vértice tenga. La matriz reserva una celda para **cada par posible**, exista la arista o no: ocupa siempre $|V|^2$, pero responder "¿hay arista de $u$ a $v$?" es un acceso por índice, en $O(1)$.

Como los grafos reales suelen ser dispersos, **la lista es la opción por defecto**: guardar $|V|^2$ celdas para unas pocas aristas desperdicia casi toda la memoria. La matriz queda para grafos densos o chicos, y para algoritmos que consultan aristas puntuales en un bucle.

---

## 2. Operaciones y complejidad

### Operaciones principales

- **`agregar_vertice(v)`:** incorpora un nuevo vértice al grafo.
- **`agregar_arista(u, v, peso=None)`:** conecta dos vértices, opcionalmente con un peso.
- **`eliminar_arista(u, v)`:** desconecta dos vértices.
- **`eliminar_vertice(v)`:** quita un vértice y todas sus aristas asociadas.
- **`vecinos(v)`:** devuelve los vértices adyacentes a `v`.
- **`existe_arista(u, v)`:** indica si hay conexión directa entre `u` y `v`.
- **`recorrer()`:** visita todos los vértices alcanzables, típicamente con BFS (en anchura) o DFS (en profundidad).

![Comparación del orden de recorrido entre BFS y DFS sobre el mismo grafo](/attachments/grimorio/data-structures/bfs-dfs.svg)

*Sobre el mismo grafo de 6 vértices partiendo de A: BFS lo recorre en el orden A, B, C, D, E, F, agotando cada nivel (con una cola FIFO) antes de bajar al siguiente; DFS se interna en profundidad por una rama antes de retroceder a explorar las demás.*

### Complejidad

Sean $|V|$ la cantidad de vértices y $|E|$ la cantidad de aristas.

| Operación | Lista de adyacencia | Matriz de adyacencia |
| :--- | :--- | :--- |
| `agregar_vertice` | $O(1)$ | $O(\|V\|^2)$<sup>1</sup> |
| `agregar_arista` | $O(1)$ | $O(1)$ |
| `eliminar_arista` | $O(\text{grado}(u))$ | $O(1)$ |
| `eliminar_vertice` | $O(\|V\| + \|E\|)$ | $O(\|V\|^2)$ |
| `existe_arista(u, v)` | $O(\text{grado}(u))$ | $O(1)$ |
| `vecinos(v)` | $O(\text{grado}(v))$ | $O(\|V\|)$ |
| `BFS()` / `DFS()` completos | $O(\lvert V\rvert + \lvert E\rvert)$ | $O(\lvert V\rvert^2)$<sup>2</sup> |
| Espacio | $O(\|V\| + \|E\|)$ | $O(\|V\|^2)$ |

<sup>1</sup>Requiere redimensionar la matriz completa para agregar una fila y columna nuevas.
<sup>2</sup>Por cada vértice, la matriz obliga a revisar las $|V|$ celdas de su fila aunque casi todas estén vacías.

### Detalles operativos

- **Grafos dispersos vs. densos:** con lista de adyacencia, un grafo disperso ($|E| \approx |V|$) usa memoria proporcional a $O(|V|)$; la matriz siempre usa $O(|V|^2)$ sin importar cuántas aristas existan realmente.
- **Aristas paralelas y multigrafos:** salvo que se implemente explícitamente, la mayoría de las representaciones no soportan más de una arista entre el mismo par de vértices.
- **Self-loops:** una arista de un vértice a sí mismo es válida en ambas representaciones, pero debe manejarse con cuidado en algoritmos de recorrido para no generar ciclos infinitos.
- **Grafos dirigidos:** en lista de adyacencia, eliminar un vértice requiere recorrer todas las listas para quitar las referencias entrantes, no solo su propia lista de salida.

---

## 3. Implementación

### Idea de implementación

La forma más común es usar una [[hash table]] (ej. `dict` en Python) donde cada clave es un vértice y el valor es la colección de sus vecinos. Esto combina la flexibilidad de identificar vértices por cualquier tipo hasheable con el acceso eficiente típico de una tabla hash.

### Invariantes

- Toda arista `(u, v)` requiere que tanto `u` como `v` existan como vértices del grafo.
- En un grafo no dirigido, agregar la arista `(u, v)` implica agregar también `(v, u)` en la lista de adyacencia de `v`.
- Eliminar un vértice debe eliminar también todas las aristas que lo referencian, para no dejar referencias colgantes.

### Ejemplo de código

```python
from collections import deque

class Grafo:
    def __init__(self, dirigido=False):
        self.dirigido = dirigido
        self.adyacencia = {}

    def agregar_vertice(self, v):
        self.adyacencia.setdefault(v, {})

    def agregar_arista(self, u, v, peso=1):
        self.agregar_vertice(u)
        self.agregar_vertice(v)
        self.adyacencia[u][v] = peso
        if not self.dirigido:
            self.adyacencia[v][u] = peso

    def vecinos(self, v):
        return self.adyacencia.get(v, {})

    def existe_arista(self, u, v):
        return v in self.vecinos(u)

    def camino_mas_corto(self, inicio, destino):
        """BFS: camino con menos aristas entre dos vértices, o None si no hay."""
        if inicio not in self.adyacencia:
            return None
        previo = {inicio: None}
        cola = deque([inicio])
        while cola:
            actual = cola.popleft()
            if actual == destino:
                camino = []
                while actual is not None:
                    camino.append(actual)
                    actual = previo[actual]
                return camino[::-1]
            for vecino in self.vecinos(actual):
                if vecino not in previo:
                    previo[vecino] = actual
                    cola.append(vecino)
        return None
```

#### Ejemplo de uso típico

Grados de separación: la cadena más corta de compañeros de equipo entre dos Pokémon (dos Pokémon están conectados si compartieron equipo en alguna partida).

```python
red = Grafo()  #no dirigido: si A fue compañero de B, B lo fue de A
for a, b in [("Pikachu", "Charmander"), ("Charmander", "Bulbasaur"), ("Bulbasaur", "Squirtle"),
             ("Pikachu", "Eevee"), ("Eevee", "Squirtle")]:
    red.agregar_arista(a, b)

camino = red.camino_mas_corto("Pikachu", "Squirtle")
print(camino)           #['Pikachu', 'Eevee', 'Squirtle'] (no pasa por Charmander y Bulbasaur)
print(len(camino) - 1)  #2 grados de separación
print(red.camino_mas_corto("Pikachu", "Mewtwo"))  #None: no está en la red
```

---

## 4. Uso y criterio

### Casos de uso

- Redes sociales: seguidores, amistades, sugerencias de contactos.
- Mapas y rutas: ciudades como vértices, caminos como aristas ponderadas por distancia o tiempo.
- Dependencias: correlatividades, paquetes o tareas de un build (orden topológico sobre un DAG).
- Redes de comunicación: enrutamiento de paquetes entre nodos.

### Cuándo NO usarlo

- Si la relación es jerárquica: un árbol es más simple y no necesita visitados.
- Si es lineal: alcanza con una [[linked list]].
- Si solo importa si una relación puntual existe, sin encadenarla: un [[map]] o [[set]] de pares alcanza.

### Comparaciones

- **vs Árbol:** es conexo, acíclico y con una raíz definida; no permite múltiples caminos entre dos nodos. Un grafo general no tiene esas restricciones y puede tener ciclos y múltiples caminos entre el mismo par de vértices.
- **vs [[map]] / [[hash table]]:** un map asocia cada clave a **un** valor y responde "¿qué le corresponde a `u`?". El grafo asocia un **conjunto** de relaciones con sus atributos. La diferencia aparece al encadenar: el map no responde "¿qué alcanzo partiendo de `u`?".
- **vs [[set]] de pares:** un `set` de tuplas `(u, v)` responde "¿existe esta relación?" en $O(1)$, pero no da los vecinos de `u` sin recorrerlo entero, y sobre esa operación se apoya todo recorrido.
- **vs [[linked list]] / [[array]]:** modelan sucesión o posición, no relación arbitraria. Un grafo donde cada vértice tiene a lo sumo un vecino *es* una lista enlazada.

### Ventajas / desventajas

**Ventajas:**

- Modela relaciones arbitrarias sin imponer restricciones de forma, y agregarles pesos o sentido no obliga a cambiar de estructura.
- Tiene detrás una familia enorme de algoritmos ya estudiados (BFS, DFS, Dijkstra, Kruskal, flujo máximo).

**Desventajas:**

- **La representación es una decisión temprana y cara de revertir.** Matriz en un grafo disperso de 100.000 vértices son $10^{10}$ celdas; lista cuando el algoritmo consulta `existe_arista` en un bucle degrada esa consulta de $O(1)$ a $O(\text{grado}(u))$. El error no se nota hasta que el grafo crece.
- **Los invariantes se rompen fácil.** En no dirigidos cada arista vive duplicada y ambas copias deben actualizarse juntas; borrar un vértice exige limpiar sus aristas entrantes. Si algo se omite, el síntoma aparece mucho después.
- **Varios problemas clásicos sobre grafos son costosos o directamente intratables** (caminos mínimos entre todos los pares, ciclo hamiltoniano, coloreo mínimo), algo que una estructura lineal ni plantea. Además, sin raíz ni aciclicidad garantizada, cualquier recorrido exige mantener los visitados a mano: olvidarlo no da error, entra en un ciclo infinito.

### Señales de reconocimiento

- "Modelar conexiones entre entidades" o "quién está conectado con quién".
- "Encontrar el camino más corto/más barato entre dos puntos".
- "Detectar si existe un ciclo" o "determinar un orden válido de ejecución" (ordenamiento topológico).
- Problemas descriptos en términos de nodos y relaciones, redes o dependencias.

---

## 5. Relaciones y extensiones

### Variantes

- **Grafo dirigido (Digraph):** las aristas tienen sentido; usado para modelar dependencias o flujos.
- **Grafo ponderado:** las aristas tienen un costo asociado, base de algoritmos como Dijkstra o Kruskal.
- **DAG (Directed Acyclic Graph):** grafo dirigido sin ciclos; permite ordenamiento topológico y es la base de sistemas de build y de resolución de dependencias.
- **Multigrafo:** permite más de una arista entre el mismo par de vértices.
- **Árbol:** caso particular de grafo conexo y acíclico con una raíz definida.

### Relación con otras estructuras

- Cada vértice suele modelarse como un **[[struct]]** que agrupa su valor y sus referencias a los vecinos.
- La representación por lista de adyacencia se implementa habitualmente sobre una **[[hash table]]** (vértice → colección de vecinos) o sobre un **[[array]]** cuando los vértices son identificables por índices enteros consecutivos.
- BFS necesita una queue (FIFO) y DFS un [[stack]] (LIFO). No es un detalle de implementación: define el orden de exploración, y cambiar una por otra convierte un recorrido en el otro.
- Un **[[set]]** se usa típicamente para llevar el registro de los vértices ya visitados durante un recorrido.
- Una **[[linked list]]** y un árbol son, conceptualmente, grafos con restricciones adicionales sobre su cantidad de conexiones.

### Notas avanzadas

**Persistencia.** Una versión persistente conserva los estados anteriores compartiendo los vértices no tocados, en vez de copiar el grafo entero: permite deshacer o ver cómo era la red antes. En disco lo cubren las bases de datos de grafos (Neo4j), que guardan las aristas como punteros físicos.

**Concurrencia.** Compartir un grafo mutable es incómodo porque **una arista toca dos vértices a la vez**: con un lock por vértice hay que tomar los dos en un orden global fijo, o aparecen deadlocks. Lo habitual es congelarlo en solo lectura durante los recorridos, que al no escribir paralelizan bien. A gran escala se particiona entre máquinas (modelo Pregel/BSP): cada una procesa sus vértices y al final de cada ronda intercambia mensajes por las aristas que cruzan particiones.

**Aleatoriedad.** Cuando el grafo no entra en memoria se abandona la respuesta exacta: las *caminatas aleatorias* saltan a un vecino al azar y permiten estimar la importancia de un vértice sin recorrerlo entero, que es la idea detrás de PageRank. Los **grafos aleatorios** (Erdős–Rényi, cada arista existe con probabilidad $p$) sirven de línea de base: distinguen qué propiedades de una red real son estructurales y cuáles saldrían igual por azar.

---

## 6. Referencias y recursos

- [[COR2011]] - Capítulo 22: "Elementary Graph Algorithms" (representaciones, BFS, DFS, orden topológico); capítulos 23 a 26 para expansión mínima, caminos mínimos y flujo.
- [[KLE2005]] - Capítulo 3: "Graphs", con foco en cómo modelar un problema como grafo.
- [[SED2011]] - Capítulo 4: "Graphs", con implementaciones completas.
- [[LAF2002]] - Capítulos 12 y 13: "Graphs" y "Weighted Graphs".
- [[Wikipedia - PageRank]](https://es.wikipedia.org/wiki/PageRank) - Qué es y como funciona PageRank.

**Visualizaciones:**

- [VisuAlgo - Graph Structures](https://visualgo.net/en/graphds) - armar un grafo y ver su lista y su matriz.
- [VisuAlgo - Graph Traversal](https://visualgo.net/en/dfsbfs) - BFS y DFS paso a paso.
- [NetworkX](https://networkx.org/documentation/stable/tutorial.html) - librería de grafos en Python.

**Casos de uso conocidos:**

- [Neo4j - Graph Database Concepts](https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/) - cómo se persiste un grafo.
