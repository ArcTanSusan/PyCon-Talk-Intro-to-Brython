module **browser.websocket**
----------------------------

Les Web sockets, définies dans HTML5, sont un moyen de gérer une communication bidirectionnelle entre le client et le serveur

Le module définit une fonction :

`websocket(`_hote_`)`
> _hote_ est l'adresse d'un serveur qui supporte le protocole WebSocket. Renvoie un objet `WebSocket`

> Si le navigateur ne gère pas ce protocole, une exception `NotImplementedError` est déclenchée. 

Les objets `WebSocket` possèdent les méthodes suivantes :

`bind(`_evt,fonction_`)`
> associe la _fonction_ à l'événement _evt_. Les événements gérés et les arguments de la fonction sont :

<blockquote>
<table border=1 cellpadding=5>
<tr>
<th>Evénement</th>
<th>Fonction</th>
</tr>
<tr>
<td>`open`</td>
<td>fonction sans argument, appelée une fois que la connexion avec le serveur est établie</td>
</tr>
<tr>
<td>`error`</td>
<td>fonction sans argument, appelée si une erreur se produit pendant la communication</td>
</tr>
<tr>
<td>`message`</td>
<td>fonction qui prend un argument, une instance de `DOMEvent`. Cette instance possède un attribut `data` qui contient le message envoyé par le serveur</td>
</tr>
<tr>
<td>`close`</td>
<td>fonction sans argument, appelée quand la connexion est close</td>
</tr>
</table>
</blockquote>

`send(`_data_`)`
> envoie la chaine _data_ au serveur

`close()`
> ferme la connection

Exemple :
<table>
<tr>
<td id="py_source">
    from browser import websocket, doc, alert
    
    def on_open(evt):
        doc['send_button'].disabled = False
        doc['closebtn'].disabled = False
        doc['openbtn'].disabled = True
    
    def on_message(evt):
        # message reçu du serveur
        alert("Message reçu : %s" %evt.data)
    
    def on_close(evt):
        # la websocket est fermée
        alert("La connexion est fermée")
        doc['openbtn'].disabled = False
        doc['closebtn'].disabled = True
        doc['send_button'].disabled = True
    
    ws = None
    def _open():
        if not __BRYTHON__.has_websocket:
            alert("WebSocket n'est pas pris en charge par votre navigateur")
            return
        global ws
        # open a web socket
        ws = websocket.websocket("wss://echo.websocket.org")
        # attache des fonctions aux événements web sockets
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

<button id="openbtn" onclick="_open()">Ouvrir la connexion</button>
<br><input id="data"><button id="send_button" disabled onclick="send()">Envoyer</button>
<p><button id="closebtn" disabled onclick="close_connection()">Fermer la connexion</button>
</td>
</tr>
</table>
