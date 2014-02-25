Problema
--------

Usar as etiquetas HTML básicas : bold, italic, headers...


Solução
-------


<table width="100%">
<tr>
<td style="width:50%;">

    <html>
    <head>
    <script src="brython.js"></script>
    </head>
    <body onload="brython()">
    
    <script type="text/python">
    import html
    doc['zone'] <= html.H1("Apresentando Brython")
    doc['zone'] <= html.H4(html.I("Python no navegador"))
    doc['zone'] <= html.B("Olá mundo !")
    </script>
    
    </body>
    </html>

<button onclick="fill_zone()">Teste</button>
</td>
<td id="zone" style="background-color:#FF7400;text-align:center;">Conteúdo inicial<p>
</td>
</tr>
</table>

<script type="text/python3">
def fill_zone():
    import html
    doc['zone'] <= html.H1("Apresentando Brython")
    doc['zone'] <= html.H4(html.I("Python no navegador"))
    doc['zone'] <= html.B("Olá mundo !")
</script>

`B` é a função definida no módulo `html`, correspondendo à etiqueta HTML `<B>` (bold)

`B("text")` retorna um objeto correspondendo a HTML `<b>text</b>`

Todas as etiquetas HTML têm sua própria função : `I, H1, H2,...`. Você pode aninhar funções, como mostrado na segunda linha :

    doc <= html.H4(html.I("Python no navegador"))

