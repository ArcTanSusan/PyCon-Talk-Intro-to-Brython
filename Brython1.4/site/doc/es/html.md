módulo html
-----------

Este módulo permite acceder a las etiquetas HTML. El nombre de la etiqueta se escribe en mayúsculas. Como para cualquier módulo Python, puedes hacer lo siguiente

- importar solo el nombre del m&oacute;dulo : `import html`, y despu&eacute;s referenciar las etiquetas mediante `html.DIV`
- o importar los nombres requeridos por el programa : `from html import A,B,DIV`, o, solo en caso de que no haya conflictos de nombres : `from html import *`

La sintaxis para crear un objeto (eg un hiperenlace) es :
<code>A(*[content,[attributes]]*)</code>

- _content_ es el nodo hijo del objeto ; puede ser un objeto Python como un string, un número, una lista, etc, o una instancia de otra clase del módulo `html`
- _attributes_ es una secuencia de palabras clave (keywords) correspondientes a los atributos de la etiqueta HTML. Estos atributos deben ser introducidos con sintaxis Javascript, no CSS: _backgroundColor_ en lugar de _background-color_

Ejemplo :

>    import html
>    link1 = html.A('Brython', href='http://www.brython.info')
>    link2 = html.A(html.B('Python'), href='http://www.python.org')

Para el atributo _style_, el valor debe ser un diccionario :

>    d = html.DIV('Brython', style={'height':100, 'width':200})

Para evitar conflictos con las palabras clave de Python, atributos como _class_ o _id_ se deben escribir con la primera letra en may&uacute;scula :

>    d = html.DIV('Brython',Id="zone", Class="container")

Tambi&eacute;n se puede crear un objeto sin argumentos y a&ntilde;adirlos a posteriori:

- Para a&ntilde;adir un nodo hijo hay que usar el operador <=
- Para a&ntilde;adir atributos se usa la sintaxis cl&aacute;sica de Python : `object.attribute = value`

Ejemplo :

>    link = A()
>    link <= B('connexion')
>    link.href = 'http://example.com'

Tambi&eacute;n se pueden crear m&uacute;ltiples elementos al mismo nivel usando el signo m&aacute;s (+) :

>    row = TR(TH('LastName') + TH('FirstName'))

Aqu&iacute; se puede ver como crear caja de selecci&oacute;n a partir de una lista (mediante la combinaci&oacute;n de los operadores descritos y sintaxis Python) :

>    items = ['one', 'two', 'three']
>    sel = SELECT()
>    for i, elt in enumerate(items):
>        sel <= OPTION(elt, value = i)
>    doc <= sel

Es importante resaltar que la creaci&oacute;n de una instancia de una clase conlleva la creaci&oacute;n HTML a partir de un &uacute;nico objeto DOM. Si asignamos la instancia a una variable, no podr&aacute; ser usada en varios sitios. Por ejemplo, con este c&oacute;digo :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P() + 'I repeat: the site is ' + link

El link solo se mostrar&aacute; en la segunda l&iacute;nea. Una soluci&oacute;n ser&iacute;a clonar el objeto original :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P() + 'I repeat: the site is ' + link.clone()

Como regla general, los atributos de las instancias de clases HTML tienen el mismo nombre que los objetos DOM correspondientes. Por ejemplo, podemos obtener la opci&oacute;n seleccionada por el atributo _selectedIndex_ del objeto SELECT. Brython a&ntilde;ade algunas cosas que permiten que la manipulaci&oacute;n sea un poco m&aacute;s Pyth&oacute;nica

