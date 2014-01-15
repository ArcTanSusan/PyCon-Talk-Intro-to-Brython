módulo time
-----------

Implementa una parte de los métodos disponibles en el módulo `time` de la librería estándar de Python

Se incluyen tres métodos que permiten ejecución en diferido o ejecución repetitiva de funciones :

- <code>set\_timeout(*funcion,ms*)</code> : ejecuta la *funcion* después de *ms* milisegundos. *function* no toma ningún argumento

- <code>set\_interval(*funcion,ms*)</code> ejecuta la *funcion* de forma repetida cada *ms* milisegundos. Esta función devuelve un objeto usable en la siguiente función

- <code>clear_interval(*timer*)</code> : para la ejecución repetitiva de la función definida por <code>set\_interval()</code>

<div id="py_source">
    import time
    
    timer = None
    counter = 0
    
    def show():
        doc['timer'].text = '%.2f' %(time.time()-counter)
    
    def start_timer():
        global timer,counter
        if timer is None:
            counter = time.time()
            timer = time.set_interval(show,10)
            doc['start'].text = 'Hold'
        elif timer == 'hold': # restart
            # restart timer
            counter = time.time()-float(doc['timer'].text)
            timer = time.set_interval(show,10)
            doc['start'].text = 'Hold'
        else: # hold
            time.clear_interval(timer)
            timer = 'hold'
            doc['start'].text = 'Restart'
    
    def stop_timer():
        global timer
        time.clear_interval(timer)
        timer = None
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