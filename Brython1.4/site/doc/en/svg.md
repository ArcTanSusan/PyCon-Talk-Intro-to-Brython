module **browser.svg**
----------------------

To create graphics in the SVG format, supported by most browsers, use the built-in module `svg`. It holds the name of the components available to draw forms or write text

The module defines the following names : `a, altGlyph, altGlyphDef, altGlyphItem, animate, animateColor, animateMotion, animateTransform, circle, clipPath, color_profile,  cursor, defs, desc, ellipse, feBlend, g, image, line, linearGradient, marker, mask, path, pattern, polygon, polyline, radialGradient, rect, stop, svg, text, tref, tspan, use`

For instance, if the HTML document has an SVG graphics zone defined by

>    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
>        width="140" height="200" style="border-style:solid;border-width:1;border-color:#000;">
>      <g id="panel">
>      </g>
>    </svg>

you can insert forms and text by :
<table>
<tr>
<td>
    from browser import doc, svg
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
from browser import doc, svg
def run_svg():
    title = svg.text('Title',x=70,y=25,font_size=22,
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