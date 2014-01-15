import
------
O _import_ é realizado por meio de chamadas Ajax

Existem três tipos de modulos importáveis :

- módulos escritos em Javascript, localizados na pasta __libs__ da distribuição : _datetime, hashlib, html, json, math, random, svg, sys_ (dos quais somente alguns atributos e métodos estão implementados)

- módulos escritos em Python, localizados na pasta __Lib__ : _dis, errno, itertools, keyword, local\_storage, os, pydom, pyindexedDB, string, sys, traceback_

- módulos definidos pelo usuário, que serão importados a partir do mesmo diretório em que se encontra o script que realiza a chamada

Os módulos devem estar codificados em utf-8 ; a declaração de codificação no começo do módulo será ignorada.