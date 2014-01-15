Problem
-------

Display content in an element of the web page


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
    doc['zone'] <= "blah "
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
from browser import doc
def fill_zone():
    doc["zone"] <= "blah "
</script>

`doc["zone"]` is the element in the web page with the id "zone" (here, the colored table cell)

