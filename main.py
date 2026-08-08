import math
from PIL import ImageDraw, Image
import random

def interpretar(angulo, longitud, cadena, height, width ):
    anguloactual = -90
    x = width/2
    y = height/2
    stack = []
    lines = []
    for char in cadena:
        if char == "F":
            prex = x
            prey = y
            x = x + longitud * math.cos(math.radians(anguloactual))
            y = y + longitud * math.sin(math.radians(anguloactual))
            lines.append(((prex, prey), (x, y)))
        elif char == "+":
            anguloactual += (random.gauss(0, 25) + angulo)
        elif char == "-":
            anguloactual -= (angulo - random.gauss(0, 25))
        elif char == "[":
            stack.append((x, y, anguloactual))
        elif char == "]":
            x, y, anguloactual = stack.pop()
    return lines

def renderlines(lines, width, height):
    img = Image.new("RGBA", (width, height))

    draw = ImageDraw.Draw(img)
    for char in lines:
        draw.line(char, "#ffffff", 3, None)

    img.save("image.png")

def expand(iteraciones, cadena, rules):
    newcadena = []
    i = 0 
    while i < iteraciones:
        for char in cadena:
            change = rules.get(char, char)
            newcadena.append(change)
        i +=1 
        cadena = "".join(newcadena)
        newcadena = []
    return cadena
        
    

def main():
    angulo = int(input("Angle:"))
    longitud = int(input("Length:"))
    cadena = input("Cadena:")
    width = int(input("Width:"))
    height = int(input("Height:"))
    iteraciones = int(input("Iteraciones:"))
    rules = {"F": "F[+F]F[-F]F"}
    cadena = expand(iteraciones, cadena, rules)
    print(cadena[:100])
    lines = interpretar(angulo, longitud, cadena, height, width)
    print(len(lines))
    print(lines[:3])
    renderlines(lines, width, height)

if __name__ == "__main__":
    main()