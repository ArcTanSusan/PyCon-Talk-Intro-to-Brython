Problema
--------

Almacenar objetos localmente usando 'local storage' disponible en HTML5


Solución
--------

Brython proporciona un módulo llamado `local_storage` que permite almacenar cadenas de valores a sociados a cadenas de claves


    from local_storage import storage
    storage['brython_test'] = doc['zone'].value
    
<input id="zone" value="Local Storage">
<button onclick="show_locstor(0)">Almacenar valor</button>

    alert(storage['brython_test'])

<button onclick="show_locstor(1)">Mostrar valor almacenado</button>


<script type="text/python3">
def show_locstor(num):
    src = doc.get(selector="pre.marked")[num].text
    exec(src)
</script>

Si un objeto Python puede ser serializado mediante el módulo `json`, podríamos almacenar la versión serializada para, más tarde, volver a obtener el objeto original :

    from local_storage import storage
    import json
    
    a = {'foo':1,1515:'Marignan'}
    
    storage["brython_test"] = json.dumps(a)
    
    b = json.loads(storage['brython_test'])
    alert(b['foo'])
    alert(b['1515'])

<button onclick="show_locstor(2)">Pruébalo</button>

Ten cuidado ya que `json` convierte las claves del diccionario a una cadena. Debido a ello es por lo que hemos usado `b['1515']` en lugar de `b[1515]` en el ejemplo anterior
