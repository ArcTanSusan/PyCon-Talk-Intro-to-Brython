Entorno de desarrollo
---------------------

Los desarrolladores deber&iacute;an usar el entorno de desarrollo disponible para descarga en [downloads](https://bitbucket.org/olemis/brython/downloads) : elige el fichero zip cuyo nombre comienza por "Brython\_site\_mirror" y descompr&iacute;melo en una carpeta (la llamaremos la carpeta Brython  en los siguientes p&aacute;rrafos).

Es necesario un servidor web para poder probar los scripts localmente mientras nos encontramos desarrollando. Cualquier servidor web que sea capaz de servir ficheros con la carpeta Brython como documento ra&iacute;z es v&aacute;lido ; puedes usar el servidor incluido con la distribuci&oacute;n : abre una consola, mu&eacute;vete hasta la carpeta donde se encuentra el fichero server.py y ejecuta `python server.py`. Esto arrancar&aacute; un servidor en el puerto 8000 (edita _server.py_ para cambiar el n&uacute;mero del puerto).

Una vez que el servidor ha arrancado, apunta tu navegador a _http://localhost:8000/site_ : deber&iacute;as poder ver la misma p&aacute;gina que en [la p&aacute;gina de inicio oficial de Brython](http://www.brython.info)

Crea una nueva carpeta (eg "test") en la carpeta Brython. Con un editor de texto crea un fichero llamado __index.html__ con el contenido mostrado m&aacute;s abajo y gu&aacute;rdala en la carpeta __test__

>    <html>
>    <head>
>    <meta charset="iso-8859-1">
>    <script src="../src/brython.js"></script>
>    </head>
>    <body onLoad="brython()">
>    <script type="text/python">
>    def echo():
>        alert("Hola %s !" %doc["zone"].value)
>    </script>
>    <p>Tu nombre es : <input id="zone"><button onclick="echo()">click !</button>
>    </body>
>    </html>

Apunta el navegador hacia _http://localhost:8000/test/index.html_ : bingo ! Acabas de escribir tu primera aplicaci&oacute;n Brython.

Usa este entorno para pruebas y desarrollo. Solo debes acordarte de apuntar el script _brython.js_ a la localizaci&oacute;n correcta en relaci&oacute;n a la carpeta donde se encuentran las p&aacute;ginas HTML que lo usen.
