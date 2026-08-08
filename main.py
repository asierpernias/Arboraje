import math
from PIL import ImageDraw, Image
import random

def randompoints(value, width, height):
    i = 0
    cords = []
    while i < value:
        startx = random.randint(20, width)
        starty = random.randint(20, height)
        cords.append([startx, starty])
        i += 1
    return cords

def interpretar(startx, starty, angulo, longitud, cadena, height, width ):
    anguloactual = -90
    x = startx
    y = starty
    profundidad = 4
    stack = []
    lines = []
    fuera = False
    for char in cadena:
        if char == "F":
            prex = x
            prey = y
            x = x + longitud * math.cos(math.radians(anguloactual))
            y = y + longitud * math.sin(math.radians(anguloactual))
            if x < 20 or x > width - 20 or y < 20 or y > height - 20:
                fuera = True
                x, y = prex, prey  # revertir
            if not fuera:
                lines.append(((prex, prey), (x, y), profundidad))
        elif char == "+":
            anguloactual += (random.gauss(0, 15) + angulo)
        elif char == "-":
            anguloactual -= (angulo - random.gauss(0, 15))
        elif char == "[":
            profundidad -= 1
            stack.append((x, y, anguloactual))
        elif char == "]":
            fuera = False
            profundidad += 1
            x, y, anguloactual = stack.pop()
    return lines

def renderlines(lines, width, height):
    img = Image.new("RGBA", (width, height))

    draw = ImageDraw.Draw(img)
    for prev, actual, profundidad in lines:
        draw.line((prev, actual), "#ffffff", profundidad, None)

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
    value = int(input("Number of points:"))
    angulo = random.randint(0, 360)
    longitud = int(input("Length:"))
    cadena = input("Cadena:")
    width = int(input("Width:"))
    height = int(input("Height:"))
    iteraciones = int(input("Iteraciones:"))
    rules = {"F": "F[+F]F[-F]F"}
    points = randompoints(value, width, height)
    cadena = expand(iteraciones, cadena, rules)
    print(cadena[:100])
    alllines = []
    for punto in points:
        startx, starty = punto
        lines = interpretar(startx, starty, angulo, longitud, cadena, height, width)
        alllines.extend(lines)
    print(len(lines))
    print(lines[:3])
    renderlines(alllines, width, height)

if __name__ == "__main__":
    main()