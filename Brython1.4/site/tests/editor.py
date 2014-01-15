import sys
import time
import dis
import traceback

#doctype html 5 causes issues with setting height of the container
#so python to the rescue! :)
from browser import doc, pydom
_height=doc.documentElement.clientHeight
_s=pydom.Selector('#container')
#set height of container to 66% of screen
_s.get().height('%spx' % int(_height*0.66))

has_ace = True
try:
    editor=JSObject(ace).edit("editor")
    editor.getSession().setMode("ace/mode/python")
except:
    from browser import html
    editor = html.TEXTAREA(rows=20,cols=70)
    doc["editor"] <= editor
    def get_value(): return editor.value
    def set_value(x):editor.value=x
    editor.getValue = get_value
    editor.setValue = set_value
    has_ace = False

if sys.has_local_storage:
    from browser.local_storage import storage
else:
    storage = False

def reset_src():
    if storage and "py_src" in storage:
       editor.setValue(storage["py_src"])
    else:
       editor.setValue('for i in range(10):\n\tprint(i)')

    editor.scrollToRow(0)
    editor.gotoLine(0)

def reset_src_area():
    if storage and "py_src" in storage:
       editor.value = storage["py_src"]
    else:
       editor.value = 'for i in range(10):\n\tprint(i)'

def write(data):
    doc["console"].value += str(data)

#sys.stdout = object()    #not needed when importing sys via src/Lib/sys.py
sys.stdout.write = write

#sys.stderr = object()    # ditto
sys.stderr.write = write

def to_str(xx):
    return str(xx)

info = sys.version_info
doc['version'].text = '%s.%s.%s' %(info.major,info.minor,info.micro)

output = ''

def show_console():
    doc["console"].value = output
    doc["console"].cols = 60

def clear_text():
    editor.setValue('')
    if sys.has_local_storage:
        storage["py_src"]=''

    doc["console"].value=''

def run():
    global output
    doc["console"].value=''
    src = editor.getValue()
    if storage:
       storage["py_src"]=src

    t0 = time.perf_counter()
    try:
        exec(src,globals())
        state = 1
    except Exception as exc:
        traceback.print_exc()
        state = 0
    output = doc["console"].value

    print('<completed in %6.2f ms>' % ((time.perf_counter()-t0)*1000.0))
    return state

# load a Python script
def load(evt):
    _name=evt.target.value+'?foo=%s' %time.time()
    editor.setValue(open(_name).read())

def show_js():
    src = editor.getValue()
    doc["console"].value = dis.dis(src)

def change_theme(evt):
    _theme=evt.target.value
    editor.setTheme(_theme)

    if storage:
       storage["ace_theme"]=_theme

def reset_theme():
    if storage:
       if "ace_theme" in storage:
          editor.setTheme(storage["ace_theme"])
          doc["ace_theme"].value=storage["ace_theme"]

if has_ace:
    reset_src()
    reset_theme()
else:
    reset_src_area()
