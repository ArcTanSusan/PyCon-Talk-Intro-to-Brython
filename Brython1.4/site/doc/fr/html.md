module **browser.html**
-----------------------

Ce module définit des classes correspondant aux balises HTML, en majuscules

Les classes définies sont :

- les balises HTML4 : `A, ABBR, ACRONYM, ADDRESS, APPLET, B, BDO, BIG, BLOCKQUOTE, BUTTON, CAPTION, CENTER, CITE, CODE, DEL, DFN, DIR, DIV, DL,EM, FIELDSET, FONT, FORM, FRAMESET,H1, H2, H3, H4, H5, H6,I, IFRAME, INS, KBD, LABEL, LEGEND,MAP, MENU, NOFRAMES, NOSCRIPT, OBJECT,OL, OPTGROUP, PRE, Q, S, SAMP,SCRIPT, SELECT, SMALL, SPAN, STRIKE,STRONG, STYLE, SUB, SUP, TABLE,TEXTAREA, TITLE, TT, U, UL, VAR, BODY, COLGROUP, DD, DT, HEAD, HTML, LI, P, TBODY, OPTION, TD, TFOOT, TH, THEAD, TR,AREA, BASE, BASEFONT, BR, COL, FRAME, HR, IMG, INPUT, ISINDEX, LINK, META, PARAM`
- les balises HTML5 : `ARTICLE, ASIDE, AUDIO, BDI, CANVAS, COMMAND, DATALIST, DETAILS, DIALOG, EMBED, FIGCAPTION, FIGURE, FOOTER, HEADER, KEYGEN, MARK, METER, NAV, OUTPUT, PROGRESS, RP, RT, RUBY, SECTION, SOURCE, SUMMARY,TIME,TRACK,VIDEO,WBR`

La syntaxe pour créer un objet (par exemple un lien hypertexte) est :

`A(`_[content,[attributes]]_`)`
> _content_ est le noeud "fils" de l'objet ; il peut s'agir d'un objet Python comme une chaine de caractères, une liste, etc, ou bien une instance d'une autre classe du module **html**

> _attributes_ est une suite de mots-clés correspondant aux attributs de la balise HTML. Ces attributs doivent être fournis avec la syntaxe Javascript, pas CSS : _backgroundColor_ et pas _background-color_

Exemple :

>    from browser import html
>    link1 = html.A('Brython',href='http://www.brython.info')
>    link2 = html.A(html.B('Python'),href='http://www.python.org')

Pour éviter les conflits avec des mots-clés de Python, des attributs comme *class* ou *id* doivent être écrits avec une majuscule :

>    d = html.DIV('Brython',Id="zone",Class="container")

Pour l'attribut _style_, la valeur doit être un dictionnaire :

>    d = html.DIV('Brython',style={'height':100,'width':200})


On peut aussi créer un objet sans argument, puis le compléter :
- pour ajouter un noeud enfant, utiliser l'opérateur <=
- pour ajouter des attributs, utiliser la syntaxe Python classique : `objet.attribut = valeur`

par exemple :
>    link = html.A()
>    link <= html.B('connexion')
>    link.href = 'http://exemple.com'

On peut aussi créer plusieurs éléments de même niveau par addition :

>    row = html.TR(html.TH('Nom')+html.TH('Prénom'))

En combinant ces opérateurs et la syntaxe Python, voici comment créer une boite de sélection à partir d'une liste :

>    items = ['un','deux','trois']
>    sel = html.SELECT()
>    for i,elt in enumerate(items):
>        sel <= html.OPTION(elt,value=i)
>    doc <= sel

A noter que la création d'une instance d'une classe HTML entraine la création d'un unique objet DOM. Si on affecte l'instance à une variable, on ne peut pas l'utiliser à plusieurs endroits. Par exemple avec ce code :

>    link = html.A('Python',href='http://www.python.org')
>    doc <= 'Site officiel de Python : '+link
>    doc <= html.P()+'Je répète : le site est '+link

le lien ne sera montré que dans la deuxième ligne. Une solution est de cloner l'objet initial :

>    link = html.A('Python',href='http://www.python.org')
>    doc <= 'Site officiel de Python : '+link
>    doc <= html.P()+'Je répète : le site est '+link.clone()

