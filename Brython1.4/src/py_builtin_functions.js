// built-in variable
__debug__ = false

// built-in functions

function abs(obj){
    if(isinstance(obj,int)){return int(Math.abs(obj))}
    else if(isinstance(obj,float)){return float(Math.abs(obj.value))}
    else if(hasattr(obj,'__abs__')){return getattr(obj,'__abs__')()}
    else{throw TypeError("Bad operand type for abs(): '"+str(obj.__class__)+"'")}
}

function $alert(src){alert(str(src))}

function all(iterable){
    while(true){
        try{
            var elt = next(iterable)
            if(!bool(elt)){return False}
        }catch(err){return True}
    }
}

function any(obj){
    var iterable = iter(obj)
    while(true){
        try{
            var elt = next(iterable)
            if(bool(elt)){return True}
        }catch(err){return False}
    }
}

function ascii(obj) {
   // adapted from 
   // http://stackoverflow.com/questions/7499473/need-to-ecape-non-ascii-characters-in-javascript
    function padWithLeadingZeros(string,pad) {
        return new Array(pad+1-string.length).join("0") + string;
    }
    
    function charEscape(charCode) {
        if(charCode>255){return "\\u" + padWithLeadingZeros(charCode.toString(16),4)}
        else{return "\\x" + padWithLeadingZeros(charCode.toString(16),2)}
    }
    
    return obj.split("").map(function (char) {
             var charCode = char.charCodeAt(0);
             return charCode > 127 ? charEscape(charCode) : char;
         })
         .join("");
}

// not in Python but used for tests until unittest works
// "assert_raises(exception,function,*args)" becomes "if condition: pass else: raise AssertionError"
function assert_raises(){
    var $ns=$MakeArgs('assert_raises',arguments,['exc','func'],{},'args','kw')
    var args = $ns['args']
    try{$ns['func'].apply(this,args)}
    catch(err){
        if(err.name!==$ns['exc']){
            throw AssertionError(
                "exception raised '"+err.name+"', expected '"+$ns['exc']+"'")
        }
        return
    }
    throw AssertionError("no exception raised, expected '"+$ns['exc']+"'")
}

// used by bin, hex and oct functions
function $builtin_base_convert_helper(obj, base) {
  var value;
  if (isinstance(obj, int)) {
     value=obj;
  } else if (obj.__index__ !== undefined) {
     value=obj.__index__()
  }
  if (value === undefined) {
     // need to raise an error
     Exception('TypeError', 'Error, argument must be an integer or contains an __index__ function')
     return
  }
  var prefix = "";
  if (base == 8) { prefix = "0o" }
  else if (base == 16) { prefix = '0x' }
  else if (base == 2) { prefix = '0b' }
  else {
    // FIXME : Choose better prefix
    prefix = ''
  }
  if (value >=0) { 
     return prefix + value.toString(base);
  } else {
    return '-' + prefix + (-value).toString(base);
  }
}

// bin() (built in function)
function bin(obj) { 
   return $builtin_base_convert_helper(obj, 2)
}

function bool(obj){ // return true or false
    if(obj===null){return False}
    else if(obj===undefined){return False}
    else if(typeof obj==="boolean"){return obj}
    else if(typeof obj==="number" || typeof obj==="string"){
        if(obj){return true}else{return false}
    }else{
        try{return getattr(obj,'__bool__')()}
        catch(err){
            $pop_exc()
            try{return getattr(obj,'__len__')()>0}
            catch(err){$pop_exc();return true}
        }
    }
}
bool.__class__ = $type
bool.__mro__ = [bool,object]
bool.__name__ = 'bool'
bool.__str__ = function(){return "<class 'bool'>"}
bool.toString = bool.__str__
bool.__hash__ = function() {
    if(this.valueOf()) return 1
    return 0
}

//bytearray() (built in function)
function bytearray(source, encoding, errors) {
  throw NotImplementedError('bytearray has not been implemented')
}

//bytes() (built in function)
$BytesDict = {
    __class__ : $type,
    __name__ : 'bytes'
}

$BytesDict.__len__ = function(self){return self.source.length}

$BytesDict.__mro__ = [$BytesDict,$ObjectDict]

$BytesDict.__repr__ = $BytesDict.__str__ = function(self){return self.source}

$BytesDict.decode = function(self){return repr(self)} // fix ?

function bytes(source, encoding, errors) {
    return {
        __class__:$BytesDict,
        source:source,
        encoding:encoding,
        errors:errors
    }
}
bytes.__class__ = $factory
bytes.$dict = $BytesDict

//callable() (built in function)
function callable(obj) {
  return hasattr(obj,'__call__')
}

//chr() (built in function)
function chr(i) {
  if (i < 0 || i > 1114111) { Exception('ValueError', 'Outside valid range')}

  return String.fromCharCode(i)
}

//classmethod() (built in function)
function classmethod(klass,func) {
    // the first argument klass is added by py2js in $CallCtx
    func.$type = 'classmethod'
    return func
}

function $class(obj,info){
    this.obj = obj
    this.__name__ = info
    this.__class__ = $type
    this.__mro__ = [this,$ObjectDict]
}

//compile() (built in function)
function compile(source, filename, mode) {
    //for now ignore mode variable, and flags, etc
    return __BRYTHON__.py2js(source, filename).to_js()
}

$ComplexDict = {__class__:$type,__name__:'complex'}
$ComplexDict.__mro__ = [$ComplexDict,$ObjectDict]

function complex(real,imag){
    return {__class__:$ComplexDict,real:real,imag:imag}
}
complex.$dict = $ComplexDict
$ComplexDict.$factory = complex

function $confirm(src){return confirm(src)}

//delattr() (built in function)
function delattr(obj, attr) {
    // descriptor protocol : if obj has attribute attr and this attribute has 
    // a method __delete__(), use it
    var res = obj[attr]
    if(res===undefined){
        var mro = obj.__class__.__mro__
        for(var i=0;i<mro.length;i++){
            var res = mro[i][attr]
            if(res!==undefined){break}
        }
    }
    if(res!==undefined && res.__delete__!==undefined){
        return res.__delete__(res,obj,attr)
    }
    getattr(obj,'__delattr__')(attr)
}

function dir(obj){
    if(isinstance(obj,JSObject)){obj=obj.js}
    if(obj.__class__===$factory){obj=obj.$dict}
    var res = []
    for(var attr in obj){
        if(attr.charAt(0)!=='$' && attr!=='__class__'){
            res.push(attr)
        }
    }
    res.sort()
    return res
}

//divmod() (built in function)
function divmod(x,y) {
    if (x < 0) {
       var x2=(Number(y)+Number(x))%y;
       if (abs(x) <= y) {
          return [int(Math.floor(x/y)), x2]
       } 
       return [int(Math.ceil(x/y)), x2]
    } 
    return list([int(Math.floor(x/y)), x.__class__.__mod__(x,y)])
}

$EnumerateDict = {__class__:$type,__name__:'enumerate'}
$EnumerateDict.__mro__ = [$EnumerateDict,$ObjectDict]

function enumerate(){
    var $ns = $MakeArgs("enumerate",arguments,["iterable"],
                {"start":Number(0)}, null, null)
    var _iter = iter($ns["iterable"])
    var _start = $ns["start"]
    var res = {
        __class__:$EnumerateDict,
        __getattr__:function(attr){return res[attr]},
        __iter__:function(){return res},
        __name__:'enumerate iterator',
        __next__:function(){
            res.counter++
            return tuple([res.counter,next(_iter)])
        },
        __repr__:function(){return "<enumerate object>"},
        __str__:function(){return "<enumerate object>"},
        counter:_start-1
    }
    for(var attr in res){
        if(typeof res[attr]==='function' && attr!=="__class__"){
            res[attr].__str__=(function(x){
                return function(){return "<method wrapper '"+x+"' of enumerate object>"}
            })(attr)
        }
    }
    return res
}
enumerate.__class__ = $factory
enumerate.$dict = $EnumerateDict
$EnumerateDict.$factory = enumerate

//eval() (built in function)
//exec() (built in function)

$FilterDict = {__class__:$type,__name__:'filter'}
$filter_iterator = $iterator_class('filter iterator')
$FilterDict.__iter__ = function(self){
    return $iterator(self.$items,$filter_iterator)
}
$FilterDict.__mro__ = [$FilterDict,$ObjectDict]

function filter(){
    if(arguments.length!=2){throw TypeError(
            "filter expected 2 arguments, got "+arguments.length)}
    var func=arguments[0],iterable=iter(arguments[1])
    var res=[]
    while(true){
        try{
            var _item = next(iterable)
            if(func(_item)){res.push(_item)}
        }catch(err){
            if(err.__name__==='StopIteration'){$pop_exc();break}
            else{throw err}
        }
    }
    return {__class__:$FilterDict,$items:res}
}


//format() (built in function)

$FrozensetDict = {__class__:$type,
    __name__:'frozenset',
}
$FrozensetDict.__mro__ = [$FrozensetDict,$ObjectDict]

// __mro__ is defined after $ObjectDict
function frozenset(){
    var res = set.apply(null,arguments)
    res.__class__ = $SetDict
    res.$real = 'frozen'
    return res
}
frozenset.__class__ = $factory
frozenset.$dict = $FrozensetDict

function getattr(obj,attr,_default){
    var klass = obj.__class__
    //if(attr=='show'){console.log('-- getattr '+attr+' of obj '+obj+' native '+klass.$native)}
    if(klass===undefined){
        // for native JS objects used in Python code
        if(obj[attr]!==undefined){return obj[attr]}
        else if(_default!==undefined){return _default}
        else{throw AttributeError('object has no attribute '+attr)}
    }

    // attribute __class__ is set for all Python objects
    if(attr=='__class__'){
        // return the factory function
        return klass.$factory
    }
    
    // attribute __dict__ returns a dictionary of all attributes
    // of the underlying Javascript object
    if(attr==='__dict__'){
        var res = dict()
        for(var $attr in obj){
            if($attr.charAt(0)!='$'){
                res.$keys.push($attr)
                res.$values.push(obj[$attr])
            }
        }
        return res
    }
    
    // __call__ on a function returns the function itself
    if(attr==='__call__' && (typeof obj=='function')){
        if(__BRYTHON__.debug>0){
            return function(){
                __BRYTHON__.call_stack.push(document.$line_info)
                try{return obj.apply(null,arguments)}
                catch(err){throw err}
                finally{__BRYTHON__.call_stack.pop()}
            }
        }
        return obj
    }
    //if(attr=='__eq__'){console.log('attr '+attr+' klass '+klass)}
    
    if(klass.$native){
    
        if(klass[attr]===undefined){
            throw AttributeError(klass.__name__+" object has no attribute '"+attr+"'")
        }
        if(typeof klass[attr]=='function'){
            if(attr=='__new__'){ // new is a static method
                return klass[attr].apply(null,arguments)
            }else{
                var method = function(){
                    var args = [obj]
                    for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
                    return klass[attr].apply(null,args)
                }
                method.__name__ = 'method '+attr+' of built-in '+klass.__name__
                return method
            }
        }
        return klass[attr]
    }

    var is_class = obj.__class__===$factory, mro, attr_func
    //if(attr=='__eq__'){console.log('2 ! getattr '+attr+' of '+obj+' ('+obj.__class__+') '+' class '+is_class)}
    if(is_class){
        attr_func=$type.__getattribute__
        if(obj.$dict===undefined){console.log('obj '+obj+' $dict undefined')}
        obj=obj.$dict
    }else{
        var mro = obj.__class__.__mro__
        if(mro===undefined){
            console.log('in getattr '+attr+' mro undefined for '+obj+' dir '+dir(obj)+' class '+obj.__class__)
            for(var _attr in obj){
                console.log('obj attr '+_attr+' : '+obj[_attr])
            }
            console.log('obj class '+dir(obj.__class__)+' str '+obj.__class__)
        }
        for(var i=0;i<mro.length;i++){
            attr_func = mro[i]['__getattribute__']
            if(attr_func!==undefined){break}
        }
    }
    if(typeof attr_func!=='function'){
        console.log(attr+' is not a function '+attr_func)
    }
    var res = attr_func(obj,attr)
    if(res!==undefined){return res}
    if(_default !==undefined){return _default}
    else{
        throw AttributeError("'"+obj.__class__.__name__+"' object has no attribute '"+attr+"'")
    }
}
getattr.__name__ = 'getattr'
//globals() (built in function)
function globals(module){
    // the translation engine adds the argument mdoule
    var res = dict()
    var scope = __BRYTHON__.scope[module].__dict__
    for(var name in scope){$DictDict.__setitem__(res,name,scope[name])}
    return res
}

function hasattr(obj,attr){
    try{getattr(obj,attr);return True}
    catch(err){$pop_exc();return False}
}

function hash(obj){
    if (isinstance(obj, int)) { return obj.valueOf();}
    if (isinstance(obj, bool)) { return int(obj);}
    if (obj.__hashvalue__ !== undefined) { return obj.__hashvalue__;}
    if (obj.__hash__ !== undefined) {
       obj.__hashvalue__=obj.__hash__()
       return obj.__hashvalue__
    } else {
       throw AttributeError(
        "'"+str(obj.__class__)+"' object has no attribute '__hash__'")
    }
}

//help() (built in function)

//hex() (built in function)
function hex(x) {
   return $builtin_base_convert_helper(x, 16)
}

//id() (built in function)
function id(obj) {
   if (obj.__hashvalue__ !== undefined) {
      return obj.__hashvalue__
   }
   if (obj.__hash__ === undefined || isinstance(obj, set) ||
      isinstance(obj, list) || isinstance(obj, dict)) {
      __BRYTHON__.$py_next_hash+=1
      obj.__hashvalue__=__BRYTHON__.$py_next_hash
      return obj.__hashvalue__
   }
   if (obj.__hash__ !== undefined) {
      return obj.__hash__()
   }

   return null
}

function __import__(mod_name){
    $import_list([mod_name])
    return __BRYTHON__.imported[mod_name]
}
//not a direct alias of prompt: input has no default value
function input(src){
    return prompt(src)
}

function isinstance(obj,arg){
    if(obj===null){return arg===None}
    if(obj===undefined){return false}
    if(arg.constructor===Array){
        for(var i=0;i<arg.length;i++){
            if(isinstance(obj,arg[i])){return true}
        }
        return false
    }else{
        if(arg===int){
            return ((typeof obj)=="number"||obj.constructor===Number)&&(obj.valueOf()%1===0)
        }
        if(arg===float){
            return ((typeof obj=="number" && obj.valueOf()%1!==0))||
                (obj.__class__===$FloatDict)
        }
        if(arg===str){return (typeof obj=="string"||obj.__class__===str)}
        if(arg===list){return (obj.constructor===Array)}
        if(obj.__class__!==undefined){
            // arg is the class constructor ; the attribute __class__ is the 
            // class dictionary, ie arg.$dict
            //return obj.__class__===arg.$dict
            var klass = obj.__class__
            if(klass.__mro__===undefined){console.log('mro undef for '+klass+' '+dir(klass)+'\n arg '+arg)}
            for(var i=0;i<klass.__mro__.length;i++){
                if(klass.__mro__[i]===arg.$dict){return true}
            }
            return false
        }
        return obj.constructor===arg
    }
}

function issubclass(klass,classinfo){
    if(arguments.length!==2){
        throw TypeError("issubclass expected 2 arguments, got "+arguments.length)
    }
    if(!klass.__class__===$factory){
        throw TypeError("issubclass() arg 1 must be a class")
    }
    if(isinstance(classinfo,tuple)){
        for(var i=0;i<classinfo.length;i++){
            if(issubclass(klass,classinfo[i])){return true}
        }
        return false
    }else if(classinfo.__class__===$factory){
        var res = klass.$dict.__mro__.indexOf(classinfo.$dict)>-1    
        return res
    }else{
        console.log('error in is_subclass '+klass.$dict.__name+' classinfo '+str(classinfo))
        throw TypeError("issubclass() arg 2 must be a class or tuple of classes")
    }
}

function iter(obj){
    try{return getattr(obj,'__iter__')()}
    catch(err){
        $pop_exc()
        throw TypeError("'"+obj.__class__.__name__+"' object is not iterable")
    }
}

function $iterator(items,klass){
    var res = {
        __class__:klass,
        __iter__:function(){return res},
        __len__:function(){return items.length},
        __next__:function(){
            res.counter++
            if(res.counter<items.length){return items[res.counter]}
            else{throw StopIteration("StopIteration")}
        },
        __repr__:function(){return "<"+klass.__name__+" object>"},
        counter:-1
    }
    res.__str__ = res.toString = res.__repr__
    return res
}

function $iterator_class(name){
    var res = {
        __class__:$type,
        __name__:name
    }
    res.__str__ = res.toString = res.__repr__
    res.__mro__ = [res,$ObjectDict]
    res.$factory = {__class__:$factory,$dict:res}
    return res
}

function len(obj){
    try{return getattr(obj,'__len__')()}
    catch(err){
        throw TypeError("object of type '"+obj.__class__.__name__+"' has no len()")}
}

// list built in function is defined in py_list

function locals(obj_id,module){
    // used for locals() ; the translation engine adds the argument obj,
    // a dictionary mapping local variable names to their values, and the
    // module name
    if(__BRYTHON__.scope[obj_id]===undefined){
        return globals(module)
    }
    var res = $dict()
    var scope = __BRYTHON__.scope[obj_id].__dict__
    for(var name in scope){$DictDict.__setitem__(res,name,scope[name])}
    return res
}

$MapDict = {
    __class__:$type,
    __name__:'map'
}
$MapDict.__mro__ = [$MapDict,$ObjectDict]

function map(){
    var func = arguments[0],res=[],rank=0
    var iter_args = []
    for(var i=1;i<arguments.length;i++){iter_args.push(iter(arguments[i]))}
    while(true){
        var args = [],flag=true
        for(var i=0;i<iter_args.length;i++){
            try{
                var x = next(iter_args[i])
                args.push(x)
            }catch(err){
                if(err.__name__==='StopIteration'){
                    $pop_exc();flag=false;break
                }else{throw err}
            }
        }
        if(!flag){break}
        res.push(func.apply(null,args))
        rank++
    }
    var obj = {
        __class__:$MapDict,
        __getattr__:function(attr){return obj[attr]},
        __iter__:function(){return iter(res)},
        __repr__:function(){return "<map object>"},
        __str__:function(){return "<map object>"}
    }
    return obj
}

function $extreme(args,op){ // used by min() and max()
    if(op==='__gt__'){var $op_name = "max"}
    else{var $op_name = "min"}
    if(args.length==0){throw TypeError($op_name+" expected 1 argument, got 0")}
    var last_arg = args[args.length-1]
    var last_i = args.length-1
    var has_key = false
    if(isinstance(last_arg,$Kw)){
        if(last_arg.name === 'key'){
            var func = last_arg.value
            has_key = true
            last_i--
        }else{throw TypeError($op_name+"() got an unexpected keyword argument")}
    }else{var func = function(x){return x}}
    if((has_key && args.length==2)||(!has_key && args.length==1)){
        var arg = args[0]
        var $iter = iter(arg)
        var res = null
        while(true){
            try{
                var x = next($iter)
                if(res===null || bool(getattr(func(x),op)(func(res)))){res = x}
            }catch(err){
                if(err.__name__=="StopIteration"){return res}
                throw err
            }
        }
    } else {
        var res = null
        for(var i=0;i<=last_i;i++){
            var x = args[i]
            if(res===null || bool(getattr(func(x),op)(func(res)))){res = x}
        }
        return res
    }
}

function max(){
    var args = []
    for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
    return $extreme(args,'__gt__')
}

// memoryview()  (built in function)
function memoryview(obj) {
  throw NotImplementedError('memoryview is not implemented')
}

function min(){
    var args = []
    for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
    return $extreme(args,'__lt__')
}

function next(obj){
    var ga = getattr(obj,'__next__')
    if(ga!==undefined){return ga()}
    throw TypeError("'"+obj.__class__.__name__+"' object is not an iterator")
}

$NotImplementedDict = {
    __class__:$type,
    __name__:'NotImplementedType'
}
$NotImplementedDict.__mro__ = [$NotImplementedDict,$ObjectDict]
$NotImplementedDict.__repr__ = $NotImplementedDict.__str__ = function(){return 'NotImplemented'}

NotImplemented = {
    __class__ : $NotImplementedDict,
}
    
function $not(obj){return !bool(obj)}

// oct() (built in function)
function oct(x) {
   return $builtin_base_convert_helper(x, 8)
}

function $open(){
    // first argument is file : can be a string, or an instance of a DOM File object
    // other arguments : 
    // - mode can be 'r' (text, default) or 'rb' (binary)
    // - encoding if mode is 'rb'
    var $ns=$MakeArgs('open',arguments,['file'],{'mode':'r','encoding':'utf-8'},'args','kw')
    for(var attr in $ns){eval('var '+attr+'=$ns["'+attr+'"]')}
    if(args.length>0){var mode=args[0]}
    if(args.length>1){var encoding=args[1]}
    if(isinstance(file,JSObject)){return new $OpenFile(file.js,mode,encoding)}
    else if(isinstance(file,str)){
        // read the file content and return an object with file object methods
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
            var req=new XMLHttpRequest();
        }else{// code for IE6, IE5
            var req=new ActiveXObject("Microsoft.XMLHTTP");
        }
        req.onreadystatechange = function(){
            var status = req.status
            if(status===404){
                $res = IOError('File not found')
            }else if(status!==200){
                $res = IOError('Could not open file '+file+' : status '+status) 
            }else{
                $res = req.responseText
            }
        }
        // add fake query string to avoid caching
        var fake_qs = '?foo='+Math.random().toString(36).substr(2,8)
        req.open('GET',file+fake_qs,false)
        req.send()
        if($res.constructor===Error){throw $res}
        // return the file-like object
        var lines = $res.split('\n')
        var res = new Object(),counter=0
        res.closed=false
        // methods for the "with" keyword
        res.__enter__ = function(){return res}
        res.__exit__ = function(){return false}
        res.__getattr__ = function(attr){return res[attr]}
        res.__iter__ = function(){return iter(lines)}
        res.__len__ = function(){return lines.length}
        res.close = function(){res.closed = true}
        res.read = function(nb){
            if(res.closed){throw ValueError('I/O operation on closed file')}
            if(nb===undefined){return $res}
            else{
                counter+=nb
                return $res.substr(counter-nb,nb)
            }
        }
        res.readable = function(){return true}
        res.readline = function(limit){
            if(res.closed){throw ValueError('I/O operation on closed file')}
            var line = ''
            if(limit===undefined||limit===-1){limit=null}
            while(true){
                if(counter>=$res.length-1){break}
                else{
                    var car = $res.charAt(counter)
                    if(car=='\n'){counter++;return line}
                    else{
                        line += car
                        if(limit!==null && line.length>=limit){return line}
                        counter++
                    }
                }
            }
        }
        res.readlines = function(hint){
            if(res.closed){throw ValueError('I/O operation on closed file')}
            var x = $res.substr(counter).split('\n')
            if(hint && hint!==-1){
                var y=[],size=0
                while(true){
                    var z = x.shift()
                    y.push(z)
                    size += z.length
                    if(size>hint || x.length==0){return y}
                }
            }else{return x}
        }
        res.seek = function(offset,whence){
            if(res.closed){throw ValueError('I/O operation on closed file')}
            if(whence===undefined){whence=0}
            if(whence===0){counter = offset}
            else if(whence===1){counter += offset}
            else if(whence===2){counter = $res.length+offset}
        }
        res.seekable = function(){return true}
        res.tell = function(){return counter}
        res.writeable = function(){return false}
        return res
    }
}

function ord(c) {
    return c.charCodeAt(0)
}

// pow() (built in function)
function pow() {
    var $ns=$MakeArgs('pow',arguments,[],{},'args','kw')
    var args = $ns['args']
    if(args.length<2){throw TypeError(
        "pow expected at least 2 arguments, got "+args.length)
    }
    if(args.length>3){throw TypeError(
        "pow expected at most 3 arguments, got "+args.length)
    }
    if(args.length === 2){
        var x = args[0]
        var y = args[1]
        var a,b
        if(isinstance(x, float)){
      a=x.value
    } else if(isinstance(x, int)){
      a=x
    } else {
      throw TypeError("unsupported operand type(s) for ** or pow()")
    }
        if (isinstance(y, float)){
      b=y.value
    } else if (isinstance(y, int)){
      b=y
    }
        else {
      throw TypeError("unsupported operand type(s) for ** or pow()")
    }
        return Math.pow(a,b)
    }
    if(args.length === 3){
        var x = args[0]
        var y = args[1]
        var z = args[2]
        var a,b,c
        if (isinstance(x, int)) {a=x} else {throw TypeError(
            "pow() 3rd argument not allowed unless all arguments are integers")}
        if (isinstance(y, int)) {b=y} else {throw TypeError(
            "pow() 3rd argument not allowed unless all arguments are integers")}
        if (isinstance(z, int)) {c=z} else {throw TypeError(
            "pow() 3rd argument not allowed unless all arguments are integers")}
        return Math.pow(a,b)%c
    }
}

function $print(){
    var $ns=$MakeArgs('print',arguments,[],{'end':'\n','sep':' '},'args', null)
    var args = $ns['args']
    var end = $ns.end
    var sep = $ns.sep
    var res = ''
    for(var i=0;i<args.length;i++){
        res += str(args[i])
        if(i<args.length-1){res += sep}
    }
    res += end
    getattr(document.$stdout,'write')(res)
}
$print.__name__ = 'print'

// compatibility with previous versions
log = function(arg){console.log(arg)} 

function $prompt(text,fill){return prompt(text,fill || '')}

// property (built in function)
$PropertyDict = {
    __class__ : $type,
    __name__ : 'property',
    __repr__ : function(){return "<property object>"},
    __str__ : function(){return "<property object>"},
    toString : function(){return "property"}
}
$PropertyDict.__mro__ = [$PropertyDict,$ObjectDict]

function property(fget, fset, fdel, doc) {
    var p = {
        __class__ : $PropertyDict,
        __doc__ : doc || "",
        $type:fget.$type,
        fget:fget,
        fset:fset,
        fdel:fdel,
        toString:function(){return '<property>'}
    }
    p.__get__ = function(self,obj,objtype) {
        if(obj===undefined){return self}
        if(self.fget===undefined){throw AttributeError("unreadable attribute")}
        return getattr(self.fget,'__call__')(obj)
    }
    if(fset!==undefined){
        p.__set__ = function(self,obj,value){
            if(self.fset===undefined){throw AttributeError("can't set attribute")}
            getattr(self.fset,'__call__')(obj,value)
        }
    }
    p.__delete__ = fdel;

    p.getter = function(fget){
        return property(fget, p.fset, p.fdel, p.__doc__)
    }
    p.setter = function(fset){
        return property(p.fget, fset, p.fdel, p.__doc__)
    }
    p.deleter = function(fdel){
        return property(p.fget, p.fset, fdel, p.__doc__)
    }
    return p
}

property.__class__ = $factory
property.$dict = $PropertyDict

// range
$RangeDict = {__class__:$type,__name__:'range',$native:true}

$RangeDict.__contains__ = function(self,other){
    var x = iter(self)
    while(true){
        try{
            var y = $RangeDict.__next__(x)
            if(getattr(y,'__eq__')(other)){return true}
        }catch(err){return false}
    }
    return false
}

$RangeDict.__getitem__ = function(self,rank){
    var res = self.start + rank*self.step
    if((self.step>0 && res >= self.stop) ||
        (self.step<0 && res < self.stop)){
            throw IndexError('range object index out of range')
    }
    return res   
}

$RangeDict.__iter__ = function(self){
    self.$counter=self.start-self.step
    return self
}

$RangeDict.__len__ = function(self){
    if(self.step>0){return 1+int((self.stop-1-self.start)/self.step)}
    else{return 1+int((self.start-1-self.stop)/-self.step)}
}

$RangeDict.__next__ = function(self){
    self.$counter += self.step
    if((self.step>0 && self.$counter >= self.stop)
        || (self.step<0 && self.$counter <= self.stop)){
            throw StopIteration('')
    }
    return self.$counter
}

$RangeDict.__mro__ = [$RangeDict,$ObjectDict]

$RangeDict.__reversed__ = function(self){
    return range(self.stop-1,self.start-1,-self.step)
}

function range(){
    var $ns=$MakeArgs('range',arguments,[],{},'args',null)
    var args = $ns['args']
    if(args.length>3){throw TypeError(
        "range expected at most 3 arguments, got "+args.length)
    }
    var start=0
    var stop=0
    var step=1
    if(args.length==1){stop = args[0]}
    else if(args.length>=2){
        start = args[0]
        stop = args[1]
    }
    if(args.length>=3){step=args[2]}
    if(step==0){throw ValueError("range() arg 3 must not be zero")}
    var res = {
        __class__ : $RangeDict,
        start:start,
        stop:stop,
        step:step
    }
    res.__repr__ = res.__str__ = function(){
            return 'range('+start+','+stop+(args.length>=3 ? ','+step : '')+')'
        }
    return res
}
range.__class__ = $factory
range.$dict = $RangeDict

function repr(obj){
    var func = getattr(obj,'__repr__')
    if(func!==undefined){return func()}
    else{throw AttributeError("object has no attribute __repr__")}
}

function reversed(seq){
    // Return a reverse iterator. seq must be an object which has a 
    // __reversed__() method or supports the sequence protocol (the __len__() 
    // method and the __getitem__() method with integer arguments starting at 
    // 0).

    var $ReversedDict = {
        __class__:$type,
        __name__:'reversed'
    }
    $ReversedDict.__mro__ = [$ReversedDict,$ObjectDict]
    $ReversedDict.__iter__ = function(self){return self}
    $ReversedDict.__next__ = function(self){
        self.$counter--
        //console.log('next '+self+' len '+self.len+' counter '+self.$counter)
        if(self.$counter<0){throw StopIteration('')}
        return self.getter(self.$counter)
    }

    try{return getattr(seq,'__reversed__')()}
    catch(err){if(err.__name__=='AttributeError'){$pop_exc()}
               else{throw err}
    }
    try{
        var res = {
            __class__:$ReversedDict,
            $counter : getattr(seq,'__len__')(),
            getter:getattr(seq,'__getitem__')
        }
        return res
    }catch(err){
        throw TypeError("argument to reversed() must be a sequence")
    }
}

function round(arg,n){
    if(!isinstance(arg,[int,float])){
        throw TypeError("type "+str(arg.__class__)+" doesn't define __round__ method")
    }
    if(n===undefined){n=0}
    if(!isinstance(n,int)){throw TypeError(
        "'"+n.__class__+"' object cannot be interpreted as an integer")}
    var mult = Math.pow(10,n)
    var res = $IntDict.__truediv__(Number(Math.round(arg.valueOf()*mult)),mult)
    if(n==0){return int(res)}else{return float(res)}
}


function setattr(obj,attr,value){
    if(!isinstance(attr,str)){throw TypeError("setattr(): attribute name must be string")}
    // descriptor protocol : if obj has attribute attr and this attribute has 
    // a method __set__(), use it
    if(__BRYTHON__.forbidden.indexOf(attr)>-1){attr='$$'+attr}
    var res = obj[attr]
    if(res===undefined){
        var mro = obj.__class__.__mro__
        for(var i=0;i<mro.length;i++){
            var res = mro[i][attr]
            if(res!==undefined){break}
        }
    }
    if(res!==undefined && res.__set__!==undefined){
        return res.__set__(res,obj,value)
    }
    
    try{var f = getattr(obj,'__setattr__')}
    catch(err){
        $pop_exc()
        obj[attr]=value
        return
    }
    f(attr,value)
}

// slice
$SliceDict = {__class__:$type,
    __name__:'slice'
}
$SliceDict.__mro__ = [$SliceDict,$ObjectDict]

function slice(){
    var $ns=$MakeArgs('slice',arguments,[],{},'args',null)
    var args = $ns['args']
    if(args.length>3){throw TypeError(
        "slice expected at most 3 arguments, got "+args.length)
    }
    var start=0
    var stop=0
    var step=1
    if(args.length==1){stop = args[0]}
    else if(args.length>=2){
        start = args[0]
        stop = args[1]
    }
    if(args.length>=3){step=args[2]}
    if(step==0){throw ValueError("slice step must not be zero")}
    var res = {
        __class__ : $SliceDict,
        start:start,
        stop:stop,
        step:step
    }
    res.__repr__ = res.__str__ = function(){
            return 'slice('+start+','+stop+(args.length>=3 ? ','+step : '')+')'
        }
    return res
}
slice.__class__ = $factory
slice.$dict = $SliceDict

// sorted() built in function
function sorted () {
    var $ns=$MakeArgs('sorted',arguments,['iterable'],{},null,'kw')
    if($ns['iterable']===undefined){throw TypeError("sorted expected 1 positional argument, got 0")}
    else{iterable=$ns['iterable']}
    var key = $DictDict.get($ns['kw'],'key',None)
    var reverse = $DictDict.get($ns['kw'],'reverse',false)
    var obj = []
    iterable = iter(iterable)
    while(true){
        try{obj.push(next(iterable))}
        catch(err){
            if(err.__name__==='StopIteration'){$pop_exc();break}
            else{throw err}
        }
    }
    // pass arguments to list.sort()
    var args = [obj]
    if (key !== None) {args.push($Kw('key',key))}
    if(reverse){args.push($Kw('reverse',true))}
    $ListDict.sort.apply(null,args)
    return obj
}

// staticmethod() built in function
function staticmethod(func) {
    func.$type = 'staticmethod'
    return func
}

// str() defined somewhere else

function sum(iterable,start){
    if(start===undefined){start=0}
    var res = start
    var iterable = iter(iterable)
    while(true){
        try{
            var _item = next(iterable)
            res = getattr(res,'__add__')(_item)
        }catch(err){
           if(err.__name__==='StopIteration'){$pop_exc();break}
           else{throw err}
        }
    }
    return res
}

// super() built in function
$SuperDict = {
    __class__:$type,
    __name__:'super'
}

$SuperDict.__getattribute__ = function(self,attr){
    var mro = self.__thisclass__.$dict.__mro__,res
    for(var i=1;i<mro.length;i++){ // start with 1 = ignores the class where super() is defined
        res = mro[i][attr]
        if(res!==undefined){
            // if super() is called with a second argument, the result is bound
            if(self.__self_class__!==None){
                var method = (function(initial_args){
                    return function(){
                        // make a local copy of initial args
                        var local_args = initial_args.slice()
                        for(var i=0;i<arguments.length;i++){
                            local_args.push(arguments[i])
                        }
                        var x = res.apply(obj,local_args)
                        if(x===undefined){return None}else{return x}
                    }})([self.__self_class__])
                method.__class__ = {
                    __class__:$type,
                    __name__:'method',
                    __mro__:[$ObjectDict]
                }
                method.__func__ = res
                method.__self__ = self
                return method
            }
            return res
        }
    }
    throw AttributeError("object 'super' has no attribute '"+attr+"'")
}

$SuperDict.__mro__ = [$SuperDict,$ObjectDict]

function $$super(_type1,_type2){
    return {__class__:$SuperDict,
        __thisclass__:_type1,
        __self_class__:_type2 || None
    }
}

function $tuple(arg){return arg} // used for parenthesed expressions

$TupleDict = {__class__:$type,__name__:'tuple'}

$TupleDict.__iter__ = function(self){
    return $iterator(self,$tuple_iterator)
}

$TupleDict.toString = function(){return '$TupleDict'}

// other attributes are defined in py_list.js, once list is defined

$tuple_iterator = $iterator_class('tuple_iterator')

// type() is implemented in py_utils

function tuple(){
    var obj = list.apply(null,arguments)
    obj.__class__ = $TupleDict

    obj.__hash__ = function () {
      // http://nullege.com/codes/show/src%40p%40y%40pypy-HEAD%40pypy%40rlib%40test%40test_objectmodel.py/145/pypy.rlib.objectmodel._hash_float/python
      var x= 0x345678
      for(var i=0; i < args.length; i++) {
         var y=_list[i].__hash__();
         x=(1000003 * x) ^ y & 0xFFFFFFFF;
      }
      return x
    }
    return obj
}
tuple.__class__ = $factory
tuple.$dict = $TupleDict
$TupleDict.$factory = tuple
$TupleDict.__new__ = $__new__(tuple) //function(arg){return tuple(arg)}

function zip(){
    var $ns=$MakeArgs('zip',arguments,[],{},'args','kw')
    var _args = $ns['args']
    var args = []
    for(var i=0;i<_args.length;i++){args.push(iter(_args[i]))}
    var kw = $ns['kw']
    var rank=0,res=[]
    while(true){
        var line=[],flag=true
        for(var i=0;i<args.length;i++){
            try{
                var x=next(args[i])
                line.push(x)
            }catch(err){
                if(err.__name__==='StopIteration'){$pop_exc();flag=false;break}
                else{throw err}
            }
        }
        if(!flag){return res}
        res.push(tuple(line))
        rank++
    }
}

// built-in constants : True, False, None

True = true
False = false

$BoolDict = {__class__:$type,
    __name__:'bool',
    __repr__ : function(){return "<class 'bool'>"},
    __str__ : function(){return "<class 'bool'>"},
    toString : function(){return "<class 'bool'>"},
}
$BoolDict.__mro__ = [$BoolDict,$ObjectDict]
bool.__class__ = $factory
bool.$dict = $BoolDict
$BoolDict.$factory = bool

$BoolDict.__add__ = function(self,other){
    if(self.valueOf()) return other + 1;
    return other;
}

Boolean.prototype.__class__ = $BoolDict

$BoolDict.__eq__ = function(self,other){
    if(self.valueOf()){return !!other}else{return !other}
}

$BoolDict.__ge__ = function(self,other){
    return $IntDict.__ge__($BoolDict.__hash__(self),other)
}

$BoolDict.__gt__ = function(self,other){
    return $IntDict.__gt__($BoolDict.__hash__(self),other)
}

$BoolDict.__hash__ = function(self) {
   if(self.valueOf()) return 1
   return 0
}

$BoolDict.__le__ = function(self,other){return !$BoolDict.__gt__(self,other)}

$BoolDict.__lt__ = function(self,other){return !$BoolDict.__ge__(self,other)}

$BoolDict.__mul__ = function(self,other){
    if(self.valueOf()) return other;
    return 0;
}

$BoolDict.toString = function(){
    if(this.valueOf()) return "True"
    return "False"
}

$BoolDict.__repr__ = $BoolDict.toString

$BoolDict.__str__ = $BoolDict.toString

$BoolDict.__sub__ = function(self,other){
    if(self.valueOf()) return 1-other;
    return -other;
}


$EllipsisDict = {__class__:$type,
    __name__:'Ellipsis',
}
$EllipsisDict.__mro__ = [$ObjectDict]
$EllipsisDict.$factory = $EllipsisDict

Ellipsis = {
    __bool__ : function(){return False},
    __class__ : $EllipsisDict,
    //__hash__ : function(){return 0},
    __repr__ : function(){return 'Ellipsis'},
    __str__ : function(){return 'Ellipsis'},
    toString : function(){return 'Ellipsis'}
}

var $comp_ops = ['ge','gt','le','lt']
var $comps = {'>':'gt','>=':'ge','<':'lt','<=':'le'}
for(var $key in $comps){ // Ellipsis is not orderable with any type
    if($comp_ops.indexOf($comps[$key])>-1){
        Ellipsis['__'+$comps[$key]+'__']=(function(k){
            return function(other){
            throw TypeError("unorderable types: ellipsis() "+k+" "+
                other.__class__.__name__)}
        })($key)
    }
}

for(var $func in Ellipsis){
    if(typeof Ellipsis[$func]==='function'){
        Ellipsis[$func].__str__ = (function(f){
            return function(){return "<method-wrapper "+f+" of Ellipsis object>"}
        })($func)
    }
}

$NoneDict = {__class__:$type,
    __name__:'NoneType',
}
$NoneDict.__mro__ = [$NoneDict,$ObjectDict]
$NoneDict.$factory = $NoneDict

None = {
    __bool__ : function(){return False},
    __class__ : $NoneDict,
    __hash__ : function(){return 0},
    __repr__ : function(){return 'None'},
    __str__ : function(){return 'None'},
    toString : function(){return 'None'}
}

var $comp_ops = ['ge','gt','le','lt']
var $comps = {'>':'gt','>=':'ge','<':'lt','<=':'le'}
for(var $key in $comps){ // None is not orderable with any type
    if($comp_ops.indexOf($comps[$key])>-1){
        None['__'+$comps[$key]+'__']=(function(k){
            return function(other){
            throw TypeError("unorderable types: NoneType() "+k+" "+
                other.__class__.__name__)}
        })($key)
    }
}
for(var $func in None){
    if(typeof None[$func]==='function'){
        None[$func].__str__ = (function(f){
            return function(){return "<method-wrapper "+f+" of NoneType object>"}
        })($func)
    }
}

// add attributes to native Function
$FunctionDict = {__class__:$type}
$FunctionDict.__repr__=$FunctionDict.__str__ = function(self){return '<function '+self.__name__+'>'}

$FunctionDict.__mro__ = [$FunctionDict,$ObjectDict]
Function.__name__ = 'function'
Function.__class__ = $type

Function.prototype.__call__ = function(){return this.apply(null,arguments)}
Function.prototype.__class__ = $FunctionDict
Function.prototype.__get__ = function(self,obj,objtype){
    // Functions are Python descriptors, so this function is called by
    // __getattribute__ if the attribute of an object is a function
    // If the object is a class, __get__ is called with (None,klass)
    // If it is an instance, it is called with (instance,type(instance))
    return self
}
$FunctionDict.$factory = Function

// class dict of functions attribute __code__
$CodeDict = {__class__:$type,__name__:'code'}
$CodeDict.__mro__ = [$CodeDict,$ObjectDict]

// built-in exceptions

$BaseExceptionDict = {
    __class__:$type,
    __name__:'BaseException'
}

$BaseExceptionDict.__init__ = function(self){
    console.log(self.__class__.__name__+' '+arguments[1])
    self.msg = arguments[1]
}

$BaseExceptionDict.__repr__ = $BaseExceptionDict.__str__ = function(){return 'BaseException'}

$BaseExceptionDict.__mro__ = [$BaseExceptionDict,$ObjectDict]

$BaseExceptionDict.__new__ = function(cls){
    console.log('new exception')
    var err = BaseException()
    err.__name__ = cls.$dict.__name__
    err.__class__ = cls.$dict
    console.log('info '+err.info)
    return err
}

BaseException = function (msg,js_exc){
    var err = Error()
    err.info = 'Traceback (most recent call last):'
    if(msg===undefined){msg='BaseException'}
    
    if(__BRYTHON__.debug && !msg.info){
        if(js_exc!==undefined){
            for(var attr in js_exc){
                if(attr==='message'){continue}
                try{err.info += '\n    '+attr+' : '+js_exc[attr]}
                catch(_err){void(0)}
            }
            err.info+='\n'        
        }
        // call stack
        var last_info
        for(var i=0;i<__BRYTHON__.call_stack.length;i++){
            var call_info = __BRYTHON__.call_stack[i]
            var lib_module = call_info[1]
            var caller = __BRYTHON__.modules[lib_module].caller
            if(caller!==undefined){
                call_info = caller
                lib_module = caller[1]
            }
            if(lib_module.substr(0,13)==='__main__,exec'){lib_module='__main__'}
            var lines = document.$py_src[call_info[1]].split('\n')
            err.info += '\n  module '+lib_module+' line '+call_info[0]
            var line = lines[call_info[0]-1]
            while(line && line.charAt(0)==' '){line=line.substr(1)}
            err.info += '\n    '+line
            last_info = call_info
        }
        // error line
        var err_info = document.$line_info
        while(true){
            var mod = __BRYTHON__.modules[err_info[1]]
            if(mod===undefined){break}
            var caller = mod.caller
            if(caller===undefined){break}
            err_info = caller
        }
        if(err_info!==last_info){
            var module = err_info[1]
            var line_num = err_info[0]
            var lines = document.$py_src[module].split('\n')
            var lib_module = module
            if(lib_module.substr(0,13)==='__main__,exec'){lib_module='__main__'}
            err.info += "\n  module "+lib_module+" line "+line_num
            var line = lines[line_num-1]
            while(line && line.charAt(0)==' '){line = line.substr(1)}
            err.info += '\n    '+line
        }
    }
    err.message = msg
    err.args = msg
    err.__str__ = function(){return msg}
    err.toString = err.__str__
    err.__name__ = 'BaseException'
    err.__class__ = $BaseExceptionDict
    err.py_error = true
    err.type = 'BaseException'
    err.value = msg
    err.traceback = None
    __BRYTHON__.exception_stack.push(err)
    return err
}

BaseException.__name__ = 'BaseException'
BaseException.__class__ = $factory
BaseException.$dict = $BaseExceptionDict

__BRYTHON__.exception = function(js_exc){
    // thrown by eval(), exec() or by a function
    // js_exc is the Javascript exception, which can be raised by the
    // code generated by Python - in this case it has attribute py_error set 
    // or by the Javascript interpreter (ReferenceError for instance)
    if(js_exc.py_error && __BRYTHON__.debug>0){console.log('info '+js_exc.info)}
    if(!js_exc.py_error){
        if(__BRYTHON__.debug>0 && js_exc.info===undefined){
            if(document.$line_info!==undefined){
                var mod_name = document.$line_info[1]
                var module = __BRYTHON__.modules[mod_name]
                if(module){
                    if(module.caller!==undefined){
                        // for list comprehension and the likes, replace
                        // by the line in the enclosing module
                        document.$line_info = module.caller
                        var mod_name = document.$line_info[1]
                    }
                    var lib_module = mod_name
                    if(lib_module.substr(0,13)==='__main__,exec'){lib_module='__main__'}
                    var line_num = document.$line_info[0]
                    var lines = document.$py_src[mod_name].split('\n')
                    js_exc.message += "\n  module '"+lib_module+"' line "+line_num
                    js_exc.message += '\n'+lines[line_num-1]
                    js_exc.info_in_msg = true
                }
            }else{
                console.log('error '+js_exc)
            }
        }
        var exc = Error()
        exc.__name__ = js_exc.__name__ || js_exc.name
        exc.__class__ = $ExceptionDict
        if(js_exc.name=='ReferenceError'){
            exc.__name__='NameError'
            exc.__class__=$NameErrorDict
        }
        exc.message = js_exc.message
        exc.info = ''
    }else{
        var exc = js_exc
    }
    __BRYTHON__.exception_stack.push(exc)
    return exc
}

function $is_exc(exc,exc_list){
    // used in try/except to check if an exception is an instance of
    // one of the classes in exc_list
    if(exc.__class__===undefined){
        exc = __BRYTHON__.exception(exc)
    }
    var exc_class = exc.__class__.$factory
    for(var i=0;i<exc_list.length;i++){
        if(issubclass(exc_class,exc_list[i])){return true}
    }
    return false
}

function $make_exc(names,parent){
    // create a class for exception called "name"
    for(var i=0;i<names.length;i++){
        var name = names[i]
        var $exc = (BaseException+'').replace(/BaseException/g,name)
        // class constructor
        eval(name+'='+$exc)
        eval(name+'.__str__ = function(){return "<class '+"'"+name+"'"+'>"}')
        eval(name+'.__class__=$factory')
        // class dictionary
        eval('$'+name+'Dict={__class__:$type,__name__:"'+name+'"}')
        eval('$'+name+'Dict.__mro__=[$'+name+'Dict].concat(parent.$dict.__mro__)')
        eval('$'+name+'Dict.$factory='+name)
        eval(name+'.$dict=$'+name+'Dict')
    }
}

$make_exc(['SystemExit','KeyboardInterrupt','GeneratorExit','Exception'],BaseException)
$make_exc(['StopIteration','ArithmeticError','AssertionError','AttributeError',
    'BufferError','EOFError','ImportError','LookupError','MemoryError',
    'NameError','OSError','ReferenceError','RuntimeError','SyntaxError',
    'SystemError','TypeError','ValueError','Warning'],Exception)
$make_exc(['FloatingPointError','OverflowError','ZeroDivisionError'],
    ArithmeticError)
$make_exc(['IndexError','KeyError'],LookupError)
$make_exc(['UnboundLocalError'],NameError)
$make_exc(['BlockingIOError','ChildProcessError','ConnectionError',
    'FileExistsError','FileNotFoundError','InterruptedError',
    'IsADirectoryError','NotADirectoryError','PermissionError',
    'ProcessLookupError','TimeoutError'],OSError)
$make_exc(['BrokenPipeError','ConnectionAbortedError','ConnectionRefusedError',
    'ConnectionResetError'],ConnectionError)
$make_exc(['NotImplementedError'],RuntimeError)
$make_exc(['IndentationError'],SyntaxError)
$make_exc(['TabError'],IndentationError)
$make_exc(['UnicodeError'],ValueError)
$make_exc(['UnicodeDecodeError','UnicodeEncodeError','UnicodeTranslateError'],
    UnicodeError)
$make_exc(['DeprecationWarning','PendingDeprecationWarning','RuntimeWarning',
    'SyntaxWarning','UserWarning','FutureWarning','ImportWarning',
    'UnicodeWarning','BytesWarning','ResourceWarning'],Warning)

EnvironmentError = IOError = VMSError = WindowsError = OSError
