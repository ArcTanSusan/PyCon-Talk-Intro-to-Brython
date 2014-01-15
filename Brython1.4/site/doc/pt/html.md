## módulo html

Este módulo expõe as etiquetas HTML. O nome da etiqueta é em letras maiúsculas. Como para qualquer módulo Python, você pode

- importar somente o nome do módulo : `import html`, e então referenciar as etiquetas com `html.DIV`
- ou importar os nomes necessários ao programa : `from html import A,B,DIV`, ou, se não houver risco de conflito de nomes : `from html import *`

A sintaxe para criar um objeto (p.ex. um hyperlink) é :
><code>A(_[conteúdo,[atributos]]_)</code>

- `conteúdo` é o nodo filho do objeto ; ele pode ser um objeto Python como uma cadeia, um número, uma lista, etc., ou uma instância de uma outra classe do módulo html
- `atributos` é uma sequência de palavras-chave correspondentes aos atributos da etiqueta HTML. Estes atributos devem ser fornecidos com a sintaxe Javascript, e não CSS: _backgroundColor_ em vez de _background-color_
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
>    link <= B('connexion')
>    link.href = 'http://example.com'

Você pode também criar múltiplos elementos no mesmo nível usando o sinal de adição (+) :

>    row = TR(TH('LastName') + TH('FirstName'))

Abaixo vemos como criar uma caixa de seleção a partir de uma lista (ao combinar estes operadores e a sintaxe Python) :

>    items = ['one', 'two', 'three']
>    sel = SELECT()
>    for i, elt in enumerate(items):
>        sel <= OPTION(elt, value = i)
>    doc <= sel

É importante notar que a criação de uma instância de uma classe consiste na criação de HTML de um único objeto DOM. Se designarmos a instância a uma variável, você não pode usá-la em diversos lugares. Por exemplo, com este código :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P( + 'I repeat: the site is ' + link

o link aparecerá somente na segunda linha. Uma solução é clonar o objeto original :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P() + 'I repeat: the site is ' + link.clone()

Como regra geral, atributos de instâncias de classes HTML têm o mesmo nome que os objetos DOM correspondentes. Por exemplo, podemos obter a opção selecionada pelo atributo `selectedIndex` do objeto `SELECT`. Brython adiciona algumas coisas para tornar a manipulação um pouco mais Pythonica, como pode ser visto nas seções _Acessando elementos_ e _Atributos e métodos_.
