Using Javascript objects
------------------------

We have to handle the transition period when Brython is going to coexist with Javascript ;-)

### Arguments of callback functions

The HTML code can attach callback functions to DOM events and pass them a number of parameters. The callback function will receive them transformed into types managed by Brython :

<table border='1'>
<tr><th>Argument type in function call</th><th>Argument received by the callback function</th></tr>
<tr><td>DOM element</td><td>`DOMNode` instance</td></tr>
<tr><td>DOM event</td><td>`DOMEvent` instance</td></tr>
<tr><td>DOM nodes list</td><td>list of `DOMNode` instances</td></tr>
<tr><td>`null, true, false`</td><td>`None, True, False`</td></tr>
<tr><td>integer</td><td>`int` instance</td></tr>
<tr><td>float</td><td>`float` instance</td></tr>
<tr><td>string</td><td>`str` instance</td></tr>
<tr><td>Javascript array</td><td>`list` instance</td></tr>
<tr><td>Javascript object</td><td>`JSObject` instance</td></tr>
</table>



For instance, if the click event on a button triggers the execution of function foo :

    <button onclick="foo(this,33,{'x':99})">Click</button>

this function will have the signature

    def foo(elt,value,obj):

where _elt_ will be the `DOMNode` instance for the button element, _value_ will be the integer 33 and _obj_ will be an instance of the built-in class `JSObject`

Instances of `JSObject` are used as ordinary Python objects ; here, the value of attribute "x" is `obj.x`. To convert them to Python dictionary, use the built-in function `dict()` : `dict(obj)['x']`

### Objects in Javascript programs

An HTML document can use Javascript scripts or libraries, and Python scripts or libraries. Brython can't use Javascript objects directly : for instance attribute lookup uses the attribute _\_\_class\_\__, which doesn't exist for Javascript objects

To be able to use them in a Python script, they must be explicitely transformed by the function `JSObject()` defined in the built-in module **javascript**

For instance :

    <script type="text/javascript">
    circle = {surface:function(r){return 3.14*r*r}}
    </script>
    
    <script type="text/python">
    from browser import doc
    from javascript import JSObject
    doc['result'].value = JSObject(circle).surface(10)
    </script>

### Using Javascript constructors

If a Javascript function is an object constructor, that can be called in Javascript code with the keyword `new`, it can be used in Brython by transforming it with the function `JSConstructor()` defined in module **javascript**

`JSConstructor(`_constr_`)`

> returns a function that, when called with arguments, returns a Python object matching the Javascript object built by the constructor _constr_

For instance :

    <script type="text/javascript">
    function Rectangle(x0,y0,x1,y1){
        this.x0 = x0
        this.y0 = y0
        this.x1 = x1
        this.y1 = y1
        this.surface = function(){return (x1-x0)*(y1-y0)}
    }
    </script>
    
    <script type="text/python">
    from browser import alert
    from javascript import JSConstructor
    rectangle = JSConstructor(Rectangle)
    alert(rectangle(10,10,30,30).surface())
    </script>

### jQuery example

Here is a more complete example of how you can use the popular library jQuery :

    <html>
    <head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
    </script>
    <script src="../../src/brython.js"></script>
    </head>
    
    <script type="text/python">
      def toggle_color(element):
          _divs=doc.get(tag="div")
          for _div in _divs:
              if _div.style.color != "blue":
                 _div.style.color = "blue"
              else:
                 _div.style.color = "red"
    
      _jQuery=JSObject($("body"))
      _jQuery.click(toggle_color)
    
    </script>
    
    <body onload="brython()">
      <div>Click here</div>
      <div>to iterate through</div>
      <div>these divs.</div>
    <script>
    </script>
     
    </body>
    </html>
    
