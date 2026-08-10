# Arboraje

## // A multi-point L-system generator

## What does it do

Arboraje is a branching patterns generator based on L-systems, rendered in a `<canvas>` with pure JavaScript, no frameworks, no build steps, just open `index.html` and it'll work.

From an initial axiom (by default `F`) and a rule system (`F -> F[+F]F[-F]F`), the generator expands the chain through iterations and interprets it as drawing instructions.

- `F` -> advances and draws a line
- `+ / -` -> changes the angle (with random noise so each branch is different)
- `[ / ]` -> keeps / restores the angle and position (allows creating branches)

The result is drawn from one or multiple random origin points on the canvas.

## How to run it

```bash
Open index.html directly in the browser
```

Or just open the deployed version

No dependencies, installation, or build process are required.

## Parameters and buttons 

- **Initial string (axiom)** -> starting point of the L-system, usually `F`
- **Iterations** -> number of times the rule is applied to the string
- **Origin points** -> number of independent patterns generated on the canvas
- **Branch length** -> length of each line drawn by `F`
- **Canvas width / height** -> size of the canvas in pixels
- **Background color** -> background color used for the generated image
- **Transparent background** -> generates the image without a background
- **New seed** -> generates a new variation using the same parameters and a different random seed
- **Download PNG** -> downloads the current result as a PNG image

## Notes

- For security, the chain has a maximum of 120,000 characters and a total of 40,000 drawn lines so the browser doesn't crash. You can increase these limits if your PC can handle it.
- The angle includes random noise, so each generation can produce slightly different branches.
- The canvas uses the device pixel ratio to keep the generated image sharp on high-density displays.

## License
MIT license, see `LICENSE` to know more.
