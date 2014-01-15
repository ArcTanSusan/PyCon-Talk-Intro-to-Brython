module **browser.svg**
----------------------

Pour créer des graphiques au format SVG, supporté par la plupart des navigateurs, on utilise le module intégré `svg`, qui contient les noms des éléments disponibles pour tracer des formes ou écrire du texte

Le module définit les noms suivants : `a, altGlyph, altGlyphDef, altGlyphItem, animate, animateColor, animateMotion, animateTransform, circle, clipPath, color_profile,  cursor, defs, desc, ellipse, feBlend, g, image, line, linearGradient, marker, mask, path, pattern, polygon, polyline, radialGradient, rect, stop, svg, text, tref, tspan, use`

(noter `color_profile` à la place de `color-profile`)

Par exemple, si le document HTML possède une zone de graphique SVG définie par 

>    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
>        width="140" height="200" style="border-style:solid;border-width:1;border-color:#000;">
>      <g id="panel">
>      </g>
>    </svg>

on peut intégrer des tracés et des textes par :
<table>
<tr>
<td>
    from browser import svg
    titre = svg.text('Titre',x=70,y=25,font_size=22,
        text_anchor="middle")
    cercle = svg.circle(cx="70",cy="120",r="40",
        stroke="black",stroke_width="2",fill="red")
    
    panel = doc['panel']
    panel <= titre
    panel <= cercle

<button onclick="run_svg()">clic !</button>
</td>

<td>
<script type="text/python">
def run_svg():
    from browser import svg
    titre = svg.text('Titre',x=70,y=25,font_size=22,
        text_anchor="middle")
    cercle = svg.circle(cx=70,cy=120,r=40,
        stroke="black",stroke_width=2,fill="red")
    
    panel = doc['panel']
    panel <= titre
    panel <= cercle
</script>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  width="140" height="200" style="border-style:solid;border-width:1;border-color:#000;">
  <g id="panel">
  </g>
</svg>
</td>

</tr>

</table>
