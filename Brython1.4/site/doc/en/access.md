Accessing elements
------------------

Getting access to an element can be done in different ways. The most usual is to use its identifier, ie its attribute _id_ : with an input field defined by

>    <input id="data">

we can get a reference to this field by

>    from browser import doc
>    data = doc["data"]

`doc` is defined in module **browser** and refers to the HTML document. It behaves like a dictionary whose keys are the identifiers of the elements in the page. If no element has the specified id, the program raises a `KeyError` exception

We can also get all the elements of a given type, for instance all the hypertext links (HTML tag `A`), using the syntax

>    from browser import html
>    links = doc[html.A]

Finally, all the elements in the page have a method `get()` that can be used to search elements :
 - `elt.get(name=N)` returns a list of all the elements descending from `elt` whose attribute `name` is equal to `N`
 - `elt.get(selector=S)` returns a list with all the elements descending from `elt` whose CSS selector matches `S`

