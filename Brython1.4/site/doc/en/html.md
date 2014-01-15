module **browser.html**
-----------------------

This module exposes the HTML tags. The tag name is in uppercase letters

The classes defined are :

- HTML4 tags : `A, ABBR, ACRONYM, ADDRESS, APPLET, B, BDO, BIG, BLOCKQUOTE, BUTTON, CAPTION, CENTER, CITE, CODE, DEL, DFN, DIR, DIV, DL,EM, FIELDSET, FONT, FORM, FRAMESET,H1, H2, H3, H4, H5, H6,I, IFRAME, INS, KBD, LABEL, LEGEND,MAP, MENU, NOFRAMES, NOSCRIPT, OBJECT,OL, OPTGROUP, PRE, Q, S, SAMP,SCRIPT, SELECT, SMALL, SPAN, STRIKE,STRONG, STYLE, SUB, SUP, TABLE,TEXTAREA, TITLE, TT, U, UL, VAR, BODY, COLGROUP, DD, DT, HEAD, HTML, LI, P, TBODY, OPTION, TD, TFOOT, TH, THEAD, TR,AREA, BASE, BASEFONT, BR, COL, FRAME, HR, IMG, INPUT, ISINDEX, LINK, META, PARAM`
- HTML5 tags : `ARTICLE, ASIDE, AUDIO, BDI, CANVAS, COMMAND, DATALIST, DETAILS, DIALOG, EMBED, FIGCAPTION, FIGURE, FOOTER, HEADER, KEYGEN, MARK, METER, NAV, OUTPUT, PROGRESS, RP, RT, RUBY, SECTION, SOURCE, SUMMARY,TIME,TRACK,VIDEO,WBR`

The syntax to create an object (eg a hyperlink) is :

`A(`_[content,[attributes]]_`)`

> _content_ is the child node of the the object ; it can be a Python object such as a string, a number, a list etc., or an instance of another class in the **html** module

> _attributes_ is a sequence of keywords corresponding to the attributes of the HTML tag. These attributes must be provided as Javascript syntax, not CSS: *backgroundColor* instead of *background-color*

Example :

>    from browser import html
>    link1 = html.A('Brython', href='http://www.brython.info')
>    link2 = html.A(html.B('Python'), href='http://www.python.org')

For the _style_ attribute, the value must be a dictionary :

>    d = html.DIV('Brython', style={'height':100, 'width':200})

To avoid conflicts with Python keywords, attributes such as _class_ or _id_ must be capitalized :

>    d = html.DIV('Brython',Id="zone",Class="container")

You can also create an object without argument, then build it up:

- to add a child node, use the <= operator
- to add attributes, use the classic Python syntax : `object.attribute = value`
Example :    
>    link = A()
>    link <= B('connexion')
>    link.href = 'http://example.com'

You can also create multiple elements at the same level by using the plus (+) sign :

>    row = TR(TH('LastName') + TH('FirstName'))

Here is how to create a selection box from a list (by combining these operators and Python syntax) :

>    items = ['one', 'two', 'three']
>    sel = SELECT()
>    for i, elt in enumerate(items):
>        sel <= OPTION(elt, value = i)
>    doc <= sel

It is important to note that the creation of an instance of a class involves creating HTML from a single DOM object. If we assign the instance to a variable, you can not use it in several places. For example, with this code :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P() + 'I repeat: the site is ' + link

the link will only show in the second line. One solution is to clone the original object :

>    link = A('Python', href='http://www.python.org')
>    doc <= 'Official Python Website: ' + link
>    doc <= P() + 'I repeat: the site is ' + link.clone()

As a rule of thumb, instances of classes HTML attributes have the same name as the corresponding DOM objects. It can for example retrieve the option selected by the `selectedIndex` attribute of the `SELECT` object. Brython adds a few things to make the manipulation a bit more Pythonic



