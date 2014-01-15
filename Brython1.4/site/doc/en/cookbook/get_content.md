Problem
-------
Get the content of an element of a web page


Solution
--------

<table width="100%">
<tr>
<td style="width:50%;">

    from browser import alert,doc
    # doc['zone'] is the colored cell
    alert(doc['zone'].text)

<button onclick="show_text()">Show text</button>

    alert(doc['zone'].html)

<br><button onclick="show_html()">Show html</button>

    # doc['entry'] is the input field
    alert(doc['entry'].value)

<br><button onclick="show_value()">Show entry</button>
</td>
<td id="zone" style="background-color:#FF7400;text-align:center;">
<B>Cell content</B><p>
<INPUT id="entry" value="input field">
</td>
</tr>
</table>

<script type="text/python3">
from browser import doc
def show_text():
    src = doc.get(selector="pre.marked")[0].text
    exec(src)
def show_html():
    src = doc.get(selector="pre.marked")[1].text
    exec(src)
def show_value():
    src = doc.get(selector="pre.marked")[2].text
    exec(src)

</script>    

Each element in the page has an attribute `text`, a string with the text shown in the element

It also has an attribute `html`, a string with the HTML code inside the element

Input fields have an attribute `value`, a string with the current field value

`alert()` is a function defined in module **browser** that shows its argument in a popup window