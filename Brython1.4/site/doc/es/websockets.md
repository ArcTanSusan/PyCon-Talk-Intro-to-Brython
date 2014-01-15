módulo websocket
----------------

Los Web sockets son una manera de manejar comunicación bidireccional entre el cliente y el servidor. Han sido especificados en HTML5

La comunicación con el servidor se establece usando el módulo `websocket` que proporciona la función `websocket(host)` :

Si tu navegador no soporta WebSocket, se obtendrá un `NotImplementedError`

La llamada devuelve una instancia de la clase `WebSocket`. dispone de los siguientes métodos :

- <code>bind(_evt,funcion_)</code> adjunta la _funcion_ al evento _evt_. Los eventos y los correspondientes argumentos de la función son :

<blockquote>
<table border=1 cellpadding=5>
<tr>
<th>Evento</th>
<th>Función</th>
</tr>
<tr>
<td>`open`</td>
<td>función sin argumento, establece la conexión con el servidor una vez que se la llama</td>
</tr>
<tr>
<td>`error`</td>
<td>función sin argumento, será llamada si ocurre un error durante la comunicación</td>
</tr>
<tr>
<td>`message`</td>
<td>función con un argumento, una instancia del `DOMEvent`. Esta instancia posee el atributo `data` que recibe el mensaje enviado por el servidor</td>
</tr>
<tr>
<td>`close`</td>
<td>función sin argumento, será llamada cuando se cierra la conexión</td>
</tr>
</table>
</blockquote>

- <code>send(_data_)</code> : envía el string _data_ al servidor
- `close()` : cierra la conexión


Ejemplo :
<table>
<tr>
<td id="py_source">
    import websocket
    
    def on_open(evt):
        doc['send_button'].disabled = False
        doc['closebtn'].disabled = False
        doc['openbtn'].disabled = True
    
    def on_message(evt):
        # message reeived from server
        alert("Mensaje recibido : %s" %evt.data)
    
    def on_close(evt):
        # websocket is closed
        alert("Connection is closed")
        doc['openbtn'].disabled = False
        doc['closebtn'].disabled = True
        doc['send_button'].disabled = True
    
    ws = None
    def _open():
        if not __BRYTHON__.has_websocket:
            alert("WebSocket is not supported by your browser")
            return
        global ws
        # open a web socket
        ws = websocket.websocket("wss://echo.websocket.org")
        # bind functions to web socket events
        ws.bind('open',on_open)
        ws.bind('message',on_message)
        ws.bind('close',on_close)
    
    def send():
        data = doc["data"].value
        if data:
            ws.send(data)
    
    def close_connection():
        ws.close()
        doc['openbtn'].disabled = False
    
</td>
<td valign="top">
<script type='text/python'>
exec(doc['py_source'].text)
</script>

<button id="openbtn" onclick="_open()">Open connection</button>
<br><input id="data"><button id="send_button" disabled onclick="send()">Send</button>
<p><button id="closebtn" disabled onclick="close_connection()">Close connection</button>
</td>
</tr>
</table>
