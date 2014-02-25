Sintaxis
--------

Brython usa la misma sintaxis que Python:
- Los espacios en blanco son significativos e importantes y definen bloques
- Las listas se crean con `[]` o `list()`, Las tuplas se crean con `()` o `tuple()`, los diccionarios se crean con `{}` o `dict()` y los conjuntos (sets) se crean con  `set()`
- listas, diccionarios y conjuntos por comprensi&oacute;n (comprehension): <ul>
- `[ expr for item in iterable if condition ]`
- ` dict((i,2*i) for i in range(5))`
- `set(x for x in 'abcdcga')`
</ul>
- generadores (keyword `yield`), expresiones generadoras : `foo(x for x in bar if x>5)`
- operador ternario: `x = r1 if condition else r2`
- Las funciones pueden ser definidas con cualquier combinaci&oacute;n de argumentos fijos, argumentos por defecto, argumentos posicionales variables y argumentos de palabras clave variables : <br>`def foo(x, y=0, \*args, \*\*kw):`
- Desempaquetado de argumentos en listas o diccionarios en llamadas a funciones : `x = foo(\*args, \*\*kw)`
- clases con herencia m&uacute;ltiple
- decoradores
- imports : 
 - `import foo`
 - `from foo import X`
 - `import foo as bar`
 - `from foo import X as Y`
 - `from foo import *`
 
 Keywords y funciones integradas (built-in functions)
----------------------------------------------------

Brython soporta la mayor parte de keywords y funciones de Python 3 :

- keywords : `as, assert, break, class, continue, def, del, elif, else, except, False, finally, for, from, global, if, import, is, lambda, None, pass, return, True, try, while, with, yield`
- built-in functions : `abs(), all(), any(), ascii(), bin(), bool(), bytes(), callable(), chr(), classmethod(), delattr(), dict(), dir(), divmod(), enumerate(), eval(), exec(), filter(), float(), frozenset(), getattr(), globals(), hasattr(), hash(), hex(), id(), input(), int(), isinstance(), iter(), len(), list(), locals(), map(), max(), min(), next(), object(), open(), ord(), pow(), print(), property(), range(), repr(), reversed(), round(), set(), setattr(), slice(), sorted(), str(), sum(), tuple(), type(), zip()`

Por defecto, `print()` mostrar&aacute; la salida en la consola del navegador de la misma forma que sucede con los errores. `sys.stderr` y `sys.stdout` se pueden asignar a un objeto usando el m&eacute;todo `write()` permitiendo la redirecci&oacute;n del 'output' a una ventana o &aacute;rea texto. 

`sys.stdin`, de momento, no ha sido implementado, sin embargo, existe la funci&oacute;n integrada (built-in function) `input()` que abre un di&aacute;logo bloqueante de entrada (un 'prompt').

Para abrir un di&aacute;logo de impresi&oacute;n (a una impresora), llama a `win.print`

Lo siguiente no ha sido implementado en la versi&oacute;n actual : 

- keyword `nonlocal`
- built-in functions `bytearray(), compile(), complex(), format(), help(),  memoryview(), super(), vars(), __import__`
- El tipo de n&uacute;meros complejos (`j`) no est&aacute; soportado

Por &uacute;ltimo, se han incluido algunas keywords y funciones integradas (built-in functions) dise&ntilde;adas para realizar operaciones en el navegador :

- Los 'built-ins' `alert(), confirm(), prompt()` corresponden a sus equivalentes en Javascript.
- La 'keyword' `win` es la ventana (objeto _window_ en Javascripts) y `doc` representa el documento HTML (_document_ en Javascript).