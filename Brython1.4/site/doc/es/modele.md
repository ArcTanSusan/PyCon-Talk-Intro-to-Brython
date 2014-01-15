Compilando y ejecutando
-----------------------

### Visi&oacute;n general

<table border=1 cellpadding =5>
<tr><td>Paso </td><td>llevado a cabo por</td></tr>
<tr>
<td>Leyendo c&oacute;digo Python</td>
<td>funci&oacute;n <code>brython(_debug\_mode_)</code> en __py2js.js__

Si el c&oacute;digo es un fichero externo, se obtendr&aacute; mediante una llamada Ajax

Esta funci&oacute;n crea las siguientes variables de entorno :

- `document.$py_src` : objeto indexado mediante los nombres de los m&oacute;dulos, el valor es el c&oacute;digo fuente del m&oacute;dulo
- `document.$debug` : nivel de depuraci&oacute;n
- `document.$exc_stack` : una lista de errores generados durante el 'parseo' o durante el tiempo de ejecuci&oacute;n
    
</td>

</tr>

<tr>
    
<td>Creaci&oacute;n del &aacute;rbol representando al c&oacute;digo Python</td>
<td>funci&oacute;n <code>\_\_BRYTHON\_\_.$py2js(_source,module_)</code> in __py2js.js__

Esta funci&oacute;n llama a :
- <code>$tokenize(_source_)</code> : an&aacute;lisis sint&aacute;ctico de los tokens en el c&oacute;digo fuente Python y en la construcci&oacute;n del &aacute;rbol. ;

   Devuelve la ra&iacute;z del &aacute;rbol
- <code>transform(_root_)</code> : transforma el &aacute;rbol para prepararlo para la conversi&oacute;n a Javascript (ver debajo)
- `$add_line_num()` para a&ntilde;adir n&uacute;meros de l&iacute;nea en el caso de que el 'debug mode' sea superior a 0

La funci&oacute;n `$py2js` devuelve la ra&iacute;z del &aacute;rbol.
</td>
</tr>

<tr>
    
<td>generando c&oacute;digo Javascript</td>
<td>m&eacute;todo `to_js()` del &aacute;rbol devuelto por `$py2js`

Esta funci&oacute;n llama de forma recursiva al m&eacute;todo del mismo nombre y a todos los elementos sint&aacute;cticos encontrados en el &aacute;rbol. Devuelve la cadena que contiene el c&oacute;digo Javascript resultante. Si el 'debug mode' es 2, esta cadena se mostrar&aacute; en la consola del navegador.
</td>
</tr>

<tr>
    
<td>ejecutando c&oacute;digo Javascript</td>
<td>evaluaci&oacute;n mediante la funci&oacute;n `eval()`
    
</td>
</tr>

</table>

### Fiicheros usados

El script __brython.js__ se genera mediante la compilaci&oacute;n de varios scripts :

- __brython\_builtins.js__ : define el objeto `__BRYTHON__` que act&uacute;a como pasarela entre objetos Javascript nativos (`Date, RegExp, Storage...`) y Brython
- __py2js.js__ : realiza la conversi&oacute;n de c&oacute;digo Python a c&oacute;digo Javascript
- __py\_utils.js__ : funciones &uacute;tiles (eg conversiones de tipos entre Javascript y Python)
- __py\_object.js__ : implementa el clase `object` de Python
- __py\_builtin\_functions.js__ : Python built-in functions
- __js\_objects.js__ : interfaz a los objetos y constructores Javascript
- __py\_import.js__ : implementación de _import_
- __py\_dict.js__ : implementación de la clase `dict` Python
- __py\_list.js__ : implementación de la clase Python `list`, basada en el tipo Javascript `Array`
- __py\_string.js__ : implementación de la clase Python `str`, basada en el tipo Javascript `String`
- __py\_set.js__ : implementación de la clase `set` Python
- __py\_dom.js__ : interacción con el documento HTML (DOM)

### M&aacute;s sobre traducci&oacute;n y ejecuci&oacute;n

Traducci&oacute;n y ejecuci&oacute;n de un script Brython mediante __py2js.js__ sigue los siguientes pasos :
<ol>
<li>An&aacute;lisis sint&aacute;ctico y creaci&oacute;n del &aacute;rbol

Este paso se basa en un aut&oacute;mata cuyo estado evoluciona con los tokens encontrados en el c&oacute;digo fuente

El c&oacute;digo Python se separa en tokens que pueden poseer los siguientes tipos : 

- keyword
- identificador
- literal (string, integer, float)
- operador
- period (.)
- colon (:)
- semi colon (;)
- par&eacute;ntesis / corchete ('bracket') / llave ('curly brace')
- asignaci&oacute;n (signo igual =)
- decorador (@)
- fin de l&iacute;nea

Para cada token, Se produce una llamada a la funci&oacute;n _$transition()_, devolver&aacute; un nuevo estado dependiendo del estado actual y del token

Cada instrucci&oacute;n en el c&oacute;digo fuente encuentra un nodo en el &aacute;rbol (una instancia de la clase _$Node_). Si una l&iacute;nea contiene m&aacute;s de una instrucci&oacute;n separadas por ":" (`def foo(x):return x`) o por ";" (`x=1;print(x)`), se crear&aacute;n tantos nodos para esa l&iacute;nea

Cada elemento sint&aacute;ctico (identificador, llamada a funci&oacute;n, expresi&oacute;n, operador,...) es manejado mediante una clase : ver en el c&oacute;digo fuente de __py2js.js__ entre `function $AbstractExprCtx` y `function $UnaryCtx`

En este paso, se puede informar de los errores : 
- errores sint&aacute;cticos
- errores de indentaci&oacute;n
- cadenas literales inacabadas
- falta de par&eacute;ntesis / corchetes ('brackets') / llaves ('curly braces')
- caracteres ilegales
- Palabras clave Python no gestionadas por Brython

<li>Transformando el &aacute;rbol

Para algunos elementos de la sintaxis Python, el &aacute;rbol que representa el c&oacute;digo fuente debe ser modificado (a&ntilde;adiendo ramas) antes de comenzar la traducci&oacute;n a Javascript. Esto se realiza mediante llamadas recursivas al m&eacute;todo `transform()` desde el principio del &aacute;rbol 

Por ejemplo, en el primer paso, el c&oacute;digo Python <code>assert _condition_</code> produce una &uacute;nica rama del &aacute;rbol. El segundo paso lo transforma a una rama <code>if not _condition_</code> y a&ntilde;ade una rama hija con `raise AssertionError`

Los elementos que deben ser transformados de esta forma son : `assert`, cadenas (`x=y=0`) y asignaciones m&uacute;ltiples (`x,y=1,2`), `class, def, except, for, try`

Este paso se usa, adem&aacute;s, para almacenar las variables declaradas mediante `global`

<li>Ejecutando c&oacute;digo Javascript

En el momento de ejecuci&oacute;n, el script generado puede hacer uso de :

- las clases definidas en _py\_objects.js, py\_dict.js, py\_string.js, py\_list.js, py\_set.js, py\_dom.js_
- funciones internas no accesibles desde Python (sus nombres siempre comienzan con $) ; la mayor&iacute;a de ellas se definen en _$py\_utils.js_. Las m&aacute;s importantes son :

 - _$JS2Py_ : toma un solo argumento y devuelve :

  - el argumento sin cambiar si es un tipo soportado por Brython (i.e. si tiene un atributo clase ___class___)
  - una instancia de DOMObject (respectivamente DOMEvent) si el argumento es un objeto DOM (resp. evento)
  - una instancia de JSObject "envolviendo" al argumento en el resto de casos

 - _$MakeArgs_ llamado al inicio de cada funci&oacute;n si su firma posee al menos un argumento. Crea un espacio de nombres basado en los argumentos de la funci&oacute;n, llamando a la funci&oacute;n `$JS2Py` en todos los argumentos
 - _$class\_constructor_ Se le llama para la definici&oacute;n de la clase
 - _$resolve\_attr_ se le llama para resolver atributos de instancias de clases y maneja herencia m&uacute;ltiple 
 - _$list\_comp_ se le llama para las comprensiones de listas
 - _$lambda_ se le llama para funciones an&oacute;nimas definidas por `lambda`
 - _$test\_expr_ y _$test\_item_ se usan en la evaluaci&oacute;n de condiciones combinadas mediante `and` o `or`

- las funciones definidas en el script __py\_import.js__ se usan para la gesti&oacute;n de los imports

