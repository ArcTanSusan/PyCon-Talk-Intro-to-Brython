Almacenamiento local (Local storage)
------------------------------------

El almacenamiento local definido por HTML5 puede ser usado con el m&oacute;dulo `local_storage`. El objeto `storage` definido en este m&oacute;dulo se usa como un diccionario Python

### Ejemplo

>    from local_storage import storage
>    storage['foo']='bar'
>    log(storage['foo'])
>    del storage['foo']
>    log(storage['foo']) # raises KeyError