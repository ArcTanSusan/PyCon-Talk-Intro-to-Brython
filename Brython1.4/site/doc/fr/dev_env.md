Environnement de développement
------------------------------

Les développeurs peuvent utiliser l'environnement disponible en  [téléchargement](https://bitbucket.org/olemis/brython/downloads) : choisir le fichier zip qui commence par "Brython\_site\_mirror" et le décompacter dans un répertoire (appelé le répertoire Brython dans les paragraphes qui suivent)

Il faut un serveur web pour tester les scripts localement dans la phase de développement. Tout serveur qui peut accéder aux fichiers avec le répertoire Brython comme racine convient ; vous pouvez utiliser le serveur web intégré à la distribution : ouvrez une fenêtre de console, allez dans le répertoire et exécutez `python server.py`. Ceci lancera le serveur sur le port 8000 (éditer _server.py_ pour changer le numéro de port)

Une fois que le serveur est lancé, pointez votre navigateur web sur _http://localhost:8000/site_ : vous devriez voir la même page que la page d'accueil du [site Brython](http://www.brython.info)

Créez un nouveau répertoire (par exemple "test") dans le répertoire Brython. Avez un éditeur de texte, créez un fichier appelé _index.html_ contenant le texte ci-dessous, et sauvegardez-le dans le répertoire _test_

    <html>
    <head>
    <meta charset="iso-8859-1">
    <script src="../src/brython.js"></script>
    </head>
    <body onLoad="brython()">
    <script type="text/python">
    from browser import doc
    def echo():
        alert("Salut %s !" %doc["zone"].value)
    </script>
    <p>Vous vous appelez : <input id="zone"><button onclick="echo()">click !</button>
    </body>
    </html>


Pointez le navigateur sur _http://localhost:8000/test/index.html_ : bingo ! vous avez écrit votre permier script Brython

Utilisez cet environnement pour le test et le développement. Faites simplement attention à donner le bon chemin pour le script _brython.js_ relativement au répertoire dans lequel se trouve la page HTML qui l'appelle

