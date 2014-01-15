// import modules

$ModuleDict = {
    __class__ : $type,
    __name__ : 'module',
}
$ModuleDict.__repr__ = function(self){return '<module '+self.__name__+'>'}
$ModuleDict.__str__ = function(self){return '<module '+self.__name__+'>'}
$ModuleDict.__mro__ = [$ModuleDict,$ObjectDict]

function $importer(){
    // returns the XMLHTTP object to handle imports
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        var $xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
        var $xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    var fake_qs;
    // lets use $options to figure out how to make requests
    if (__BRYTHON__.$options.cache === undefined ||
        __BRYTHON__.$options.cache == 'none') {
      //generate random number to pass in request to "bust" browser caching
      fake_qs="?v="+Math.random().toString(36).substr(2,8)
    } else if (__BRYTHON__.$options.cache == 'version') {
      fake_qs="?v="+__BRYTHON__.version_info[2]
    } else if (__BRYTHON__.$options.cache == 'browser') {
      fake_qs=""
    } else {  // default is to send random string to bust cache
      fake_qs="?v="+Math.random().toString(36).substr(2,8)
    }

    var timer = setTimeout( function() {
        $xmlhttp.abort()
        throw ImportError("No module named '"+module+"'")}, 5000)
    return [$xmlhttp,fake_qs,timer]
}

function $download_module(module,url){
    var imp = $importer()
    var $xmlhttp = imp[0],fake_qs=imp[1],timer=imp[2],res=null
    $xmlhttp.onreadystatechange = function(){
        if($xmlhttp.readyState==4){
            window.clearTimeout(timer)
            if($xmlhttp.status==200 || $xmlhttp.status==0){res=$xmlhttp.responseText}
            else{
                // don't throw an exception here, it will not be caught (issue #30)
                res = FileNotFoundError("No module named '"+module+"'")
            }
        }
    }
    $xmlhttp.open('GET',url+fake_qs,false)
    if('overrideMimeType' in $xmlhttp){$xmlhttp.overrideMimeType("text/plain")}
    $xmlhttp.send()
    if(res.constructor===Error){throw res} // module not found
    return res
}

function $import_js(module){
   var filepath=__BRYTHON__.brython_path+'libs/' + module.name
   return $import_js_generic(module,filepath)
}

function $import_js_generic(module,filepath) {
   var module_contents=$download_module(module.name, filepath+'.js')
   return $import_js_module(module, filepath+'.js', module_contents)
}

function $import_js_module(module,filepath,module_contents){
    eval(module_contents)
    // check that module name is in namespace
    if(eval('$module')===undefined){
        throw ImportError("name '$module' is not defined in module")
    }
    // add class and __str__
    __BRYTHON__.scope[module.name] = {__dict__:$module}
    $module.__class__ = $ModuleDict
    $module.__name__ = module.name
    $module.__repr__ = function(){return "<module '"+module.name+"' from "+filepath+" >"}
    $module.__str__ = function(){return "<module '"+module.name+"' from "+filepath+" >"}
    $module.__file__ = filepath
    return $module
}

function $import_module_search_path(module,origin){
  // this module is needed by $import_from, so don't remove
  var path_list = __BRYTHON__.path.slice()
  return $import_module_search_path_list(module,__BRYTHON__.path,origin);
}

function $import_module_search_path_list(module,path_list,origin){
    var search = []
    if(origin!==undefined){
        // add path of origin script to list of paths to search
        var origin_path = __BRYTHON__.$py_module_path[origin]
        var elts = origin_path.split('/')
        elts.pop()
        origin_path = elts.join('/')
        if(path_list.indexOf(origin_path)==-1){
            path_list.splice(0,0,origin_path)
        }
    }
    if(module.name.substr(0,2)=='$$'){module.name=module.name.substr(2)}
    mod_path = module.name.replace(/\./g,'/')
    if(!module.package_only){
        search.push(mod_path)
    }
    search.push(mod_path+'/__init__')
    
    var flag = false
    for(var j=0; j < search.length; j++) {
        var modpath = search[j]
        for(var i=0;i<path_list.length;i++){
           var path = path_list[i] + "/" + modpath;
           try {
               mod = $import_py(module,path)
               flag = true
               if(j==search.length-1){mod.$package=true}
           }catch(err){if(err.__name__!=="FileNotFoundError"){throw err}}
           if(flag){break}
        }
        if(flag){break}
    }
    if(!flag){
        throw ImportError("module "+module.name+" not found")
    }
    return mod
}

function $import_py(module,path){
    // import Python modules, in the same folder as the HTML page with
    // the Brython script
    var module_contents=$download_module(module.name, path+'.py')
    return $import_py_module(module,path+'.py',module_contents)
}

function $import_py_module(module,path,module_contents) {
    __BRYTHON__.$py_module_path[module.name]=path //.substr(__BRYTHON__.brython_path.length)

    var root = __BRYTHON__.py2js(module_contents,module.name)
    var body = root.children
    root.children = []
    // use the module pattern : module name returns the results of an anonymous function
    var mod_node = new $Node('expression')
    new $NodeJSCtx(mod_node,'$module=(function()')
    root.insert(0,mod_node)
    mod_node.children = body

    // $globals will be returned when the anonymous function is run
    var ret_node = new $Node('expression')
    new $NodeJSCtx(ret_node,'return $globals')
    mod_node.add(ret_node)
    // add parenthesis for anonymous function execution
    
    var ex_node = new $Node('expression')
    new $NodeJSCtx(ex_node,')()')
    root.add(ex_node)
    
    try{
        var js = root.to_js()
        if (__BRYTHON__.$options.debug == 10) {
            console.log('code for module '+module.name)
           console.log(js);
        }
        eval(js)
        // add names defined in the module as attributes of $module
        for(var attr in __BRYTHON__.scope[module.name].__dict__){
            $module[attr] = __BRYTHON__.scope[module.name].__dict__[attr]
        }
        // add class and __str__
        $module.__class__ = $ModuleDict
        $module.__repr__ = function(){return "<module '"+module.name+"' from "+path+" >"}
        $module.__str__ = function(){return "<module '"+module.name+"' from "+path+" >"}
        $module.toString = function(){return "module "+module.name}
        $module.__file__ = path
        $module.__initializing__ = false
        return $module
    }catch(err){
        console.log(''+err+' '+' for module '+module.name)
        for(var attr in err){
            console.log(attr+' '+err[attr])
        }
        //console.log('js code\n'+js)
        if(__BRYTHON__.debug>0){console.log('line info '+document.$line_info)}
        throw err
    }
}

function $import_single(module,origin){
    var import_funcs = [$import_js, $import_module_search_path]
    if(module.name.search(/\./)>-1){import_funcs = [$import_module_search_path]}
    for(var j=0;j<import_funcs.length;j++){
        try{
            return import_funcs[j](module,origin)
        } catch(err){
            if(err.__name__==="FileNotFoundError"){
                if(j==import_funcs.length-1){
                    // all possible locations failed : throw error
                    // remove module name from __BRYTHON__.imported and .modules
                    __BRYTHON__.imported[module.name] = undefined
                    __BRYTHON__.modules[module.name] = undefined
                    throw err
                }else{
                    continue
                }
            }else{
                __BRYTHON__.imported[module.name] = undefined
                __BRYTHON__.modules[module.name] = undefined
                throw err
            }
        }
    }
}

function $import_list(modules,origin){
    var res = []
    for(var i=0;i<modules.length;i++){
        var mod_name=modules[i]
        if(mod_name.substr(0,2)=='$$'){mod_name=mod_name.substr(2)}
        var mod;
        var stored = __BRYTHON__.imported[mod_name]
        if(stored===undefined){
            // if module is in a package (eg "import X.Y") then we must first import X
            // by searching for the file X/__init__.py, then import X.Y searching either
            // X/Y.py or X/Y/__init__.py
            var mod = {}
            var parts = mod_name.split('.')
            for(var i=0;i<parts.length;i++){
                var module = new Object()
                module.name = parts.slice(0,i+1).join('.')
                if(__BRYTHON__.modules[module.name]===undefined){
                    // this could be a recursive import, so lets set modules={}
                    __BRYTHON__.modules[module.name]={__class__:$ModuleDict}
                    __BRYTHON__.imported[module.name]={__class__:$ModuleDict}
                    // indicate if package only, or package or file
                    if(i<parts.length-1){module.package_only = true}
                    __BRYTHON__.modules[module.name] = $import_single(module,origin)
                    __BRYTHON__.imported[module.name]=__BRYTHON__.modules[module.name]
                }
            }
        }else{
            mod=stored
        }
        res.push(mod)
    }
    return res
}

function $import_from(mod_name,names,origin){
    // used for "from X import A,B,C
    // mod_name is the name of the module
    // names is a list of names
    // origin : name of the module where the import is requested
    // if mod_name matches a module, the names are searched in the module
    // if mod_name matches a package (file mod_name/__init__.py) the names
    // are searched in __init__.py, or as module names in the package
    if(mod_name.substr(0,2)=='$$'){mod_name=mod_name.substr(2)}
    var mod = __BRYTHON__.imported[mod_name]
    if(mod===undefined){$import_list([mod_name]);mod=__BRYTHON__.modules[mod_name]}
    var mod_ns = mod
    for(var i=0;i<names.length;i++){
        if(mod_ns[names[i]]===undefined){
            if(mod.$package){
                var sub_mod = mod_name+'.'+names[i]
                $import_list([sub_mod],origin)
                mod[names[i]] = __BRYTHON__.modules[sub_mod]
            }else{
                throw ImportError("cannot import name "+names[i])
            }
        }
    }
    return mod
}


function $import_list_intra(src,current_url,names){
    // form "from . import A,B" or "from ..X import A,B"
    // "src" is the item after "from" : '.' and '..X' in the examples above
    // "current_url" is the URL of the script where the call was made
    // "names" is the list of names to import
    var mod;
    var elts = current_url.split('/')
    var nbpts = 0 // number of points in src
    while(src.charAt(nbpts)=='.'){nbpts++}
    var pymod_elts = elts.slice(0,elts.length-nbpts)
    var pymod_name = src.substr(nbpts)
    var pymod_path = pymod_elts.join('/')
    if(pymod_name){ // form 'from ..Z import bar' : Z is a module name, 
                    // bar is a name in Z namespace
        //pymod_elts.push(pymod_name)
        var stored = __BRYTHON__.imported[pymod_name]
        if(stored!==undefined){return stored}
        var pymod = {'name':pymod_name}
        mod = $import_module_search_path_list(pymod,[pymod_path])
        if(mod!=undefined){
            __BRYTHON__.modules[pymod_name] = mod
            __BRYTHON__.imported[pymod_name] = mod
            return mod
        }
    }else{ // form 'from . import X' : X is a module name
        var mod = {}
        for(var i=0;i<names.length;i++){
            var stored = __BRYTHON__.imported[names[i]]
            if(stored!==undefined){mod[names[i]]=stored}
            else{
                mod[names[i]]=$import_module_search_path_list({'name':names[i]},[pymod_path])
                __BRYTHON__.modules[names[i]] = mod[names[i]]
                __BRYTHON__.imported[names[i]]=mod[names[i]]
            }
        }
    }
    return mod
}
