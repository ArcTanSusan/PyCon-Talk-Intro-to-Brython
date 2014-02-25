// cross-browser utility functions
function $getMouseOffset(target, ev){
    ev = ev || window.event;
    var docPos    = $getPosition(target);
    var mousePos  = $mouseCoords(ev);
    return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

function $getPosition(e){
    var left = 0;
    var top  = 0;
    var width = e.offsetWidth;
    var height = e.offsetHeight;

    while (e.offsetParent){
        left += e.offsetLeft;
        top  += e.offsetTop;
        e     = e.offsetParent;
    }

    left += e.offsetLeft;
    top  += e.offsetTop;

    return {left:left, top:top, width:width, height:height};
}

function $mouseCoords(ev){
    var posx = 0;
    var posy = 0;
    if (!ev) var ev = window.event;
    if (ev.pageX || ev.pageY){
        posx = ev.pageX;
        posy = ev.pageY;
    } else if (ev.clientX || ev.clientY){
        posx = ev.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posy = ev.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    var res = object()
    res.x = int(posx)
    res.y = int(posy)
    res.__getattr__ = function(attr){return this[attr]}
    res.__class__ = "MouseCoords"
    return res
}

var $DOMNodeAttrs = ['nodeName','nodeValue','nodeType','parentNode',
    'childNodes','firstChild','lastChild','previousSibling','nextSibling',
    'attributes','ownerDocument']

function $isNode(obj){
    for(var i=0;i<$DOMNodeAttrs.length;i++){
        if(obj[$DOMNodeAttrs[i]]===undefined){return false}
    }
    return true
}

function $isNodeList(nodes) {
    // copied from http://stackoverflow.com/questions/7238177/
    // detect-htmlcollection-nodelist-in-javascript
    try{
        var result = Object.prototype.toString.call(nodes);
        return (typeof nodes === 'object'
            && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(result)
            && nodes.hasOwnProperty('length')
            && (nodes.length == 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
        )
    }catch(err){
        return false
    }
}

var $DOMEventAttrs_W3C = ['NONE','CAPTURING_PHASE','AT_TARGET','BUBBLING_PHASE',
    'type','target','currentTarget','eventPhase','bubbles','cancelable','timeStamp',
    'stopPropagation','preventDefault','initEvent']

var $DOMEventAttrs_IE = ['altKey','altLeft','button','cancelBubble',
    'clientX','clientY','contentOverflow','ctrlKey','ctrlLeft','data',
    'dataFld','dataTransfer','fromElement','keyCode','nextPage',
    'offsetX','offsetY','origin','propertyName','reason','recordset',
    'repeat','screenX','screenY','shiftKey','shiftLeft',
    'source','srcElement','srcFilter','srcUrn','toElement','type',
    'url','wheelDelta','x','y']

function $isEvent(obj){
    flag = true
    for(var i=0;i<$DOMEventAttrs_W3C.length;i++){
        if(obj[$DOMEventAttrs_W3C[i]]===undefined){flag=false;break}
    }
    if(flag){return true}
    for(var i=0;i<$DOMEventAttrs_IE.length;i++){
        if(obj[$DOMEventAttrs_IE[i]]===undefined){return false}
    }
    return true
}

// DOM node types
$NodeTypes = {1:"ELEMENT",
    2:"ATTRIBUTE",
    3:"TEXT",
    4:"CDATA_SECTION",
    5:"ENTITY_REFERENCE",
    6:"ENTITY",
    7:"PROCESSING_INSTRUCTION",
    8:"COMMENT",
    9:"DOCUMENT",
    10:"DOCUMENT_TYPE",
    11:"DOCUMENT_FRAGMENT",
    12:"NOTATION"
}

$DOMEventDict = {__class__:$type,
    __name__:'DOMEvent'
}

$DOMEventDict.__mro__ = [$DOMEventDict,$ObjectDict]

$DOMEventDict.__getattribute__ = function(self,attr){
    if(attr=="x"){return $mouseCoords(self).x}
    if(attr=="y"){return $mouseCoords(self).y}
    if(attr=="data"){
        if(self.dataTransfer!==undefined){return $Clipboard(self.dataTransfer)}
        else{return self['data']}
    }
    if(attr=="target"){
        if(self.target===undefined){return $DOMNode(self.srcElement)}
        else{return $DOMNode(self.target)}
    }
    var res =  self[attr]
    if(res!==undefined){
        if(typeof res=='function'){return function(){return res.apply(self,arguments)}}
        return res
    }else{
        throw AttributeError("object DOMEvent has no attribute '"+attr+"'")
    }
}

function $DOMEvent(ev){
    ev.__class__ = $DOMEventDict
    if(ev.preventDefault===undefined){ev.preventDefault = function(){ev.returnValue=false}}
    if(ev.stopPropagation===undefined){ev.stopPropagation = function(){ev.cancelBubble=true}}
    ev.__repr__ = function(){return '<DOMEvent object>'}
    ev.__str__ = function(){return '<DOMEvent object>'}
    ev.toString = ev.__str__
    return ev
}
$DOMEvent.__class__ = $factory
$DOMEvent.$dict = $DOMEventDict

$ClipboardDict = {
    __class__:$type,
    __name__:'Clipboard'
}

$ClipboardDict.__getitem__ = function(self,name){
    return self.data.getData(name)
}

$ClipboardDict.__mro__ = [$ClipboardDict,$ObjectDict]

$ClipboardDict.__setitem__ = function(self,name,value){
    self.data.setData(name,value)
}

function $Clipboard(data){ // drag and drop dataTransfer
    return {
        data : data,
        __class__ : $ClipboardDict,
    }
}

function $EventsList(elt,evt,arg){
    // handles a list of callback fuctions for the event evt of element elt
    // method .remove(callback) removes the callback from the list, and 
    // removes the event listener
    this.elt = elt
    this.evt = evt
    if(isintance(arg,list)){this.callbacks = arg}
    else{this.callbacks = [arg]}
    this.remove = function(callback){
        var found = false
        for(var i=0;i<this.callbacks.length;i++){
            if(this.callbacks[i]===callback){
                found = true
                this.callback.splice(i,1)
                this.elt.removeEventListener(this.evt,callback,false)
                break
            }
        }
        if(!found){throw KeyError("not found")}
    }
}

function $OpenFile(file,mode,encoding){
    this.reader = new FileReader()
    if(mode==='r'){this.reader.readAsText(file,encoding)}
    else if(mode==='rb'){this.reader.readAsBinaryString(file)}
    
    this.file = file
    this.__class__ = dom.FileReader
    this.__getattr__ = function(attr){
        if(this['get_'+attr]!==undefined){return this['get_'+attr]}
        return this.reader[attr]
    }
    this.__setattr__ = (function(obj){
        return function(attr,value){
            if(attr.substr(0,2)=='on'){ // event
                // value is a function taking an event as argument
                if(window.addEventListener){
                    var callback = function(ev){return value($DOMEvent(ev))}
                    obj.addEventListener(attr.substr(2),callback)
                }else if(window.attachEvent){
                    var callback = function(ev){return value($DOMEvent(window.event))}
                    obj.attachEvent(attr,callback)
                }
            }else if('set_'+attr in obj){return obj['set_'+attr](value)}
            else if(attr in obj){obj[attr]=value}
            else{setattr(obj,attr,value)}
        }
    })(this.reader)
}


dom = { File : function(){},
    FileReader : function(){}
    }
dom.File.__class__ = $type
dom.File.__str__ = function(){return "<class 'File'>"}
dom.FileReader.__class__ = $type
dom.FileReader.__str__ = function(){return "<class 'FileReader'>"}

function $Options(parent){
    return {
        __class__:$OptionsDict,
        parent:parent
    }
}
$OptionsDict = {
    __class__:$type,
    __name__:'Options'
}

$OptionsDict.__delitem__ = function(self,arg){
    self.parent.options.remove(arg.elt)
}

$OptionsDict.__getitem__ = function(self,key){
    return $DOMNode(self.parent.options[key])
}
    
$OptionsDict.__len__ = function(self) {return self.parent.options.length}

$OptionsDict.__mro__ = [$OptionsDict,$ObjectDict]

$OptionsDict.__setattr__ = function(self,attr,value){
    self.parent.options[attr]=value
}

$OptionsDict.__setitem__ = function(self,attr,value){
    self.parent.options[attr]= $JS2Py(value)
}

$OptionsDict.__str__ = function(self){
    return "<object Options wraps "+self.parent.options+">"
}

$OptionsDict.append = function(self,element){
    self.parent.options.add(element.elt)
}

$OptionsDict.insert = function(self,index,element){
    if(index===undefined){self.parent.options.add(element.elt)}
    else{self.parent.options.add(element.elt,index)}
}

$OptionsDict.item = function(self,index){
    return self.parent.options.item(index)
}
    
$OptionsDict.namedItem = function(self,name){
    return self.parent.options.namedItem(name)
}
    
$OptionsDict.remove = function(self,arg){self.parent.options.remove(arg.elt)}
    
//$OptionsDict.toString = $OptionsDict.__str__
    
function $Location(){ // used because of Firefox bug #814622
    var obj = new object()
    for(var x in window.location){
        if(typeof window.location[x]==='function'){
            obj[x] = (function(f){
                return function(){
                    return f.apply(window.location,arguments)
                }
              })(window.location[x])
        }else{
            obj[x]=window.location[x]
        }
    }
    if(obj['replace']===undefined){ // IE
        obj['replace'] = function(url){window.location = url}
    }
    obj.__class__ = new $class(this,'Location')
    obj.toString = function(){return window.location.toString()}
    obj.__repr__ = obj.__str__ = obj.toString
    return obj
}

win =  new $JSObject(window)

$StyleDict = {__class__:$type,__name__:'CSSProperty'}

$StyleDict.__mro__ = [$StyleDict,$ObjectDict]

$StyleDict.__getattr__ = function(self,attr){
    return $ObjectDict.__getattribute__(self.js,attr)
}

$StyleDict.__setattr__ = function(self,attr,value){
    if(attr.toLowerCase()==='float'){
        self.js.cssFloat = value
        self.js.styleFloat = value
    }else{
        if(['top','left','height','width','borderWidth'].indexOf(attr)>-1
            && isinstance(value,int)){value = value+'px'}
        self.js[attr] = value
    }
}

function $Style(style){
    // property "style"
    return {__class__:$StyleDict,js:style}
}
$Style.__class__ = $factory
$Style.$dict = $StyleDict
$StyleDict.$factory = $Style

function DOMNode(){} // define a Node object
DOMNode.__class__ = $type
DOMNode.__mro__ = [DOMNode,object]
DOMNode.__name__ = 'DOMNode'
DOMNode.$dict = DOMNode // for isinstance
DOMNode.$factory = DOMNode

function $DOMNode(elt){ 
    // returns the element, enriched with an attribute $brython_id for 
    // equality testing and with all the attributes of Node
    var res = {}
    res.$dict = {} // used in getattr
    res.elt = elt // DOM element
    if(elt['$brython_id']===undefined||elt.nodeType===9){
        // add a unique id for comparisons
        elt.$brython_id=Math.random().toString(36).substr(2, 8)
        // add attributes of Node to element
        res.__repr__ = res.__str__ = res.toString = function(){
            var res = "<DOMNode object type '"
            return res+$NodeTypes[elt.nodeType]+"' name '"+elt.nodeName+"'>"
        }
    }
    res.__class__ = DOMNode
    return res
}

DOMNode.__add__ = function(self,other){
    // adding another element to self returns an instance of $TagSum
    var res = $TagSum()
    res.children = [self]
    if(isinstance(other,$TagSum)){
        for(var $i=0;$i<other.children.length;$i++){res.children.push(other.children[$i])}
    } else if(isinstance(other,[str,int,float,list,dict,set,tuple])){
        res.children.push($DOMNode(document.createTextNode(str(other))))
    }else{res.children.push(other)}
    return res
}

DOMNode.__bool__ = function(self){return true}

DOMNode.__class__ = $type

DOMNode.__contains__ = function(self,key){
    try{self.__getitem__(key);return True}
    catch(err){return False}
}

DOMNode.__del__ = function(self){
    // if element has a parent, calling __del__ removes object
    // from the parent's children
    if(!self.elt.parentNode){
        throw ValueError("can't delete "+str(elt))
    }
    self.elt.parentNode.removeChild(self.elt)
}

DOMNode.__delitem__ = function(self,key){
    if(self.elt.nodeType===9){ // document : remove by id
        var res = self.elt.getElementById(key)
        if(res){res.parentNode.removeChild(res)}
        else{throw KeyError(key)}
    }else{ // other node : remove by rank in child nodes
        self.elt.removeChild(self.elt.childNodes[key])
    }
}

DOMNode.__eq__ = function(self,other){
    return self.elt==other.elt
}

DOMNode.__getattribute__ = function(self,attr){
    if(['children','html','left','parent','query','text',
        'top','value','height','width'].indexOf(attr)>-1){
        return DOMNode[attr](self)
    }
    if(attr=='remove'){
        return function(){DOMNode[attr](self,arguments[0])}
    }
    if(attr=='$$location'){attr='location'}
    if(self.elt.getAttribute!==undefined){
        res = self.elt.getAttribute(attr)
        // IE returns the properties of a DOMNode (eg parentElement)
        // as "attribute", so we must check that this[attr] is not
        // defined
        if(res!==undefined&&res!==null&&self.elt[attr]===undefined){
            // now we're sure it's an attribute
            return res
        }
    }
    if(self.elt[attr]!==undefined){
        res = self.elt[attr]
        if(typeof res==="function"){
            var func = (function(f,elt){
                return function(){
                    var args = []
                    for(var i=0;i<arguments.length;i++){
                        if(isinstance(arguments[i],JSObject)){
                            args.push(arguments[i].js)
                        }else if(isinstance(arguments[i],DOMNode)){
                            args.push(arguments[i].elt)
                        }else if(arguments[i]===None){
                            args.push(null)
                        }else{
                            args.push(arguments[i])
                        }
                    }
                    return $JS2Py(f.apply(elt,args))
                }
            })(res,self.elt)
            func.__name__ = attr
            return func
        }else if(attr=='options'){
            return $Options(self.elt)
        }else if(attr=='style'){
            return $Style(self.elt[attr])
        }else{
            return $JS2Py(self.elt[attr])
        }
    }
    if(self.elt[attr]!==undefined){return self.elt[attr]}
    return $ObjectDict.__getattribute__(self,attr)
}

DOMNode.__getitem__ = function(self,key){
    if(self.elt.nodeType===9){ // Document
        if(typeof key==="string"){
            var res = self.elt.getElementById(key)
            if(res){return $DOMNode(res)}
            else{throw KeyError(key)}
        }else{
            try{
                var elts=self.elt.getElementsByTagName(key.name),res=[]
                for(var $i=0;$i<elts.length;$i++){res.push($DOMNode(elts[$i]))}
                return res
            }catch(err){
                throw KeyError(str(key))
            }
        }    
    }else{
        return $DOMNode(self.elt.childNodes[key])
    }
}

DOMNode.__in__ = function(self,other){return other.__contains__(self)}

DOMNode.__iter__ = function(self){ // for iteration
    self.$counter = -1
    return self
}

DOMNode.__le__ = function(self,other){
    // for document, append child to document.body
    var elt = self.elt
    if(self.elt.nodeType===9){elt = self.elt.body} 
    if(isinstance(other,$TagSum)){
        var $i=0
        for($i=0;$i<other.children.length;$i++){
            elt.appendChild(other.children[$i].elt)
        }
    }else if(typeof other==="string" || typeof other==="number"){
        var $txt = document.createTextNode(other.toString())
        elt.appendChild($txt)
    }else{ // other is a DOMNode instance
        elt.appendChild(other.elt)
    }
}

DOMNode.__len__ = function(self){return self.elt.childNodes.length}

DOMNode.__mul__ = function(self,other){
    if(isinstance(other,int) && other.valueOf()>0){
        var res = $TagSum()
        for(var i=0;i<other.valueOf();i++){
            var clone = DOMNode.clone(self)()
            res.children.push(clone)
        }
        return res
    }else{
        throw ValueError("can't multiply "+self.__class__+"by "+other)
    }
}

DOMNode.__ne__ = function(self,other){return !DOMNode.__eq__(self,other)}

DOMNode.__next__ = function(self){
   self.$counter++
   if(self.$counter<self.elt.childNodes.length){
       return $DOMNode(self.elt.childNodes[self.$counter])
   }
   throw StopIteration('StopIteration')
}

DOMNode.__not_in__ = function(self,other){return !getattr(other,"__contains__")(self)}

DOMNode.__radd__ = function(self,other){ // add to a string
    var res = $TagSum()
    var txt = $DOMNode(document.createTextNode(other))
    res.children = [txt,self]
    return res
}

DOMNode.__repr__ = function(self){
    if(self===undefined){return "<class 'DOMNode'>"}
    else{
        var res = "<DOMNode object type '"
        return res+$NodeTypes[self.elt.nodeType]+"' name '"+self.elt.nodeName+"'>"
    }
}

DOMNode.__setattr__ = function(self,attr,value){
    if(attr.substr(0,2)=='on'){ // event
        if (!bool(value)) { // remove all callbacks attached to event
            DOMNode.unbind(self,attr.substr(2))
        }else{
            // value is a function taking an event as argument
            DOMNode.bind(self,attr.substr(2),value)
        }
    }else{
        var attr1 = attr.replace('_','-').toLowerCase()
        if(DOMNode['set_'+attr1]!==undefined){
            return DOMNode['set_'+attr1](self,value)
        }
        if(self.elt[attr1]!==undefined){self.elt[attr1]=value;return}
        var res = self.elt.getAttribute(attr1)
        if(res!==undefined&&res!==null){self.elt.setAttribute(attr1,value)}
        else{
            self.elt[attr]=value
        }
    }
}

DOMNode.__setitem__ = function(self,key,value){
    self.elt.childNodes[key]=value
}

DOMNode.__str__ = DOMNode.__repr__

DOMNode.bind = function(self,event){
    // bind functions to the event (event = "click", "mouseover" etc.)
    var _id
    if(self.elt.nodeType===9){_id=0}
    else{_id = self.elt.$brython_id}
    var ix = __BRYTHON__.events.$keys.indexOf(_id)
    if(ix===-1){
        __BRYTHON__.events.$keys.push(_id)
        __BRYTHON__.events.$values.push(dict())
        ix = __BRYTHON__.events.$keys.length-1
    }
    var ix_event = __BRYTHON__.events.$values[ix].$keys.indexOf(event)
    if(ix_event==-1){
        __BRYTHON__.events.$values[ix].$keys.push(event)
        __BRYTHON__.events.$values[ix].$values.push([])
        ix_event = __BRYTHON__.events.$values[ix].$values.length-1
    }
    for(var i=2;i<arguments.length;i++){
        var func = arguments[i]
        var callback = (function(f){
            return function(ev){return f($DOMEvent(ev))}}
        )(func)
        if(window.addEventListener){
            self.elt.addEventListener(event,callback,false)
        }else if(window.attachEvent){
            self.elt.attachEvent("on"+event,callback)
        }
        
        __BRYTHON__.events.$values[ix].$values[ix_event].push([func,callback])
    }
}

DOMNode.children = function(self){
    var res = []
    for(var i=0;i<self.elt.childNodes.length;i++){
        res.push($DOMNode(self.elt.childNodes[i]))
    }
    return res
}

DOMNode.class = function(self){
    if(self.elt.className !== undefined){return self.elt.className}
    else{return None}
}

DOMNode.clone = function(self){
    res = $DOMNode(self.elt.cloneNode(true))
    res.elt.$brython_id=Math.random().toString(36).substr(2, 8)

    // bind events on clone to the same callbacks as self
    var ix_elt = __BRYTHON__.events.$keys.indexOf(self.elt.$brython_id)
    if(ix_elt!=-1){
        var events = __BRYTHON__.events.$values[ix_elt]
        for(var i=0;i<events.$keys.length;i++){
            var event = events.$keys[i]
            for(var j=0;j<events.$values[i].length;j++){
                DOMNode.bind(res,event,events.$values[i][j][0])
            }
        }
    }
    return res
}

DOMNode.focus = function(self){
    return (function(obj){
        return function(){
            // focus() is not supported in IE
            setTimeout(function() { obj.focus(); }, 10)
        }
    })(self.elt)
}

DOMNode.get = function(self){
    // for document : doc.get(key1=value1[,key2=value2...]) returns a list of the elements
    // with specified keys/values
    // key can be 'id','name' or 'selector'
    var obj = self.elt
    var args = []
    for(var i=1;i<arguments.length;i++){args.push(arguments[i])}
    var $ns=$MakeArgs('get',args,[],{},null,'kw')
    var $dict = {}
    for(var i=0;i<$ns['kw'].$keys.length;i++){
        $dict[$ns['kw'].$keys[i]]=$ns['kw'].$values[i]
    }
    if($dict['name']!==undefined){
        if(obj.getElementsByName===undefined){
            throw TypeError("DOMNode object doesn't support selection by name")
        }
        var res = []
        var node_list = document.getElementsByName($dict['name'])
        if(node_list.length===0){return []}
        for(var i=0;i<node_list.length;i++){
            res.push($DOMNode(node_list[i]))
        }
    }
    if($dict['tag']!==undefined){
        if(obj.getElementsByTagName===undefined){
            throw TypeError("DOMNode object doesn't support selection by tag name")
        }
        var res = []
        var node_list = document.getElementsByTagName($dict['tag'])
        if(node_list.length===0){return []}
        for(var i=0;i<node_list.length;i++){
            res.push($DOMNode(node_list[i]))
        }
    }
    if($dict['classname']!==undefined){
        if(obj.getElementsByClassName===undefined){
            throw TypeError("DOMNode object doesn't support selection by class name")
        }
        var res = []
        var node_list = document.getElementsByClassName($dict['classname'])
        if(node_list.length===0){return []}
        for(var i=0;i<node_list.length;i++){
            res.push($DOMNode(node_list[i]))
        }
    }
    if($dict['id']!==undefined){
        if(obj.getElementById===undefined){
            throw TypeError("DOMNode object doesn't support selection by id")
        }
        var id_res = obj.getElementById($dict['id'])
        if(!id_res){return []}
        else{return [$DOMNode(id_res)]}
    }
    if($dict['selector']!==undefined){
        if(obj.querySelectorAll===undefined){
            throw TypeError("DOMNode object doesn't support selection by selector")
        }
        var node_list = obj.querySelectorAll($dict['selector'])
        var sel_res = []
        if(node_list.length===0){return []}
        for(var i=0;i<node_list.length;i++){
            sel_res.push($DOMNode(node_list[i]))
        }
        if(res===undefined){return sel_res}
        var to_delete = []
        for(var i=0;i<res.length;i++){
            var elt = res[i] // keep it only if it is also inside sel_res
            flag = false
            for(var j=0;j<sel_res.length;j++){
                if(elt.__eq__(sel_res[j])){flag=true;break}
            }
            if(!flag){to_delete.push(i)}
        }
        for(var i=to_delete.length-1;i>=0;i--){
            res.splice(to_delete[i],1)
        }
        return res
    }
    return res
}

DOMNode.getContext = function(self){ // for CANVAS tag
    if(!('getContext' in self.elt)){throw AttributeError(
        "object has no attribute 'getContext'")}
    var obj = self.elt
    return function(ctx){return new $JSObject(obj.getContext(ctx))}
}

DOMNode.getSelectionRange = function(self){ // for TEXTAREA
    if(self.elt['getSelectionRange']!==undefined){
        return self.elt.getSelectionRange.apply(null,arguments)
    }
}

DOMNode.height = function(self){
    return int($getPosition(self.elt)["height"])
}

DOMNode.left = function(self){
    return int($getPosition(self.elt)["left"])
}

DOMNode.id = function(self){
    if(self.elt.id !== undefined){return self.elt.id}
    else{return None}
}

DOMNode.options = function(self){ // for SELECT tag
    return new $OptionsClass(self.elt)
}

DOMNode.children = function(self){
    var res = []
    for(var i=0;i<self.elt.childNodes.length;i++){
        res.push($DOMNode(self.elt.childNodes[i]))
    }
    return res
}

DOMNode.parent = function(self){
    if(self.elt.parentElement){return $DOMNode(self.elt.parentElement)}
    else{return None}
}

DOMNode.remove = function(self,child){
    // Remove child from self
    // If child is not inside self, throw ValueError
    var elt=self.elt,flag=false,ch_elt=child.elt
    if(self.elt.nodeType==9){elt=self.elt.body}
    
    while(ch_elt.parentElement){
        if(ch_elt.parentElement===elt){
            elt.removeChild(ch_elt)
            flag = true
            break
        }else{ch_elt = ch_elt.parentElement}
    }
    if(!flag){throw ValueError('element '+child+' is not inside '+self)}
}

DOMNode.top = function(self){
    return int($getPosition(self.elt)["top"])
}

DOMNode.reset = function(self){ // for FORM
    return function(){self.elt.reset()}
}

DOMNode.style = function(self){
    // set attribute "float" for cross-browser compatibility
    self.elt.style.float = self.elt.style.cssFloat || self.style.styleFloat
    console.log('get style')
    return new $JSObject(self.elt.style)
}

DOMNode.setSelectionRange = function(self){ // for TEXTAREA
    if(this['setSelectionRange']!==undefined){
        return (function(obj){
            return function(){
                return obj.setSelectionRange.apply(obj,arguments)
            }})(this)
    }else if (this['createTextRange']!==undefined) {
        return (function(obj){
            return function(start_pos,end_pos){
                if(end_pos==undefined){end_pos=start_pos}
        var range = obj.createTextRange();
        range.collapse(true);
        range.moveEnd('character', start_pos);
        range.moveStart('character', end_pos);
        range.select();
            }
    })(this)
    }
}
    
DOMNode.submit = function(self){ // for FORM
    return function(){self.elt.submit()}
}

DOMNode.text = function(self){
    return self.elt.innerText || self.elt.textContent
}
    
DOMNode.html = function(self){return self.elt.innerHTML}

DOMNode.value = function(self){return self.elt.value}

DOMNode.width = function(self){
    return int($getPosition(self.elt)["width"])
}

DOMNode.set_class = function(self,arg){self.elt.setAttribute('class',arg)}

DOMNode.set_html = function(self,value){
    self.elt.innerHTML=str(value)
}

DOMNode.set_style = function(self,style){ // style is a dict
    for(var i=0;i<style.$keys.length;i++){
        var key = style.$keys[i],value=style.$values[i]
        if(key.toLowerCase()==='float'){
            self.elt.style.cssFloat = value
            self.elt.style.styleFloat = value
        }else{
            if(['top','left','height','width','borderWidth'].indexOf(key)>-1
                && isinstance(value,int)){value = value+'px'}
            self.elt.style[key] = value
        }
    }
}

DOMNode.set_text = function(self,value){
    self.elt.innerText=str(value)
    self.elt.textContent=str(value)
}

DOMNode.set_value = function(self,value){self.elt.value = str(value)}

DOMNode.toString = function(self){
    if(self===undefined){return 'DOMNode'}
    return self.elt.nodeName
}

DOMNode.unbind = function(self,event){
    // unbind functions from the event (event = "click", "mouseover" etc.)
    // if no function is specified, remove all callback functions
    var _id
    if(self.elt.nodeType==9){_id=0}else{_id=self.elt.$brython_id}
    var ix_elt = __BRYTHON__.events.$keys.indexOf(_id)
    if(ix_elt==-1){
        throw KeyError('missing callback for event '+event)
    }
    var ix_event = __BRYTHON__.events.$values[ix_elt].$keys.indexOf(event)
    if(ix_event==-1){throw KeyError('missing callback for event '+event)}
    var events = __BRYTHON__.events.$values[ix_elt].$values[ix_event]
    if(arguments.length===2){
        for(var i=0;i<events.length;i++){
            var callback = events[i][1]
            if(window.removeEventListener){
                self.elt.removeEventListener(event,callback,false)
            }else if(window.detachEvent){
                self.elt.detachEvent(event,callback,false)
            }
        }
        __BRYTHON__.events.$values[ix_elt][ix_event] = []
        return
    }
    for(var i=1;i<arguments.length;i++){
        var func = arguments[i], flag = false
        for(var j=0;j<events.length;j++){
            if(func===events[j][0]){
                var callback = events[event][j][1]
                if(window.removeEventListener){
                    self.elt.removeEventListener(event,callback,false)
                }else if(window.detachEvent){
                    self.elt.detachEvent(event,callback,false)
                }
                event.splice(j,1)
                flag = true
                break
            }
            if(!flag){throw KeyError('missing callback for event '+event)}
            __BRYTHON__.events.$values[ix_elt][ix_event] = events
        }
    }
}

_doc = $DOMNode(document)

_doc.$dict.headers = function(){
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var headers = req.getAllResponseHeaders();
    headers = headers.split('\r\n')
    var res = dict()
    for(var i=0;i<headers.length;i++){
        var header = headers[i]
        if(header.strip().length==0){continue}
        var pos = header.search(':')
        res.__setitem__(header.substr(0,pos),header.substr(pos+1).lstrip())
    }
    return res;
}

// return query string as an object with methods to access keys and values
// same interface as cgi.FieldStorage, with getvalue / getlist / getfirst
$QueryDict = {__class__:$type,__name__:'query'}

$QueryDict.__contains__ = function(self,key){
    return self._keys.indexOf(key)>-1
}

$QueryDict.__getitem__ = function(self,key){
    // returns a single value or a list of values 
    // associated with key, or raise KeyError
    var result = self._values[key]
    if(result===undefined){throw KeyError(key)}
    else if(result.length==1){return result[0]}
    return result
}

$QueryDict_iterator = $iterator_class('query string iterator')
$QueryDict.__iter__ = function(self){
    return $iterator(self._keys,$QueryDict_iterator)
}

$QueryDict.__mro__ = [$QueryDict,$ObjectDict]

$QueryDict.getfirst = function(self,key,_default){
    // returns the first value associated with key
    var result = self._values[key]
    if(result===undefined){
        if(_default===undefined){return None}
        return _default
    }
    return result[0]
}

$QueryDict.getlist = function(self,key){
    // always return a list
    var result = self._values[key]
    if(result===undefined){return []}
    return result
}

$QueryDict.getvalue = function(self,key,_default){
    try{return self.__getitem__(key)}
    catch(err){
        $pop_exc()
        if(_default===undefined){return None}
        else{return _default}
    }
}

$QueryDict.keys = function(self){return self._keys}

DOMNode.query = function(self){

    var res = {__class__:$QueryDict,
        _keys : [],
        _values : {}
    }
    var qs = location.search.substr(1).split('&')
    for(var i=0;i<qs.length;i++){
        var pos = qs[i].search('=')
        var elts = [qs[i].substr(0,pos),qs[i].substr(pos+1)]
        var key = decodeURIComponent(elts[0])
        var value = decodeURIComponent(elts[1])
        if(res._keys.indexOf(key)>-1){res._values[key].push(value)}
        else{
            res._keys.push(key)
            res._values[key] = [value]
        }
    }

    return res
}

// class used for tag sums
$TagSumDict = {
    __class__ : $type,
    __name__:'TagSum'
}

$TagSumDict.appendChild = function(self,child){    
    self.children.push(child)
}

$TagSumDict.__add__ = function(self,other){
    if(other.__class__===$TagSumDict){
        self.children = self.children.concat(other.children)
    }else if(isinstance(other,[str,int,float,dict,set,list])){
        self.children = self.children.concat($DOMNode(document.createTextNode(other)))
    }else{self.children.push(other)}
    return self
}

$TagSumDict.__mro__ = [$TagSumDict,$ObjectDict]

$TagSumDict.__radd__ = function(self,other){
    var res = $TagSum()
    res.children = self.children.concat($DOMNode(document.createTextNode(other)))
    return res
}

$TagSumDict.__repr__ = function(self){
    var res = '<object TagSum> '
    for(var i=0;i<self.children.length;i++){
        res+=self.children[i]
        if(self.children[i].toString()=='[object Text]'){res += ' ['+self.children[i].textContent+']\n'}
    }
    return res
}

$TagSumDict.__str__ = $TagSumDict.toString = $TagSumDict.__repr__

$TagSumDict.clone = function(self){
    var res = $TagSum(), $i=0
    for($i=0;$i<self.children.length;$i++){
        res.children.push(self.children[$i].cloneNode(true))
    }
    return res
}

function $TagSum(){
    return {__class__:$TagSumDict,
        children:[],
        toString:function(){return '(TagSum)'}
    }
}
$TagSum.__class__=$factory
$TagSum.$dict = $TagSumDict

//creation of jquery like helper functions..

var $toDOM = function (content) {
   if (isinstance(content,DOMNode)) {return content}

   if (isinstance(content,str)) {
      var _dom = document.createElement('html')
      _dom.innerHTML = content
      return _dom
   }

   // if we got this far there is a problem..
   $raise('Error', 'Invalid argument' + content)
}

DOMNode.prototype.addClass = function(classname){
   var _c = this.__getattr__('class')
   if (_c === undefined) {
      this.__setattr__('class', classname)
   } else {
      this.__setattr__('class', _c + " " + classname)
   }
   return this
}

DOMNode.prototype.after = function(content){
   var _content=$toDOM(content);

   if (this.nextSibling !== null) {
     this.parentElement.insertBefore(_content, this.nextSibling);
   } else {
     this.parentElement.appendChild(_content)
   }

   return this
}

DOMNode.prototype.append = function(content){
   var _content=$toDOM(content);
   this.appendChild(_content);
   return this
}

DOMNode.prototype.before = function(content){
   var _content=$toDOM(content);
   this.parentElement.insertBefore(_content, this);
   return this
}

// closest will return the first ancestor that it comes across
// while traversing up the tree.
// note that selector parameter in regular jquery will be implemented
// at a higher level (ie, python class).

//a python class will implement very high level 
// selector functions, which will allow maximum flexibility
// we can also emulate jquery style selectors with the
// python class. :)

DOMNode.prototype.closest = function(selector){
   var traverse=function(node, ancestors) {
       if (node === _doc) return None
       for(var i=0; i<ancestors.length; i++) {
          if (node === ancestors[i]) { 
             return ancestors[i];
          }
       } 

       return traverse(this.parentElement, ancestors);
   }

   if (isinstance(selector, str)) {
      var _elements=_doc.get(selector=selector)
      return traverse(this, _elements); 
   } 

   return traverse(this, selector);
}

DOMNode.prototype.css = function(property,value){
   if (value !== undefined) {
      this.set_style({property:value})
      return this   
   }

   if (isinstance(property, dict)) {
      // we also set styles here..
      this.set_style(property)
      return this
   }

   //this is a get request
   if (this.style[property] === undefined) { return None}
   return this.style[property]
}

DOMNode.prototype.empty = function(){
   for (var i=0; i <= this.childNodes.length; i++) {
       this.removeChild(this.childNodes[i])
   }
}

DOMNode.prototype.hasClass = function(name){
   var _c = this.__getattr__('class')
   if (_c === undefined) return False
   if (_c.indexOf(name) > -1) return True

   return False
}

DOMNode.prototype.prepend = function(content){
   var _content=$toDOM(content);
   this.insertBefore(_content, this.firstChild);
}

DOMNode.prototype.removeAttr = function(name){
   this.__setattr__(name, undefined)
}

DOMNode.prototype.removeClass = function(name){
   var _c = this.__getattr__('class')
   if (_c === undefined) return

   if (_c === name) {
      this.__setattr__('class', undefined)
      return
   }

   _index=_c.indexOf(name)
   if (_index == -1) return

   var _class_string=_c
   if (_index==0) {  // class is first in list
        _class_string=_c.substring(name.length)
   } else if (_index == _c.length - name.length) {  // at end of string
        _class_string=_c.substring(0, _index)
   } else { // must be somewhere in the middle
        _class_string=_c.replace(' '+name+' ', '')
   }
   this.__setattr('class', _class_string)
}

win.get_postMessage = function(msg,targetOrigin){
    if(isinstance(msg,dict)){
        var temp = new Object()
        temp.__class__='dict'
        for(var i=0;i<msg.__len__();i++){temp[msg.$keys[i]]=msg.$values[i]}
        msg = temp
    }
    return window.postMessage(msg,targetOrigin)
}
