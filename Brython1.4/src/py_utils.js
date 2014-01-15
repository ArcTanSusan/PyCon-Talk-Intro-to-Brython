
function $MakeArgs($fname,$args,$required,$defaults,$other_args,$other_kw){
    // builds a namespace from the arguments provided in $args
    // in a function call like foo(x,y,z=1,*args,**kw) the parameters are
    // $required : ['x','y']
    // $defaults : {'z':int(1)}
    // $other_args = 'args'
    // $other_kw = 'kw'
    var i=null,$set_vars = [],$def_names = [],$ns = {}
    for(var k in $defaults){$def_names.push(k);$ns[k]=$defaults[k]}
    if($other_args != null){$ns[$other_args]=[]}
    if($other_kw != null){$dict_keys=[];$dict_values=[]}
    // create new list of arguments in case some are packed
    var upargs = []
    for(var i=0;i<$args.length;i++){
        $arg = $args[i]
        if($arg===undefined){console.log('arg '+i+' undef in '+$fname)}
        if($arg===null){upargs.push(null)}
        else if($arg.__class__===$ptupleDict){
            for(var j=0;j<$arg.arg.length;j++){
                upargs.push($arg.arg[j])
            }
        }else if($arg.__class__===$pdictDict){
            for(var j=0;j<$arg.arg.$keys.length;j++){
                upargs.push($Kw($arg.arg.$keys[j],$arg.arg.$values[j]))
            }
        }else{
            upargs.push($arg)
        }
    }
    for(var $i=0;$i<upargs.length;$i++){
        var $arg=upargs[$i]
        var $PyVar=$JS2Py($arg)
        if($arg && $arg.__class__===$KwDict){ // keyword argument
            $PyVar = $arg.value
            if($set_vars.indexOf($arg.name)>-1){
                throw new TypeError($fname+"() got multiple values for argument '"+$arg.name+"'")
            } else if($required.indexOf($arg.name)>-1){
                var ix = $required.indexOf($arg.name)
                eval('var '+$required[ix]+"=$PyVar")
                $ns[$required[ix]]=$PyVar
                $set_vars.push($required[ix])
            } else if($arg.name in $defaults){
                $ns[$arg.name]=$PyVar
                $set_vars.push($arg.name)
            } else if($other_kw!=null){
                $dict_keys.push($arg.name)
                $dict_values.push($PyVar)
            } else {
                throw new TypeError($fname+"() got an unexpected keyword argument '"+$arg.name+"'")
            }
            if($arg.name in $defaults){delete $defaults[$arg.name]}
        }else{ // positional arguments
            if($i<$required.length){
                eval('var '+$required[$i]+"=$PyVar")
                $ns[$required[$i]]=$PyVar
                $set_vars.push($required[$i])
            } else if($other_args!==null){
                eval('$ns["'+$other_args+'"].push($PyVar)')
            } else if($i<$required.length+$def_names.length) {
                $var_name = $def_names[$i-$required.length]
                $ns[$var_name]=$PyVar
                $set_vars.push($var_name)
            } else {
                console.log(''+document.$line_info)
                msg = $fname+"() takes "+$required.length+' positional argument'
                msg += $required.length == 1 ? '' : 's'
                msg += ' but more were given'
                throw TypeError(msg)
            }
        }
    }
    // throw error if not all required positional arguments have been set
    var missing = []
    for(var i=0;i<$required.length;i++){
        if($set_vars.indexOf($required[i])==-1){missing.push($required[i])}
    }
    if(missing.length==1){
        throw TypeError($fname+" missing 1 positional argument: '"+missing[0]+"'")
    }else if(missing.length>1){
        var msg = $fname+" missing "+missing.length+" positional arguments: "
        for(var i=0;i<missing.length-1;i++){msg += "'"+missing[i]+"', "}
        msg += "and '"+missing.pop()+"'"
        throw TypeError(msg)
    }
    if($other_kw!=null){$ns[$other_kw]=new $DictClass($dict_keys,$dict_values)}
    if($other_args!=null){$ns[$other_args]=tuple($ns[$other_args])}
    return $ns
}

function $mkdict(glob,loc){
    var res = {}
    for(var arg in glob){res[arg]=glob[arg]}
    for(var arg in loc){res[arg]=loc[arg]}
    return res
}

function $list_comp(){
    var $env = arguments[0]
    for(var $arg in $env){
        eval("var "+$arg+'=$env["'+$arg+'"]')
    }
    var $ix = Math.random().toString(36).substr(2,8)
    var $py = 'def func'+$ix+"():\n"
    $py += "    res=[]\n"
    var indent=4
    for(var $i=2;$i<arguments.length;$i++){
        for(var $j=0;$j<indent;$j++){$py += ' '}
        $py += arguments[$i]+':\n'
        indent += 4
    }
    for(var $j=0;$j<indent;$j++){$py += ' '}
    $py += 'res.append('+arguments[1]+')\n'
    $py += "    return res\n"
    $py += "res"+$ix+"=func"+$ix+"()"
    var $mod_name = 'lc'+$ix
    var $root = __BRYTHON__.py2js($py,$mod_name,document.$line_info)
    $root.caller = document.$line_info
    var $js = $root.to_js()
    __BRYTHON__.scope[$mod_name].__dict__ = $env
    try{
    eval($js)
    }catch(err){throw __BRYTHON__.exception(err)}
    return eval("res"+$ix)
}

function $gen_expr(){ // generator expresssion
    var $env = arguments[0]
    for(var $arg in $env){
        eval("var "+$arg+'=$env["'+$arg+'"]')
    }
    var $ix = Math.random().toString(36).substr(2,8)
    var $res = 'res'+$ix
    var $py = $res+"=[]\n"
    var indent=0
    for(var $i=2;$i<arguments.length;$i++){
        for(var $j=0;$j<indent;$j++){$py += ' '}
        $py += arguments[$i]+':\n'
        indent += 4
    }
    for(var $j=0;$j<indent;$j++){$py += ' '}
    $py += $res+'.append('+arguments[1]+')'
    var $mod_name = 'ge'+$ix
    var $root = __BRYTHON__.py2js($py,$mod_name,document.$line_info)
    $root.caller = document.$line_info
    var $js = $root.to_js()
    __BRYTHON__.scope[$mod_name].__dict__=$env
    eval($js)
    var $res1 = eval($res)
    var $GenExprDict = {
        __class__:$type,
        __name__:'generator',
        toString:function(){return '(generator)'}
    }
    $GenExprDict.__mro__ = [$GenExprDict,$ObjectDict]
    $GenExprDict.__iter__ = function(self){return $ListDict.__iter__(self.value)}
    $GenExprDict.__str__ = function(self){
        if(self===undefined){return "<class 'generator'>"}
        return '<generator object <genexpr>>'
    }
    $GenExprDict.$factory = $GenExprDict
    var $res2 = {value:$res1,__class__:$GenExprDict}
    //$res1.__repr__ = function(){return "<generator object <genexpr>>"}
    //$res1.__str__ = $res1.__repr__
    $res2.toString = function(){return 'ge object'}
    return $res2
}

function $dict_comp(){ // dictionary comprehension
    var $env = arguments[0]
    for(var $arg in $env){
        eval("var "+$arg+'=$env["'+$arg+'"]')
    }
    var $ix = Math.random().toString(36).substr(2,8)
    var $res = 'res'+$ix
    var $py = $res+"={}\n"
    var indent=0
    for(var $i=2;$i<arguments.length;$i++){
        for(var $j=0;$j<indent;$j++){$py += ' '}
        $py += arguments[$i]+':\n'
        indent += 4
    }
    for(var $j=0;$j<indent;$j++){$py += ' '}
    $py += $res+'.update({'+arguments[1]+'})'
    var mod_name = 'dc'+$ix
    var $js = __BRYTHON__.py2js($py,mod_name,document.$line_info).to_js()
    __BRYTHON__.scope[mod_name].__dict__ = $env
    eval($js)
    return eval($res)
}


function $generator(func){
    // a cheap and buggy implementation of generators
    // actually executes the function and stores the result of
    // successive yields in a list
    // calls to stdout.write() are captured and indexed by the iteration
    // counter

    $GeneratorDict = {__class__:$type,
        __name__:'generator'
    }
    $GeneratorDict.__iter__ = function(self){return self}
    $GeneratorDict.__next__ = function(self){
        self.$iter++
        if(self.$iter<self.func.$iter.length){
            if(self.output[self.$iter]!==undefined){
                for(var i=0;i<self.output[self.$iter].length;i++){
                    document.$stdout.write(self.output[self.$iter][i])
                }
            }
            return self.func.$iter[self.$iter]
        }
        else{throw StopIteration("")}
    }
    $GeneratorDict.__mro__ = [$GeneratorDict,$ObjectDict]

    var res = function(){
        func.$iter = []
        
        // cheat ! capture all standard output
        var save_stdout = document.$stdout
        var output = {}
        document.$stdout = JSObject({
            write : function(data){
                var loop_num = func.$iter.length
                if(output[loop_num]===undefined){
                    output[loop_num]=[data]
                }else{
                    output[loop_num].push(data)
                }
            }
        })
        func.apply(this,arguments)
        document.$stdout = save_stdout
    
        var obj = {
            __class__ : $GeneratorDict,
            func:func,
            output:output,
            $iter:-1
        }
        return obj
    }
    res.__repr__ = function(){return "<function "+func.__name__+">"}
    return res
}
$generator.__repr__ = function(){return "<class 'generator'>"}
$generator.__str__ = function(){return "<class 'generator'>"}
$generator.__class__ = $type

function $ternary(env,cond,expr1,expr2){
    for(var attr in env){eval('var '+attr+'=env["'+attr+'"]')}
    var res = 'if ('+cond+'){\n'
    res += '    var $res = '+unescape(expr1)+'\n}else{\n'
    res += '    var $res = '+unescape(expr2)+'\n}'
    eval(res)
    return $res
}

function $lambda($globals,$locals,$args,$body){
    for(var $attr in $globals){eval('var '+$attr+'=$globals["'+$attr+'"]')}
    for(var $attr in $locals){eval('var '+$attr+'=$locals["'+$attr+'"]')}
    var $res = 'res'+Math.random().toString(36).substr(2,8)
    var $py = 'def '+$res+'('+$args+'):\n'
    $py += '    return '+$body
    var $js = __BRYTHON__.py2js($py,'lambda').to_js()
    eval($js)
    return eval($res)    
}

// transform native JS types into Brython types
function $JS2Py(src){
    if(src===null||src===undefined){return None}
    if(typeof src==='number'){
        if(src%1===0){return src}
        else{return float(src)}
    }
    if(src.__class__!==undefined){
        if(src.__class__===$ListDict){
            for(var i=0;i<src.length;i++){
                src[i] = $JS2Py(src[i])
            }
        }
        return src
    }
    if(typeof src=="object"){
        if($isNode(src)){return $DOMNode(src)}
        else if($isEvent(src)){return $DOMEvent(src)}
        else if(src.constructor===Array||$isNodeList(src)){
            var res = []
            for(var i=0;i<src.length;i++){
                res.push($JS2Py(src[i]))
            }
            return res
        }
    }
    return JSObject(src)
}

// generic attribute getter
function $getattr(obj,attr){ 
    if(obj[attr]!==undefined){
        var res = obj[attr]
        if(typeof res==="function"){
            res = $bind(res, obj) // see below
        }
        return $JS2Py(res)
    }    
}

// this trick is necessary to set "this" to the instance inside functions
// found at http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
function $bind(func, thisValue) {
    return function() {return func.apply(thisValue, arguments)}
}

// exceptions
function $raise(){
    // used for "raise" without specifying an exception
    // if there is an exception in the stack, use it, else throw a simple Exception
    if(__BRYTHON__.exception_stack.length>0){throw $last(__BRYTHON__.exception_stack)}
    else{throw Error('Exception')}
}

function $syntax_err_line(module,pos) {
    // map position to line number
    var pos2line = {}
    var lnum=1
    var src = document.$py_src[module]
    var line_pos = {1:0}
    for(i=0;i<src.length;i++){
        pos2line[i]=lnum
        if(src.charAt(i)=='\n'){lnum+=1;line_pos[lnum]=i}
    }
    var line_num = pos2line[pos]
    var lines = src.split('\n')

    var lib_module = module
    if(lib_module.substr(0,13)==='__main__,exec'){lib_module='__main__'}

    var line = lines[line_num-1]
    var lpos = pos-line_pos[line_num]
    while(line && line.charAt(0)==' '){
     line=line.substr(1)
     lpos--
    }
    info = '\n    ' //+line+'\n    '
    for(var i=0;i<lpos;i++){info+=' '}
    info += '^'
    return info
}

function $SyntaxError(module,msg,pos) {
    console.log('Syntax error')
    var exc = SyntaxError(msg)
    console.log('info '+exc)
    exc.info += $syntax_err_line(module,pos)
    console.log('syntax error '+exc.info)
    throw exc
}

function $IndentationError(module,msg,pos) {
    var exc = IndentationError(msg)
    exc.info += $syntax_err_line(module,pos)
    throw exc
}

// function to remove internal exceptions from stack exposed to programs
function $pop_exc(){__BRYTHON__.exception_stack.pop()}


// escaping double quotes
var $dq_regexp = new RegExp('"',"g") // to escape double quotes in arguments
function $escape_dq(arg){return arg.replace($dq_regexp,'\\"')}

// default standard output and error
// can be reset by sys.stdout or sys.stderr
document.$stderr = {
    __getattr__:function(attr){return this[attr]},
    write:function(data){console.log(data)},
    flush:function(){}
}
document.$stderr_buff = '' // buffer for standard output

document.$stdout = {
    __getattr__:function(attr){return this[attr]},
    write: function(data){console.log(data)},
    flush:function(){}
}

function $UnsupportedOpType(op,class1,class2){
    $raise('TypeError',
        "unsupported operand type(s) for "+op+": '"+class1+"' and '"+class2+"'")
}

// classes used for passing parameters to functions
// keyword arguments : foo(x=1)
$KwDict = {__class__:$type,__name__:'kw'}
$KwDict.__mro__ = [$KwDict,$ObjectDict]

function $Kw(name,value){
    return {__class__:$KwDict,name:name,value:value}
}
$Kw.$dict = $KwDict // for insinstance
$KwDict.$factory = $Kw

// packed tuple : foo(*args)
$ptupleDict = {
    __class__:$type,
    __name__:'packed tuple',
    toString:function(){return 'ptuple'}
}
$ptupleDict.$dict = $ptupleDict

function $ptuple(arg){
    return {
        __class__:$ptupleDict,
        arg:arg
    }
}
$ptuple.$dict = $ptupleDict
$ptupleDict.$factory = $ptuple

// packed dict : foo(**kw)
$pdictDict = {
    __class__ : $type,
    __name__:'packed dict'
}
$pdictDict.$dict = $pdictDict

function $pdict(arg){
    return {
        __class__:$pdictDict,
        arg:arg
    }
}
$pdict.$dict = $pdictDict
$pdict.$factory = $pdict

function $test_item(expr){
    // used to evaluate expressions with "and" or "or"
    // returns a Javascript boolean (true or false) and stores
    // the evaluation in a global variable $test_result
    document.$test_result = expr
    return bool(expr)
}

function $test_expr(){
    // returns the last evaluated item
    return document.$test_result
}

Array.prototype.match = function(other){
    // return true if array and other have the same first items
    var $i = 0
    while($i<this.length && $i<other.length){
        if(this[$i]!==other[$i]){return false}
        $i++
    }
    return true
}

// IE doesn't implement indexOf on Arrays
if(!Array.indexOf){  
Array.prototype.indexOf = function(obj){  
    for(var i=0;i<this.length;i++){  
        if(this[i]==obj){  
            return i;  
        }  
    }  
    return -1;  
 }  
}

// in case console is not defined
try{console}
catch(err){
    console = {'log':function(data){void(0)}}
}

function $List2Dict(){
    var res = {}
    var i=0
    if(arguments.length==1 && arguments[0].constructor==Array){
        // arguments passed as a list
        for(i=0;i<arguments[0].length;i++){
            res[arguments[0][i]]=0
        }
    } else {
        for(i=0;i<arguments.length;i++){
            res[arguments[i]]=0
        }
    }
    return res
}

function $last(item){
    if(typeof item=="string"){return item.charAt(item.length-1)}
    else if(typeof item=="object"){return item[item.length-1]}
}

// override IDBObjectStore's add, put, etc functions since we need
// to convert python style objects to a js object type

function pyobject2jsobject(obj) {
    if(isinstance(obj,dict)){
        var temp = new Object()
        temp.__class__ = 'dict'
        for(var i=0;i<obj.$keys.length;i++){temp[obj.$keys[i]]=obj.$values[i]}
        return temp
    }

    // giving up, just return original object
    return obj
}

function jsobject2pyobject(obj) {
    if(obj === undefined) return None
    if(obj.__class__ === 'dict'){
       var d = dict()
       for(var attr in obj){
          if (attr !== '__class__') d.__setitem__(attr, obj[attr])
       }
       return d
    }

    // giving up, just return original object
    return obj
}

if (window.IDBObjectStore !== undefined) {
    window.IDBObjectStore.prototype._put=window.IDBObjectStore.prototype.put
    window.IDBObjectStore.prototype.put=function(obj, key) {
       var myobj=pyobject2jsobject(obj);
       return window.IDBObjectStore.prototype._put.apply(this, [myobj, key]);
    }
    
    window.IDBObjectStore.prototype._add=window.IDBObjectStore.prototype.add
    window.IDBObjectStore.prototype.add=function(obj, key) {
       var myobj=pyobject2jsobject(obj);
       return window.IDBObjectStore.prototype._add.apply(this, [myobj, key]);
    }
}

if (window.IDBRequest !== undefined) {
    window.IDBRequest.prototype.pyresult=function() {
       return jsobject2pyobject(this.result);
    }
}
