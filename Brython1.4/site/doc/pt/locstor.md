Armazenamento local
-------------------

O armazenamento local definido por HTML5 pode ser acessado com o módulo 
`local_storage`. O objeto `storage` definido neste módulo é usado como 
um dicionário Python típico.

### Exemplo

>    from local_storage import storage
>    storage['foo']='bar'
>    log(storage['foo'])
>    del storage['foo']
>    log(storage['foo']) # raises KeyError
