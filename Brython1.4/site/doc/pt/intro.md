O objetivo de Brython é substituir Javascript por Python como a linguagem de scripting para navegadores web.

Um exemplo simples :
<table>
<tr>
<td>

    <html>
    <head>
    <script src="/brython.js"></script>
    </head>
    <body onload="brython()">
    <script type="text/python">
    def echo():
        alert(doc["zone"].value)
    </script>
    <input id="zone"><button onclick="echo()">click !</button>
    </body>
    </html>

</td>
<td>

Tente! :  

<script type="text/python">
def echo():
    alert(doc["zone"].value)
</script>

<input id="zone"><button onclick="echo()">click !</button>
</td>
</tr>
</table>

Para que o script em Python possa ser processado, é necessário incluir
_brython.js_ e executar a função `brython()` ao carregar a página
(usando o atributo _onload_ da etiqueta `<body>`). Enquanto estiver em
fase de desenvolvimento, é possível passar um argumento à função
`brython()` : 1 para que as mensagens de erro sejam mostradas no
console do navegador, 2 para que seja mostrado também o código
Javascript junto com o erro.

Se o programa em Python for grande, outra opção é escrevê-lo em um
arquivo separado e carregá-lo usando o atributo _src_ da etiqueta
`<script>` :

<table><tr><td>

    <html>
    <head>
    <script src="/brython.js"></script>
    </head>
    <body onload="brython()">
    <script type="text/python" src="test.py"></script>
    <input id="zone"><button onclick="echo()">click !</button>
    </body>
    </html>

</td></tr></table>

Perceba que, neste caso, o script em Python será carregado por uma
chamada Ajax : ele deve estar localizado no mesmo domínio da página
HTML.

Nos dois exemplos acima, quando clicamos no botão, o evento _onclick_
chama e executa a função `echo()`, definida no script Python. Esta
função obtém o valor do elemento INPUT através de seu id (_zone_). É
utilizada a sintaxe `doc["zone"]`. Em Brython, `doc` é uma
palavra-chave e se comporta como um dicionário cujas chaves são os ids
dos elementos do DOM. Portanto, em nosso exemplo, `doc["zone"]` é um
objeto que está mapeado ao elemento INPUT, e sua propriedade _value_
contém o valor do elemento.

Em Brython, a saída pode ser obtida de varias formas, incluindo a
função `alert()`, integrada, que mostra uma janela popup com o texto
que for passado como argumento.