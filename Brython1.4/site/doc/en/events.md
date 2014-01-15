## Events

The elements in the web page can react to events such as a mouse click, the mouse moving over it or leaving it, a key pressed or released, etc

### Binding and unbinding functions to an event

`element.bind(`_event,callback1[,callback2...]_`)`

> binds one or several function(s) to an _event_

> _event_ is a string describing the handled event : 'click', 'mouseover', 'mousedown', 'keydown', etc

> the _callback_ functions take a single argument, a `DOMEvent` object

`element.unbind(`_event[,callback1[,callback2...]]_`)`

>  removes the binding of the specified functions. If no callback function is specified, removes all bindings to the _event_

### `DOMEvent` objects

Beyond the DOM attributes (the names can vary based on browsers), `DOMEvent` objects have in particular these attributes :

<table border=1>
<tr><th>Type of event</th><th>Attributes</th></tr>
<tr><td>all events</td><td><tt>target</tt> : the DOM node the event was bound to</td></tr>
<tr><td>click or mouse movement</td><td><tt>x, y</tt> : mouse position in relation to the top left corner of the window</td></tr>
<tr><td>drag and drop (HTML5)</td><td><tt>data</tt> : data associated with the movement</td></tr>
</table>

### Example

<table>
<tr>
<td>
    <script type='text/python'>
    from browser import doc
    def mouse_move(ev):
        doc["trace"].value = '%s %s' %(ev.x,ev.y)
    
    doc["zone"].bind('mousemove',mouse_move)
    </script>
    
    <input id="trace" value="">
    <br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
    move the mouse over here</textarea>
</td>
<td>
<script type='text/python'>
def mouse_move(ev):
    doc["trace"].value = '%s %s' %(ev.x,ev.y)

doc["zone"].bind('mousemove',mouse_move)
</script>

<input id="trace" value="">
<br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
move the mouse over here</textarea>
</td>
</tr>
</table>