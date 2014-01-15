Problem
-------

Use the basic HTML markup : bold, italic, headers...


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
    from browser import doc,html
    doc['zone'] <= html.H1("Introducing Brython")
    doc['zone'] <= html.H4(html.I("Python in the browser"))
    doc['zone'] <= html.B("Hello world !")
    </script>
    
    </body>
    </html>

<button onclick="fill_zone()">Test it</button>
</td>
<td id="zone" style="background-color:#FF7400;text-align:center;">Initial content<p>
</td>
</tr>
</table>

<script type="text/python3">
def fill_zone():
    from browser import doc,html
    doc['zone'] <= html.H1("Introducing Brython")
    doc['zone'] <= html.H4(html.I("Python in the browser"))
    doc['zone'] <= html.B("Hello world !")
</script>

`B` is a function defined in the module `browser.html`, matching the HTML tag `<B>` (bold)

`B("text")` returns an object matching the HTML `<b>text</b>`

All HTML tags have their own function : `I, H1, H2,...`. You can nest functions, as shown in the second line :

    doc <= html.H4(html.I("Python in the browser"))

