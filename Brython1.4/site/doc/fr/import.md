import
------

L'importation est réalisée par des appels Ajax

Il y a plusieurs types de modules importables :

- des modules écrits en Javascript, situés dans le répertoire __libs__ de la distribution : _datetime, hashlib, html, json, math, random, svg, sys_ (dont seule une part plus ou moins grande des attributs et méthodes sont implémentés)
- des modules écrits en Python, situés dans le dossier __Lib__ : _dis, errno, itertools, keyword, local\_storage, os, pydom, pyindexedDB, string, sys, traceback_
- d'autres modules Python peuvent être importés s'ils se trouvent dans le répertoire de la page HTML appelante, ou du script appelé par cette page : par exemple si la page appelle un script dont l'attribut _src_ est _brython\_app/foo.py_, les modules situés dans le répertoire __brython\_app__ peuvent être importés

Les modules doivent être encodés en utf-8 ; la déclaration d'encodage en début de module n'est pas prise en compte