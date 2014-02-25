Problème
--------

Stocker des objets localement, en utilisant le Local Storage de HTML5


Solution
--------

Brython fournit un module intégré `local_storage` qui stocke des valeurs associées à des clés (clés et valeurs sont des chaines de caractères)

    from browser import alert, doc
    from browser.local_storage import storage
    storage['brython_test'] = doc['zone'].value
    
<input id="zone" value="Local Storage">
<button onclick="show_locstor(0)">Stocker la valeur</button>

    alert(storage['brython_test'])

<button onclick="show_locstor(1)">Montrer la valeur stockée</button>


<script type="text/python3">
from browser import doc
def show_locstor(num):
    src = doc.get(selector="pre.marked")[num].text
    exec(src)
</script>

Si un objet Python peut être sérialisé par le module `json`, on peut stocker la version sérialisée, puis récupérer l'objet original :

    from browser import alert
    from browser.local_storage import storage
    import json
    
    a = {'foo':1,1515:'Marignan'}
    
    storage["brython_test"] = json.dumps(a)
    
    b = json.loads(storage['brython_test'])
    alert(b['foo'])
    alert(b['1515'])

<button onclick="show_locstor(2)">Test it</button>

Bien faire attention que `json` convertit les clés de dictionnaires en chaine de caractères, c'est pour cela qu'on utilise `b['1515']` au lieu de `b[1515]`
