# Arcana - Material de Programación Avanzada

Arcana es un recurso de estudio complementario para la cátedra de **Programación Avanzada de la Universidad Nacional de La Matanza**. Reúne definiciones, técnicas y resultados centrales de la materia en un único lugar pensado tanto para el estudio secuencial como para la consulta puntual.

El proyecto es mantenido por la cátedra y sus alumnos: es un documento vivo que crece con cada ciclo lectivo y se corrige cuando alguien detecta un error. Nuestro objetivo es conservar la rigurosidad y, a la vez, la claridad: estudiar algoritmos puede ser serio y disfrutable.

## Cómo editar el contenido

Todo el contenido está en la carpeta `content/`, en formato Markdown. Para editarlo, abrí esa carpeta como vault en [Obsidian](https://obsidian.md/): así se ven bien los `[[wikilinks]]` internos entre páginas.

![Editando contenido en Obsidian](content/attachments/README-obsidian.png)

## Cómo levantar el sitio

```bash
make start
```

Esto ejecuta `npm run quartz -- build --serve` y levanta el sitio localmente con recarga automática para ver los cambios renderizados con un navegador.

![Sitio de Arcana](content/attachments/README-arcana.png)
