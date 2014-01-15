import
------
The import is performed by Ajax calls

There are three types of importable modules :

- modules written in Javascript, located in folder __libs__ of the distribution : _datetime, hashlib, html, json, math, random, svg, sys_ (of which only some of the attributes and methods are implemented)

- built-in modules written in Python, located in folder __Lib__ : _dis, errno, itertools, keyword, local\_storage, os, pydom, pyindexedDB, string, sys, traceback_

- user-defined Python modules will be imported from the same directory in which the calling script is situated

Modules must be encoded in utf-8 ; the encoding declaration at the beginning of a module is ignored