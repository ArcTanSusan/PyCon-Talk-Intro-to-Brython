import
------

El import se realiza mediante llamadas Ajax

Existen tres tipos de m&oacute;dulos importables:

- m&oacute;dulos escritos en Javascript, localizados en la carpeta __libs__ de la distribuci&oacute;n : _datetime, hashlib, html, json, math, random, svg, sys_ (en los cuales solo algunos de los atributos y m&eacute;todos se encuentran implementados)
- m&oacute;dulos escritos en Python, localizados en la carpeta __Lib__ : _dis, errno, itertools, keyword, local\_storage, os, pydom, pyindexedDB, string, sys, traceback_
- m&oacute;dulos escritos por el usuario en Python, los cuales ser&aacute;n importados desde la misma carpeta desde la que se encuentra el script que realiza la llamada

Los m&oacute;dulos deben ser codificados en utf-8 ; la declaraci&oacute;n de la codificaci&oacute;n al principio del m&oacute;dulo ser&aacute; ignorada.