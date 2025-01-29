# NONHUMAN-WEB

![NONHUMAN Logo](link_to_logo.png)

## Descripción
Este repositorio contiene el código fuente de la página oficial de [NONHUMAN](https://nonhuman.com). Es un proyecto web que puede ejecutarse y desarrollarse utilizando `npm run dev`.

## Características principales
El componente más importante de este proyecto es el **renderizador de Markdown**, el cual permite interpretar y estructurar contenido escrito en formato Markdown con algunas personalizaciones adicionales.

### Sintaxis de Markdown personalizada
Para garantizar que el formato de Markdown sea interpretado correctamente, es importante seguir las siguientes reglas:

#### Código
Para resaltar fragmentos de código, se debe iniciar con triple tilde (` ``` `) seguido del lenguaje de programación a renderizar. Por ejemplo:

```markdown
```python
print("Hola, mundo!")
```
```

#### Imágenes con tamaño personalizado
Para insertar imágenes con un tamaño definido, utilizamos la siguiente sintaxis:

```markdown
![titulo_imagen|longitud](https://example.com/image.png)
```

Donde:
- `titulo_imagen` es el texto alternativo de la imagen.
- `longitud` es el tamaño deseado de la imagen.
- El enlace de la imagen debe ser un **URL público accesible**.

#### Estructuración basada en encabezados
Nuestro renderizador también estructura automáticamente el contenido en base a los encabezados definidos en Markdown:
- `# Encabezado 1` (h1)
- `## Encabezado 2` (h2)
- `### Encabezado 3` (h3)
- Y así sucesivamente...

Esto permite una organización clara y jerárquica de la información dentro del contenido renderizado.

## Instalación y ejecución
Para ejecutar el proyecto en un entorno local:

```sh
npm install
npm run dev
```

## Contacto
Para cualquier consulta o duda sobre este proyecto, puedes enviarme un correo a **leo.perez.nestares@gmail.com**.

---

¡Gracias por contribuir a NONHUMAN-WEB!

