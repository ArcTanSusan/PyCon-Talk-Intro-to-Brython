import simple

class Simple2:
    def __init__(self):
        self.info = "SimpleClass2"

class Simple3(simple.Simple):
  def __init__(self):
      simple.Simple.__init__(self)

text = "text in simple"

assert simple.text == text

_s=simple.Simple()
_s3=Simple3()
assert _s.info==_s3.info

import recursive_import
_s=recursive_import.myClass()

assert str(_s) == "success!"

print('passed all tests')

