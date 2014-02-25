module **browser.ajax**
-----------------------

Ce module permet d'exécuter des requêtes Ajax. Il définit une seule fonction :

`ajax()`
> Renvoie un objet ajax

Cet objet possède les attributs et méthodes suivants :

`bind(`_evt,fonction_`)`
> Attache la _fonction_ à l'événement _evt_. _evt_ est une chaine de caractères correspondent aux différents états de la requête :
- "uninitialized" : non initialisé
- "loading" : connexion établie
- "loaded" : requête reçue
- "interactive" : réponse en cours
- "complete" : terminé

> La _fonction_ prend un seul argument, qui est l'objet `ajax`

`open(`_methode,url,async_`)`
> _methode_ est la méthode HTTP utilisée pour la requête (habituellement GET ou POST)

> _url_ est l'url appelée

> _async_ est un booléen qui indique si l'appel est asynchrone (le script qui a effectué la requête continue de s'exécuter sans attendre la réponse à cette requête) ou non (l'exécution du script s'arrête en attendant la réponse)

`readyState`
> un entier représentant l'état d'avancement de la requête, selon le tableau ci-dessous

<blockquote>
<table cellspacing=0 cellpadding=4 border=1>
<tr><th>
readyState
</th><th>
événement
</th></tr>
<tr><td align="center">0</td><td>"uninitialized"</td></tr>
<tr><td align="center">1</td><td>"loading"</td></tr>
<tr><td align="center">2</td><td>"loaded"</td></tr>
<tr><td align="center">3</td><td>"interactive"</td></tr>
<tr><td align="center">4</td><td>"complete"</td></tr>
</table>
</blockquote>

`set_header(`_nom,valeur_`)`
> affecte la valeur _valeur_ à l'entête _nom_

`set_timeout(`_duree,fonction_`)`
> si la requête n'a pas renvoyé de réponse dans les _duree_ secondes, annule la requête et exécute la _fonction_. Cette fonction ne prend pas d'argument

`send()`
> lance la requête

`status`
> un entier représentant le statut HTTP de la requête. Les valeurs les plus courantes sont 200 (ok) et 404 (fichier non trouvé)

`text`
> la réponse du serveur sous forme de chaine de caractères

`xml`
> la réponse du serveur sous forme d'objet DOM



### Exemple

On suppose qu'il y a un DIV avec l'id "result" dans la page HTML

>    from browser import doc, ajax
>
>    def on_complete(req):
>        if req.status==200:
>            doc["result"].html = req.text
>        else:
>            doc["result"].html = "error "+req.text
>
>    req = ajax.ajax()
>    req.bind('complete',on_complete)
>    req.open('POST',url,True)
>    req.set_header('content-type','application/x-www-form-urlencoded')
>    req.send(data)
