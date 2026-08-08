import math
from PIL import ImageDraw, Image

def interpretar(angulo, longitud, cadena, height, width ):
    anguloactual = 0
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
            anguloactual += angulo
        elif char == "-":
            anguloactual -= angulo
        elif char == "[":
            stack.append((x, y, anguloactual))
        elif char == "]":
            x, y, anguloactual = stack.pop()
    return lines

def renderlines(lines, width, height):
    img = Image.new("RGBA", (width, height))

    draw = ImageDraw.Draw(img)
    for char in lines:
        draw.line(char, "#ffffff", 10, None)

    img.save("image.png")

def expand(iteraciones, cadena, rules):
    newcadena = []
    i = 0 
    while i < iteraciones:
        for char in cadena:
            change = rules.get(char, char)
            newcadena.append(change)
        i +=1 
        cadena = newcadena
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
    lines = interpretar(angulo, longitud, cadena, width, height)
    renderlines(lines, width, height)

if __name__ == "__main__":
    main()