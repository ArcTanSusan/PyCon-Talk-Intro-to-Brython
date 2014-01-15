// class object for the built-in class 'object'
$ObjectDict = {
    //__class__:$type, : not here, added in py_type.js after $type is defined
    __name__:'object',
    $native:true
}

// function used to generate the methods that return 'unorderable types'
var $ObjectNI = function(name,op){
    return function(other){
        throw TypeError('unorderable types: object() '+op+' '+str(other.__class__.__name__)+'()')
    }
}

$ObjectDict.__delattr__ = function(self,attr){delete self[attr]}

$ObjectDict.__eq__ = function(self,other){
    // equality test defaults to identity of objects
    return self===other
}

$ObjectDict.__ge__ = $ObjectNI('__ge__','>=')

$ObjectDict.__getattribute__ = function(obj,attr){
    if(attr==='__class__'){
        return obj.__class__.$factory
    }
    var res = obj[attr],args=[]
    if(obj.$dict!==undefined && obj.$dict[attr]!==undefined){
        res=obj.$dict[attr]
    }
    if(res===undefined){
        // search in classes hierarchy, following method resolution order
        //if(attr=='show'){console.log('object getattr '+attr+' of obj '+obj)}
        var mro = obj.__class__.__mro__
        for(var i=0;i<mro.length;i++){
            var v=mro[i][attr]
            if(v!==undefined){
                res = v
                break
            }
        }
    }else{
        if(res.__set__===undefined){
            // For non-data descriptors, the attribute found in object 
            // dictionary takes precedence
            return res
        }
    }
        
    if(res!==undefined){
        if(res.__get__!==undefined){ // descriptor
            res.__name__ = attr
            // __new__ is a static method
            if(attr=='__new__'){res.$type='staticmethod'}
            res1 = res.__get__.apply(null,[res,obj,obj.__class__])
            if(typeof res1=='function'){
                // if attribute is a class then return it as is
                // example :
                // ===============
                // class A:
                //    def __init__(self,x):
                //        self.x = x
                //
                // class B:
                //    foo = A
                //    def __init__(self):
                //        self.info = self.foo(18)
                //
                // B()
                // ===============
                // In class B, when we call self.foo(18), self.foo is the
                // class A, its method __init__ must be called without B's
                // self as first argument
    
                if(res1.__class__===$factory){return res}
                // instance method object
                var __self__,__func__,__repr__,__str__
                if(res.$type===undefined || res.$type==='instancemethod'){
                    // instance method : called with the instance as first 
                    // argument
                    args = [obj]
                    __self__ = obj
                    __func__ = res1
                    __repr__ = __str__ = function(){
                        var x = '<bound method '+attr
                        x += " of '"+obj.__class__.__name__+"' object>"
                        return x
                    }
                }else if(res.$type==='function'){
                    // module level function
                    return res
                }else if(res.$type==='classmethod'){
                    // class method : called with the class as first argument
                    args = [obj.__class__]
                    __self__ = obj.__class_
                    __func__ = res1
                    __repr__ = __str__ = function(){
                        var x = '<bound method type'+'.'+attr
                        x += ' of '+obj.__class__.__name__+'>'
                        return x
                    }
                }else if(res.$type==='staticmethod'){
                    // static methods have no __self__ or __func__
                    args = []
                    __repr__ = __str__ = function(){
                        return '<function '+obj.__class__.__name__+'.'+attr+'>'
                    }
                }
                var method = (function(initial_args){
                    return function(){
                        // make a local copy of initial args
                        var local_args = initial_args.slice()
                        for(var i=0;i<arguments.length;i++){
                            local_args.push(arguments[i])
                        }
                        var x = res.apply(obj,local_args)
                        if(x===undefined){return None}else{return x}
                    }})(args)
                method.__class__ = $MethodDict
                method.__func__ = __func__
                method.__repr__ = __repr__
                method.__self__ = __self__
                method.__str__ = __str__
                return method
            }else{
                return res1
            }
        }
        return res
    }else{
        // XXX search __getattr__
        var _ga = obj['__getattr__']
        if(_ga===undefined){
            var mro = obj.__class__.__mro__
            if(mro===undefined){console.log('in getattr mro undefined for '+obj)}
            for(var i=0;i<mro.length;i++){
                var v=mro[i]['__getattr__']
                if(v!==undefined){
                    _ga = v
                    break
                }
            }
        }
        if(_ga!==undefined){
            try{return _ga(obj,attr)}
            catch(err){void(0)}
        }
        //throw AttributeError('object '+obj.__class__.__name__+" has no attribute '"+attr+"'")
    }
}

$ObjectDict.__gt__ = $ObjectNI('__gt__','>')

$ObjectDict.__hash__ = function (self) { 
    __BRYTHON__.$py_next_hash+=1; 
    return __BRYTHON__.$py_next_hash;
}

$ObjectDict.__in__ = function(self,other){
    return getattr(other,'__contains__')(self)
}

$ObjectDict.__le__ = $ObjectNI('__le__','<=')

$ObjectDict.__lt__ = $ObjectNI('__lt__','<')

$ObjectDict.__mro__ = [$ObjectDict]

// A funtion that builds the __new__ method for the factory function
function $__new__(factory){
    return function(cls){
        if(cls===undefined){
            throw TypeError(factory.$dict.__name__+'.__new__(): not enough arguments')
        }
        var res = factory.apply(null,[])
        res.__class__ = cls.$dict
        var init_func = null
        try{init_func = getattr(res,'__init__')}
        catch(err){$pop_exc()}
        if(init_func!==null){
            var args = []
            for(var i=1;i<arguments.length;i++){args.push(arguments[i])}
            init_func.apply(null,args)
            res.__initialized__ = true
        }
        return res
    }
}

$ObjectDict.__new__ = function(cls){
    if(cls===undefined){throw TypeError('object.__new__(): not enough arguments')}
    var obj = new Object()
    obj.__class__ = cls.$dict
    return obj
}

$ObjectDict.__ne__ = function(self,other){return self!==other}

$ObjectDict.__or__ = function(self,other){
    if(bool(self)){return self}else{return other}
}

$ObjectDict.__repr__ = function(self){
    if(self===object){return "<class 'object'>"}
    else if(self===undefined){return "<class 'object'>"}
    else if(self.__class__===$type){return "<class '"+self.__class__.__name__+"'>"}
    else{return "<"+self.__class__.__name__+" object>"}
}

$ObjectDict.__setattr__ = function(self,attr,val){
    if(val===undefined){ // setting an attribute to 'object' type is not allowed
        throw TypeError("can't set attributes of built-in/extension type 'object'")
    }else if(self.__class__===$ObjectDict){
        // setting an attribute to object() is not allowed
        if($ObjectDict[attr]===undefined){
            throw AttributeError("'object' object has no attribute '"+attr+"'")
        }else{
            throw AttributeError("'object' object attribute '"+attr+"' is read-only")
        }
    }
    self[attr]=val
}
$ObjectDict.__setattr__.__str__ = function(){return 'method object.setattr'}

$ObjectDict.__str__ = $ObjectDict.__repr__

$ObjectDict.toString = $ObjectDict.__repr__ //function(){return '$ObjectDict'}


// constructor of the built-in class 'object'
function object(){
    return {__class__:$ObjectDict}
}
object.$dict = $ObjectDict
// object.__class__ = $factory : this is done in py_types
$ObjectDict.$factory = object
