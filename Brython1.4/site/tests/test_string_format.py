import datetime
d = datetime.date(2010, 9, 7)

assert "The year is {}".format(2010) == 'The year is 2010'
assert "The year is {0.year}".format(year=2010,month=9,day=7) == "The year is 2010"

assert "{0:{width}.{precision}s}".format('hello world', width=8, precision=5) == 'hello   '
assert "The year is {0.year}".format(d) == "The year is 2010"
assert "Tested on {0:%Y-%m-%d}".format(d) == "Tested on 2010-09-07"

assert "{0:{width}.{precision}s}".format('hello world',
            width=8, precision=5) == 'hello   '
assert "The year is {0.year}".format(d) == "The year is 2010"
assert "Tested on {0:%Y-%m-%d}".format(d) == "Tested on 2010-09-07"

assert "{0:{width}.{precision}s}".format('hello world',
            width=8, precision=5) == 'hello   '
assert "The year is {0.year}".format(d) == "The year is 2010"
assert "Tested on {0:%Y-%m-%d}".format(d) == "Tested on 2010-09-07"
