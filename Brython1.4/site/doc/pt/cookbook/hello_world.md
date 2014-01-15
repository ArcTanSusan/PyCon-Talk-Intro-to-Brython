Problema
--------

Fazer o navegador mostrar "Olá mundo !"


Solução
-------

    <html>
    <head>
    <script src="brython.js"></script>
    </head>
    <body onload="brython()">
    
    <script type="text/python">
    doc <= "Olá mundo !"
    </script>
    
    </body>
    </html>

`doc` é uma palavra-chave integrada em Brython que representa o documento (o conteúdo da página web). Ela suporta a operação `<=` significando "adicionar conteúdo". Aqui o conteúdo é uma simples cadeia Python.
