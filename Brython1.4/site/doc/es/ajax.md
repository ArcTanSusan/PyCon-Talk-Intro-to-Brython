Ajax
----

El módulo `ajax` permite acceder a la función `ajax()` que devuelve un objeto capaz de realizar peticiones Ajax.Posee los siguientes métodos :

- `bind(*evt, funcion*)`: adjunta la función al evento *evt*. Los eventos se combinan con los siguientes estados de la petición

<blockquote>
<table cellspacing=0 cellpadding=0 border=1><tr><th>readyState</th><th>atributo</th></tr>
<tr><td align="center">0</td><td>`uninitialized`</td></tr>
<tr><td align="center">1</td><td>`loading`</td></tr>
<tr><td align="center">2</td><td>`loaded`</td></tr>
<tr><td align="center">3</td><td>`interactive`</td></tr>
<tr><td align="center">4</td><td>`complete`</td></tr>
</table>

La *función* toma un &uacute;nico argumento: el objeto `ajax`. Este objeto posee los siguientes atributos :

- `readyState` : un entero que representa el estado de la petición (ver tabla más arriba)
- `status` : un entero que representa el estado HTTP de la petici&oacute;n
- `text` : la respuesta del servidor como una cadena de caracteres (corresponder&iacute;a a _responseText_ en Javascript)
- `xml` : la respuesta del servidor como un objeto DOM (corresponder&iacute;a a _responseXML_ en Javascript)

</blockquote>


- <code>open(_method, url, async_)</code> : _method_ es el m&eacute;todo HTTP usado para la petici&oacute;n (normalmente GET o POST), _url_ es la url a llamar, _async_ es el booleano que indica si la llamada es as&iacute;ncrona o no
- <code>set\_header(_name, value_)</code> : establece el _valor_ del _nombre_ del cabecero
- <code>set\_timeout(_duration, function_)</code> : si la petici&oacute;n no devuelve una respuesta durante la _duraci&oacute;n_ en segundos, cancelar&aacute; la petici&oacute;n y ejecutar&aacute; la _funci&oacute;n_. Esta funci&oacute;n no puede tener argumentos
- `send()` : env&iacute;a (inicia) la petici&oacute;n


### Ejemplo

Supondremos que existe un DIV con id _result_ en la p&aacute;gina HTML

    def on_complete(req):
        if req.status==200 or req.status==0:
            doc["result"].html = req.text
        else:
            doc["result"].html = "error "+req.text
    
    req = ajax()
    req.on_complete = on_complete
    req.set_timeout(timeout,err_msg)
    req.open('POST',url,True)
    req.set_header('content-type','application/x-www-form-urlencoded')
    req.send(data)
    