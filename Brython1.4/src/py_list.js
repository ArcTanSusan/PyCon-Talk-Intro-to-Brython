list = function(){

function $list(){
    // used for list displays
    // different from list : $list(1) is valid (matches [1])
    // but list(1) is invalid (integer 1 is not iterable)
    var args = new Array()
    for(var i=0;i<arguments.length;i++){args.push(arguments[i])}
    return new $ListDict(args)
}

$ListDict = {$native:true}

$ListDict.__add__ = function(self,other){
    var res = self.valueOf().concat(other.valueOf())
    if(isinstance(self,tuple)){res = tuple(res)}
    return res
}

$ListDict.__class__ = $type

$ListDict.__contains__ = function(self,item){
    for(var i=0;i<self.length;i++){
        try{if(getattr(self[i],'__eq__')(item)){return true}
        }catch(err){$pop_exc();void(0)}
    }
    return false
}

$ListDict.__delitem__ = function(self,arg){
    if(isinstance(arg,int)){
        var pos = arg
        if(arg<0){pos=self.length+pos}
        if(pos>=0 && pos<self.length){
            self.splice(pos,1)
            return
        }
        else{throw IndexError('list index out of range')}
    } else if(isinstance(arg,slice)) {
        var start = arg.start || 0
        var stop = arg.stop || self.length
        var step = arg.step || 1
        if(start<0){start=self.length+start}
        if(stop<0){stop=self.length+stop}
        var res = [],i=null
        if(step>0){
            if(stop>start){
                for(i=start;i<stop;i+=step){
                    if(self[i]!==undefined){res.push(i)}
                }
            }
        } else {
            if(stop<start){
                for(i=start;i>stop;i+=step.value){
                    if(self[i]!==undefined){res.push(i)}
                }
                res.reverse() // must be in ascending order
            }
        }
        // delete items from left to right
        for(var i=res.length-1;i>=0;i--){
            self.splice(res[i],1)
        }
        return
    } else {
        throw TypeError('list indices must be integer, not '+str(arg.__class__))
    }
}

$ListDict.__eq__ = function(self,other){
    if(other===undefined){ // compare object "self" to class "list"
        return self===list
    }
    if(other.__class__===self.__class__){
        if(other.length==self.length){
            for(var i=0;i<self.length;i++){
                if(!getattr(self[i],'__eq__')(other[i])){return False}
            }
            return True
        }
    }else{console.log('not the same class '+self.__class__+' '+other.__class__)}
    return False
}

$ListDict.__getitem__ = function(self,arg){
    if(isinstance(arg,int)){
        var items=self.valueOf()
        var pos = arg
        if(arg<0){pos=items.length+pos}
        if(pos>=0 && pos<items.length){return items[pos]}
        else{
            throw IndexError('list index out of range')
        }
    } else if(isinstance(arg,slice)) {
        var step = arg.step===None ? 1 : arg.step
        if(step>0){
            var start = arg.start===None ? 0 : arg.start
            var stop = arg.stop===None ? self.length : arg.stop
        }else{
            var start = arg.start===None ? self.length-1 : arg.start
            var stop = arg.stop===None ? 0 : arg.stop
        }
        if(start<0){start=int(self.length+start)}
        if(stop<0){stop=self.length+stop}
        var res = [],i=null,items=self.valueOf()
        if(step>0){
            if(stop<=start){return res}
            else {
                for(i=start;i<stop;i+=step){
                    if(items[i]!==undefined){res.push(items[i])}
                    else {res.push(None)}
                }
                return res
            }
        } else {
            if(stop>=start){return res}
            else {
                for(i=start;i>=stop;i+=step){
                    if(items[i]!==undefined){res.push(items[i])}
                    else {res.push(None)}
                }
                return res
            }
        } 
    } else if(isinstance(arg,bool)){
        return $ListDict.__getitem__(self,int(arg))
    } else {
        throw TypeError('list indices must be integer, not '+str(arg.__class__))
    }
}

$ListDict.__ge__ = function(self,other){
    if(!isinstance(other,list)){
        throw TypeError("unorderable types: list() >= "+other.__class__.__name__+'()')
    }
    var i=0
    while(i<self.length){
        if(i>=other.length){return true}
        else if(self[i]==other[i]){i++}
        else return(self[i]>=other[i])
    }
    // other starts like self, but is longer
    return false        
}

$ListDict.__gt__ = function(self,other){
    if(!isinstance(other,list)){
        throw TypeError("unorderable types: list() > "+other.__class__.__name__+'()')
    }
    var i=0
    while(i<self.length){
        if(i>=other.length){return true}
        else if(self[i]==other[i]){i++}
        else return(self[i]>other[i])
    }
    // other starts like self, but is longer
    return false        
}

$ListDict.__hash__ = function(){throw TypeError("unhashable type: 'list'")}

$ListDict.__in__ = function(self,item){return getattr(item,'__contains__')(self)}

$ListDict.__init__ = function(self,arg){
    var len_func = getattr(self,'__len__'),pop_func=getattr(self,'pop')
    while(len_func()){pop_func()}
    if(arg===undefined){return}
    var arg = iter(arg)
    var next_func = getattr(arg,'__next__')
    while(true){
        try{self.push(next_func())}
        catch(err){if(err.__name__=='StopIteration'){$pop_exc()};break}
    }
}

$ListDict.__iter__ = function(self){
    return $iterator(self,$list_iterator)
}

$ListDict.__le__ = function(self,other){
    return !$ListDict.__gt__(self,other)
}

$ListDict.__len__ = function(self){return self.length}

$ListDict.__lt__ = function(self,other){
    return !$ListDict.__ge__(self,other)
}

$ListDict.__mro__ = [$ListDict,$ObjectDict]

$ListDict.__mul__ = function(self,other){
    if(isinstance(other,int)){return getattr(other,'__mul__')(self)}
    else{
        throw TypeError("can't multiply sequence by non-int of type '"+other.__class__.__name__+"'")
    }
}

$ListDict.__name__ = 'list'

$ListDict.__ne__ = function(self,other){return !$ListDict.__eq__(self,other)}

$ListDict.__not_in__ = function(self,item){return !$ListDict.__in__(self,item)}

$ListDict.__repr__ = function(self){
    if(self===undefined){return "<class 'list'>"}
    var items=self.valueOf()
    var res = '['
    if(self.__class__===$TupleDict){res='('}
    for(var i=0;i<self.length;i++){
        var x = self[i]
        try{res+=getattr(x,'__repr__')()}
        catch(err){console.log('no __repr__');res += x.toString()}
        if(i<self.length-1){res += ', '}
    }
    if(self.__class__===$TupleDict){
        if(self.length==1){res+=','}
        return res+')'
    }
    else{return res+']'}
}

$ListDict.__setitem__ = function(self,arg,value){
    if(isinstance(arg,int)){
        var pos = arg
        if(arg<0){pos=self.length+pos}
        if(pos>=0 && pos<self.length){self[pos]=value}
        else{throw IndexError('list index out of range')}
    } else if(isinstance(arg,slice)){
        var start = arg.start===None ? 0 : arg.start
        var stop = arg.stop===None ? self.length : arg.stop
        var step = arg.step===None ? 1 : arg.step
        if(start<0){start=self.length+start}
        if(stop<0){stop=self.length+stop}
        self.splice(start,stop-start)
        // copy items in a temporary JS array
        // otherwise, a[:0]=a fails
        if(hasattr(value,'__iter__')){
            var $temp = list(value)
            for(var i=$temp.length-1;i>=0;i--){
                self.splice(start,0,$temp[i])
            }
        }else{
            throw TypeError("can only assign an iterable")
        }
    }else {
        throw TypeError('list indices must be integer, not '+str(arg.__class__))
    }
}

$ListDict.__str__ = $ListDict.__repr__

$ListDict.append = function(self,other){self.push(other)}

$ListDict.clear = function(self){
    while(self.length){self.pop()}
}

$ListDict.copy = function(self){
    var res = []
    for(var i=0;i<self.length;i++){res.push(self[i])}
    return res
}

$ListDict.count = function(self,elt){
    var res = 0
    for(var i=0;i<self.length;i++){
        if(getattr(self[i],'__eq__')(elt)){res++}
    }
    return res
}

$ListDict.extend = function(self,other){
    if(arguments.length!=2){throw TypeError(
        "extend() takes exactly one argument ("+arguments.length+" given)")}
    other = iter(other)
    while(true){
        try{self.push(next(other))}
        catch(err){
            if(err.__name__=='StopIteration'){$pop_exc();break}
            else{throw err}
        }
    }
}

$ListDict.index = function(self,elt){
    for(var i=0;i<self.length;i++){
        if(getattr(self[i],'__eq__')(elt)){return i}
    }
    throw ValueError(str(elt)+" is not in list")
}

$ListDict.insert = function(self,i,item){self.splice(i,0,item)}

$ListDict.remove = function(self,elt){
    for(var i=0;i<self.length;i++){
        if(getattr(self[i],'__eq__')(elt)){
            self.splice(i,1)
            return
        }
    }
    throw ValueError(str(elt)+" is not in list")
}

$ListDict.pop = function(self,pos){
    if(pos===undefined){ // can't use self.pop() : too much recursion !
        var res = self[self.length-1]
        self.splice(self.length-1,1)
        return res
    }else if(arguments.length==2){
        if(isinstance(pos,int)){
            var res = self[pos]
            self.splice(pos,1)
            return res
        }else{
            throw TypeError(pos.__class__+" object cannot be interpreted as an integer")
        }
    }else{ 
        throw TypeError("pop() takes at most 1 argument ("+(arguments.length-1)+' given)')
    }
}

$ListDict.reverse = function(self){
    for(var i=0;i<parseInt(self.length/2);i++){
        var buf = self[i]
        self[i] = self[self.length-i-1]
        self[self.length-i-1] = buf
    }
}
    
// QuickSort implementation found at http://en.literateprograms.org/Quicksort_(JavaScript)
function $partition(arg,array,begin,end,pivot)
{
    var piv=array[pivot];
    array.swap(pivot, end-1);
    var store=begin;
    for(var ix=begin;ix<end-1;++ix) {
        if(getattr(arg(array[ix]),'__le__')(arg(piv))) {
            array.swap(store, ix);
            ++store;
        }
    }
    array.swap(end-1, store);
    return store;
}

Array.prototype.swap=function(a, b)
{
    var tmp=this[a];
    this[a]=this[b];
    this[b]=tmp;
}

function $qsort(arg,array, begin, end)
{
    if(end-1>begin) {
        var pivot=begin+Math.floor(Math.random()*(end-begin));
        pivot=$partition(arg,array, begin, end, pivot);
        $qsort(arg,array, begin, pivot);
        $qsort(arg,array, pivot+1, end);
    }
}

$ListDict.sort = function(self){
    var func=function(x){return x}
    var reverse = false
    for(var i=1;i<arguments.length;i++){
        var arg = arguments[i]
        if(arg.__class__==$KwDict){
            if(arg.name==='key'){func=arg.value}
            else if(arg.name==='reverse'){reverse=arg.value}
        }
    }
    if(self.length==0){return}
    $qsort(func,self,0,self.length)
    if(reverse){$ListDict.reverse(self)}
    // Javascript libraries might use the return value
    if(!self.__brython__){return self}
}

$ListDict.toString = function(){return '$ListDict'}

// attribute __dict__
$ListDict.__dict__ = dict()
for(var $attr in list){
    $ListDict.__dict__.$keys.push($attr)
    $ListDict.__dict__.$values.push(list[$attr])
}

// constructor for built-in type 'list'
function list(){
    if(arguments.length===0){return []}
    else if(arguments.length>1){
        throw TypeError("list() takes at most 1 argument ("+arguments.length+" given)")
    }
    var res = []
    var arg = iter(arguments[0])
    var next_func = getattr(arg,'__next__')
    while(true){
        try{res.push(next_func())}
        catch(err){
            if(err.__name__=='StopIteration'){
                $pop_exc()
            }else{
                //console.log('err in next func '+err+'\n'+dir(arguments[0]))
            }
            break
        }
    }
    res.__brython__ = true // false for Javascript arrays - used in sort()
    return res
}
list.__class__ = $factory
list.$dict = $ListDict
$ListDict.$factory = list

Array.prototype.__class__ = $ListDict

// override built-in methods 'pop' and 'sort'
Array.prototype.$dict = {
    'pop':function(){$ListDict.pop.apply(this,arguments)},
    'sort':function(){$ListDict.sort.apply(this,arguments)}
}

// add tuple methods
for(var attr in $ListDict){
    if(['__delitem__','__setitem__',
        'append','extend','insert','remove','pop','reverse','sort'].indexOf(attr)>-1){continue}
    if($TupleDict[attr]===undefined){
        $TupleDict[attr] = $ListDict[attr]
    }
}

$TupleDict.__eq__ = function(self,other){
    if(other===undefined){ // compare object "self" to class "list"
        return self===tuple
    }
    return $ListDict.__eq__(self,other)
}

$TupleDict.__mro__ = [$TupleDict,$ObjectDict]
$TupleDict.__name__ = 'tuple'

return list
}()
$list_iterator = $iterator_class('list_iterator')
$ListDict.__new__ = $__new__(list)