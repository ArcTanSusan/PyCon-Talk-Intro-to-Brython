import os
import base64
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
  _vfs.write("__BRYTHON__.py_VFS={\n")

  _flag=False
  for _mydir in ("libs", "Lib"):
    for _root, _dir, _files in os.walk(os.path.join(_main_root, _mydir)):
        print(_root)
        if 'lib_migration' in _dir:
            _dir.remove('lib_migration')
        #if _root.endswith('lib_migration'): continue  #skip these modules 
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

               if _flag: _vfs.write(',\n')
               _flag=True
               _vfs.write("'%s':'%s'" % (_vfs_filename, base64.b64encode(_data)))

  _vfs.write('\n}\n\n')

  _vfs.write("""
function readFromVFS(lib){
   //borrowed code from http://stackoverflow.com/questions/1119722/base-62-conversion-in-python
   if (window.atob === undefined) {
      // browser is not chrome, firefox or safari :(
      window.atob=function(s) {
        var e={},i,k,v=[],r='',w=String.fromCharCode;
        var n=[[65,91],[97,123],[48,58],[43,44],[47,48]];

        for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
        for(i=0;i<64;i++){e[v[i]]=i;}

        for(i=0;i<s.length;i+=72){
           var b=0,c,x,l=0,o=s.substring(i,i+72);
           for(x=0;x<o.length;x++){
              c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
              while(l>=8){r+=w((b>>>(l-=8))%256);}
           }
        }
        return r;
      }
   }

   if (__BRYTHON__.py_VFS[lib] === undefined) return undefined
   //retrieve module from virutal file system and return contents
   return window.atob(__BRYTHON__.py_VFS[lib])
}

""")

  _vfs.close()

if __name__ == '__main__':
   _main_root=os.path.join(os.getcwd(), '../src')
   process(os.path.join(_main_root, "py_VFS.js"))
