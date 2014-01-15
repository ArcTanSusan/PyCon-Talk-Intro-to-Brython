# strings
log('spam eggs')
log('doesn\'t')
log("doesn't")
log('"Yes," he said.')
log("\"Yes,\" he said.")
log('"Isn\'t," she said.')
hello = "This is a rather long string containing\n\
several lines of text just as you would do in C.\n\
    Note that whitespace at the beginning of the line is\
 significant."
log(hello)
log("""\
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
""")
hello = r"This is a rather long string containing\n\
several lines of text much as you would do in C."
log(hello)

word = 'Help' + 'A'
assert word=='HelpA'
assert '<' + word*5 + '>'=='<HelpAHelpAHelpAHelpAHelpA>'

x = 'str' 'ing'
assert x=='string'
assert 'str'.strip() + 'ing'=='string'

# string methods
x='fooss'
log(x.replace('o','X',20))
log('GhFF'.lower())
log(x.lstrip('of'))
x='aZjhkhZyuy'
log(x.find('Z'))
log(x.rfind('Z'))
log(x.rindex('Z'))
try:
    log(x.rindex('K'))
except ValueError:
    log('erreur')
log(x.split('h'))
#log(x.split('h',1))
log(x.startswith('aZ'))
log(x.strip('auy'))
log(x.upper())

x = "zer"
assert x.capitalize() == "Zer"
assert str.capitalize(x) == "Zer"

x = "azert$t y t"
assert x.count('t')==3
assert str.count(x,'t')==3

assert x.endswith("y t")==True

assert x.find('t')==4
assert x.find('$')==5
assert x.find('p')==-1

assert x.index('t')==4

items = ['sd','kj']
assert '-'.join(items)=="sd-kj"

assert "ZER".lower()=="zer"

assert "azerty".lstrip('a')=="zerty"
assert "azerty".lstrip('za')=="erty"
assert "azaerty".lstrip('az')=="erty"

assert "$XE$".replace("$XE$", "!")=="!"
assert "$XE".replace("$XE", "!")=='!'
assert "XE$".replace("XE$", "!")=="!"
assert "XE$".replace("$", "!")=="XE!"
assert "$XE".replace("$", "!")=="!XE"
assert "?XE".replace("?", "!")=="!XE"
assert "XE?".replace("?", "!")=="XE!"
assert "XE!".replace("!", "?")=="XE?"

assert "azterty".find('t')==2
assert "azterty".rfind('t')==5
assert "azterty".rfind('p')==-1

assert "azterty".rindex('t')==5

try:
    "azterty".rindex('p')
except ValueError:
    pass

assert "azerty".rstrip('y')=="azert"
assert "azerty".rstrip('yt')=="azer"
assert "azeryty".rstrip('ty')=="azer"

assert "az er ty".split()==["az","er","ty"]
assert "azferfty".split('f')==["az","er","ty"]
assert " aBc  dEf ".split(maxsplit=1)==['aBc','dEf ']
assert " aBc  dEf ".split()==['aBc','dEf']

assert "az\ner\nty".splitlines()==["az","er","ty"]

assert "azerty".startswith('az')

assert "  azerty ".strip() == "azerty"

assert "bghggbazertyhbg".strip("bhg") == "azerty"

assert "zer".upper() == "ZER"

print("passed all tests...")

