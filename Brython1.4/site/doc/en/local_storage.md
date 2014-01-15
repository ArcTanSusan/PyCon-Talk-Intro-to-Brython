module **browser.local_storage**
--------------------------------

This module uses the local storage defined in HTML5 : a way of storing key/value pairs in a file attached to the browser. Keys and values are strings

The module defines an object, `storage`, which is used as a typical Python dictionary

### Example

>    from browser.local_storage import storage
>    storage['foo']='bar'
>    print(storage['foo'])
>    del storage['foo']
>    print(storage['foo']) # raises KeyError
