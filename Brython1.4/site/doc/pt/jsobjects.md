Usando objetos Javascript
-------------------------

Teremos que gerenciar o período de transição em que Brython irá coexistir com Javascript ;-)

### Argumentos de funções de resposta (callback)

O código HTML pode vincular funções a eventos do DOM e passá-las alguns parâmetros. A função de resposta irá recebê-los transformados em tipos gerenciados por Brython : 

<table border='1'>
<tr><th>Tipo de argumento na chamada da função</th><th>Argumento recebido pela função de resposta</th></tr>
<tr><td>elemento DOM</td><td>instância de `DOMNode`</td></tr>
<tr><td>evento DOM</td><td>instância de `DOMEvent`</td></tr>
<tr><td>lista de nodos DOM</td><td>lista de instâncias de `DOMNode`</td></tr>
<tr><td>`null, true, false`</td><td>`None, True, False`</td></tr>
<tr><td>inteiro</td><td>instância de `int`</td></tr>
<tr><td>ponto flutuante</td><td>instância de `float`</td></tr>
<tr><td>cadeia de caracteres</td><td>instância de `str`</td></tr>
<tr><td>Array Javascript array</td><td>instânncia de `list`</td></tr>
<tr><td>Objeto Javascript</td><td>instância de `JSObject`</td></tr>
</table>



Por exemplo, se o evento 'click' em um botão provoca a execução da função foo :

    <button onclick="foo(this,33,{'x':99})">Click</button>

esta função terá a assinatura

    def foo(elt,value,obj):

onde _elt_ será a instância de `DOMNode` do elemento 'botão', _value_ será o inteiro 33 e _obj_ será uma instância da classe integrada `JSObject`

Instâncias de `JSObject` são usadas como objetos Python ordinários ; aqui, o valor do atributo "x" é `obj.x`. Para convertê-los em um dicionário Python, use a função integrada `dict()` : `dict(obj)['x']`

### Objetos em programas Javascript

Um documento HTML pode usar scripts e bibliotecas em Javascript, e scripts e bibliotecas em Python. Brython não pode usar objetos Javascript diretamente : por exemplo, a busca de atriburos é feita pelo método _\_\_getattr\_\__, que não existe em objetos Javascript

Para poder utilizá-los em um script Python, eles devem ser explicitamente transformados pela função integrada `JSObject()`

Por exemplo :

    <script type="text/javascript">
    circle = {surface:function(r){return 3.14*r*r}}
    </script>
    
    <script type="text/python">
    doc['result'].value = JSObject(circle).surface(10)
    </script>

### Usando construtores Javascript

Se uma função Javascript é um construtor de objetos que pode ser chamada em Javascript com a palavra-chave `new`, ela pode ser usada em Brython transformando-a com a função intrgrada `JSConstructor()`

<code>JSConstructor(_constr_)</code> retorna a função que, quando chamada com argumantos, retorna um objeto Python que corresponde ao objeto Javascript construído pelo construtor _constr_

Por exemplo :

    <script type="text/javascript">
    function Rectangle(x0,y0,x1,y1){
        this.x0 = x0
        this.y0 = y0
        this.x1 = x1
        this.y1 = y1
        this.surface = function(){return (x1-x0)*(y1-y0)}
    }
    </script>
    
    <script type="text/python">
    rectangle = JSConstructor(Rectangle)
    alert(rectangle(10,10,30,30).surface())
    </script>

### Exemplo jQuery

Abaixo um exemplo mais completo de como você pode usar a popular biblioteca jQuery :

    <html>
    <head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
    </script>
    <script src="../../src/brython.js"></script>
    </head>
    
    <script type="text/python">
      def toggle_color(element):
          _divs=doc.get(tag="div")
          for _div in _divs:
              if _div.style.color != "blue":
                 _div.style.color = "blue"
              else:
                 _div.style.color = "red"
    
      _jQuery=JSObject($("body"))
      _jQuery.click(toggle_color)
    
    </script>
    
    <body onload="brython()">
      <div>Click here</div>
      <div>to iterate through</div>
      <div>these divs.</div>
    <script>
    </script>
     
    </body>
    </html>
    
