Palavras-chave e funções integradas
-----------------------------------

Brython suporta a maior parde das palavras-chave e funções de Python 3 :

- palavras-chave : `as, assert, break, class, continue, def, del, elif, else, except, False, finally, for, from, global, if, import, is, lambda, None, pass, return, True, try, while, with, yield`
- funções integradas : `abs(), all(), any(), ascii(), bin(), bool(), callable(), chr(), classmethod(), delattr(), dict(), dir(), divmod(), enumerate(), eval(), exec(), filter(), float(), frozenset(), getattr(), globals(), hasattr(), hash(), hex(), id(), input(), int(), isinstance(), iter(), len(), list(), locals(), map(), max(), min(), next(), object(), open(), ord(), pow(), print(), property(), range(), repr(), reversed(), round(), set(), setattr(), slice(), sorted(), str(), sum(), tuple(), type(), zip()`

Por padrão, `print()` será mostrado no console do navegador web, assim como as mensagens de erro. `sys.stderr` e `sys.stdout` podem ser designados a um objeto que tenha o método `write()`, permitindo o redirecionamento das saídas para uma janela ou área de texto

`sys.stdin` ainda não está implementado até o momento, entretanto, há uma função integrada `input()` que abre uma caixa de diálogo de entrada bloqueadora (um 'prompt').

Para abrir um diálogo de impressão (para uma impressora), use `win.print`

O seguinte ainda não está implementado na versão atual :

- palavras-chave `nonlocal`
- funções integradas `bytearray(), bytes(), compile(), complex(), format(), help(),  memoryview(), super(), vars(), __import__`
- números complexos tipo (`j`) não são suportados

Diferentemente de Python, você pode adicionar atributos a objetos criados com `object()` :

>    x = object()
>    x.foo = 44
>    del x.foo

Finalmente, foram adicionadas algumas palavras-chave e funções integradas elaboradas para operação em um navegador web :
- As funções `alert(), confirm(), prompt()` correspondem a seus equivalentes em Javascript.
- A função integrada `ajax()` permite a execução de requisições HTTP em modo Ajax.
- A palavra-chave `win` é a janela (objeto _window_ em Javascript) e `doc` representa o documento HTML (_document_ em Javascript).