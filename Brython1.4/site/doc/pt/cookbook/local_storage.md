Problema
--------

Armazenar objetos localmente, usando Armazenamento Local HTML5


Solução
-------

Brython fornece um módulo integrado `local_storage` que armazena valores associados a chaves, sendo ambos cadeias de caracteres


    from local_storage import storage
    storage['brython_test'] = doc['zone'].value
    
<input id="zone" value="Armazenamento Local">
<button onclick="show_locstor(0)">Armazenar valor</button>

    alert(storage['brython_test'])

<button onclick="show_locstor(1)">Mostrar valor armazenado</button>


<script type="text/python3">
def show_locstor(num):
    src = doc.get(selector="pre.marked")[num].text
    exec(src)
</script>

Se um objeto Python pode ser serializado pelo módulo `json`, você pode armazenar a versão serializadda, e então recuperar o objeto original :

    from local_storage import storage
    import json
    
    a = {'foo':1,1515:'Marignan'}
    
    storage["brython_test"] = json.dumps(a)
    
    b = json.loads(storage['brython_test'])
    alert(b['foo'])
    alert(b['1515'])

<button onclick="show_locstor(2)">Teste</button>

Atenção, `json` converte chaves de dicionários a seus valores em cadeias de caracteres, é por isso que usamos `b['1515']` em vez de `b[1515]`
