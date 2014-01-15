Problema
--------

Mostrar contenido en un elemento de la p&aacute;gina


Solución
--------

<table width="100%">
<tr>
<td style="width:50%;">

    <html>
    <head>
    <script src="brython.js"></script>
    </head>
    <body onload="brython()">
    
    <script type="text/python">
    doc['zone'] <= "blah "
    </script>
    
    </body>
    </html>

<button onclick="fill_zone()">Pruébalo</button>
</td>
<td id="zone" style="background-color:#FF7400;text-align:center;">Contenido inicial<p>
</td>
</tr>
</table>

<script type="text/python3">
def fill_zone():
    doc["zone"] <= "blah "
</script>

`doc["zone"]` es el elemento en la p&aacute;gina web con el id "zone" (aquí, la celda coloreada de la tabla)

