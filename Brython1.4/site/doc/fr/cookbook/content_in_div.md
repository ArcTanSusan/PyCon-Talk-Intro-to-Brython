Problème
--------

Afficher du contenu dans un élément de la page web


Solution
--------

<table width="100%">
<tr>
<td style="width:50%;">

    <html>
    <head>
    <script src="brython.js"></script>
    </head>
    <body onload="brython()">
    
    <script type="text/python">
    from browser import doc
    doc['zone'] <= "bla "
    </script>
    
    </body>
    </html>

<button onclick="fill_zone()">Essayer</button>
</td>
<td id="zone" style="background-color:#FF7400;text-align:center;">Contenu initial<p>
</td>
</tr>
</table>

<script type="text/python3">
def fill_zone():
    doc["zone"] <= "bla "
</script>

`doc["zone"]` est l'élément dans la page web qui possède l'id "zone" (ici, la cellule colorée)

