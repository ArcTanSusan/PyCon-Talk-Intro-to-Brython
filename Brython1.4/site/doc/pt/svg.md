## módulo svg

Para criar gráficos no formato SVG, suportado pela maioria dos navegadores, use o módulo `svg`. Ele contém os nomes dos componentes disponíveis para desenhar formas e escrever texto

Por exemplo, se o documento HTML tem uma zona de gráfico SVG definida por

>    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
>        width="140" height="200" style="border-style:solid;border-width:1;border-color:#000;">
>      <g id="panel">
>      </g>
>    </svg>

você pode inserir formas e texto :
<table>
<tr>
<td>
    import svg
    title = svg.text('Title',x=70,y=25,font_size=22,
        text_anchor="middle")
    circle = svg.circle(cx="70",cy="120",r="40",
        stroke="black",stroke_width="2",fill="red")
    
    panel = doc['panel']
    panel <= title
    panel <= circle
</td>
<td>
<button onclick="run_svg()">click !</button>
</td>

<td>
<script type="text/python">
def run_svg():
    import svg
    title = svg.text('Título',x=70,y=25,font_size=22,
        text_anchor="middle")
    circle = svg.circle(cx=70,cy=120,r=40,stroke="black",
        stroke_width=2,fill="red")
    
    panel = doc['panel']
    panel <= title
    panel <= circle

</script>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  width="140" height="200" style="border-style:solid;border-width:1;border-color:#000;">
  <g id="panel">
  </g>
</svg>
</td>

</tr>

</table>