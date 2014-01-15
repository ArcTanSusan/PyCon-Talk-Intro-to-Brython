## módulo time

Implementa uma parte dos métodos no módulo `time` da distribuição padrão de Python

Os três métodos foram adicionados para permitir a execução repetitiva ou diferida de funções 

- <code>set\_timeout(*function,ms*)</code> : executa a função
  *function* após *ms* milisegundos. *function* não deve tomar argumentos

- <code>set\_interval(*function,ms*)</code> inicia a execução repetida
  da função *function* a cada *ms* milisegundos. Esta função retorna
  um objeto utilizável na seguinte função

- <code>clear_interval(*timer*)</code> : pára a execução repetida da
  função definida por <code>set\_interval()</code>

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
            doc['start'].text = 'Pausar'
        elif timer == 'hold': # restart
            # restart timer
            counter = time.time()-float(doc['timer'].text)
            timer = time.set_interval(show,10)
            doc['start'].text = 'Pausar'
        else: # hold
            time.clear_interval(timer)
            timer = 'hold'
            doc['start'].text = 'Continuar'
    
    def stop_timer():
        global timer
        time.clear_interval(timer)
        timer = None
        t = 0
        doc['timer'].text = '%.2f' %0
        doc['start'].text = 'Iniciar'

</div>

<script type='text/python'>
exec(doc['py_source'].text)
</script>

<table cellpadding=10>
<tr>
<td style="width:100px;">
<button id="start" onclick="start_timer()">Iniciar</button>
<br><button id="stop" onclick="stop_timer()">Parar</button>
</td>
<td>
<div id="timer" style="background-color:black;color:#0F0;padding:15px;font-family:courier;font-weight:bold;font-size:23px;">0.00</div>
</td>
</tr>
</table>