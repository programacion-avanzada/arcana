# Arcana - Material de Programación Avanzada

Arcana es un recurso de estudio complementario para la cátedra de **Programación Avanzada de la Universidad Nacional de La Matanza**. Reúne definiciones, técnicas y resultados centrales de la materia en un único lugar pensado tanto para el estudio secuencial como para la consulta puntual.

El proyecto es mantenido por la cátedra y sus alumnos: es un documento vivo que crece con cada ciclo lectivo y se corrige cuando alguien detecta un error. Nuestro objetivo es conservar la rigurosidad y, a la vez, la claridad: estudiar algoritmos puede ser serio y disfrutable.

## Cómo editar el contenido

Todo el contenido está en la carpeta `content/`, en formato Markdown. Para editarlo, abrí esa carpeta como vault en [Obsidian](https://obsidian.md/): así se ven bien los `[[wikilinks]]` internos entre páginas.

![Editando contenido en Obsidian](content/attachments/README-obsidian.png)

> [!TIP]
> Utiliza el DevContainer para editar el contenido sin instalar nada en tu computadora.

<details>
<summary>
    <h3>Cómo utilizar el DevContainer para editar el contenido</h3>
</summary>

Si quieres utilizar una maquina virtual en la nube:

- Presiona el botón `Open in GitHub Codespaces` y no tendrás que utilizar los recursos de tu computadora. </br></br>[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/programacion-avanzada/arcana)

Si quieres utilizar el DevContainer localmente, seguí estos pasos:

1. Instala [Visual Studio Code](https://code.visualstudio.com/), [Docker](https://www.docker.com/) y [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) (extensión de Visual Studio Code).
2. Iniciar Docker.
3. Clona el repositorio en tu maquina y abre su carpeta en Visual Studio Code.
4. Reabre el proyecto en un DevContainer, presionando `F1` y seleccionando `Dev Containers: Rebuild and Reopen in Container`.
5. Espera a que se construya e inicie el contenedor, y a que se instalen las dependencias.
6. ¡Listo! Ahora puedes ejecutar `make start` para levantar el sitio.

</details>

## Cómo levantar el sitio

```bash
make start
```

Esto ejecuta `npm run quartz -- build --serve` y levanta el sitio localmente con recarga automática para ver los cambios renderizados con un navegador.

![Sitio de Arcana](content/attachments/README-arcana.png)
