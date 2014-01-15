module **browser.timer**
------------------------

Implémente des fonctions pour permettre l'exécution différée ou répétitive de fonctions :

`set_timeout(`_fonction,ms_`)`
> exécute la *fonction* après *ms* millisecondes. *fonction* ne prend aucun argument. Renvoie un objet utilisable dans la fonction suivante

`clear_timeout(`_timer_`)`
> annule l'exécution définie par `set_timeout()`

`set_interval(`_fonction,ms_`)`
> lance l'exécution répétée de la *fonction* toutes les *ms* millisecondes. Renvoie un objet utilisable dans la fonction suivante

`clear_interval(`_timer_`)`
> termine l'exécution répétée définie par `set_interval()`

Exemple
=======

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
            doc['start'].text = 'Pause'
        elif _timer == 'hold': # restart
            # restart timer
            counter = time.time()-float(doc['timer'].text)
            _timer = timer.set_interval(show,10)
            doc['start'].text = 'Départ'
        else: # hold
            timer.clear_interval(_timer)
            _timer = 'hold'
            doc['start'].text = 'Redémarrer'
    
    def stop_timer():
        global _timer
        timer.clear_interval(_timer)
        _timer = None
        t = 0
        doc['timer'].text = '%.2f' %0
        doc['start'].text = 'Départ'

</div>

<script type='text/python'>
exec(doc['py_source'].text)
</script>

<table cellpadding=10>
<tr>
<td style="width:100px;">
<button id="start" onclick="start_timer()">Départ</button>
<br><button id="stop" onclick="stop_timer()">Arrêt</button>
</td>
<td>
<div id="timer" style="background-color:black;color:#0F0;padding:15px;font-family:courier;font-weight:bold;font-size:23px;">0.00</div>
</td>
</tr>
</table>