Elements attributes and methods
-------------------------------

The elements in a page have attributes and methods that depend on the element type ; they can be found on many Internet sites

Since their name may vary depending on the browser, Brython defines additinal attributes that work in all cases :

<table border=1 cellpadding=3>
<tr>
<th>Nom</th><th>Type</th><th>Description</th><th>R = read only<br>R/W = read + write</th>
</tr>
<tr>
<td>*text*</td><td>string</td><td>the text inside the element</td><td>R/W</td>
</tr>
<tr>
<td>*html*</td><td>string</td><td>the HTML code inside the element</td><td>R/W</td>
</tr>
<tr>
<td>*left, top*</td><td>integers</td><td>the position of the element relatively to the upper left border of the page</td><td>R</td>
</tr>
<tr>
<td>*children*</td><td>list</td><td>the element's children in the document tree</td><td>R</td>
</tr>
<tr>
<td>*parent*</td><td>`DOMNode` instance</td><td>the element's parent (`None` for `doc`)</td><td>R</td>
</tr>
<tr>
<td>*class*</td><td>string</td><td>the name of the element's class (tag attribute *class*)</td><td>R/W</td>
</tr>
<tr>
<td>*remove*</td><td>function</td><td><code>remove(_child_)</code> removes *child* from the list of the element's children</td><td>R</td>
</tr>
</table>

To add a child to an element, use the operator `<=` (think of it as a left arrow for assignment)

>    from browser import doc
>    doc['zone'] <= INPUT(Id="data")

Iterating on an element's children can be done using the usual Python syntax : 
>    for child in element:
>        (...)

To destroy an element, use the keyword `del`
>    zone = doc['zone']
>    del zone

The `options` collection associated with a SELECT object has an interface of a Python list :

 - access to an option by its index : `option = elt.options[index]`
 - insertion of an option at the _index_ position : `elt.options.insert(index,option)`
 - insertion of an option at the end of the list : `elt.options.append(option)`
 - deleting an option : `del elt.options[index]`
