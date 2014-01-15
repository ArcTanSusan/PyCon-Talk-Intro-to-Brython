## Eventos

Os elementos em uma página da web podem reagir a eventos como cliques de mouse, movimentos do mouse sobre eles ou deixando-os, uma tecla pressionada ou liberada, etc

### Vinculando funções de resposta a um evento

Para vincular uma ou várias funções de resposta (callback) a um evento, use a sintaxe

<blockquote>`element.bind(event,callback1[,callback2...])`</blockquote>

As funções de resposta (_callback_) têm somente um único argumento, uma instância da classe _DOMEvent_. Além dos atributos do DOM (os nomes podem variar de acordo com o navegador), este objeto tem particularmente estes artibutos :

<table border=1>
<tr><th>Tipo de evento</th><th>Atributos</th></tr>
<tr><td>todos os eventos</td><td><tt>target</tt> : o nodo DOM ao qual o evento está vinculado</td></tr>
<tr><td>click ou movimento do mouse</td><td><tt>x, y</tt> : a posição do mouse em relação ao canto superior esquerdo da janela</td></tr>
<tr><td>arrastar e soltar (HTML5)</td><td><tt>data</tt> : dados associados ao movimento</td></tr>
</table>

Exemplo :
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
    Mova o mouse sobre esta área</textarea>
</td>
<td>
<script type='text/python'>
def mouse_move(ev):
    doc["trace"].value = '%s %s' %(ev.x,ev.y)

doc["zone"].bind('mousemove',mouse_move)
</script>

<input id="trace" value="">
<br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
Mova o mouse sobre esta área</textarea>
</td>
</tr>
</table>

### Desvinculando


`element.unbind(event,callback1[,callback2...])` remove o vínculo entre o elemento e as funções especificadas para o evento  

`element.unbind(event)` remove todos os vínculos para o evento