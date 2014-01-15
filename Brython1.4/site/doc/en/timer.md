module **browser.timer**
------------------------

Implements methods to allow differed or repetitive execution of functions :

`set_timeout(`_function,ms_)`
> runs the *function* after *ms* milliseconds. *function* takes no argument. Returns an object usable in the following function

`clear_interval(`_timer_`)`
> cancels the execution of the function defined by `set_timeout()`

`set_interval(`_fonction,ms_`)`
> lauches repeated execution of the *function* every *ms* milliseconds. This function returns an object usable in the following function

`clear_interval(`_timer_`)`
> stops the repeated execution of the function defined by `set_interval()`

<div id="py_source">
    import time
    from browser import timer
    
    _timer = None
    counter = 0
    
    def show():
        doc['timer'].text = '%.2f' %(time.time()-counter)
    
    def start_timer():
        global _timer,counter
        if _timer is None:
            counter = time.time()
            _timer = timer.set_interval(show,10)
            doc['start'].text = 'Hold'
        elif _timer == 'hold': # restart
            # restart timer
            counter = time.time()-float(doc['timer'].text)
            _timer = timer.set_interval(show,10)
            doc['start'].text = 'Hold'
        else: # hold
            timer.clear_interval(_timer)
            _timer = 'hold'
            doc['start'].text = 'Restart'
    
    def stop_timer():
        global _timer
        timer.clear_interval(_timer)
        _timer = None
        t = 0
        doc['timer'].text = '%.2f' %0
        doc['start'].text = 'Start'

</div>

<script type='text/python'>
exec(doc['py_source'].text)
</script>

<table cellpadding=10>
<tr>
<td style="width:100px;">
<button id="start" onclick="start_timer()">Start</button>
<br><button id="stop" onclick="stop_timer()">Stop</button>
</td>
<td>
<div id="timer" style="background-color:black;color:#0F0;padding:15px;font-family:courier;font-weight:bold;font-size:23px;">0.00</div>
</td>
</tr>
</table>