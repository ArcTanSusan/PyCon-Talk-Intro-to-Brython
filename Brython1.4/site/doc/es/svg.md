módulo SVG
----------

Para crear gr&aacute;ficos vectoriales (formato SVG), soportado por la mayor&iacute;a de navegadores, puedes usar el m&oacute;dulo integrado `svg`. El nombre proviene de los componentes disponibles para dibujar formas y escribir texto

Por ejemplo, si el documento HTML posee una zona de gr&aacute;ficos SVG definida por

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        width="140" height="200" style="border-style:solid;border-width:1;border-color:#000;">
      <g id="panel">
      </g>
    </svg>


puedes insertar formas y texto :
<table>
<tr>
<td>
    import svg
    title = svg.text('Title',x=70,y=25,font_size=22,text_anchor="middle")
    circle = svg.circle(cx="70",cy="120",r="40",stroke="black",stroke_width="2",fill="red")
    
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
    title = svg.text('Title',x=70,y=25,font_size=22,text_anchor="middle")
    circle = svg.circle(cx=70,cy=120,r=40,stroke="black",stroke_width=2,fill="red")
    
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
