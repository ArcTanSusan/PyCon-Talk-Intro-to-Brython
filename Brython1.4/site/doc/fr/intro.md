L'objectif de Brython est d'utiliser Python comme langage de script pour les navigateurs web, à la place de Javascript

Un exemple simple :
<table>
<tr>
<td>

    <html>
    <head>
    <script src="/brython.js"></script>
    </head>
    <body onload="brython()">
    <script type="text/python">
    from browser import doc,alert
    def echo():
        alert(doc["zone"].value)
    </script>
    <input id="zone"><button onclick="echo()">click !</button>
    </body>
    </html>

</td>
<td>

essayez :<p>
<script type="text/python">
from browser import doc,alert
print(doc)
def echo():
    alert(doc["zone"].value)
</script>

<input id="zone"><button onclick="echo()">clic !</button>
</td>
</tr>
</table>

Pour faire fonctionner les scripts Python, il suffit d'importer le script 
_brython.js_, et d'exécuter la fonction `brython()` quand la page est chargée 
(attribut _onload_ de la balise `<BODY>`. En phase de développement, on peut 
passer un argument à cette fonction : 1 pour avoir les messages d'erreur dans 
la console du navigateur, 2 pour avoir en plus le code Javascript généré

Si le programme Python est volumineux, une autre possibilité est de l'écrire 
dans un fichier séparé, et de le charger dans la page en utilisant l'attribut 
_src_ de la balise `<script>` :

<table><tr><td>

    <html>
    <head>
    <script src="/brython.js"></script>
    </head>
    <body onload="brython()">
    <script type="text/python" src="test.py"></script>
    <input id="zone"><button onclick="echo()">clic !</button>
    </body>
    </html>

</td></tr></table>

Attention, dans ce deuxième cas le script Python est récupéré par un appel 
Ajax : il doit donc se trouver dans le même domaine que la page HTML

Quand on clique sur le bouton, la fonction `echo()` définie dans le script 
Python est exécutée. Cette fonction récupère la valeur de l'élément INPUT 
par son id _zone_, en utilisant la syntaxe `doc["zone"]` : `doc` est un attribut 
du module intégré **browser**, il se comporte comme un dictionnaire indexé par les id des éléments 
DOM. `doc["zone"]` est un objet correspondant à l'élément INPUT ; on accède à la
 valeur par l'attribut _value_

L'affichage est réalisé par la fonction `alert()` définie dans le même module
**browser**, qui affiche une fenêtre avec le texte passé en paramètre
