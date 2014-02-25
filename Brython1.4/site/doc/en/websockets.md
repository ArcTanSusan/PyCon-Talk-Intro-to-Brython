module **browser.websocket**
----------------------------

Web sockets, defined in HTML5, are a way to handle bi directional communication between client and server

The module defines one function :

`websocket(`_host_`)`
> _host_ is the location of a server that supports the WebSocket protocol. Returns a `WebSocket` object

> If the browser doesn't support WebSocket, a `NotImplementedError` will be raised

`WebSocket` objects have the following methods :

`bind(`_evt,function_`)`
> attaches the _function_ to the event _evt_. The events and the corresponding function arguments are :

<blockquote>
<table border=1 cellpadding=5>
<tr>
<th>Event</th>
<th>Function</th>
</tr>
<tr>
<td>`open`</td>
<td>function with no argument, called once the connection with the server is established</td>
</tr>
<tr>
<td>`error`</td>
<td>function with no argument, called if an error occurs during the communication</td>
</tr>
<tr>
<td>`message`</td>
<td>function that takes one argument, an instance of `DOMEvent`. This instance has an attribute `data` that holds the message sent by the server as a string</td>
</tr>
<tr>
<td>`close`</td>
<td>function with no argument, called when the connection is closed</td>
</tr>
</table>
</blockquote>

`send(`_data_`)`
> sends the string _data_ to the server

`close()`
> closes the connection

Example :
<table>
<tr>
<td id="py_source">
    from browser import doc,alert,websocket
    
    def on_open(evt):
        doc['send_button'].disabled = False
        doc['closebtn'].disabled = False
        doc['openbtn'].disabled = True
    
    def on_message(evt):
        # message reeived from server
        alert("Message reçu : %s" %evt.data)
    
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
