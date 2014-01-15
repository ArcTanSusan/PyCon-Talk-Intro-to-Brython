$IntDict = {__class__:$type,
    __name__:'int',
    toString:function(){return '$IntDict'},
    $native:true
}
// Pierre, this probably isn't correct, but may work for now.
// do we need to create a $IntDict, like what we did for Float?
$IntDict.from_bytes = function(x, byteorder) {
  var len = x.length
  var num = x.charCodeAt(len - 1);
  if (type.signed && (num >= 128)) {
    num = num - 256;
  }
  for (var i = (len - 2); i >= 0; i--) {
    num = 256 * num + x.charCodeAt(i);
  }
  return num;
}

$IntDict.__and__ = function(self,other){return self & other} // bitwise AND

$IntDict.__bool__ = function(self){return new Boolean(self.valueOf())}

$IntDict.__class__ = $type

$IntDict.__eq__ = function(self,other){
    if(other===undefined){ // compare object "self" to class "int"
        return self===int
    }
    if(isinstance(other,int)){return self.valueOf()==other.valueOf()}
    else if(isinstance(other,float)){return self.valueOf()==other.value}
    else{return self.valueOf()===other}
}

$IntDict.__floordiv__ = function(self,other){
    if(isinstance(other,int)){
        if(other==0){throw ZeroDivisionError('division by zero')}
        else{return Math.floor(self/other)}
    }else if(isinstance(other,float)){
        if(!other.value){throw ZeroDivisionError('division by zero')}
        else{return float(Math.floor(self/other.value))}
    }else{$UnsupportedOpType("//","int",other.__class__)}
}

$IntDict.__hash__ = function(self){return self.valueOf()}

$IntDict.__in__ = function(self,item){
    return getattr(item,'__contains__')(self)
}

$IntDict.__ior__ = function(self,other){return self | other} // bitwise OR

$IntDict.__init__ = function(self,value){
    self.toString = function(){return value}
    self.valueOf = function(){return value}
}

$IntDict.__int__ = function(self){return self}

$IntDict.__invert__ = function(self){return ~self}

$IntDict.__lshift__ = function(self,other){return self << other} // bitwise left shift

$IntDict.__mod__ = function(self,other) {
    // can't use Javascript % because it works differently for negative numbers
    if(isinstance(other,int)){
        return (self%other+other)%other
    }
    else if(isinstance(other,float)){
        return ((self%other)+other)%other
    }else if(isinstance(other,bool)){ 
         var bool_value=0; 
         if (other.valueOf()) bool_value=1;
         return (self%bool_value+bool_value)%bool_value
    }else{throw TypeError(
        "unsupported operand type(s) for -: "+self+" (int) and '"+other.__class__+"'")
    }
}

$IntDict.__mro__ = [$IntDict,$ObjectDict]

$IntDict.__mul__ = function(self,other){
    var val = self.valueOf()
    if(isinstance(other,int)){return self*other}
    else if(isinstance(other,float)){return float(self*other.value)}
    else if(isinstance(other,bool)){
         var bool_value=0
         if (other.valueOf()) bool_value=1
         return self*bool_value}
    else if(typeof other==="string") {
        var res = ''
        for(var i=0;i<val;i++){res+=other}
        return res
    }else if(isinstance(other,[list,tuple])){
        var res = []
        // make temporary copy of list
        var $temp = other.slice(0,other.length)
        for(var i=0;i<val;i++){res=res.concat($temp)}
        if(isinstance(other,tuple)){res=tuple(res)}
        return res
    }else{$UnsupportedOpType("*",int,other)}
}

$IntDict.__name__ = 'int'

$IntDict.__ne__ = function(self,other){return !$IntDict.__eq__(self,other)}

$IntDict.__neg__ = function(self){return -self}

$IntDict.__new__ = function(cls){
    if(cls===undefined){throw TypeError('int.__new__(): not enough arguments')}
    return {__class__:cls.$dict}
}

$IntDict.__not_in__ = function(self,item){
    res = getattr(item,'__contains__')(self)
    return !res
}

$IntDict.__or__ = function(self,other){return self | other} // bitwise OR

$IntDict.__pow__ = function(self,other){
    if(isinstance(other, int)) {return int(Math.pow(self.valueOf(),other.valueOf()))}
    else if (isinstance(other, float)) { return float(Math.pow(self.valueOf(), other.valueOf()))}
    else{$UnsupportedOpType("**",int,other.__class__)}
}

$IntDict.__repr__ = function(self){
    if(self===int){return "<class 'int'>"}
    return self.toString()
}

$IntDict.__rshift__ = function(self,other){return self >> other} // bitwise right shift

$IntDict.__setattr__ = function(self,attr,value){
    if(self.__class__===$IntDict){throw AttributeError("'int' object has no attribute "+attr+"'")}
    // subclasses of int can have attributes set
    self[attr] = value
}

$IntDict.__str__ = $IntDict.__repr__

$IntDict.__truediv__ = function(self,other){
    if(isinstance(other,int)){
        if(other==0){throw ZeroDivisionError('division by zero')}
        else{return float(self/other)}
    }else if(isinstance(other,float)){
        if(!other.value){throw ZeroDivisionError('division by zero')}
        else{return float(self/other.value)}
    }else{$UnsupportedOpType("//","int",other.__class__)}
}

$IntDict.__xor__ = function(self,other){return self ^ other} // bitwise XOR

$IntDict.bit_length = function(self){
    s = bin(self)
    s = getattr(s,'lstrip')('-0b') // remove leading zeros and minus sign
    return s.length       // len('100101') --> 6
}

// operations
var $op_func = function(self,other){
    //console.log('op - self '+self+' other '+other)
    if(isinstance(other,int)){
        var res = self.valueOf()-other.valueOf()
        if(isinstance(res,int)){return res}
        else{return float(res)}
    }
    else if(isinstance(other,float)){return float(self.valueOf()-other.value)}
    else if(isinstance(other,bool)){
         var bool_value=0;
         if(other.valueOf()) bool_value=1;
         return self.valueOf()-bool_value}
    else{throw TypeError(
        "unsupported operand type(s) for -: "+self.valueOf()+" and '"+str(other.__class__)+"'")
    }
}
$op_func += '' // source code
var $ops = {'+':'add','-':'sub'}
for($op in $ops){
    eval('$IntDict.__'+$ops[$op]+'__ = '+$op_func.replace(/-/gm,$op))
}

// comparison methods
var $comp_func = function(self,other){
    if(isinstance(other,int)){return self.valueOf() > other.valueOf()}
    else if(isinstance(other,float)){return self.valueOf() > other.value}
    else if(isinstance(other,bool)){return self.valueOf() > $BoolDict.__hash__(other)}
    else{throw TypeError(
        "unorderable types: "+self.__class__.__name__+'() > '+other.__class__.__name__+"()")}
}
$comp_func += '' // source codevar $comps = {'>':'gt','>=':'ge','<':'lt','<=':'le'}
for($op in $comps){
    eval("$IntDict.__"+$comps[$op]+'__ = '+$comp_func.replace(/>/gm,$op))
}

Number.prototype.__class__ = $IntDict
Number.prototype.$fast_augm = true // used to speed up augmented assigns

int = function(value){
    var res
    if(value===undefined){res = Number(0)}
    else if(isinstance(value,int)){res = Number(value)}
    else if(value===True){res = Number(1)}
    else if(value===False){res = Number(0)}
    else if(typeof value=="number"){res = Number(parseInt(value))}
    else if(typeof value=="string" && (new RegExp(/^[ ]*[+-]?\d+[ ]*$/)).test(value)){
        res = Number(parseInt(value))
    }else if(isinstance(value,float)){
        res = Number(parseInt(value.value))
    }else{ throw ValueError(
        "Invalid literal for int() with base 10: '"+str(value)+"'")
    }
    return res
}
int.$dict = $IntDict
int.__class__ = $factory
$IntDict.$factory = int

