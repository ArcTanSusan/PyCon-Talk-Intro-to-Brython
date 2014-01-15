Evénements
----------

Les éléments d'une page peuvent réagir à des événements, par exemple le déplacement de la souris au-dessus de l'élément, une frappe au clavier dans un champ de saisie, l'appui sur un bouton, etc. On peut en trouver une liste complète sur Internet ; en voici quelques exemples :

<table cellpadding=3 border=1>
<tr><td>*mouseover*</td><td>la souris arrive au-dessus de l'élément</td></tr>
<tr><td>*mousemove*</td><td>la souris se déplace sur l'élément</td></tr>
<tr><td>*click*</td><td>clic de souris</td></tr>
<tr><td>*keypress*</td><td>appui sur une touche du clavier</td></tr>
</table>

Pour attacher une fonction à un événement qui survient sur un élément, on utilise la syntaxe 

<code>element.bind(_event,callback_)</code>

La fonction *callback()* doit prendre un seul argument, qui est une instance de la classe `DOMEvent`. En plus des attributs DOM (qui peuvent avoir des noms différents selon les navigateurs), cet objet possède notamment les attributs suivants :
<p><table cellpadding=3 border=1>
<tr><th>
Type d'événement
</th><th>
Attributs
</th></tr>
<tr><td>
clic ou déplacement de la souris
</td><td>
*target* : l'élément sur lequel l'événement s'est produit
<br>*x,y* : position de la souris par rapport au bord supérieur gauche de la fenêtre
</td></tr>
<tr><td>
glisser-déposer (HTML5)
</td><td>
*data* : donnée associée au déplacement
</td></tr>
</table>

Exemple :
<table>
<tr>
<td>
    <script type='text/python'>
    from browser import doc
    def mouse_move(ev):
        doc["trace"].value = '%s %s' %(ev.x,ev.y)
    
    doc["zone"].bind('mousemove',mouse_move)
    </script>
    
    <input id="trace" value="">
    <br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
    passer la souris ici</textarea>

</td>
<td>
<script type='text/python'>
from browser import doc
def mouse_move(ev):
    doc["trace"].value = '%s %s' %(ev.x,ev.y)

doc["zone"].bind('mousemove',mouse_move)
</script>

<input id="trace" value="">
<br><textarea id="zone" rows=7 columns=30 style="background-color:gray">
passer la souris ici</textarea>
</pre>
</td>
</tr>
</table>
