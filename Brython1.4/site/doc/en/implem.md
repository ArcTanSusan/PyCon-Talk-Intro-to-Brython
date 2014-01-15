Translation of the Python syntax into Javascript code
-----------------------------------------------------

<table border=1 cellpadding=3>
<tr>
<th>Python</th>
<th>Javascript</th>
<th>Comments</th>
</tr>

<tr>
<td>
`x = 1`

`y = 3.14`

`z = "azerty"`
</td>
<td>
    var $globals = __BRYTHON__.scope["__main__"].__dict__
    var $locals = $globals
    x=$globals["x"]=Number(1)
    y=$globals["y"]=float(3.14)
    z=$globals["z"]="azerty"
</td>
<td>The first 2 lines are present in all scripts ; they define internal Brython variables that are used by the built-in functions `globals()` and `locals()`. They will not be reproduced in the next examples

_float_ is a Javascript function defined in __py\_builtin\_functions.js__</td>
</tr>

<tr>
<td>`x = foo.bar`</td>
<td>`x=getattr(foo,"bar")`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`foo.bar = x`</td>
<td>`setattr(foo,"bar",x)`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`x = foo[bar]`</td>
<td>`x=getattr(foo,"__getitem__")(bar)`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`foo[bar] = x`</td>
<td>`getattr(foo,"__setitem__")(bar,x)`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`x+y`</td>
<td>`getattr(x,"__add__")(y)`
<td>same for all operators
<br>necessary to implement such operations as 2 * "a"</td>
</td>
</tr>

<tr>
<td>`x += y`</td>
<td>
    $temp=y
    if(!hasattr(x,"__iadd__")){
     x=getattr(x,"__add__")($temp)
    }else{
     x=getattr(x,"__iadd__")($temp)
    }
</td>
<td>&nbsp;
</td>
</td>
</tr>

<tr>
<td>`a and b`</td>
<td>`$test_expr($test_item(a)&&$test_item(b))`
<td>we are keeping the Javascript && operator so as to not evaluate b if a is false
<br>_$test\_item_ returns a Javascript boolean (true or false)  and stores the resulting value in a global variable ; _$test\_expr_ returns this global variable</td>
</td>
</tr>

<tr>
<td>
    for obj in iterable:
        (...)
</td>
<td>
    var $iter48=iter(y)
    var $no_break48=true
    while(true){
        try{
            x=$globals["x"]=getattr($iter48,"__next__")()
        }
        catch($err){
            if($is_exc($err,[StopIteration])){
                $pop_exc();break
            }else{
                throw($err)
            }
        }
        (...)
    }

</td>
<td>_$no\_break_ is a boolean used if the `for` loop has an `else` clause

_$pop\_exc()_ is an internal function that removes the last exception from the exception stack

_$is\_exc(exc,classes)_ is an internal function that checks if the exception _exc_ in an instance of one of the _classes_

</td></tr>

<tr>
<td>`x,y = iterable`</td>
<td>
    $right=iter(iterable)
    $counter=-1
    try{
        $counter++
        x=next($right)
        $counter++
        y=next($right)
    }catch($err49){
        if($err49.__name__=="StopIteration"){
            $pop_exc()
            throw ValueError("need more than "+$counter+" value"+
                ($counter>1 ? "s" : "")+" to unpack")
        }
    }
    var $exhausted=true
    try{
        next($right)
        $exhausted=false
    }catch(err){
        if(err.__name__=="StopIteration"){
        $pop_exc()
        }
    }
    if(!$exhausted){
        throw ValueError("too many values to unpack (expected "+
            ($counter+1)+")")
    } 
</td>
<td>The translation is quite long, but exception handling must be done at runtime</td></tr>

<tr>
<td>
    def foo():
       x=3
</td>
<td>
    var foo= (function (){
        return function(){
            try{
                var $ns=$MakeArgs("foo",arguments,[],{},null,null)
                for($var in $ns){eval("var "+$var+"=$ns[$var]")}
                var $locals = __BRYTHON__.scope["a54xmumg"].__dict__=$ns
                var x=$locals["x"]=Number(3)
            }catch(err51){
                throw __BRYTHON__.exception(err51)
            }
        }
    })()
    foo.__name__="foo"
    window.foo=foo
    foo.$type='function'
</td>
<td>
_$ns_ is an internal variable, an object returned by the built-in function _$MakeArgs_ that inspects the function arguments and sets values according to the function signature

If no exception is raised by _$MakeArgs_, local values are set, and stored in the internal variable _$locals_, and in the attribute _\_\_dict\_\__ of a value of the internal object _\_\_BRYTHON\_\_.scope_ indexed by a random string (here "a54xmumg") associated with the function

To be consistent with the management of the Python namespace, the local variable `x` is declared by the `var` keyword

The line `window.foo = foo` adds the function name in the namespace of the browser ; it will only exist if the function is at the module level, and not inside another function

The function attribute _$type_ is used internally to sort module-level function from methods defined in classes
</td>
</tr>

<tr>
<td>
    def foo():
       global x
       x=3
</td>
<td>
    var foo= (function (){
        return function(){
            try{
                var $ns=$MakeArgs("foo",arguments,[],{},null,null)
                for($var in $ns){eval("var "+$var+"=$ns[$var]")}
                var $locals = __BRYTHON__.scope["a54xmumg"].__dict__=$ns
                x=$locals["x"]=Number(3)
            }catch(err51){
                throw __BRYTHON__.exception(err51)
            }
        }
    })()
    foo.__name__="foo"
    window.foo=foo
    foo.$type='function'

</td>
<td>for a global variable, we do not use the `var` keyword</td>
</tr>

<tr>
<td>
    def foo(x,y=3,*args,**kw):
       (...)
</td>
<td>
    var foo= (function (){
        return function(){
            try{
                var $ns=$MakeArgs("foo",arguments,["x"],
                    {"y":Number(3)},"args","kw")
                for($var in $ns){eval("var "+$var+"=$ns[$var]")}
                var $locals = __BRYTHON__.scope["jez7jnqt"].__dict__=$ns
                (...)
            }catch(err51){
                throw __BRYTHON__.exception(err51)
            }
        }
    })()
    foo.__name__="foo"
    window.foo=foo
    $globals["foo"]=foo
    foo.$type='function'
</td>
<td>the _$MakeArgs_ function builds a Javascript object matching the names defined in the function signature to the values that are actually passed to it. The following line builds the namespace of the function (local variables)</td>
</tr>

<tr>
<td>`foo(x)`
</td>
<td>`getattr(foo,"__call__")(x)`
</td>
<td>Calls use the method \_\_call\_\_ of the object
</tr>



<tr>
<td>`foo(x,y=1)`
</td>
<td>`getattr(foo,"__call__")(x,$Kw("y",Number(1)))`
</td>
<td>arguments passed as keywords are converted into objects created by the _$Kw_ function
</tr>

<tr>
<td>
    x='brython'
    try:
        x[2]='a'
    except TypeError:
        print('error')
    except:
        print('another error')
</td>
<td>
    x=$globals["x"]='brython'
    $failed49=false
    try{
        getattr(x,"__setitem__")(Number(2),'a')
    }
    catch($err49){
        var $failed49=true
        if(false){void(0)}
        else if($is_exc($err49,[TypeError])){
            getattr($print,"__call__")('error')
        }
        else{
            getattr($print,"__call__")('another error')
        }
    }

</td>
<td>the lines
    catch($err51){
        if(false){void(0)}
        
are added before all `except` clauses, translated as `else if` when an exception name is specified or as an `else` when it is not the case

</tr>

<tr>
<td><pre><code>class foo:
   pass
</code></pre></td>
<td>
    var $foo=(function(){
        var $class = new Object()
        void(0)
        return $class
    }
    )()
    var foo=$class_constructor("foo",$foo)
    window.foo=foo
    __BRYTHON__.scope["__main__"].__dict__["foo"]=foo
</td>
<td>The class definition body is run in a function prefixed by the sign $. This function returns an object `$class` that holds the attributes and methods of the class

The class itself is built with the function _$class\_constructor_ defined in __py\_utils.js__ that builds 2 Javascript objects for the class : a "factory" used to build class instances, and an object with the class attributes and methods

The arguments passed to _$class\_constructor_ are the class name, the function prefixed by $, and a tuple with the optional parent classes
</tr>

<tr>
<td>
    class foo(A):
        def __init__(self,x):
            self.x = x
</td>
<td><code><pre>
    var $foo=(function(){
        var $class = new Object()
        $class.__init__= (function (){
        return function(){
            try{
                var $ns=$MakeArgs("__init__",arguments,
                    ["self","x"],{},null,null)
                for($var in $ns){eval("var "+$var+"=$ns[$var]")}
                var $locals = __BRYTHON__.scope["dybwedwu"].__dict__=$ns
                setattr(self,"x",x)
            }catch(err52){
                throw __BRYTHON__.exception(err52)
            }
        }
        })()
        $class.__init__.__name__="__init__"
        return $class
        }
    )()
    var foo=$class_constructor("foo",$foo,A)
    window.foo=foo
    __BRYTHON__.scope["__main__"].__dict__["foo"]=foo
</pre></code>
</td>
<td>The code shows that the object `$class` receives the method `__init__()` as attribute

The class inherits from another class `A`, it is found as the 3rd argument of `$class_constructor`
</td>
</tr>


</table>

