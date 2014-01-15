import os
import json
import sys

#check to see if slimit or some other minification library is installed
#set minify equal to slimit's minify function

#NOTE: minify could be any function that takes a string and returns a string
# Therefore other minification libraries could be used.
try:
  import slimit
  minify=slimit.minify
except ImportError:
  minify=None  
  
if sys.version_info[0] >= 3:
   print("For the time being, because of byte issues in Bryton, please use python 2.x")
   sys.exit()

def process(filename):
  print "generating %s" % filename
  _main_root=os.path.dirname(filename)
  _vfs=open(filename, "w")

  _VFS={}

  for _mydir in ("libs", "Lib"):
    for _root, _dir, _files in os.walk(os.path.join(_main_root, _mydir)):
        if _root.endswith('lib_migration'): continue  #skip these modules 
        for _file in _files:
            if _file.endswith('.py'):
               # we only want to include a .py file if a compiled javascript
               # version is not available
               if os.path.exists(os.path.join(_root, _file.replace('.py', '.pyj'))):
                  continue

            _ext=os.path.splitext(_file)[1]
            if _ext in ('.js', '.py', '.pyj'): #_file.endswith('.js') or _file.endswith('.py') or _file.endswith('.pyj'):
               _fp=open(os.path.join(_root, _file), "r")
               _data=_fp.read()
               _fp.close()

               if _ext in ('.js', '.pyj') and minify is not None:
                  _data=minify(_data)

               _vfs_filename=os.path.join(_root, _file).replace(_main_root, '')
               _vfs_filename=_vfs_filename.replace("\\", "/")

               if _vfs_filename.startswith('/libs/crypto_js/rollups/'):
                  if _file not in ('md5.js', 'sha1.js', 'sha3.js',
                      'sha224.js', 'sha384.js', 'sha512.js'):
                       continue

               print("adding %s" % _vfs_filename)

               _VFS[_vfs_filename]=_data

  _vfs.write(json.dumps(_VFS))

  _vfs.close()

if __name__ == '__main__':
   _main_root=os.path.join(os.getcwd(), '../src')
   process(os.path.join(_main_root, "py_VFS.json"))
