"""Generates a skeleton for non-pure Python modules of the CPython distribution
The resulting script has the same names as the original module, with the same values
if they are a built-in type (integer, string etc) and a value of the same type
(function, class etc) if possible, else a string with information on the missing
value
"""

import types
import inspect

stdlib_name = '_string'
ns = {}
exec('import %s;print(dir(%s))' %(stdlib_name,stdlib_name),ns)
out = open('%s_skeleton.py' %stdlib_name,'w')

infos = ns[stdlib_name]

def skeleton(infos):
    res = ''
    print(infos)
    if infos.__doc__:
        res += '"""%s"""\n\n' %infos.__doc__
    for key in dir(infos):
        if key in ['__class__','__doc__','__name__','__file__','__package__']:
            continue
        val = getattr(infos,key)
        if isinstance(val,(int,float,dict)):
            res += '\n%s = %s\n' %(key,val)
        elif val in [True,False,None]:
            res += '\n%s = %s\n' %(key,val)
        elif isinstance(val,str):
            res += '\n%s = """%s"""\n' %(key,val)
        elif type(val)in [types.BuiltinFunctionType,
            types.BuiltinMethodType,
            types.FunctionType]:
            res += '\ndef %s(*args,**kw):\n' %key
            if val.__doc__:
                lines = val.__doc__.split('\n')
                res += '    """'
                if len(lines)==1:
                    res += lines[0]+'"""\n'
                else:
                    res += lines[0]
                    for line in lines[1:-1]:
                        res += '    %s\n' %line
                    res += '    %s"""\n' %lines[-1]
            res += '    pass\n'
        elif inspect.isclass(val):
            res += '\nclass %s' %key
            if val.__bases__:
                res += '('+','.join(x.__name__ for x in val.__bases__)+')'
            res += ':\n    pass\n'
        else:
            res += '\n%s = "%s"\n' %(key,val)
    return res
    
out.write(skeleton(infos))
out.close()