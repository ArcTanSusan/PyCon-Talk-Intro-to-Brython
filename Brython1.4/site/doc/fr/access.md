Accéder aux éléments de la page
-------------------------------

Pour accéder à un élément, on peut utiliser plusieurs méthodes. La plus courante est de se servir de son identifiant, c'est-à-dire de son attribut _id_ : si on a une zone de saisie définie par

>    <input id="data">

on peut obtenir une référence à ce champ par 

>    from browser import doc
>    data = doc["data"]

L'objet `doc` du module **browser** référence le document HTML. Il se comporte comme un dictionnaire dont les clés sont les identifiants des éléments de la page. Si aucun élément ne possède l'identifiant spécifié, le programme déclenche une exception `KeyError`

On peut aussi récupérer tous les éléments d'un certain type, par exemple tous les liens hypertexte (balise HTML `A`), en  utilisant la syntaxe

>    import html
>    links = doc[html.A]

Enfin, tous les éléments de la page possèdent une méthode `get()` qui permet de rechercher des éléments de plusieurs façons :
 - `elt.get(name=N)` retourne une liste avec tous les éléments descendant de `elt` dont l'attribut `name` est égal à `N`
 - `elt.get(selector=S)` retourne une liste avec tous les élements descendant de `elt` dont le sélecteur CSS correspond à `S`

