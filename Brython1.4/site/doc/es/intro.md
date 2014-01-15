El objetivo de Brython es reemplazar Javascript con Python como lenguaje de scripting en los navegadores.

Un ejemplo simple :
<table>
<tr>
<td>
<pre><code>
&lt;html&gt;
&lt;head&gt;
<b>&lt;script src="/brython.js"&gt;&lt;/script&gt;</b>
&lt;/head&gt;
&lt;body <b>onload="brython()"</b>&gt;
&lt;script <b>type="text/python"</b>&gt;
def echo():
    alert(doc["zone"].value)
&lt;/script&gt;
&lt;input id="zone"&gt;&lt;button onclick="echo()"&gt;click !&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;

</code></pre>
</td>
<td>
Try it!<p>
<script type="text/python">
def echo():
    alert(doc["zone"].value)
</script>

<input id="zone"><button onclick="echo()">click !</button>
</td>
</tr>
</table>

Para que el script Python se pueda procesar es necesario incluir _brython.js_ y ejecutar la funci&oacute;n `brython()` al cargarse la p&aacute;gina (usando el atributo _onload_ de la etiqueta `<BODY>`). Mientras nos encontremos en la fase de desarrollo, es posible pasar un argumento a la funci&oacute;n _brython()_ : 1 para que los mensajes de error se muestren en la consola del navegador, 2 para, adem&aacute;s, mostrar el c&oacute;digo Javascript junto con el error

Si el programa Python es extenso, otra opci&oacute;n ser&iacute;a escribirlo en un fichero separado y cargarlo usando el atributo _src_ de la etiqueta _script_ :

<p><table><tr><td>
<pre style="margin:10px;padding:5px;"><code>&lt;html&gt;
&lt;head&gt;
<span style="color:blue">&lt;script src="/brython.js"&gt;&lt;/script&gt;</span>
&lt;/head&gt;
&lt;body <span style="color:blue">onload="brython()"</span>&gt;
<span style="color:blue">&lt;script type="text/python" <b>src="test.py"</b>&gt;&lt;/script&gt;</span>
&lt;input id="zone"&gt;&lt;button onclick="echo()"&gt;clic !&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

</td></tr></table>

Hay que resaltar que, en este caso, el script Python ser&aacute; cargado mediante una llamada Ajax : deber&aacute;, por tanto, estar localizado en el mismo dominio que la p&aacute;gina HTML.

En los dos ejemplos de c&oacute;digo anteriores, cuando pulsamos el bot&oacute;n del rat&oacute;n, el evento onclick llama y ejecuta la funci&oacute;n `echo()`, definida en el script Python. Esta funci&oacute;n obtiene el valor mediante el elemento INPUT, a trav&eacute;s de su id (_zone_). Esto se consigue mediante la sintaxis `doc["zone"]` : `doc` es una keyword en Brython, que se comporta como un diccionario cuyas claves son los ids de los elementos del DOM. Por tanto, en nuestro ejemplo, `doc["zone"]` es un objeto que 'mapea' el elemento INPUT ; la propiedad _value_ contiene el valor del objeto.

En Brython, el 'output' se puede obtener de varias formas, incluyendo la funci&oacute;n integrada `alert()` que muestra una ventana ('popup window') con el texto que hemos pasado como argumento.
