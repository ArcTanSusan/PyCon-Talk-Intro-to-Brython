// dictionary for built-in class 'float'
$FloatDict = {$native:true}

$FloatDict.__bool__ = function(self){return bool(self.value)}

$FloatDict.__class__ = $type

$FloatDict.__eq__ = function(self,other){
    if(other===undefined){ // compare object "self" to class "float"
        return self===float
    }
    if(isinstance(other,int)){return self.value==other}
    else if(isinstance(other,float)){return self.value==other.value}
    else{return self.valueOf()===other}
}

$FloatDict.__floordiv__ = function(self,other){
    if(isinstance(other,int)){
        if(other===0){throw ZeroDivisionError('division by zero')}
        else{return float(Math.floor(self.value/other))}
    }else if(isinstance(other,float)){
        if(!other.value){throw ZeroDivisionError('division by zero')}
        else{return float(Math.floor(self.value/other.value))}
    }else{throw TypeError(
        "unsupported operand type(s) for //: 'float' and '"+other.__class__+"'")
    }
}

$FloatDict.__getformat__ = function(self,arg){
    if(['double','float'].indexOf(arg)){return 'IEEE, little-endian'}
    throw ValueError("__getformat__() argument 1 must be 'double' or 'float'")
}

$FloatDict.__hash__ = function() {
    // http://cw.tactileint.com/++Floats/Ruby,JavaScript,Ruby
    frexp=function (re) {
       var ex = Math.floor(Math.log(re) / Math.log(2)) + 1;
       var frac = re / Math.pow(2, ex);
       return [frac, ex];
    }

    if (this.value === Infinity || this.value === -Infinity) {
       if (this.value < 0.0) return -271828
       return 314159;
    } else if (isNaN(this.value)) {
       return 0;
    }

    var r=frexp(this.value);
    r[0] *= Math.pow(2,31)
    hipart = int(r[0])
    r[0] = (r[0] - hipart) * Math.pow(2,31)
    var x = hipart + int(r[0]) + (r[1] << 15)
    return x & 0xFFFFFFFF;
}

$FloatDict.__in__ = function(self,item){return item.__contains__(self)}

$FloatDict.__init__ = function(self,value){self.value=value}

$FloatDict.__mod__ = function(self,other) {
    // can't use Javascript % because it works differently for negative numbers
    if(isinstance(other,int)){
        return float((self.value%other+other)%other)
    }
    else if(isinstance(other,float)){
        return float(((self.value%other.value)+other.value)%other.value)
    }else if(isinstance(other,bool)){ 
         var bool_value=0; 
         if (other.valueOf()) bool_value=1;
         return float((self.value%bool_value+bool_value)%bool_value)
    }else{throw TypeError(
        "unsupported operand type(s) for -: "+self.value+" (float) and '"+other.__class__+"'")
    }
}

$FloatDict.__mro__ = [$FloatDict,$ObjectDict]

$FloatDict.__name__ = 'float'

$FloatDict.__ne__ = function(self,other){return !$FloatDict.__eq__(self,other)}

$FloatDict.__neg__ = function(self,other){return float(-self.value)}


$FloatDict.__not_in__ = function(self,item){return !(getattr(item,'__contains__')(self))}

$FloatDict.__repr__ = $FloatDict.__str__ = function(self){
    if(self===float){return "<class 'float'>"}
    var res = self.value+'' // coerce to string
    if(res.indexOf('.')==-1){res+='.0'}
    return str(res)
}

$FloatDict.__truediv__ = function(self,other){
    if(isinstance(other,int)){
        if(other===0){throw ZeroDivisionError('division by zero')}
        else{return float(self.value/other)}
    }else if(isinstance(other,float)){
        if(!other.value){throw ZeroDivisionError('division by zero')}
        else{return float(self.value/other.value)}
    }else{throw TypeError(
        "unsupported operand type(s) for //: 'float' and '"+other.__class__+"'")
    }
}

// operations
var $op_func = function(self,other){
    if(isinstance(other,int)){return float(self.value-other)}
    else if(isinstance(other,float)){return float(self.value-other.value)}
    else if(isinstance(other,bool)){ 
         var bool_value=0; 
         if (other.valueOf()) bool_value=1;
         return float(self.value-bool_value)}
    else{throw TypeError(
        "unsupported operand type(s) for -: "+self.value+" (float) and '"+other.__class__+"'")
    }
}
$op_func += '' // source code
var $ops = {'+':'add','-':'sub','*':'mul'}
for($op in $ops){
    eval('$FloatDict.__'+$ops[$op]+'__ = '+$op_func.replace(/-/gm,$op))
}

$FloatDict.__pow__= function(self,other){
    if(isinstance(other,int)){return float(Math.pow(self,other))}
    else if(isinstance(other,float)){return float(Math.pow(self.value,other.value))}
    else{throw TypeError(
        "unsupported operand type(s) for -: "+self.value+" (float) and '"+other.__class__+"'")
    }
}

// comparison methods
var $comp_func = function(self,other){
    if(isinstance(other,int)){return self.value > other.valueOf()}
    else if(isinstance(other,float)){return self.value > other.value}
    else{throw TypeError(
        "unorderable types: "+self.__class__+'() > '+other.__class__+"()")
    }
}
$comp_func += '' // source code
var $comps = {'>':'gt','>=':'ge','<':'lt','<=':'le'}
for($op in $comps){
    eval("$FloatDict.__"+$comps[$op]+'__ = '+$comp_func.replace(/>/gm,$op))
}

// unsupported operations
var $notimplemented = function(self,other){
    throw TypeError(
        "unsupported operand types for OPERATOR: '"+self.__class__+"' and '"+other.__class__+"'")
}
$notimplemented += '' // coerce to string
for($op in $operators){
    // use __add__ for __iadd__ etc, so don't define __iadd__ below
    if(['+=','-=','*=','/=','%='].indexOf($op)>-1) continue
    var $opfunc = '__'+$operators[$op]+'__'
    if(!($opfunc in $FloatDict)){
        eval('$FloatDict.'+$opfunc+"="+$notimplemented.replace(/OPERATOR/gm,$op))
    }
}

function $FloatClass(value){
    this.value = value
    this.__class__ = $FloatDict
    this.toString = function(){return this.value}
    this.valueOf = function(){return value}
}

// constructor for built-in class 'float'
float = function (value){
    if(value===undefined){return new $FloatClass(0.0)}
    if(typeof value=="number" || (typeof value=="string" && !isNaN(value))){
        var res = new $FloatClass(parseFloat(value))
        return res
    }
    if(isinstance(value,float)) return value
    if (value == 'inf') return new $FloatClass(Infinity);
    if (value == '-inf') return new $FloatClass(-Infinity);
    if (typeof value == 'string' && value.toLowerCase() == 'nan') return new $FloatClass(Number.NaN)
    
    throw ValueError("Could not convert to float(): '"+str(value)+"'")
}
float.__class__ = $factory
float.$dict = $FloatDict
$FloatDict.$factory = float
$FloatDict.__new__ = $__new__(float)