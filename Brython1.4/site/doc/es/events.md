## Eventos

Los elementos en la p&aacute;gina web pueden reaccionar a eventos como el click del rat&oacute;n, el movimiento del rat&oacute;n sobre el elemento o cuando el rat&oacute;n abandona el elemento, cuando se pulsa una tecla o cuando se deja de pulsar, etc

### Vinculando funciones de respuesta a un evento

Para vincular una o varias funciones a una evento puedes usar la siguiente sintaxis 

<blockquote>`element.bind(event,callback1[,callback2...])`</blockquote>

Las funciones de respuesta (o _callback_ functions) toman un &uacute;nico argumento, una instancia de la clase _DOMEvent_. M&aacute;s all&aacute; de los atributos del DOM (los nombres pueden variar dependiendo del navegador), este objeto tendr&aacute;, en particular, los siguientes atributos :

<table border=1>
<tr><th>Tipo de evento</th><th>Atributos</th></tr>
<tr><td>todos los eventos</td><td><tt>target</tt> : el nodo del DOM al cual se asocia el evento</td></tr>
<tr><td>click o movimiento del rat&oacute;n</td><td><tt>x, y</tt> : posici&oacute;n del rat&oacute;n en relaci&oacute;n a la esquina superior izquierda de la ventana</td></tr>
<tr><td>"drag and drop" (HTML5)</td><td><tt>data</tt> : datos asociados con el movimiento</td></tr>
</table>

Ejemplo :
<table>
<tr>
<td>
    <script type='text/python'>
    def mouse_move(ev):
        doc["trace"].value = '%s %s' %(ev.x,ev.y)
    
    doc["zone"].bind('mousemove',mouse_move)
    </script>
    
    <input id="trace" value="">
    <br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
    Mueve el rat&oacute;n por encima de esta &aacute;rea</textarea>
</td>
<td>
<script type='text/python'>
def mouse_move(ev):
    doc["trace"].value = '%s %s' %(ev.x,ev.y)

doc["zone"].bind('mousemove',mouse_move)
</script>

<input id="trace" value="">
<br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
Mueve el rat&oacute;n por encima de esta &aacute;rea</textarea>
</td>
</tr>
</table>

### Desvinculando


`element.unbind(event,callback1[,callback2...])` elimina el v&iacute;nculo entre el elemento y la funci&oacute;n especificada

`element.unbind(event)` elimina todos los v&iacute;nculos para el vento


