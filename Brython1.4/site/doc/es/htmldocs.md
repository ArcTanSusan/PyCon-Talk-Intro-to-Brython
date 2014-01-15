Manejo de documentos HTML
-------------------------

Una p&aacute;gina HTML se puede ver como un &aacute;rbol cuyo nodo ra&iacute;z se representa por la etiqueta `doc`. Los subsecuentes nodos tambi&eacute;n son objetos Python integrados (strings, integers ...) u objetos creados por las funciones correspondientes a sus etiquetas HTML.

Estas funciones se encuentran en el m&oacute;dulo integrado `html` que debe ser importado. El nombre de la etiqueta se escribe en letras may&uacute;sculas. De la misma forma que para cualquier m&oacute;dulo Python, puedes  

- importar solo el nombre del m&oacute;dulo : `import html`, y despu&eacute;s referenciar las etiquetas mediante `html.DIV`
- o importar los nombres requeridos por el programa : `from html import A,B,DIV`, o, solo en caso de que no haya conflictos de nombres : `from html import *`

La sintaxis para crear un objeto (eg un hiperenlace) es :
<code>A(<i>[content,[attributes]]</i>)</code>

> _content_ es el nodo hijo del objeto ; _attributes_ es una secuencia de palabras clave (keywords) correspondientes a los atributos de la etiqueta HTML. Estos atributos deben ser introducidos con sintaxis Javascript, no CSS: _backgroundColor_ en lugar de _background-color_

Ejemplo :

>    import html
>    link1 = html.A('Brython', href='http://www.brython.info')
>    link2 = html.A(html.B('Python'), href='http://www.python.org')

Para el atributo _style_, el valor debe ser un diccionario :

>    d = html.DIV('Brython', style={'height':100, 'width':200})

Para evitar conflictos con las palabras clave de Python, atributos como _class_ o _id_ deben ser escritos con la primera letra en may&uacute;scula :

>    d = html.DIV('Brython',Id="zone", Class="container")

Tambi&eacute;n se puede crear un objeto sin argumentos y a&ntilde;adirlos a posteriori:

- Para a&ntilde;adir un nodo hijo hay que usar el operador __<=__
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

- Para buscar objetos por su identificador o su nombre de etiqueta puedes usar la siguiente sintaxis :

 - `doc[obj_id]`  devuelve el objeto a partir de su identificador o lanza una `KeyError`.
 - `doc[A]`  devuelve la lista de todos los objetos de tipo A (hiperenlace) presentes en el documento.

 - El m&eacute;todo `get()` se puede usar para buscar elementos :

  - `elt.get(name=N)` devuelve una lista con todos los elementos dentro de _elt_ cuyo atributo `name` es igual a `N`
  - `elt.get(selector=S)` devuelve una lista con todos los elementos dentro de _elt_ que coinciden con el selector especificado

- El contenido de un nodo DOM puede ser le&iacute;do o modificado por los atributos _text_ o _html_, que corresponden a los objetos DOM _innerText_ (o _textContent_) y _innerHTML_, respectivamente.

- La colecci&oacute;n `options` asociada con el objeto SELECT tiene una interfaz de lista Python :

 - acceso a una opci&oacute;n por su &iacute;ndice : `option = elt.options[index]`
 - inserci&oacute;n de una opci&oacute;n en la posici&oacute;n del _index_ : `elt.options.insert(index,option)`
 - inserci&oacute;n de una opci&oacute;n al final de la lista : `elt.options.append(option)`
 - borrado de una opci&oacute;n : `del elt.options[index]`

- Es posible iterar sobre los hijos del objeto usando la sintaxis Python habitual :

>    for child in dom_object:
>        (...)

## Query string

`doc` soporta el atributo `query`, que devuelve la cadena pedida como un objeto con los siguientes atributos y m&eacute;todos :

- <code>doc.query[<i>key</i>]</code> : devuelve el valor asociado con _`key`_. Si una clave tiene m&aacute;s de un valor (caso, por ejemplo, de etiquetas SELECT con el atributo MULTIPLE o para etiquetas `<INPUT type="checkbox">`), devuelve una lista de los valores. Se obtendr&aacute; un `KeyError` si no hay valor asociado con la clave

- <code>doc.query.getfirst(<i>key[,default]</i>)</code> : devuelve el primer valor para _`key`_. Si no existe un valor asociado con la clave, devolver&aacute; _`default`_ si se le proporciona, en otros casos devolver&aacute; `None`

- <code>doc.query.getlist(<i>key</i>)</code> : devuelve la lista de valores asociados con _`key`_ (devolver&aacute; una lista vacia en el caso de que no haya valor asociado a la clave)

- <code>doc.query.getvalue(<i>key[,default]</i>)</code> : mismo comportamiento que `doc.query()[key]`, pero devuelve _`default`_ o `None` si no hay valor asociado a la clave


