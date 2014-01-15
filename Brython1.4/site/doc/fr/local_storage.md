module **browser.local_storage**
--------------------------------

Le stockage local défini par HTML5 permet de stocker des données localement, sur le terminal du navigateur, en les indexant par une chaine de caractères

Le module `local_storage` définit un objet `storage` qui est utilisé comme un dictionnaire Python classique

### Exemple

>    from local_storage import storage
>    storage['foo']='bar'
>    print(storage['foo'])
>    del storage['foo']
>    print(storage['foo']) # déclenche KeyError
