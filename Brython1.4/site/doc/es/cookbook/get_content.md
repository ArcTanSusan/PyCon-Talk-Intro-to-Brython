Problema
--------
Obtener el contenido de un elemento de la p&aacute;gina


Solución
--------

<table width="100%">
<tr>
<td style="width:50%;">

    # doc['zone'] is the colored cell
    alert(doc['zone'].text)

<button onclick="show_text()">Mostrar texto</button>

    alert(doc['zone'].html)

<br><button onclick="show_html()">Mostrar html</button>

    # doc['entry'] is the input field
    alert(doc['entry'].value)

<br><button onclick="show_value()">Mostrar texto introducido</button>
</td>
<td id="zone" style="background-color:#FF7400;text-align:center;">
<B>Contenido de la celda</B><p>
<INPUT id="entry" value="campo de entrada">
</td>
</tr>
</table>

<script type="text/python3">
def show_text():
    src = doc.get(selector="pre.marked")[0].text
    exec(src)
def show_html():
    src = doc.get(selector="pre.marked")[1].text
    exec(src)
def show_value():
    src = doc.get(selector="pre.marked")[2].text
    exec(src)

</script>    

Cada elemento en la página posee un atributo `text`, una cadena con el testo mostrado en el elemento

Además, posee un atributo `html`, una cadena con el código HTML dentro del elemento

Los campos de entrada poseen un atributo `value`, una cadena con el valor actual del campo de entrada

`alert()` es una función integrada de Brython que muestra su argumento en una ventana emergente (popup window)