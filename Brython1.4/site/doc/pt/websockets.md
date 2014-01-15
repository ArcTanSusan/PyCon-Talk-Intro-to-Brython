## módulo websocket

Web sockets são uma forma de gerir a comunicação bi direcional entre cliente e servidor. Eles foram especificados em HTML5

A comunicação com o servidor é estabelecida utilizando o módulo `websocket` que expõe a função <code>websocket(_host_)</code> onde _host_ é a localização de um servidor que suporta o protocolo WebSocket

Se seu navegador não suporta WebSocket, um erro `NotImplementedError` será levantado

Esta chamada retorna uma instância da classe `WebSocket`, ela tem os seguintes métodos :

- <code>bind(_evt,function_)</code> vincula a função _function_ ao evento _evt_. Os eventos e os argumentos correspondentes da função são :

<blockquote>
<table border=1 cellpadding=5>
<tr>
<th>Evento</th>
<th>Função</th>
</tr>
<tr>
<td>`open`</td>
<td>função sem argumentos, chamada quando a conexão com o servidor é estabelecida</td>
</tr>
<tr>
<td>`error`</td>
<td>função sem argumentos, chamada se um erro ocorrer durante a comunicação</td>
</tr>
<tr>
<td>`message`</td>
<td>função com um único argumento, uma instância de `DOMEvent`. Esta instância tem um atributo `data` que contém a mensagem enviada pelo servidor como uma cadeia de caracteres</td>
</tr>
<tr>
<td>`close`</td>
<td>função sem argumentos, chamada quando a conexão é fechada</td>
</tr>
</table>
</blockquote>

- <code>send(_data_)</code> : envia a cadeia de caracteres _data_ para o servidor
- `close()` : fecha a conexão

Exemplo :
<table>
<tr>
<td id="py_source">
    import websocket
    
    def on_open(evt):
        doc['send_button'].disabled = False
        doc['closebtn'].disabled = False
        doc['openbtn'].disabled = True
    
    def on_message(evt):
        # mensagem recebida do servidor
        alert("Mensagem recebida : %s" %evt.data)
    
    def on_close(evt):
        # websocket está fechado
        alert("Conexão está fechada")
        doc['openbtn'].disabled = False
        doc['closebtn'].disabled = True
        doc['send_button'].disabled = True
    
    ws = None
    def _open():
        if not __BRYTHON__.has_websocket:
            alert("WebSocket não é suportado por seu navegador")
            return
        global ws
        # abre um websocket
        ws = websocket.websocket("wss://echo.websocket.org")
        # vincula funções aos eventos websocket
        ws.bind('open',on_open)
p        ws.bind('message',on_message)
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

<button id="openbtn" onclick="_open()">Abrir conexão</button>
<br><input id="data"><button id="send_button" disabled onclick="send()">Enviar</button>
<p><button id="closebtn" disabled onclick="close_connection()">Fechar conexão</button>
</td>
</tr>
</table>
