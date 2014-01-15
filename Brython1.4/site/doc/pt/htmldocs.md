## Gestão de documentos HTML

Uma página HTML pode ser vista como uma árvore cujo nodo raiz é representado pela etiqueta `doc`. Nodos subsequentes são objetos Python integrados (cadeias de caracteres, inteiros ...) ou objetos criados por funções correspondentes a suas etiquetas HTML

Estas funções ficam no módulo integrado `html` que precisa ser importado. O nome da etiqueta é em letras maiúsculas. Assim como qualquer módulo Python, você pode

- importar somente o nome do módulo : `import html`, e então se referir às etiquetas por `html.DIV`
- ou importar os nomes requeridos pelo programa : `from html import A,B,DIV`, ou, se não houver risco de conflito de nomes : `from html import *`

A sintaxe para criar um objeto (p.ex. um hyperlink) é :
> `A(<i>[conteúdo,[atributos]]</i>)`

> _conteúdo_ é o nodo filho do objeto ; _atributos_ é a sequência de palavras-chave correspondentes aos atributos da etiqueta html

Estes atributos devem ser fornecidos com a sintaxe Javascript, não CSS: _backgroundColor_ em vez de _background-color_
</dl>
Exemplo :

>    import html
>    link1 = html.A('Brython', href='http://www.brython.info')
>    link2 = html.A(html.B('Python'), href='http://www.python.org')

Para o atributo _style_, o valor deve ser um dicionário :

>    d = html.DIV('Brython', style={'height':100, 'width':200})

Para evitar conflitos com palavras-chave de Python, atributos como _class_ ou _id_ deven ter a primeira letra maiúscula :

>    d = html.DIV('Brython',Id="zone",Class="container")

Você pode também criar um objeto sem argumentos e acrescentá-los depois :

- para adicionar um nodo, use o operador <=
- para adicionar atributos, use a sintaxe clássica de Python : `object.attribute = value`
Exemplo :    
>    link = A()
>    link <= B('connexion')    link.href = 'http://example.com'

Você pode também criar múltiplos elementos no mesmo nível usando o sinal de adição (+) :

>    row = TR(TH('LastName') + TH('FirstName'))

Abaixo vemos como criar uma caixa de seleção a partir de uma lista (ao combinar estes operadores e a sintaxe Python) :

>    items = ['one', 'two', 'three']
>    sel = SELECT()
>    for i, elt in enumerate(items):
>        sel <= OPTION(elt, value = i)
>    doc <= sel

É importante notar que a criação de uma instância de uma classe envolve a criação de HTML de um único objeto DOM. Se designarmos a instância a uma variável, você não pode usá-la em diversos lugares. Por exemplo, com este código :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P( + 'I repeat: the site is ' + link

o link aparecerá somente na segunda linha. Uma solução é clonar o objeto original :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P() + 'I repeat: the site is ' + link.clone()

Como regra geral, atributos de instâncias de classes HTML têm o mesmo nome que os objetos DOM correspondentes. Por exemplo, podemos obter a opção selecionada pelo atributo `selectedIndex` do objeto `SELECT`. Brython adiciona algumas coisas para tornar a manipulação um pouco mais Pythonica

- Para buscar um objeto pelo identificador ou pelo nome de etiqueta, use a seguinte sintexe :

 - `doc[obj_id]` retorna o objeto por seu identificador ou lança `KeyError`
 - `doc[A]` retorna uma lista de objetos do tipo A (hyperlink) no documento
 - o método `get()` pode ser usado para buscar por elementos :

  - `elt.get(name=N)` retorna uma lista de todos os elementos dentro de _elt_ cujo atributo `name` é igual a `N`
  - `elt.get(selector=S)` retorna uma lista de todos os elementos dentro de _elt_ que correspondem so seletor especificado


- o conteúdo de um nodo DOM pode ser lido ou modificado pelos atributos _text_ ou _html_, correspondendo a _innerText_ (ou _textContent_) e _innerHTML_ respectivamente para objetos DOM

- A coleção `options` associada com um objeto SELECT tem uma interface de lista de Python :

 - acesso a uma opção por seu índice : `option = elt.options[índice]`
 - inserção de uma opção na posição _índice_ : `elt.options.insert(índice,opção)`
 - inserção de uma opção ao final da lista : `elt.options.append(opção)`
 - deleção de uma opção : `del elt.options[índice]`

- é possível iterar os filhos do objeto usando a sintaxe típica de Python : 

>    for child in dom_object:
>       (...)

## Cadeia de consulta

`doc` suporta o atributo `query`, que retorna a cadeia de consulta como um objeto com os seguintes atributos e métodos :

- <code>doc.query[<i>key</i>]</code> : retorna o valor associado com _`key`_. Se uma chave tem mais de um valor (que pode ser o caso de etiquetas SELECT com o atributo MULTIPLO, ou para etiquetas `<INPUT type="checkbox">`), retorna uma lista de valores. Lança `KeyError` se não houver valor para a chave

- <code>doc.query.getfirst(<i>key[,default]</i>)</code> : retorna o primeiro valor para _`key`_. Se não houver valor associado com a chave, retorna _`default`_ se fornecido, em outros casos retorna `None`

- <code>doc.query.getlist(<i>key</i>)</code> : retorna a lista de valores associados com _`key`_ (uma lista vazia se não houver valor para a chave)

- <code>doc.query.getvalue(<i>key[,default]</i>)</code> : o mesmo que `doc.query()[key]`, mas retorna _`default`_ ou `None` se não houver valor para a chave