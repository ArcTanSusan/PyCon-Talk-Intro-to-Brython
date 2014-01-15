// set

$SetDict = {
    __class__:$type,
    __name__:'set',
    $native:true
}

$SetDict.__add__ = function(self,other){
    return set(self.$items.concat(other.$items))
}

$SetDict.__and__ = function(self,other){
    var res = set()
    for(var i=0;i<self.$items.length;i++){
        if(getattr(other,'__contains__')(self.$items[i])){
            $SetDict.add(res,self.$items[i])
        }
    }
    return res
}

$SetDict.__contains__ = function(self,item){
    for(var i=0;i<self.$items.length;i++){
        try{if(getattr(self.$items[i],'__eq__')(item)){return True}
        }catch(err){void(0)}
    }
    return False
}

$SetDict.__eq__ = function(self,other){
    console.log('set eq')
    if(other===undefined){ // compare class set
        return self===set
    }
    if(isinstance(other,set)){
        if(other.$items.length==self.$items.length){
            for(var i=0;i<self.$items.length;i++){
                if($SetDict.__contains__(self,other.$items[i])===False){
                    return False
                }
            }
            return True
        }
    }
    return False
}

$SetDict.__ge__ = function(self,other){
    return !$SetDict.__lt__(self,other)
}

$SetDict.__gt__ = function(self,other){
    return !$SetDict.__le__(self,other)
}

$SetDict.__hash__ = function(self) {throw TypeError("unhashable type: 'set'");}

$SetDict.__in__ = function(self,item){return getattr(item,'__contains__')(self)}

$SetDict.__init__ = function(self){
    args = []
    for(var i=1;i<arguments.length;i++){args.push(arguments[i])}
    self.$items = []
    if(args.length==0){return}
    else if(args.length==1){    // must be an iterable
        var arg=args[0]
        if(isinstance(arg,set)){
            self.$items = arg.$item
            return
        }
        try{
            var iterable = iter(arg)
            var obj = {$items:[]}
            while(true){
                try{$SetDict.add(obj,next(iterable))}
                catch(err){
                    if(err.__name__=='StopIteration'){$pop_exc();break}
                    throw err
                }
            }
            self.$items = obj.$items
        }catch(err){
            console.log(''+err)
            throw TypeError("'"+arg.__class__.__name__+"' object is not iterable")
        }
    } else {
        throw TypeError("set expected at most 1 argument, got "+args.length)
    }
}

$set_iterator = $iterator_class('set iterator')
$SetDict.__iter__ = function(self){
    return $iterator(self.$items,$set_iterator)
}

$SetDict.__le__ = function(self,other){
    for(var i=0;i<self.$items.length;i++){
        if(!getattr(other,'__contains__')(self.$items[i])){return false}
    }
    return true
}

$SetDict.__len__ = function(self){return int(self.$items.length)}

$SetDict.__lt__ = function(self,other){
    return $SetDict.__le__(self,other)&&$SetDict.__len__(self)<getattr(other,'__len__')()
}

$SetDict.__mro__ = [$SetDict,$ObjectDict]

$SetDict.__ne__ = function(self,other){return !$SetDict.__eq__(self,other)}

$SetDict.__not_in__ = function(self,item){return !$SetDict.__in__(self,item)}

$SetDict.__or__ = function(self,other){
    var res = $SetDict.copy(self)
    for(var i=0;i<other.$items.length;i++){
        $SetDict.add(res,other.$items[i])
    }
    return res
}

$SetDict.__repr__ = function(self){
    if(self===undefined){return "<class 'set'>"}
    var head='',tail=''
    frozen = self.$real === 'frozen'
    if(self.$items.length===0){
        if(frozen){return 'frozenset()'}
        else{return 'set()'}
    }
    if(self.__class__===$SetDict && frozen){
        head = 'frozenset('
        tail = ')'
    }else if(self.__class__!==$SetDict){ // subclasses
        head = self.__class__.__name__+'('
        tail = ')'
    }
    var res = "{"
    for(var i=0;i<self.$items.length;i++){
        res += repr(self.$items[i])
        if(i<self.$items.length-1){res += ','}
    }
    res += '}'
    return head+res+tail
}

$SetDict.__str__ = $SetDict.toString = $SetDict.__repr__

$SetDict.__sub__ = function(self,other){
    // Return a new set with elements in the set that are not in the others
    var res = set()
    for(var i=0;i<self.$items.length;i++){
        if(!getattr(other,'__contains__')(self.$items[i])){
            res.$items.push(self.$items[i])
        }
    }
    return res
}

$SetDict.__xor__ = function(self,other){
    // Return a new set with elements in either the set or other but not both
    var res = set()
    for(var i=0;i<self.$items.length;i++){
        if(!getattr(other,'__contains__')(self.$items[i])){
            $SetDict.add(res,self.$items[i])
        }
    }
    for(var i=0;i<other.$items.length;i++){
        if(!$SetDict.__contains__(self,other.$items[i])){
            $SetDict.add(res,other.$items[i])
        }
    }
    return res
}

$SetDict.add = function(self,item){
    if(self.$real=='frozen'){throw AttributeError("'frozenset' object has no attribute 'add'")}
    for(var i=0;i<self.$items.length;i++){
        try{if(getattr(item,'__eq__')(self.$items[i])){return}}
        catch(err){void(0)} // if equality test throws exception
    }
    self.$items.push(item)
}

$SetDict.clear = function(self){
    if(self.__class__===frozenset.$dict){
        throw AttributeError("'frozenset' object has no attribute 'clear'")
    }
    self.$items = []
}

$SetDict.copy = function(self){
    var res = set() // copy returns an instance of set, even for subclasses
    for(var i=0;i<self.$items.length;i++){res.$items[i]=self.$items[i]}
    return res
}

$SetDict.discard = function(self,item){
    if(self.$real=='frozen'){
        throw AttributeError("'frozenset' object has no attribute 'discard'")
    }
    try{$SetDict.remove(self,item)}
    catch(err){if(err.__name__!=='KeyError'){throw err}}
}

$SetDict.isdisjoint = function(self,other){
    for(var i=0;i<self.$items.length;i++){
        if(getattr(other,'__contains__')(self.$items[i])){return false}
    }
    return true    
}

$SetDict.pop = function(self){
    if(self.$real=='frozen'){
        throw AttributeError("'frozenset' object has no attribute 'pop'")
    }
    if(self.$items.length===0){throw KeyError('pop from an empty set')}
    return self.$items.pop()
}

$SetDict.remove = function(self,item){
    if(self.$real=='frozen'){
        throw AttributeError("'frozenset' object has no attribute 'remove'")
    }
    for(var i=0;i<self.$items.length;i++){
        if(getattr(self.$items[i],'__eq__')(item)){
            self.$items.splice(i,1)
            return None
        }
    }
    throw KeyError(item)
}

$SetDict.difference = $SetDict.__sub__
$SetDict.intersection = $SetDict.__and__
$SetDict.issubset = $SetDict.__le__
$SetDict.issuperset = $SetDict.__ge__
$SetDict.union = $SetDict.__or__

function set(){
    var res = {__class__:$SetDict}
    // apply __init__ with arguments of set()
    var args = [res]
    for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
    $SetDict.__init__.apply(null,args)
    return res
}
set.__class__ = $factory
set.$dict = $SetDict
$SetDict.$factory = set
$SetDict.__new__ = $__new__(set)
