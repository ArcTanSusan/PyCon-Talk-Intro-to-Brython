The package **browser** groups the built-in Brython-specific names and modules

**browser**.`doc`
> an object that represents the HTML document currently displayed in the browser window. The interface of this object is described in section "Browser interface"

**browser**.`win`
> an object that represents the browser window

**browser**.`alert(`_message_`)`
> a function that prints the _message_ in a pop-up window. Returns `None`

**browser**.`confirm(`_message_`)`
> a function that print the _message_ in a window, and two buttons (ok/cancel). Returns `True` if ok, `False` if cancel

**browser**.`prompt(`_message[,defaut]_`)`
> a function that prints the _message_ in a window, and an entry field. Returns the entered value ; if no value was entered, return _defaut_ if defined, else the empty string
