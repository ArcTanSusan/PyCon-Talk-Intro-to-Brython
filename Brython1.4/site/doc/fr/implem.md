Traduction de la syntaxe Python en code Javascript
--------------------------------------------------

<p>
<table border=1>
<tr>
<th>Python</th>
<th>Javascript</th>
<th>Commentaires</th>
</tr>

<tr>
<td><pre><code>
x = 1
y = 3.14
z = "azerty"
</code></pre></td>
<td>    
    var $globals = __BRYTHON__.scope["__main__"].__dict__
    var $locals = $globals
    x=$globals["x"]=Number(1)
    y=$globals["y"]=float(3.14)
    z=$globals["z"]="azerty"
</td>
<td>Les 2 premières lignes sont présentes dans tous les scripts ; elles définissent des variables internes à Brython qui sont utilisées par les fonctions intégrées `globals()` et `locals()`. Ces lignes ne seront pas recopiées dans les exemples suivants

_float_ est une fonction Javascript définie dans __py\_builtin\_functions.js__
</td>
</tr>

<tr>
<td><pre>
`x = foo.bar`
</td>
<td>
`x=getattr(foo,"bar")`
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`foo.bar = x`</td>
<td>`setattr(foo,"bar",x)`</pre>
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`x = foo[bar]`</td>
<td>`x=getattr(foo,"__getitem__")(bar)`</pre>
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>
`foo[bar] = x`
</td>
<td>
`getattr(foo,"__setitem__")(bar,x)`
</pre>
<td>&nbsp;</td>
</td>
</tr>

<tr>
<td>`x+y`</td>
<td>`getattr(x,"__add__")(y)`</pre>
<td>même chose pour tous les opérateurs

indispensable pour implémenter des opérations comme 2*"a"
</td>
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
<td>on conserve l'opérateur Javascript && pour ne pas évaluer b si a est faux

_$test\_item_ retourne un booléen Javascript (`true` ou `false`) et stocke la valeur évaluée dans une variable globale ; _$test\_expr_ renvoie cette variable globale</td>
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
<td>_$no\_break_ est un booléen utilisé si la boucle `for` possède une clause `else`

_$pop\_exc()_ est une fonction interne qui enlève la dernière exception de la pile

_$is\_exc(exc,classes)_ est une fonction interne qui indique si l'exception _exc_ est une instance d'une des _classes_
</td>
</tr>

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
<td>La traduction est assez longue, mais il faut gérer les exceptions au moment de l'exécution</td></tr>

<tr>
<td><pre><code>
def foo():
   x=3
</code></pre></td>
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

<td>_$ns_ est une variable interne, un object renvoyé par la fonction _$MakeArgs_ qui inspecte les arguments passés à la fonction et affecte des valeurs selon la signature de la fonction

Si aucune exception n'est déclenchée par _$MakeArgs_, les variables locales sont initialisées et stockées dans la variable interne _$locals_, et dans l'attribut _\_\_dict\_\__ d'une valeur de l'objet interne _\_\_BRYTHON\_\_.scope_ indexée par une chaine aléatoire (ici "a54xmumg") associée à la fonction

Pour être cohérent avec la gestion de l'espace de noms Python, la variable _x_ est locale, déclarée par le mot-clé `var`

La dernière ligne ajoute le nom de la fonction dans l'espace de noms du navigateur ; elle n'est présente que si la fonction est au niveau du module, pas à l'intérieur d'une autre fonction ou d'une classe

L'attribut _$type_ de la fonction est utilisée en interne pour différencier les fonctions des méthodes définies dans des classes
</td></tr>

<tr>
<td><pre><code>
def foo():
   global x
   x=3
</code></pre></td>
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
<td>pour une variable globale, on ne précède pas l'affectation du mot-clé `var`</td>
</tr>

<tr>
<td><pre><code>
def foo(x,y=3,*args,**kw):
   (...)
</code></pre></td>
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
<td>la fonction _$MakeArgs_ contruit un objet Javascript faisant correspondre les noms définis dans la signature de la fonction aux valeurs effectivement passées. La ligne suivante construit l'espace de noms de la fonction (variables locales)</td>
</tr>

<tr>
<td><pre>
`foo(x)`
</pre></td>
<td>
`getattr(foo,"__call__")(x)`
</td>
<td>Cette transformation est nécessaire pour rendre appelables les instances des classes qui définissent une méthode`__call__()`

Elle est définie pour les objets de type fonction par 
<br>`Function.prototype.__call__ = function(){return this.apply(null,arguments)}`
</tr>

<tr>
<td>
`foo(x,y=1)`
</td>
<td>
`getattr(foo,"__call__")(x,$Kw("y",Number(1)))`
</td>
<td>les arguments passés sous forme de mots-clés sont convertis en objets créés par la fonction _$Kw()_
</tr>

<tr>
<td>
    x='brython'
    try:
        x[2]='a'
    except TypeError:
        print('erreur')
    except:
        print('autre erreur')
</code></pre></td>
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
            getattr($print,"__call__")('erreur')
        }
        else{
            getattr($print,"__call__")('autre erreur')
        }
    }
</td>
<td>les lignes
    catch($err0){
       if(false){void(0)} </b></pre><p>
sont ajoutées avant toutes les clauses `except`, qui sont traduites en `else if` si un nom d'exception est précisé ou `else` sinon

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
<td>le corps de la définition de la classe est intégré dans une fonction préfixée par le signe $. Cette fonction renvoie un objet `$class` qui possède les attributs et méthodes définis dans la classe

La classe elle-même est construite par la fonction _$class\_constructor_ définie dans __py_utils.js__ qui construit un objet Javascript correspondant à la classe Python. Les arguments passés à cette fonction sont le nom de la classe, la fonction préfixée par $, et un tuple contenant les éventuelles classes parentes
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
<td>On voit que l'objet `$class` reçoit comme attribut la méthode `__init__()`

La classe hérite d'une autre classe `A`, qu'on retrouve comme 3ème argument de l'appel à `$class_constructor`
</td>
</tr>

</table>
