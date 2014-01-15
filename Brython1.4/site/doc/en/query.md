## Query string

**browser**.`doc` supports the attribute `query`, that returns the query string as an object with the following attributes and methods :

- <code>doc.query[<i>key</i>]</code> : returns the value associated with _`key`_. If a key has more than one value (which might be the case for SELECT tags with the attribute MULTIPLE set, or for `<INPUT type="checkbox">` tags), returns a list of the values. Raises `KeyError` if there is no value for the key

- <code>doc.query.getfirst(<i>key[,default]</i>)</code> : returns the first value for _`key`_. If no value is associated with the key, returns _`default`_ if provided, else returns `None`

- <code>doc.query.getlist(<i>key</i>)</code> : returns the list of values associated with _`key`_ (the empty list if there is no value for the key)

- <code>doc.query.getvalue(<i>key[,default]</i>)</code> : same as `doc.query[key]`, but returns _`default`_ or `None` if there is no value for the key