Tradução da sintaxe de Python em código Javascript
--------------------------------------------------

<table border=1>
<tr>
<th>Python</th>
<th>Javascript</th>
<th>Comentários</th>
</tr>

<tr>
<td>
`x = 1`

`y = 3.14`

`z = "azerty"`
</td>
<td>
`x = Number(1)`

`y = float(3.14)`

`z = "azerty"`
</td>
<td>_float_ é uma funlção Javascript definnida em __py\_classes.js__</td>
</tr>

<tr>
<td>`x = foo.bar`</td>
<td>`x = foo.__getattr__('bar')`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`foo.bar = x`</td>
<td>`foo.__setattr__('bar',x)`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`x = foo[bar]`</td>
<td>`x = foo.__getitem__(bar)`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`foo[bar] = x`</td>
<td>`foo.__setitem__(bar,x)`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`x+y`</td>
<td>`x.__add__(b)`
<td>O mesmo para todos os operadores.
<br>Necessário para implementar operações como 2 * "a"</td>
</td>
</tr>

<tr>
<td>`a and b`</td>
<td>`$test_expr($test_item(a)&&$test_item(b))`
<td>Estamos mantendo o operador && de Javascript <br>de forma a não avaliar b se a for falso.
<br>_$test\_item_ retorna um valor booleano de Javasccript (true or false) e armazena o valor resultante em uma variável global ; _$test\_expr_ retorna esta variável global</td>
</td>
</tr>

<tr>
<td>
    for obj in iterable:
        (...)
</td>
<td>
    var $Iter1 = iterable
    for (var $i1=0;$i1<$iter1.__len__();$i1++){ 
       obj =$iter1.__item__($i1)
       void(0)
    }
</td>
<td>&nbsp;</td></tr>

<tr>
<td>`x,y = iterable`</td>
<td>
    var $var =iterable 
    x =$var.__item__(0) 
    y =$var.__item__(1) 
</td>
<td>&nbsp;</td></tr>

<tr>
<td>`x,y = a,b`</td>
<td>
    var $temp=[]
    $temp.push(a)
    $temp.push(b)
    x =$temp[0] 
    y =$temp[1]
</td>
<td>&nbsp;</td></tr>

<tr>
<td>
    def foo():
       x=3
</td>
<td>
    function foo(){
       var x=3
    }
    window.foo=foo 
</td>
<td>
Para ser consistente com a gestão do espaço de nomes (namespace) de Python, a variável local `x` é declarada pela palavra-chave `var`

A última linha adiciona o nome da função ao espaço de nomes do navegador web ; ela só funcionará se a função estiver no nível do módulo, e não dentro de outra função
</td>
</tr>

<tr>
<td>
    def foo():
       global x
       x=3
</td>
<td>
    function foo(){
       x=3
    }
    window.foo=foo 
</td>
<td>Para uma variável global, não usamos a palavra-chave `var`.</td>
</tr>

<tr>
<td>
    def foo(x,y=3,*args,**kw):
       (...)
</td>
<td>
    function foo(){
       $ns=$MakeArgs(arguments,['x'],{"y":3},"args","kw")
       for($var in $ns){eval("var "+$var+"=$ns[$var]")} 
       (...)
    }
    window.foo=foo 
</td>
<td>A função _$MakeArgs_ constrói um objeto Javascript combinando os nomes definidos na assinatura da função aos valores que são realmente passados a ela. A linha seguinte constrói o espaço de nomes da função (variáveis locais)</td>
</tr>

<tr>
<td>`foo(x,y=1)`
</td>
<td>`foo(x,$Kw("y",1))`
</td>
<td>Argumentos passados como palavras-chave são convertidos em objetos criados pela funlção _$Kw_
</tr>

<tr>
<td>
    x='brython'
    try:
        x[2]='a'
    except TypeError:
        log('error')
    except:
        log('another error')
</td>
<td>
    x ='brython' 
    try{
        x.__setitem__(2,str('a'))
    }
    catch($err0){
        if(false){void(0)} 
        else if($err0.name=="TypeError"){
            log('error')
        }
        else{
            log('another error')
        }
    }
</td>
<td>As linhas
    catch($err0){
        if(false){void(0)}
        
são adicionadas antes das cláusulas `except`, traduzidas como `else if` quando o nome de uma excessão é especificado ou como `else` quando não for o caso.

</tr>

</table>

<p>
<table border=1>
<tr>
<th>Javascript</th>
<th>Python</th>
</tr>

<tr>
<td>`setInterval(func,millisec)`</td>
<td>
    import time
    time.set_interval(func,millisec)
</td>
</tr>

<tr>
<td>`clearInterval(interval_id)`</td>
<td>
    import time
    time.clear_interval(interval_id)
</td>
</tr>

<tr>
<td>`setTimeOut(func,millisec)`</td>
<td>
    import time
    time.set_timeout(func,millisec)
</td>
</tr>

</table>

