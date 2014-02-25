Creando un documento
--------------------

Brython existe para poder programar aplicaciones web,es decir, páginas HTML enlas que el usuario puede interactuar

Una página web está hecha de elementos (textos, imágenes, sonidos,...) que pueden ser incluidos en la página de dos formas :

- escribiendo código HTML con etiquetes, por ejemplo

>    <html>
>    <body>
>    <b>Brython</b> es una implementación de <a href="http://www.python.org">Python</a> 
>    para los navegadores
>    </body>
>    </html>

- o escribiendo código Python, usando el módulo integrado `html` (descrito en la sección de Librerías)

>    <html>
>    <body>
>    <script type="text/python">
>    from html import A,B
>    doc <= B("Brython")+"es una implementación de "
>    doc <= A("Python",href="http://www.python.org")+" para los navegadores"
>    </script>
>    </body>
>    </html>

