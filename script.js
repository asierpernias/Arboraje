(function() {
    const $ = (id) => document.getElementById(id);
    const canvas = $('canvas');
    const ctx = canvas.getContext('2d');
    const emptyHint = $('emptyHint');
    const metaLine = $('metaLine');

    $('iteraciones').addEventListener('input', () => {
        $('iteracionesVal').textContent = $('iteraciones').value;
    });

    function randGauss(mean, stdev) {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdev + mean;
    }

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomPoints(value, width, height){
        const cords = [];
        for (let i = 0; i < value; i++){
            const startx = randInt(20, width);
            const starty = randInt(20, height);
            cords.push([startx, starty]);
        }
        return cords;
    }

    // Hard cap so the L-system string can't blow up the tab's memory/CPU.
    // The rule "F -> F[+F]F[-F]F" roughly quadruples the string each
    // iteration, so a few extra iterations can mean millions of characters.
    const MAX_CADENA_CHARS = 120000;

    function expand(iteraciones, cadena, rules){
        for (let i = 0; i < iteraciones; i++){
            let out = '';
            for (const char of cadena) {
                out += (rules[char] !== undefined ? rules[char] : char);
                if (out.length >= MAX_CADENA_CHARS) break;
            }
            cadena = out;
            if (cadena.length >= MAX_CADENA_CHARS){
                cadena = cadena.slice(0, MAX_CADENA_CHARS);
                break;
            }
        }
        return cadena;
    }

    function cellKey(x, y, cellSize){
        return Math.floor(x / cellSize) + '_' + Math.floor(y / cellSize);
    }

    function interpretar(startx, starty, angulo, longitud, cadena, height, width, occupied, cellSize){
        let anguloActual = randInt(0, 360);
        let x = startx, y = starty;
        let profundidad = 4;
        const stack = [];
        const lines = [];
        let fuera = false;

        if (occupied) occupied.add(cellKey(x, y, cellSize));

        for (const char of cadena){
            if (char === 'F'){
                const prex = x, prey = y;
                x = x + longitud * Math.cos(anguloActual * Math.PI / 180);
                y = y + longitud * Math.sin(anguloActual * Math.PI / 180);
                if (x < 20 || x > width - 20 || y < 20 || y > height - 20){
                    fuera = true;
                    x = prex; y = prey;
                } else if (occupied) {
                    const key = cellKey(x, y, cellSize);
                    if (occupied.has(key)){
                        fuera = true;
                        x = prex; y = prey;
                    } else {
                        occupied.add(key);
                    }
                }
                if (!fuera){
                    lines.push([[prex, prey], [x, y], profundidad]);
                }
            } else if (char === '+'){
                anguloActual += (randGauss(0, 15) + angulo);
            } else if (char === '-'){
                anguloActual -= (angulo - randGauss(0, 15));
            } else if (char === '['){
                profundidad -= 1;
                stack.push([x, y, anguloActual]);
            } else if (char === ']'){
                fuera = false;
                profundidad += 1;
                const popped = stack.pop();
                if (popped) { [x, y, anguloActual] = popped; }
            }
        }
        return lines;
    }

    function renderLines(allLines, width, height){
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = 'round';

        const batchSize = Math.max(4, Math.ceil(allLines.length / 220));
        let i = 0;

        function step() {
            const end = Math.min(i + batchSize, allLines.length);
            for (; i < end; i++){
                const [prev, cur, profundidad] = allLines[i];
                const r = randInt(0, 50);
                const g = randInt(100, 255);
                const b = randInt(0, 80);
                const a = Math.min(255, Math.max(0, randGauss(90, 25))) / 255;
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
                ctx.lineWidth = Math.max(1, profundidad);
                ctx.beginPath();
                ctx.moveTo(prev[0], prev[1]);
                ctx.lineTo(cur[0], cur[1]);
                ctx.stroke();
            }
            if (i < allLines.length){
                requestAnimationFrame(step);
            } else {
                metaLine.innerHTML = `<span>${allLines.length}</span> trazos · listo`;
            }
        }
        requestAnimationFrame(step);
    }

    function generate(){
        const value = parseInt($('value').value, 10);
        const longitud = parseInt($('longitud').value, 10);
        const width = parseInt($('width').value, 10);
        const height = parseInt($('height').value, 10);
        const iteraciones = parseInt($('iteraciones').value, 10);
        let cadena = $('cadena').value.trim() || 'F';
        const angulo = randInt(0, 360);
        const rules = { F: 'F[+F]F[-F]F' };

        const canvasWrap = $('canvasWrap');
        canvasWrap.style.width = width + 'px';

        const points = randomPoints(value, width, height);
        const expanded = expand(iteraciones, cadena, rules);

        emptyHint.style.display = 'none';
        metaLine.textContent = 'generando…';

        const avoidCollisions = $('avoidCollisions').checked;
        const cellSize = Math.max(3, longitud * 0.6);
        const occupied = avoidCollisions ? new Set() : null;
        if (occupied){
            // reserve the origin points themselves so two patterns can't spawn on top of each other
            for (const [px, py] of points) occupied.add(cellKey(px, py, cellSize));
        }

        const MAX_TOTAL_LINES = 40000;
        const allLines = [];
        let truncated = false;
        for (const [startx, starty] of points){
            const lines = interpretar(startx, starty, angulo, longitud, expanded, height, width, occupied, cellSize);
            for (const line of lines){
                if (allLines.length >= MAX_TOTAL_LINES){ truncated = true; break; }
                allLines.push(line);
            }
            if (truncated) break;
        }

        const cap = truncated ? ' · límite alcanzado, resultado recortado' : '';
        metaLine.innerHTML = `cadena: <span>${expanded.length}</span> caract. · orígenes: <span>${points.length}</span>${cap}`;
        renderLines(allLines, width, height);
    }

    $('growBtn').addEventListener('click', generate);
    $('reseedBtn').addEventListener('click', generate);
    $('downloadBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'ramaje.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    canvas.width = parseInt($('width').value, 10);
    canvas.height = parseInt($('height').value, 10);
})();